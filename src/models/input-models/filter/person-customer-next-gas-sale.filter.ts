import { PaginationFilter } from "../abstraction/pagination.filter";

export interface PersonCustomerNextGasSaleFilter extends PaginationFilter {

    personCustomer?: string;
    startNextSaleMinDate?: string;
    endNextSaleMinDate?: string;
    startNextSaleMaxDate?: string;
    endNextSaleMaxDate?: string;
}