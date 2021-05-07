import { SaleOrderStatus } from "../../../common/enums/sale-order-status";
import { PaginationFilter } from "../abstraction/pagination.filter";

export interface SaleOrderDriverFilter extends PaginationFilter {
    startDeliveredAt?: string;
    endDeliveredAt?: string;
}