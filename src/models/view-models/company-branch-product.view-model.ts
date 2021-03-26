import { CompanyBranchProduct } from "../entities/company-branch-product";
import { CompanyBranchProductPriceViewModel } from "./company-branch-product-price.view-model";
import { ProductViewModel } from "./product.view-model";

export class CompanyBranchProductViewModel {

    public id: number;
    public product: ProductViewModel;
    public prices: CompanyBranchProductPriceViewModel[];
    public isDefault: boolean;

    public static fromEntity(cbp: CompanyBranchProduct): CompanyBranchProductViewModel {

        const product = new CompanyBranchProductViewModel();

        product.id = cbp.id;
        product.product = cbp.product ? ProductViewModel.fromEntity(cbp.product) : null;
        product.prices = cbp.prices ? cbp.prices.map(CompanyBranchProductPriceViewModel.fromEntity) : null;
        product.isDefault = cbp.isDefault;

        return product;
    }
}