import { SaleOrderStatus } from "../../../common/enums/sale-order-status";
import { PaginationFilter } from "../abstraction/pagination.filter";

export interface SaleOrderFilter extends PaginationFilter {
    status?: string;
    employeeDriverId?: number;
    startDateOfIssue?: string;
    endDateOfIssue?: string;
    personCustomerId?: number;
    paymentMethodId?: number;
}