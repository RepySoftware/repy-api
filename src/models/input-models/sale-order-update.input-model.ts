import { SaleOrderStatus } from "../../common/enums/sale-order-status";
import { AddressInputModel } from "./address.input-model";
import { SaleOrderProductUpdateInputModel } from "./sale-order-product-update.input-model";

export interface SaleOrderUpdateInputModel {
    id: number;
    status: SaleOrderStatus;
    companyBranchId: number;
    employeeDriverId?: number;
    personCustomerId: number;
    paymentMethodId: number;
    paymentInstallments: number;
    deliveryAddress: AddressInputModel;
    observation?: string;
    scheduledAt?: string;
    dateOfIssue: string;
    deliveredAt?: string;
    products: SaleOrderProductUpdateInputModel[];
}