import { SaleOrderProduct } from "../entities/sale-order-product";
import { CompanyBranchProductPriceViewModel } from "./company-branch-product-price.view-model";
import { CompanyBranchProductViewModel } from "./company-branch-product.view-model";

export class SaleOrderProductViewModel {

    public id: number;
    public companyBranchProduct: CompanyBranchProductViewModel;
    public companyBranchProductPrice: CompanyBranchProductPriceViewModel;
    public quantity: number;
    public salePrice: number;

    public static fromEntity(sop: SaleOrderProduct): SaleOrderProductViewModel {

        const product = new SaleOrderProductViewModel();

        product.id = sop.id;
        product.companyBranchProduct = sop.companyBranchProduct ? CompanyBranchProductViewModel.fromEntity(sop.companyBranchProduct) : null;
        product.companyBranchProductPrice = sop.companyBranchProductPrice ? CompanyBranchProductPriceViewModel.fromEntity(sop.companyBranchProductPrice) : null;
        product.quantity = sop.quantity;
        product.salePrice = sop.salePrice;

        return product;
    }
}