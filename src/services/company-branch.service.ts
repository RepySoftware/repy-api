import { inject, injectable } from "inversify";
import { Op, WhereOptions } from "sequelize";
import { NotFoundException } from "../common/exceptions/not-fount.exception";
import { Database } from "../data/database-config";
import { CompanyBranch } from "../models/entities/company-branch";
import { CompanyBranchProduct } from "../models/entities/company-branch-product";
import { CompanyBranchProductPrice } from "../models/entities/company-branch-product-price";
import { Product } from "../models/entities/product";
import { ProductCategory } from "../models/entities/product-category";
import { User } from "../models/entities/user";
import { ProductFilter } from "../models/input-models/filter/product.filter";
import { CompanyBranchProductViewModel } from "../models/view-models/company-branch-product.view-model";
import { CompanyBranchViewModel } from "../models/view-models/company-branch.view-model";

@injectable()
export class CompanyBranchService {

    constructor(
        @inject(Database) private _database: Database
    ) { }

    private async getUser(userId: number): Promise<User> {

        const user: User = await User.findOne({
            where: {
                id: userId
            }
        });

        if (!user)
            throw new NotFoundException('Usuário não encontrado');

        return user;
    }

    public async getAll(userId: number): Promise<CompanyBranchViewModel[]> {

        const user = await this.getUser(userId);

        const branches: CompanyBranch[] = await CompanyBranch.findAll({
            where: {
                companyId: user.companyId
            },
            order: [['name', 'ASC']]
        });

        return branches.map(CompanyBranchViewModel.fromEntity);
    }
}