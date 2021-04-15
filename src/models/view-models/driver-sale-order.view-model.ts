import { DriverSaleOrderProductViewModel } from "./driver-sale-order-product.view-model";

export class DriverSaleOrderViewModel {
    id: number;
    personCustomerName: string;
    scheduledAt?: string;
    totalSalePrice: number;
    addressFormatted: string;
    paymentMethod?: string;
    observation?: string;
    products: DriverSaleOrderProductViewModel[];
}