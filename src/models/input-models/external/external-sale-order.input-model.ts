import { ExternalAddressInputModel } from "./external-address.input-model";
import { ExternalPaymentInputModel } from "./external-payment.input-model";
import { ExternalPersonCustomerInputModel } from "./external-person-customer.input-model";
import { ExternalSaleOrderProductInputModel } from "./external-sale-order-product-create.input-model";

export interface ExternalSaleOrderInputModel {
    salePointId: number;
    personCustomer: ExternalPersonCustomerInputModel;
    payments: ExternalPaymentInputModel[];
    deliveryAddress: ExternalAddressInputModel;
    observation?: string;
    dateOfIssue: string;
    scheduledAt?: string;
    source: string;
    products: ExternalSaleOrderProductInputModel[];
}