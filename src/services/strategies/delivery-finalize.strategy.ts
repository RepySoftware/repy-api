import { SaleOrderStatus } from "../../common/enums/sale-order-status";
import { DeliveryException } from "../../common/exceptions/delivery.exception";
import { CompanyBranch } from "../../models/entities/company-branch";
import { SaleOrder } from "../../models/entities/sale-order";
import { Strategy } from "../abstraction/strategy";
import { UserService } from "../user.service";
import { Employee } from "../../models/entities/employee";
import { DeliveryInstructionStatus } from "../../common/enums/delivery-instruction-status";
import { DeliveryFinalizeInputModel } from "../../models/input-models/delivery-finalize.input-model";
import { Person } from "../../models/entities/person";
import { SaleOrderProduct } from "../../models/entities/sale-order-product";
import { CompanyBranchProduct } from "../../models/entities/company-branch-product";
import { Product } from "../../models/entities/product";
import { PaymentMethod } from "../../models/entities/payment-method";
import { NotFoundException } from "../../common/exceptions/not-fount.exception";
import { Op, Transaction } from "sequelize";
import { Database } from "../../data/database-config";
import * as moment from 'moment-timezone';
import { DeliveryInstruction } from "../../models/entities/delivery-instruction";
import { SaleOrderService } from "../sale-order.service";
import { SaleOrderPayment } from "../../models/entities/sale-order-payment";

export class DeliveryFinalizeStrategy extends Strategy<{ input: DeliveryFinalizeInputModel, userId: number }, Promise<void>> {

    constructor(
        type: string,
        private _userService: UserService,
        private _database: Database
    ) {
        super(type, ['saleOrder', 'deliveryInstruction']);
    }

    private async saleOrder(params: { input: DeliveryFinalizeInputModel, userId: number }): Promise<void> {

        const user = await this._userService.getEntityById(params.userId);

        const saleOrder: SaleOrder = await SaleOrder.findOne({
            where: {
                '$companyBranch.companyId$': user.companyId,
                id: params.input.id
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
                    model: SaleOrderPayment,
                    as: 'payments',
                    separate: true
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

        if (saleOrder.status == SaleOrderStatus.CANCELED || saleOrder.status == SaleOrderStatus.FINISHED)
            throw new DeliveryException('Este pedido não pode ser finalizado');

        if (!params.input.payments) {
            throw new DeliveryException('Nenhum pagamento informado');
        }

        saleOrder.setStatus(SaleOrderStatus.FINISHED);
        saleOrder.deliveredAt = params.input.deliveredAt ? moment.utc(params.input.deliveredAt).toDate() : moment.utc().toDate();

        const transaction: Transaction = await this._database.sequelize.transaction();

        try {
            await saleOrder.save({ transaction });

            //#region payments
            // update payments
            for (const sopInput of params.input.payments) {
                const saleOrderPayment = saleOrder.payments.find(x => x.id == sopInput.id);

                if (saleOrderPayment) {
                    saleOrderPayment.paymentMethodId = sopInput.paymentMethodId;
                    saleOrderPayment.value = sopInput.value;
                    saleOrderPayment.dueDate = sopInput.dueDate ? moment.utc(sopInput.dueDate).toDate() : moment.utc().toDate();
                    saleOrderPayment.payDate = sopInput.payDate ? moment.utc(sopInput.payDate).toDate() : null;

                    await saleOrderPayment.save({ transaction });
                }
            }

            // delete payments
            for (const sop of saleOrder.payments) {
                if (!params.input.payments.find(x => x.id == sop.id)) {
                    await SaleOrderPayment.destroy({
                        where: { id: sop.id },
                        transaction
                    });

                    saleOrder.payments.splice(
                        saleOrder.payments.findIndex(x => x.id == sop.id),
                        1
                    );
                }
            }

            // add payments
            for (const sopInput of params.input.payments) {
                if (!sopInput.id) {
                    const newSaleOrderPayment = SaleOrderPayment.create({
                        saleOrderId: saleOrder.id,
                        paymentMethodId: sopInput.paymentMethodId,
                        value: sopInput.value,
                        dueDate: sopInput.dueDate ? moment.utc(sopInput.dueDate).toDate() : moment.utc().toDate(),
                        payDate: sopInput.payDate ? moment.utc(sopInput.payDate).toDate() : null,
                    });

                    await newSaleOrderPayment.save({ transaction });

                    saleOrder.payments.push(newSaleOrderPayment);
                }
            }
            //#endregion payments

            // update indexes
            const saleOrdersByDriver: SaleOrder[] = await SaleOrder.findAll({
                where: {
                    '$companyBranch.companyId$': user.companyId,
                    employeeDriverId: saleOrder.employeeDriverId,
                    status: { [Op.in]: [SaleOrderStatus.ON_DELIVERY, SaleOrderStatus.PENDING] },
                    id: { [Op.not]: saleOrder.id }
                },
                include: [
                    {
                        model: CompanyBranch,
                        as: 'companyBranch'
                    }
                ],
                order: [['index', 'ASC']]
            });

            for (const [i, so] of saleOrdersByDriver.entries()) {
                so.index = i;
                await so.save({ transaction });
            }

            // set isGasCustomer
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

    private async deliveryInstruction(params: { input: DeliveryFinalizeInputModel, userId: number }): Promise<void> {

        const user = await this._userService.getEntityById(params.userId);

        const deliveryInstruction: DeliveryInstruction = await DeliveryInstruction.findOne({
            where: {
                '$employeeDriver.companyId$': user.companyId,
                id: params.input.id
            },
            include: [
                {
                    model: Employee,
                    as: 'employeeDriver'
                }
            ]
        });

        if (deliveryInstruction.status == DeliveryInstructionStatus.FINISHED)
            throw new DeliveryException('Instrução já está finalizada');

        deliveryInstruction.setStatus(DeliveryInstructionStatus.FINISHED);

        await deliveryInstruction.save();
    }
}