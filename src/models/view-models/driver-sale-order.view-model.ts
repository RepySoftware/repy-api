import { SaleOrderStatus } from "../../common/enums/sale-order-status";
import { DriverSaleOrderProductViewModel } from "./driver-sale-order-product.view-model";
import { PaymentMethodViewModel } from "./payment-method.view-model";

export class DriverSaleOrderViewModel {
    id: number;
    personCustomerName: string;
    status: SaleOrderStatus;
    scheduledAt?: string;
    totalSalePrice: number;
    addressFormatted: string;
    paymentMethod?: PaymentMethodViewModel;
    observation?: string;
    products: DriverSaleOrderProductViewModel[];
}