import { SaleOrderProduct } from "../entities/sale-order-product";

export class DriverSaleOrderProductViewModel {

    productName: string;
    quantity: number;
    salePrice: number;

    public static fromEntity(sop: SaleOrderProduct): DriverSaleOrderProductViewModel {

        const saleOrderProduct = new DriverSaleOrderProductViewModel();

        saleOrderProduct.productName = sop.companyBranchProduct.product.name;
        saleOrderProduct.quantity = sop.quantity;
        saleOrderProduct.salePrice = sop.salePrice;

        return saleOrderProduct;
    }
}