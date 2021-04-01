import { SalesByDayItemViewModel } from "./sales-by-day-item.view-model";

export class SalesByDayViewModel {

    public items: SalesByDayItemViewModel[];
    public totalIssuedItems: number;
    public totalDeliveredItems: number;
    public totalIssuedSalePrice: number;
    public totalDeliveredSalePrice: number;
}