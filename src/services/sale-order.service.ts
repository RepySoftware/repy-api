import { inject, injectable } from "inversify";
import { Op, Transaction, WhereOptions } from "sequelize";
import { SaleOrderStatus } from "../common/enums/sale-order-status";
import { NotFoundException } from "../common/exceptions/not-fount.exception";
import { Database } from "../data/database-config";
import { Address } from "../models/entities/address";
import { CompanyBranch } from "../models/entities/company-branch";
import { CompanyBranchProduct } from "../models/entities/company-branch-product";
import { Employee } from "../models/entities/employee";
import { Person } from "../models/entities/person";
import { Product } from "../models/entities/product";
import { SaleOrder } from "../models/entities/sale-order";
import { SaleOrderProduct } from "../models/entities/sale-order-product";
import { SaleOrderFilter } from "../models/input-models/filter/sale-order.filter";
import { SaleOrderCreateInputModel } from "../models/input-models/sale-order-create.input-model";
import { SaleOrderViewModel } from "../models/view-models/sale-order.view-model";
import { UserService } from "./user.service";
import * as moment from 'moment-timezone';
import { PaymentMethod } from "../models/entities/payment-method";
import { SaleOrderConfirmDeliveryInputModel } from "../models/input-models/sale-order-confirm-delivery.input-model";
import { SaleOrderException } from "../common/exceptions/sale-order.exception";

@injectable()
export class SaleOrderService {

    constructor(
        @inject(UserService) private _userService: UserService,
        @inject(Database) private _database: Database,
    ) { }

    public async getAll(input: SaleOrderFilter, userId: number): Promise<SaleOrderViewModel[]> {

        const user = await this._userService.getEntityById(userId);

        const limit = Number(input.limit || 20);
        const offset = Number((input.index || 0) * limit);

        const where: WhereOptions = {
            '$companyBranch.companyId$': user.companyId
        };

        if (input.status) {
            where['status'] = input.status;
        }

        const saleOrders: SaleOrder[] = await SaleOrder.findAll({
            where,
            include: [
                {
                    model: CompanyBranch,
                    as: 'companyBranch'
                },
                {
                    model: Employee,
                    as: 'employeeAgent'
                },
                {
                    model: Employee,
                    as: 'employeeDriver'
                },
                {
                    model: Person,
                    as: 'personCustomer'
                },
                {
                    model: Address,
                    as: 'deliveryAddress'
                },
                {
                    model: PaymentMethod,
                    as: 'paymentMethod'
                },
                {
                    model: SaleOrderProduct,
                    as: 'products',
                    separate: true,
                    include: [
                        {
                            model: CompanyBranchProduct,
                            as: 'companyBranchProduct',
                            include: [
                                {
                                    model: Product,
                                    as: 'product'
                                }
                            ]
                        }
                    ]
                }
            ],
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        return saleOrders.map(SaleOrderViewModel.fromEntity);
    }

    public async create(input: SaleOrderCreateInputModel, userId: number): Promise<SaleOrderViewModel> {

        const user = await this._userService.getEntityById(userId);

        const personCustomer: Person = await Person.findOne({
            where: {
                id: input.personCustomerId
            },
            include: [
                {
                    model: Address,
                    as: 'address'
                }
            ]
        });

        if (!personCustomer)
            throw new NotFoundException('Cliente não encontrado');

        const pendingSaleOrders: SaleOrder[] = await SaleOrder.findAll({
            where: {
                '$companyBranch.companyId$': user.companyId,
                status: SaleOrderStatus.PENDING
            },
            include: [
                {
                    model: CompanyBranch,
                    as: 'companyBranch'
                }
            ]
        });

        const transaction: Transaction = await this._database.sequelize.transaction();

        try {

            const deliveryAddress = new Address({
                description: personCustomer.address.description,
                zipCode: personCustomer.address.zipCode,
                city: personCustomer.address.city,
                region: personCustomer.address.region,
                country: personCustomer.address.country,
                complement: personCustomer.address.complement,
                referencePoint: personCustomer.address.referencePoint,
                latitude: personCustomer.address.latitude,
                longitude: personCustomer.address.longitude
            });

            await deliveryAddress.save({ transaction });

            const saleOrder = new SaleOrder({
                companyBranchId: input.companyBranchId,
                employeeAgentId: user.employeeId,
                employeeDriverId: input.employeeDriverId,
                personCustomerId: input.personCustomerId,
                deliveryAddressId: deliveryAddress.id,
                paymentMethodId: input.paymentMethodId,
                totalSalePrice: 0,
                paymentInstallments: input.paymentInstallments,
                status: SaleOrderStatus.PENDING,
                index: pendingSaleOrders.length,
                scheduledAt: input.scheduledAt
            });

            await saleOrder.save({ transaction });

            const saleOrderProducts = input.products.map(inputProduct => new SaleOrderProduct({
                saleOrderId: saleOrder.id,
                companyBranchProductId: inputProduct.companyBranchProductId,
                companyBranchProductPriceId: inputProduct.companyBranchProductPriceId,
                quantity: inputProduct.quantity,
                salePrice: inputProduct.salePrice
            }));

            for (const p of saleOrderProducts) {
                await p.save({ transaction });
            }

            saleOrder.calculeTotalSalePrice(saleOrderProducts);
            await saleOrder.save({ transaction });

            await transaction.commit();

            return SaleOrderViewModel.fromEntity(saleOrder);

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    public async updateIndex(items: { saleOrderId: number, index: number }[], userId: number): Promise<void> {

        const user = await this._userService.getEntityById(userId);

        const saleOrders: SaleOrder[] = await SaleOrder.findAll({
            where: {
                '$companyBranch.companyId$': user.companyId,
                id: { [Op.in]: items.map(x => x.saleOrderId) }
            },
            include: [
                {
                    model: CompanyBranch,
                    as: 'companyBranch'
                }
            ]
        });

        const transaction: Transaction = await this._database.sequelize.transaction();

        try {
            for (const so of saleOrders) {
                const item = items.find(x => x.saleOrderId == so.id);

                if (item) {
                    so.index = item.index;
                    await so.save({ transaction });
                }
            }

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    public async updateEmployeeDriver(input: { saleOrderId: number, employeeDriverId: number }, userId: number): Promise<void> {

        const user = await this._userService.getEntityById(userId);

        const saleOrder: SaleOrder = await SaleOrder.findOne({
            where: {
                '$companyBranch.companyId$': user.companyId,
                id: input.saleOrderId
            },
            include: [
                {
                    model: CompanyBranch,
                    as: 'companyBranch'
                }
            ]
        });

        saleOrder.employeeDriverId = input.employeeDriverId || null;

        await saleOrder.save();
    }

    public async confirmDelivery(input: SaleOrderConfirmDeliveryInputModel, userId: number): Promise<void> {

        const user = await this._userService.getEntityById(userId);

        const saleOrder: SaleOrder = await SaleOrder.findOne({
            where: {
                '$companyBranch.companyId$': user.companyId,
                id: input.saleOrderId
            },
            include: [
                {
                    model: CompanyBranch,
                    as: 'companyBranch'
                },
                {
                    model: Person,
                    as: 'personCustomer'
                },
                {
                    model: SaleOrderProduct,
                    as: 'products',
                    separate: true,
                    include: [
                        {
                            model: CompanyBranchProduct,
                            as: 'companyBranchProduct',
                            include: [
                                {
                                    model: Product,
                                    as: 'product'
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        const paymentMethod: PaymentMethod = PaymentMethod.findOne({
            where: {
                id: input.paymentMethodId
            }
        });

        if (!paymentMethod)
            throw new NotFoundException('Método de pagamento não encontrado');

        if (
            paymentMethod.hasInstallments
            && (!input.installments || input.installments <= 0)
        ) {
            throw new SaleOrderException('Número de parcelas inválido');
        }

        saleOrder.status = SaleOrderStatus.FINISHED;
        saleOrder.deliveredAt = moment(input.deliveredAt).toDate();
        saleOrder.paymentMethodId = input.paymentMethodId;
        saleOrder.paymentInstallments = input.installments || null;

        const transaction: Transaction = await this._database.sequelize.transaction();

        try {
            await saleOrder.save({ transaction });

            if (saleOrder.products.find(p => p.companyBranchProduct.product.isGas)) {
                saleOrder.personCustomer.isGasCustomer = true;
                await saleOrder.personCustomer.save({ transaction });
            }

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}