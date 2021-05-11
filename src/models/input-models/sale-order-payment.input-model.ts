export interface SaleOrderPaymentInputModel {

    id?: number;
    paymentMethodId: number;
    value: number;
    dueDate: string;
    payDate?: string;
}