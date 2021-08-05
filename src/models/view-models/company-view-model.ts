import { Company } from "../entities/company";

export class CompanyViewModel {

    public id: number;
    public name: string;

    public static fromEntity(c: Company): CompanyViewModel {

        const company = new CompanyViewModel();

        company.id = c.id;
        company.name = c.name;

        return company;
    }
}