import { SalesByDateItemViewModel } from "./sales-by-date-item.view-model";

export class SalesByDateViewModel {

    public items: SalesByDateItemViewModel[];
    public totalIssuedItems: number;
    public totalDeliveredItems: number;
    public totalIssuedSalePrice: number;
    public totalDeliveredSalePrice: number;
}