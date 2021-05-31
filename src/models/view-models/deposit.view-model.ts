import { DateHelper } from "../../common/helpers/date.helper";
import { Entity } from "../abstraction/entity";
import { Deposit } from "../entities/deposit";
import { CompanyBranchViewModel } from "./company-branch.view-model";

export class DepositViewModel {

    public id: number;
    public name: string;
    public companyBranch: CompanyBranchViewModel;
    public createdAt: string;
    public updatedAt: string;

    public static fromEntity(d: Deposit): DepositViewModel {

        const deposit = new DepositViewModel();

        deposit.id = d.id;
        deposit.name = d.name;
        deposit.companyBranch = d.companyBranch ? CompanyBranchViewModel.fromEntity(d.companyBranch) : null;
        deposit.createdAt = DateHelper.toStringViewModel(d.createdAt);
        deposit.updatedAt = DateHelper.toStringViewModel(d.updatedAt);

        return deposit;
    }
}