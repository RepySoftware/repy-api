import { EmployeeDeliveryInstructionStatus } from "../../common/enums/delivery-instruction-status";
import { EmployeeDeliveryInstruction } from "../entities/employee-delivery-instruction";

export class DriverEmployeeDeliveryInstructionViewModel {

    public id: number;
    public description: string;
    public status: EmployeeDeliveryInstructionStatus;
    public index: number;
    public startedAt: Date;
    public finishedAt: Date;
    public createdAt: Date;
    public updatedAt: Date;

    public static fromEntity(edi: EmployeeDeliveryInstruction): DriverEmployeeDeliveryInstructionViewModel {

        const employeeDeliveryInstruction = new DriverEmployeeDeliveryInstructionViewModel();

        employeeDeliveryInstruction.description = edi.deliveryInstruction.description;
        employeeDeliveryInstruction.status = edi.status;
        employeeDeliveryInstruction.index = edi.index;
        employeeDeliveryInstruction.startedAt = edi.startedAt;
        employeeDeliveryInstruction.finishedAt = edi.finishedAt;
        employeeDeliveryInstruction.createdAt = edi.createdAt;
        employeeDeliveryInstruction.updatedAt = edi.updatedAt;

        return employeeDeliveryInstruction;
    }
}