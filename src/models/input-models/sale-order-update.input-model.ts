import { SaleOrderStatus } from "../../common/enums/sale-order-status";
import { AddressInputModel } from "./address.input-model";
import { SaleOrderPaymentInputModel } from "./sale-order-payment.input-model";
import { SaleOrderProductUpdateInputModel } from "./sale-order-product-update.input-model";

export interface SaleOrderUpdateInputModel {
    id: number;
    status: SaleOrderStatus;
    companyBranchId: number;
    employeeDriverId?: number;
    personCustomerId: number;
    payments: SaleOrderPaymentInputModel[];
    // deliveryAddress: AddressInputModel;
    observation?: string;
    scheduledAt?: string;
    dateOfIssue: string;
    deliveredAt?: string;
    products: SaleOrderProductUpdateInputModel[];
}