import { DateHelper } from "../../common/helpers/date.helper";
import { Company } from "../entities/company";

export class CompanyViewModel {

    public id: number;
    public name: string;
    public updatedAt: string;
    public createdAt: string;

    public static fromEntity(c: Company): CompanyViewModel {

        const company = new CompanyViewModel();

        company.id = c.id;
        company.name = c.name;
        company.updatedAt = DateHelper.toStringViewModel(c.updatedAt);
        company.createdAt = DateHelper.toStringViewModel(c.createdAt);

        return company;
    }
}  