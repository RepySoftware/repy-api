import { EmployeeDeliveryInstructionStatus } from "../../common/enums/delivery-instruction-status";
import { EmployeeDeliveryInstruction } from "../entities/employee-delivery-instruction";
import { DeliveryInstructionViewModel } from "./delivery-instruction.view-model";
import { EmployeeViewModel } from "./employee.view-model";

export class EmployeeDeliveryInstructionViewModel {

    public id: number;
    public deliveryInstruction: DeliveryInstructionViewModel;
    public employee: EmployeeViewModel;
    public status: EmployeeDeliveryInstructionStatus;
    public index: number;
    public startedAt: Date;
    public finishedAt: Date;
    public createdAt: Date;
    public updatedAt: Date;

    public static fromEntity(edi: EmployeeDeliveryInstruction): EmployeeDeliveryInstructionViewModel {

        const employeeDeliveryInstruction = new EmployeeDeliveryInstructionViewModel();

        employeeDeliveryInstruction.deliveryInstruction = edi.deliveryInstruction ? DeliveryInstructionViewModel.fromEntity(edi.deliveryInstruction) : null;;
        employeeDeliveryInstruction.employee = edi.employeeDriver ? EmployeeViewModel.fromEntity(edi.employeeDriver) : null;
        employeeDeliveryInstruction.status = edi.status;
        employeeDeliveryInstruction.index = edi.index;
        employeeDeliveryInstruction.startedAt = edi.startedAt;
        employeeDeliveryInstruction.finishedAt = edi.finishedAt;
        employeeDeliveryInstruction.createdAt = edi.createdAt;
        employeeDeliveryInstruction.updatedAt = edi.updatedAt;

        return employeeDeliveryInstruction;
    }
}