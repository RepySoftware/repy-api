import { inject, injectable } from "inversify";
import { Op, WhereOptions } from "sequelize";
import { CompanyBranch } from "../models/entities/company-branch";
import { CompanyBranchProduct } from "../models/entities/company-branch-product";
import { CompanyBranchProductPrice } from "../models/entities/company-branch-product-price";
import { Product } from "../models/entities/product";
import { ProductCategory } from "../models/entities/product-category";
import { ProductFilter } from "../models/input-models/filter/product.filter";
import { CompanyBranchProductViewModel } from "../models/view-models/company-branch-product.view-model";
import { ProductViewModel } from "../models/view-models/product.view-model";
import { UserService } from "./user.service";

@injectable()
export class ProductService {

    constructor(
        @inject(UserService) private _userService: UserService
    ) { }

    public async getAllForSales(input: ProductFilter, companyBranchId: number, userId: number): Promise<CompanyBranchProductViewModel[]> {

        const user = await this._userService.getEntityById(userId);

        const limit = Number(input.limit || 20);
        const offset = Number((input.index || 0) * limit);

        let where: WhereOptions = {
            companyBranchId: companyBranchId,
            '$companyBranch.companyId$': user.companyId
        };

        if (input.q) {
            where['$product.name$'] = {
                [Op.like]: `%${input.q}%`
            }
        }

        const products: CompanyBranchProduct[] = await CompanyBranchProduct.findAll({
            where,
            include: [
                {
                    model: Product,
                    as: 'product',
                    include: [
                        {
                            model: ProductCategory,
                            as: 'category'
                        }
                    ]
                },
                {
                    model: CompanyBranch,
                    as: 'companyBranch'
                },
                {
                    model: CompanyBranchProductPrice,
                    as: 'prices',
                    separate: true
                }
            ],
            limit,
            offset,
            order: [['product', 'name', 'ASC']]
        });

        return products.map(CompanyBranchProductViewModel.fromEntity);
    }

    public async getAll(input: ProductFilter, userId: number): Promise<ProductViewModel[]> {

        const user = await this._userService.getEntityById(userId);

        const limit = Number(input.limit || 20);
        const offset = Number((input.index || 0) * limit);

        let where: WhereOptions = {
            companyId: user.companyId
        };

        if (input.q) {
            where['name'] = {
                [Op.like]: `%${input.q}%`
            };
        }

        const products: Product[] = await Product.findAll({
            where,
            include: [
                {
                    model: ProductCategory,
                    as: 'category'
                },
                {
                    model: CompanyBranchProduct,
                    as: 'companyBranchesProduct',
                    separate: true,
                    include: [
                        {
                            model: CompanyBranch,
                            as: 'companyBranch'
                        },
                        {
                            model: CompanyBranchProductPrice,
                            as: 'prices',
                            separate: true
                        }
                    ]
                }
            ],
            limit,
            offset,
            order: [['name', 'ASC']]
        });

        return products.map(ProductViewModel.fromEntity);
    }
}