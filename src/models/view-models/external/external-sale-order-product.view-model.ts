import { SaleOrderProduct } from "../../entities/sale-order-product";

export class ExternalSaleOrderProductViewModel {

    public id: number;
    public productCode: string;
    public quantity: number;
    public salePrice: number;

    public static fromEntity(sop: SaleOrderProduct): ExternalSaleOrderProductViewModel {

        const product = new ExternalSaleOrderProductViewModel();

        product.id = sop.id;
        product.productCode = sop.companyBranchProduct.product.code;
        product.quantity = sop.quantity;
        product.salePrice = sop.salePrice;

        return product;
    }
}