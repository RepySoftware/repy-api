export interface DeliveryFinalizeInputModel {

    id: number;

    // sale order params
    deliveredAt?: string;
    paymentMethodId?: number;
    installments?: number;
}