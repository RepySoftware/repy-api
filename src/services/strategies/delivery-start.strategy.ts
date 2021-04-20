import { DeliveryType } from "../../common/enums/delivery-type";
import { SaleOrderStatus } from "../../common/enums/sale-order-status";
import { CompanyBranch } from "../../models/entities/company-branch";
import { SaleOrder } from "../../models/entities/sale-order";
import { Strategy } from "../abstraction/strategy";
import { UserService } from "../user.service";
import * as moment from 'moment-timezone';
import { EmployeeDeliveryInstruction } from "../../models/entities/employee-delivery-instruction";
import { Employee } from "../../models/entities/employee";
import { EmployeeDeliveryInstructionStatus } from "../../common/enums/delivery-instruction-status";
import { DeliveryException } from "../../common/exceptions/delivery.exception";

export class DeliveryStartStrategy extends Strategy<{ id: number, userId: number }, Promise<void>> {

    constructor(
        type: string,
        private _userService: UserService
    ) {
        super(type, ['saleOrder', 'deliveryInstruction']);
    }

    private async saleOrder(params: { id: number, type: DeliveryType, userId: number }): Promise<void> {

        const user = await this._userService.getEntityById(params.userId);

        const saleOrder: SaleOrder = await SaleOrder.findOne({
            where: {
                '$companyBranch.companyId$': user.companyId,
                id: params.id
            },
            include: [
                {
                    model: CompanyBranch,
                    as: 'companyBranch'
                }
            ]
        });

        if (saleOrder.status == SaleOrderStatus.CANCELED || saleOrder.status == SaleOrderStatus.FINISHED)
            throw new DeliveryException('Não é possível iniciar a entrega deste pedido pois não está pendente');

        saleOrder.setStatus(SaleOrderStatus.ON_DELIVERY);

        await saleOrder.save();
    }

    private async deliveryInstruction(params: { id: number, type: DeliveryType, userId: number }): Promise<void> {

        const user = await this._userService.getEntityById(params.userId);

        const employeeDeliveryInstruction: EmployeeDeliveryInstruction = await EmployeeDeliveryInstruction.findOne({
            where: {
                '$employeeDriver.companyId$': user.companyId,
                id: params.id
            },
            include: [
                {
                    model: Employee,
                    as: 'employeeDriver'
                }
            ]
        });

        if (employeeDeliveryInstruction.status == EmployeeDeliveryInstructionStatus.IN_PROGRESS)
            throw new DeliveryException('Instrução já está em progresso');

        employeeDeliveryInstruction.setStatus(EmployeeDeliveryInstructionStatus.IN_PROGRESS);

        await employeeDeliveryInstruction.save();
    }
}