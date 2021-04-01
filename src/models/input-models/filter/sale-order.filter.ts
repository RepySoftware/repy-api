import { SaleOrderStatus } from "../../../common/enums/sale-order-status";
import { PaginationFilter } from "../abstraction/pagination.filter";

export interface SaleOrderFilter extends PaginationFilter {
    status?: SaleOrderStatus;
    employeeDriverId?: number;
    startDateOfIssue?: string;
    endDateOfIssue?: string;
}