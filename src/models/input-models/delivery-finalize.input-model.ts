import { SaleOrderPaymentInputModel } from "./sale-order-payment.input-model";

export interface DeliveryFinalizeInputModel {

    id: number;

    // sale order params
    deliveredAt?: string;
    payments?: SaleOrderPaymentInputModel[];
}