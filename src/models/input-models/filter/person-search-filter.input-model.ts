import { PaginationFilter } from "../abstraction/pagination.filter";
import { SearchFilter } from "../abstraction/search.filter";

export interface PersonSearchInputModel extends PaginationFilter, SearchFilter {
    name?: string;
    phone?: string;
    address?: string;
}