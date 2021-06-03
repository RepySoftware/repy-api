import { DepositProduct } from "../entities/deposit-product";
import { CompanyBranchProductViewModel } from "./company-branch-product.view-model";
import { DepositViewModel } from "./deposit.view-model";

export class DepositProductViewModel {

    public id: number;
    public deposit: DepositViewModel;
    public companyBranchProduct: CompanyBranchProductViewModel;
    public quantity: number;

    public static fromEntity(dp: DepositProduct): DepositProductViewModel {
        const depositProduct = new DepositProductViewModel();

        depositProduct.id = dp.id;
        depositProduct.deposit = dp.deposit ? DepositViewModel.fromEntity(dp.deposit) : null;
        depositProduct.companyBranchProduct = dp.companyBranchProduct ? CompanyBranchProductViewModel.fromEntity(dp.companyBranchProduct) : null;
        depositProduct.quantity = dp.quantity;

        return depositProduct;
    }
}