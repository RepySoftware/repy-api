import { PaginationFilter } from "../abstraction/pagination.filter";

export interface StockPostFilter extends PaginationFilter {
    depositId: number;
    companyBranchProductId?: number;
}