import { DeliveryInstruction } from "../entities/delivery-instruction";

export class DeliveryInstructionViewModel {

    public id: number;
    public description: string;

    public static fromEntity(di: DeliveryInstruction): DeliveryInstructionViewModel {

        const deliveryInstruction = new DeliveryInstructionViewModel();

        deliveryInstruction.id = di.id;
        deliveryInstruction.description = di.description;

        return deliveryInstruction;
    }
}