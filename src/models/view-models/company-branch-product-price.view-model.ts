import { DateHelper } from "../../common/helpers/date.helper";
import { CompanyBranchProductPrice } from "../entities/company-branch-product-price";

export class CompanyBranchProductPriceViewModel {

    public id: number;
    public name: string;
    public salePrice: number;
    public isDefault: boolean;
    public isActive: boolean;
    public createdAt: string;
    public updatedAt: string;

    public static fromEntity(cbpp: CompanyBranchProductPrice): CompanyBranchProductPriceViewModel {

        const price = new CompanyBranchProductPriceViewModel();

        price.id = cbpp.id;
        price.name = cbpp.name;
        price.salePrice = cbpp.salePrice;
        price.isDefault = cbpp.isDefault;
        price.isActive = cbpp.isActive;
        price.createdAt = DateHelper.toStringViewModel(cbpp.createdAt);
        price.updatedAt = DateHelper.toStringViewModel(cbpp.updatedAt);

        return price;
    }
}