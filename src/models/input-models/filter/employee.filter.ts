import { PaginationFilter } from "../abstraction/pagination.filter";
import { SearchFilter } from "../abstraction/search.filter";

export interface EmployeeFilter extends PaginationFilter, SearchFilter {
    isDriver?: boolean;
}