import { ProductViewModel } from "./product.view-model";

export class SalesByDateItemViewModel {
    public product: ProductViewModel;
    public quantityIssued: number;
    public quantityDelivered: number;
    public totalIssuedSalePrice: number;
    public totalDeliveredSalePrice: number;
}