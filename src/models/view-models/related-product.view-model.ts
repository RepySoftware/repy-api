import { RelatedProduct } from "../entities/related-product";
import { CompanyBranchProductViewModel } from "./company-branch-product.view-model";

export class RelatedProductViewModel {

    public id: number;
    public referencedCompanyBranchProduct: CompanyBranchProductViewModel;
    public isDefault: boolean;

    public static fromEntity(rp: RelatedProduct): RelatedProductViewModel {

        const relatedProduct = new RelatedProductViewModel();

        relatedProduct.id = rp.id;
        relatedProduct.referencedCompanyBranchProduct = rp.referencedCompanyBranchProduct ? CompanyBranchProductViewModel.fromEntity(rp.referencedCompanyBranchProduct) : null;
        relatedProduct.isDefault = rp.isDefault;

        return relatedProduct;
    }
}