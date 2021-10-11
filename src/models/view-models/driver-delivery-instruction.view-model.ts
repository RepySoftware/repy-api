import { DeliveryInstructionStatus } from "../../common/enums/delivery-instruction-status";
import { AddressHelper } from "../../common/helpers/address.helper";
import { DateHelper } from "../../common/helpers/date.helper";
import { DeliveryInstruction } from "../entities/delivery-instruction";

export class DriverDeliveryInstructionViewModel {

    public id: number;
    public description: string;
    public status: DeliveryInstructionStatus;
    public index: number;
    public addressFormatted?: string;
    public addressToMap?: string;
    public checkableByDriver: boolean;
    public startedAt: string;
    public finishedAt: string;
    public createdAt: string;
    public updatedAt: string;

    public static fromEntity(edi: DeliveryInstruction): DriverDeliveryInstructionViewModel {

        const deliveryInstruction = new DriverDeliveryInstructionViewModel();

        deliveryInstruction.id = edi.id;
        deliveryInstruction.description = edi.description;
        deliveryInstruction.status = edi.status;
        deliveryInstruction.index = edi.index;
        deliveryInstruction.addressFormatted = AddressHelper.format(edi.address);
        deliveryInstruction.addressToMap = AddressHelper.format(edi.address, { includeComplement: false });
        deliveryInstruction.checkableByDriver = edi.checkableByDriver;
        deliveryInstruction.startedAt = DateHelper.toStringViewModel(edi.startedAt);
        deliveryInstruction.finishedAt = DateHelper.toStringViewModel(edi.finishedAt);
        deliveryInstruction.createdAt = DateHelper.toStringViewModel(edi.createdAt);
        deliveryInstruction.updatedAt = DateHelper.toStringViewModel(edi.updatedAt);

        return deliveryInstruction;
    }
}