import { DeliveryInstructionStatus } from "../../common/enums/delivery-instruction-status";
import { DateHelper } from "../../common/helpers/date.helper";
import { DeliveryInstruction } from "../entities/delivery-instruction";
import { DefaultDeliveryInstructionViewModel } from "./default-delivery-instruction.view-model";
import { EmployeeViewModel } from "./employee.view-model";

export class DeliveryInstructionViewModel {

    public id: number;
    public employee: EmployeeViewModel;
    public description: string;
    public status: DeliveryInstructionStatus;
    public index: number;
    public checkableByDriver: boolean;
    public startedAt: string;
    public finishedAt: string;
    public createdAt: string;
    public updatedAt: string;

    public static fromEntity(edi: DeliveryInstruction): DeliveryInstructionViewModel {

        const deliveryInstruction = new DeliveryInstructionViewModel();

        deliveryInstruction.id = edi.id;
        deliveryInstruction.employee = edi.employeeDriver ? EmployeeViewModel.fromEntity(edi.employeeDriver) : null;
        deliveryInstruction.status = edi.status;
        deliveryInstruction.description = edi.description;
        deliveryInstruction.index = edi.index;
        deliveryInstruction.checkableByDriver = edi.checkableByDriver;
        deliveryInstruction.startedAt = DateHelper.toStringViewModel(edi.startedAt);
        deliveryInstruction.finishedAt = DateHelper.toStringViewModel(edi.finishedAt);
        deliveryInstruction.createdAt = DateHelper.toStringViewModel(edi.createdAt);
        deliveryInstruction.updatedAt = DateHelper.toStringViewModel(edi.updatedAt);

        return deliveryInstruction;
    }
}