import { inject, injectable } from "inversify";
import { Op, Transaction, WhereOptions } from "sequelize";
import { NotFoundException } from "../common/exceptions/not-fount.exception";
import { Database } from "../data/database-config";
import { Company } from "../models/entities/company";
import { CompanyBranch } from "../models/entities/company-branch";
import { CompanyBranchProduct } from "../models/entities/company-branch-product";
import { CompanyBranchProductPrice } from "../models/entities/company-branch-product-price";
import { Product } from "../models/entities/product";
import { ProductCategory } from "../models/entities/product-category";
import { RelatedProduct } from "../models/entities/related-product";
import { CompanyBranchProductPriceInputModel } from "../models/input-models/company-branch-product-price.input-model";
import { ProductFilter } from "../models/input-models/filter/product.filter";
import { ProductInputModel } from "../models/input-models/product.input-model";
import { CompanyBranchProductPriceViewModel } from "../models/view-models/company-branch-product-price.view-model";
import { CompanyBranchProductViewModel } from "../models/view-models/company-branch-product.view-model";
import { ProductCategoryViewModel } from "../models/view-models/product-category.view-model";
import { ProductViewModel } from "../models/view-models/product.view-model";
import { RelatedProductViewModel } from "../models/view-models/related-product.view-model";
import { UserService } from "./user.service";

@injectable()
export class ProductService {

    constructor(
        @inject(UserService) private _userService: UserService,
        @inject(Database) private _database: Database
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
                    separate: true,
                    where: {
                        isActive: true
                    }
                }
            ],
            limit,
            offset,
            order: [['product', 'name', 'ASC']]
        });

        return products.map(CompanyBranchProductViewModel.fromEntity);
    }

    public async getCategories(userId: number): Promise<ProductCategoryViewModel[]> {

        const user = await this._userService.getEntityById(userId);

        const categories: ProductCategory[] = await ProductCategory.findAll({
            where: {
                companyId: user.id
            },
            order: [['name', 'ASC']]
        });

        return categories.map(ProductCategoryViewModel.fromEntity);
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

    public async getById(id: number, userId: number): Promise<ProductViewModel> {

        const user = await this._userService.getEntityById(userId);

        const product: Product = await Product.findOne({
            where: {
                companyId: user.companyId,
                id
            },
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
            ]
        });

        if (!product)
            throw new NotFoundException('Produto não encontrado');

        return ProductViewModel.fromEntity(product);
    }

    public async getRelated(companyBranchProductId: number, userId: number): Promise<RelatedProductViewModel[]> {

        const user = await this._userService.getEntityById(userId);

        const relatedProducts: RelatedProduct[] = await RelatedProduct.findAll({
            where: {
                companyBranchProductId,
                '$companyBranchProduct.companyBranch.companyId$': user.companyId,
                '$referencedCompanyBranchProduct.companyBranch.companyId$': user.companyId
            },
            include: [
                {
                    model: CompanyBranchProduct,
                    as: 'companyBranchProduct',
                    include: [
                        {
                            model: CompanyBranch,
                            as: 'companyBranch'
                        },
                        {
                            model: Product,
                            as: 'product'
                        }
                    ]
                },
                {
                    model: CompanyBranchProduct,
                    as: 'referencedCompanyBranchProduct',
                    include: [
                        {
                            model: CompanyBranch,
                            as: 'companyBranch'
                        },
                        {
                            model: Product,
                            as: 'product'
                        }
                    ]
                }
            ],
            order: [['companyBranchProduct', 'product', 'name', 'ASC']]
        });

        return relatedProducts.map(RelatedProductViewModel.fromEntity);
    }

    public async create(input: ProductInputModel, userId: number): Promise<ProductViewModel> {

        const user = await this._userService.getEntityById(userId);

        const company: Company = await Company.findOne({
            where: {
                id: user.companyId
            }
        });

        if (!company)
            throw new NotFoundException('Empresa não encontrada');

        const product = Product.create({
            companyId: company.id,
            categoryId: input.categoryId,
            code: input.code,
            name: input.name,
            description: input.description,
            measurementUnit: input.measurementUnit,
            isGas: input.isGas,
        });

        await product.save();

        return await this.getById(product.id, userId);
    }

    public async update(input: ProductInputModel, userId: number): Promise<ProductViewModel> {

        const user = await this._userService.getEntityById(userId);

        const product: Product = await Product.findOne({
            where: {
                id: input.id,
                companyId: user.companyId
            }
        });

        if (!product)
            throw new NotFoundException('Produto não encontrado');

        product.categoryId = input.categoryId;
        product.code = input.code;
        product.name = input.name;
        product.description = input.description;
        product.measurementUnit = input.measurementUnit;
        product.isGas = input.isGas;

        await product.save();

        return await this.getById(product.id, userId);
    }

    public async getPrices(productId: number, userId: number): Promise<CompanyBranchProductPriceViewModel[]> {

        const user = await this._userService.getEntityById(userId);

        const prices: CompanyBranchProductPrice[] = await CompanyBranchProductPrice.findAll({
            where: {
                '$companyBranchProduct.product.companyId$': user.companyId,
                '$companyBranchProduct.product.id$': productId
            },
            include: [
                {
                    model: CompanyBranchProduct,
                    as: 'companyBranchProduct',
                    include: [
                        {
                            model: Product,
                            as: 'product'
                        }
                    ]
                }
            ]
        });

        return prices.map(CompanyBranchProductPriceViewModel.fromEntity);
    }

    public async getPriceById(
        productId: number,
        companyBranchProductPriceId: number,
        userId: number
    ): Promise<CompanyBranchProductPriceViewModel> {

        const user = await this._userService.getEntityById(userId);

        const price: CompanyBranchProductPrice = await CompanyBranchProductPrice.findOne({
            where: {
                '$companyBranchProduct.product.companyId$': user.companyId,
                '$companyBranchProduct.product.id$': productId,
                id: companyBranchProductPriceId
            },
            include: [
                {
                    model: CompanyBranchProduct,
                    as: 'companyBranchProduct',
                    include: [
                        {
                            model: Product,
                            as: 'product'
                        }
                    ]
                }
            ]
        });

        return CompanyBranchProductPriceViewModel.fromEntity(price);
    }

    public async createPrice(
        input: CompanyBranchProductPriceInputModel,
        userId: number
    ): Promise<CompanyBranchProductPriceViewModel> {

        const user = await this._userService.getEntityById(userId);

        const companyBranchProduct: CompanyBranchProduct = await CompanyBranchProduct.findOne({
            where: {
                '$product.companyId$': user.companyId,
                '$product.id$': input.productId,
            },
            include: [
                {
                    model: Product,
                    as: 'product'
                },
                {
                    model: CompanyBranchProductPrice,
                    as: 'prices',
                    separate: true
                }
            ]
        });

        if (!companyBranchProduct)
            throw new NotFoundException('Produto não encontrado');

        const transaction: Transaction = await this._database.sequelize.transaction();

        try {

            if (input.isDefault) {
                for (const p of companyBranchProduct.prices.filter(x => x.isDefault)) {
                    p.isDefault = false;
                    await p.save({ transaction });
                }
            }

            const price = CompanyBranchProductPrice.create({
                companyBranchProductId: companyBranchProduct.id,
                name: input.name,
                salePrice: input.salePrice,
                isDefault: input.isDefault,
                isActive: input.isActive
            });

            await price.save({ transaction });

            await transaction.commit();

            return await this.getPriceById(input.productId, price.id, userId);

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    public async updatePrice(
        input: CompanyBranchProductPriceInputModel,
        userId: number
    ): Promise<CompanyBranchProductPriceViewModel> {

        const user = await this._userService.getEntityById(userId);

        const companyBranchProduct: CompanyBranchProduct = await CompanyBranchProduct.findOne({
            where: {
                '$product.companyId$': user.companyId,
                '$product.id$': input.productId,
            },
            include: [
                {
                    model: Product,
                    as: 'product'
                },
                {
                    model: CompanyBranchProductPrice,
                    as: 'prices',
                    separate: true
                }
            ]
        });

        const price: CompanyBranchProductPrice = await CompanyBranchProductPrice.findOne({
            where: {
                '$companyBranchProduct.product.companyId$': user.companyId,
                '$companyBranchProduct.product.id$': input.productId,
                id: input.id
            },
            include: [
                {
                    model: CompanyBranchProduct,
                    as: 'companyBranchProduct',
                    include: [
                        {
                            model: Product,
                            as: 'product'
                        }
                    ]
                }
            ]
        });

        if (!price)
            throw new NotFoundException('Preço não encontrado');

        const transaction: Transaction = await this._database.sequelize.transaction();

        try {
            if (input.isDefault) {
                for (const p of companyBranchProduct.prices.filter(x => x.isDefault && x.id != input.id)) {
                    p.isDefault = false;
                    await p.save({ transaction });
                }
            }

            price.name = input.name;
            price.salePrice = input.salePrice;
            price.isDefault = input.isDefault;
            price.isActive = input.isActive;

            await price.save({ transaction });

            await transaction.commit();

            return await this.getPriceById(input.productId, price.id, userId);

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}