import { DateHelper } from "../../common/helpers/date.helper";
import { CompanyBranch } from "../entities/company-branch";
import { AddressViewModel } from "./address.view-model";

export class CompanyBranchViewModel {

    public id: number;
    public name: string;
    public tradeName: string;
    public documentNumber: string;
    public address: AddressViewModel;
    public isDefault: boolean;
    public createdAt: string;
    public updatedAt: string;

    public static fromEntity(cb: CompanyBranch): CompanyBranchViewModel {

        const branch = new CompanyBranchViewModel();

        branch.id = cb.id;
        branch.name = cb.name;
        branch.tradeName = cb.tradeName;
        branch.documentNumber = cb.documentNumber;
        branch.address = cb.address ? AddressViewModel.fromEntity(cb.address) : null;
        branch.isDefault = cb.isDefault;
        branch.createdAt = DateHelper.toStringViewModel(cb.createdAt);
        branch.updatedAt = DateHelper.toStringViewModel(cb.updatedAt);

        return branch;
    }
}  