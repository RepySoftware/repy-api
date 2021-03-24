import { inject, injectable } from "inversify";
import { Includeable, Op, WhereOptions } from "sequelize";
import { CompanyBranchException } from "../common/exceptions/company-branch.exception";
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

@injectable()
export class UserService {

    constructor() { }

    public async getEntityById(userId: number, include: Includeable[] = []): Promise<User> {

        const user: User = await User.findOne({
            where: {
                id: userId
            },
            include
        });

        if (!user)
            throw new NotFoundException('Usuário não encontrado');

        return user;
    }
}