export interface SaleOrderConfirmDeliveryInputModel {

    saleOrderId: number;
    deliveredAt: string;
    paymentMethodId: number;
    installments?: number;
}