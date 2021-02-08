import { PaginationFilter } from "../abstraction/pagination.filter";
import { SearchFilter } from "../abstraction/search.filter";

export interface PersonFilter extends PaginationFilter, SearchFilter {

}