import { SaleOrderStatus } from "../../common/enums/sale-order-status";
import { DeliveryException } from "../../common/exceptions/delivery.exception";
import { CompanyBranch } from "../../models/entities/company-branch";
import { SaleOrder } from "../../models/entities/sale-order";
import { Strategy } from "../abstraction/strategy";
import { UserService } from "../user.service";
import { EmployeeDeliveryInstruction } from "../../models/entities/employee-delivery-instruction";
import { Employee } from "../../models/entities/employee";
import { EmployeeDeliveryInstructionStatus } from "../../common/enums/delivery-instruction-status";
import { DeliveryFinalizeInputModel } from "../../models/input-models/delivery-finalize.input-model";
import { Person } from "../../models/entities/person";
import { SaleOrderProduct } from "../../models/entities/sale-order-product";
import { CompanyBranchProduct } from "../../models/entities/company-branch-product";
import { Product } from "../../models/entities/product";
import { PaymentMethod } from "../../models/entities/payment-method";
import { NotFoundException } from "../../common/exceptions/not-fount.exception";
import { Transaction } from "sequelize";
import { Database } from "../../data/database-config";
import * as moment from 'moment-timezone';

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

        const paymentMethod: PaymentMethod = PaymentMethod.findOne({
            where: {
                id: params.input.paymentMethodId
            }
        });

        if (!paymentMethod)
            throw new NotFoundException('Método de pagamento não encontrado');

        if (
            paymentMethod.hasInstallments
            && (!params.input.installments || params.input.installments <= 0)
        ) {
            throw new DeliveryException('Número de parcelas inválido');
        }

        saleOrder.setStatus(SaleOrderStatus.FINISHED);
        saleOrder.deliveredAt = params.input.deliveredAt ? moment.utc(params.input.deliveredAt).toDate() : moment.utc().toDate();
        saleOrder.paymentMethodId = params.input.paymentMethodId || null;
        saleOrder.paymentInstallments = params.input.installments || (paymentMethod.hasInstallments ? 1 : null);

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

    private async deliveryInstruction(params: { input: DeliveryFinalizeInputModel, userId: number }): Promise<void> {

        const user = await this._userService.getEntityById(params.userId);

        const employeeDeliveryInstruction: EmployeeDeliveryInstruction = await EmployeeDeliveryInstruction.findOne({
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

        if (employeeDeliveryInstruction.status == EmployeeDeliveryInstructionStatus.FINISHED)
            throw new DeliveryException('Instrução já está finalizada');

        employeeDeliveryInstruction.setStatus(EmployeeDeliveryInstructionStatus.FINISHED);

        await employeeDeliveryInstruction.save();
    }
}