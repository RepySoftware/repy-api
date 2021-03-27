import { SaleOrderProductCreateInputModel } from "./sale-order-product-create.input-model copy";

export interface SaleOrderCreateInputModel {
    companyBranchId: number;
    employeeDriverId?: number;
    personCustomerId: number;
    paymentMethodId: number;
    paymentInstallments: number;
    observation?: string;
    scheduledAt?: string;
    products: SaleOrderProductCreateInputModel[];
}