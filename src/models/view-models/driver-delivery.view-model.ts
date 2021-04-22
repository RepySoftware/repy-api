import { DeliveryType } from "../../common/enums/delivery-type";
import { DeliveryInstruction } from "../entities/delivery-instruction";
import { SaleOrder } from "../entities/sale-order";
import { DriverDeliveryInstructionViewModel } from "./driver-delivery-instruction.view-model";
import { DriverSaleOrderViewModel } from "./driver-sale-order.view-model";

export class DriverDeliveryViewModel {

    public type: DeliveryType;
    public index: number;
    public saleOrder?: DriverSaleOrderViewModel;
    public deliveryInstruction?: DriverDeliveryInstructionViewModel;

    public static fromSaleOrder(so: SaleOrder): DriverDeliveryViewModel {

        const delivery = new DriverDeliveryViewModel();

        delivery.type = DeliveryType.saleOrder;
        delivery.index = so.index;
        delivery.saleOrder = DriverSaleOrderViewModel.fromEntity(so);

        return delivery;
    }

    public static fromDeliveryInstruction(edi: DeliveryInstruction): DriverDeliveryViewModel {

        const delivery = new DriverDeliveryViewModel();

        delivery.type = DeliveryType.deliveryInstruction;
        delivery.index = edi.index;
        delivery.deliveryInstruction = DriverDeliveryInstructionViewModel.fromEntity(edi);

        return delivery;
    }
}