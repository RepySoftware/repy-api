import { ProductViewModel } from "./product.view-model";

export class SalesByDayItemViewModel {
    public product: ProductViewModel;
    public quantityIssued: number;
    public quantityDelivered: number;
    public totalIssuedSalePrice: number;
    public totalDeliveredSalePrice: number;
}