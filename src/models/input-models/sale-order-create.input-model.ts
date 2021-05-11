import { SaleOrderPaymentInputModel } from "./sale-order-payment.input-model";
import { SaleOrderProductCreateInputModel } from "./sale-order-product-create.input-model";

export interface SaleOrderCreateInputModel {
    companyBranchId: number;
    employeeDriverId?: number;
    personCustomerId: number;
    payments: SaleOrderPaymentInputModel[];
    observation?: string;
    scheduledAt?: string;
    products: SaleOrderProductCreateInputModel[];
}