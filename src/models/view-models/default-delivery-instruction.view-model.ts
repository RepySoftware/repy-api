import { DeliveryInstruction } from "../entities/delivery-instruction";

export class DefaultDeliveryInstructionViewModel {

    public id: number;
    public description: string;

    public static fromEntity(di: DeliveryInstruction): DefaultDeliveryInstructionViewModel {

        const deliveryInstruction = new DefaultDeliveryInstructionViewModel();

        deliveryInstruction.id = di.id;
        deliveryInstruction.description = di.description;

        return deliveryInstruction;
    }
}