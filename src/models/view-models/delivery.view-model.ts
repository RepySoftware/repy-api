import { DeliveryType } from "../../common/enums/delivery-type";
import { DeliveryInstruction } from "../entities/delivery-instruction";
import { SaleOrder } from "../entities/sale-order";
import { DeliveryInstructionViewModel } from "./delivery-instruction.view-model";
import { EmployeeViewModel } from "./employee.view-model";
import { SaleOrderViewModel } from "./sale-order.view-model";

export class DeliveryViewModel {

    public type: DeliveryType;
    public index: number;
    public employeeDriver: EmployeeViewModel;
    public saleOrder?: SaleOrderViewModel;
    public deliveryInstruction?: DeliveryInstructionViewModel;

    public static fromSaleOrder(so: SaleOrder): DeliveryViewModel {

        const delivery = new DeliveryViewModel();

        delivery.type = DeliveryType.saleOrder;
        delivery.index = so.index;
        delivery.employeeDriver = so.employeeDriver ? EmployeeViewModel.fromEntity(so.employeeDriver) : null;
        delivery.saleOrder = SaleOrderViewModel.fromEntity(so);

        return delivery;
    }

    public static fromDeliveryInstruction(edi: DeliveryInstruction): DeliveryViewModel {

        const delivery = new DeliveryViewModel();

        delivery.type = DeliveryType.deliveryInstruction;
        delivery.index = edi.index;
        delivery.employeeDriver = EmployeeViewModel.fromEntity(edi.employeeDriver);
        delivery.deliveryInstruction = DeliveryInstructionViewModel.fromEntity(edi);

        return delivery;
    }
}