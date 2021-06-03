import { inject, injectable } from "inversify";
import { Transaction } from "sequelize/types";
import { NotFoundException } from "../common/exceptions/not-fount.exception";
import { Database } from "../data/database-config";
import { CompanyBranch } from "../models/entities/company-branch";
import { CompanyBranchProduct } from "../models/entities/company-branch-product";
import { Deposit } from "../models/entities/deposit";
import { DepositProduct } from "../models/entities/deposit-product";
import { Product } from "../models/entities/product";
import { StockPost } from "../models/entities/stock-post";
import { PaginationFilter } from "../models/input-models/abstraction/pagination.filter";
import { StockPostFilter } from "../models/input-models/filter/stock-post.filter";
import { StockPostInputModel } from "../models/input-models/stock-post.input-model";
import { DepositViewModel } from "../models/view-models/deposit.view-model";
import { StockPostViewModel } from "../models/view-models/stock-post.view-model";
import { UserService } from "./user.service";

@injectable()
export class StockService {

    constructor(
        @inject(UserService) private _userService: UserService,
        @inject(Database) private _database: Database
    ) { }

    public async getDeposits(companyBranchId: number, userId: number): Promise<DepositViewModel[]> {

        const user = await this._userService.getEntityById(userId);

        const deposits: Deposit[] = await Deposit.findAll({
            where: {
                companyBranchId,
                '$companyBranch.companyId$': user.companyId
            },
            include: [
                {
                    model: CompanyBranch,
                    as: 'companyBranch'
                },
                {
                    model: DepositProduct,
                    as: 'products',
                    separate: true,
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
                }
            ]
        });

        return deposits.map(DepositViewModel.fromEntity);
    }

    public async getDepositById(depositId: number, userId: number): Promise<DepositViewModel> {

        const user = await this._userService.getEntityById(userId);

        const deposit: Deposit = await Deposit.findOne({
            where: {
                id: depositId,
                '$companyBranch.companyId$': user.companyId
            },
            include: [
                {
                    model: CompanyBranch,
                    as: 'companyBranch'
                },
                {
                    model: DepositProduct,
                    as: 'products',
                    separate: true,
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
                }
            ]
        });

        return DepositViewModel.fromEntity(deposit);
    }

    public async getPosts(input: StockPostFilter, userId: number): Promise<StockPostViewModel[]> {

        const user = await this._userService.getEntityById(userId);

        const limit = Number(input.limit || 20);
        const offset = Number((input.index || 0) * limit);

        const where = {
            depositId: input.depositId,
            '$deposit.companyBranch.companyId$': user.companyId
        };

        if (input.companyBranchProductId)
            where['$depositProduct.companyBranchProductId$'] = input.companyBranchProductId;

        const posts: StockPost[] = await StockPost.findAll({
            where,
            include: [
                {
                    model: Deposit,
                    as: 'deposit',
                    include: [
                        {
                            model: CompanyBranch,
                            as: 'companyBranch'
                        }
                    ]
                },
                {
                    model: DepositProduct,
                    as: 'depositProduct',
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
                }
            ],
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        return posts.map(StockPostViewModel.fromEntity);
    }

    public async post(input: StockPostInputModel, userId: number): Promise<StockPostViewModel> {

        const user = await this._userService.getEntityById(userId);

        const companyBranchProduct: CompanyBranchProduct = await CompanyBranchProduct.findOne({
            where: {
                id: input.companyBranchProductId,
                '$companyBranch.companyId$': user.companyId
            },
            include: [
                {
                    model: CompanyBranch,
                    as: 'companyBranch'
                }
            ]
        });

        if (!companyBranchProduct)
            throw new NotFoundException('Produto não encontrado');

        let depositProduct: DepositProduct = await DepositProduct.findOne({
            where: {
                depositId: input.depositId,
                companyBranchProductId: companyBranchProduct.id
            }
        });

        const transaction: Transaction = await this._database.sequelize.transaction();

        try {

            if (!depositProduct) {
                depositProduct = DepositProduct.create({
                    depositId: input.depositId,
                    companyBranchProductId: companyBranchProduct.id,
                    quantity: 0
                });

                await depositProduct.save({ transaction });
            }

            const stockPost: StockPost = StockPost.create({
                depositId: input.depositId,
                depositProductId: depositProduct.id,
                quantity: input.quantity
            });

            await stockPost.save({ transaction });

            depositProduct.quantity += input.quantity;

            await depositProduct.save({ transaction });

            await transaction.commit();

            return StockPostViewModel.fromEntity(stockPost);

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}