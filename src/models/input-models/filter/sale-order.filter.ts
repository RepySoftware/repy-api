import { PaginationFilter } from "../abstraction/pagination.filter";

export interface SaleOrderFilter extends PaginationFilter {
    status?: string;
    employeeDriverId?: number;
    startDateOfIssue?: string;
    endDateOfIssue?: string;
    startDeliveredAt?: string;
    endDeliveredAt?: string;
    personCustomerId?: number;
    paymentMethodId?: number;
}