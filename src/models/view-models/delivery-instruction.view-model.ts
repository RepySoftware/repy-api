import { DeliveryInstructionStatus } from "../../common/enums/delivery-instruction-status";
import { DeliveryInstruction } from "../entities/delivery-instruction";
import { DefaultDeliveryInstructionViewModel } from "./default-delivery-instruction.view-model";
import { EmployeeViewModel } from "./employee.view-model";

export class DeliveryInstructionViewModel {

    public id: number;
    public employee: EmployeeViewModel;
    public description: string;
    public status: DeliveryInstructionStatus;
    public index: number;
    public startedAt: Date;
    public finishedAt: Date;
    public createdAt: Date;
    public updatedAt: Date;

    public static fromEntity(edi: DeliveryInstruction): DeliveryInstructionViewModel {

        const deliveryInstruction = new DeliveryInstructionViewModel();

        deliveryInstruction.id = edi.id;
        deliveryInstruction.employee = edi.employeeDriver ? EmployeeViewModel.fromEntity(edi.employeeDriver) : null;
        deliveryInstruction.status = edi.status;
        deliveryInstruction.description = edi.description;
        deliveryInstruction.index = edi.index;
        deliveryInstruction.startedAt = edi.startedAt;
        deliveryInstruction.finishedAt = edi.finishedAt;
        deliveryInstruction.createdAt = edi.createdAt;
        deliveryInstruction.updatedAt = edi.updatedAt;

        return deliveryInstruction;
    }
}