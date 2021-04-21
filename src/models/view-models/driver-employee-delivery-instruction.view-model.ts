import { DeliveryInstructionStatus } from "../../common/enums/delivery-instruction-status";
import { DeliveryInstruction } from "../entities/delivery-instruction";

export class DriverEmployeeDeliveryInstructionViewModel {

    public id: number;
    public description: string;
    public status: DeliveryInstructionStatus;
    public index: number;
    public startedAt: Date;
    public finishedAt: Date;
    public createdAt: Date;
    public updatedAt: Date;

    public static fromEntity(edi: DeliveryInstruction): DriverEmployeeDeliveryInstructionViewModel {

        const employeeDeliveryInstruction = new DriverEmployeeDeliveryInstructionViewModel();

        employeeDeliveryInstruction.description = edi.description;
        employeeDeliveryInstruction.status = edi.status;
        employeeDeliveryInstruction.index = edi.index;
        employeeDeliveryInstruction.startedAt = edi.startedAt;
        employeeDeliveryInstruction.finishedAt = edi.finishedAt;
        employeeDeliveryInstruction.createdAt = edi.createdAt;
        employeeDeliveryInstruction.updatedAt = edi.updatedAt;

        return employeeDeliveryInstruction;
    }
}