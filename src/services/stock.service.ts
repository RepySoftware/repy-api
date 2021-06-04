import { inject, injectable } from "inversify";
import { Op, Transaction } from "sequelize";
import { NotFoundException } from "../common/exceptions/not-fount.exception";
import { Database } from "../data/database-config";
import { CompanyBranch } from "../models/entities/company-branch";
import { CompanyBranchProduct } from "../models/entities/company-branch-product";
import { Deposit } from "../models/entities/deposit";
import { DepositProduct } from "../models/entities/deposit-product";
import { Product } from "../models/entities/product";
import { StockPost } from "../models/entities/stock-post";
import { StockPostFilter } from "../models/input-models/filter/stock-post.filter";
import { StockPostInputModel } from "../models/input-models/stock-post.input-model";
import { DepositViewModel } from "../models/view-models/deposit.view-model";
import { StockPostViewModel } from "../models/view-models/stock-post.view-model";
import { UserService } from "./user.service";
import * as moment from 'moment-timezone';
import { DepositTransferInputModel } from "../models/input-models/deposit-transfer.input-model";

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
                    where: {
                        quantity: { [Op.gt]: 0 }
                    },
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
                    where: {
                        quantity: { [Op.gt]: 0 }
                    },
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
            order: [['dateOfIssue', 'DESC']]
        });

        return posts.map(StockPostViewModel.fromEntity);
    }

    public async createPost(input: StockPostInputModel, userId: number, options?: { transaction?: Transaction, saleOrderId?: number }): Promise<StockPostViewModel> {

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

        const transaction: Transaction = options?.transaction || await this._database.sequelize.transaction();

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
                quantity: input.quantity,
                observation: input.observation,
                saleOrderId: options?.saleOrderId,
                dateOfIssue: moment.utc(input.dateOfIssue).toDate()
            });

            await stockPost.save({ transaction });

            depositProduct.quantity += input.quantity;

            await depositProduct.save({ transaction });

            if (!options?.transaction)
                await transaction.commit();

            return StockPostViewModel.fromEntity(stockPost);

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    public async deletePost(postId: number, userId: number): Promise<void> {

        const user = await this._userService.getEntityById(userId);

        const stockPost: StockPost = await StockPost.findOne({
            where: {
                id: postId,
                '$deposit.companyBranch.companyId$': user.companyId
            },
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
                }
            ]
        });

        if (!stockPost)
            throw new NotFoundException('Lançamento não encontrado');

        const depositProduct: DepositProduct = await DepositProduct.findOne({
            where: {
                id: stockPost.depositProductId
            }
        });

        const transaction: Transaction = await this._database.sequelize.transaction();

        try {

            depositProduct.quantity -= stockPost.quantity;
            await depositProduct.save({ transaction });

            await stockPost.destroy({ transaction });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }

    }

    public async depositTransfer(input: DepositTransferInputModel, userId: number): Promise<void> {

        const user = await this._userService.getEntityById(userId);

        const originDeposit: Deposit = await Deposit.findOne({
            where: {
                id: input.originDepositId,
                '$companyBranch.companyId$': user.companyId
            },
            include: [
                {
                    model: CompanyBranch,
                    as: 'companyBranch'
                }
            ]
        });

        const destinationDeposit: Deposit = await Deposit.findOne({
            where: {
                id: input.destinationDepositId,
                '$companyBranch.companyId$': user.companyId
            },
            include: [
                {
                    model: CompanyBranch,
                    as: 'companyBranch'
                }
            ]
        });

        if (!originDeposit || !destinationDeposit)
            throw new NotFoundException('Depósito não encontrado');

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

        const observation = `[Transferência '${originDeposit.name}' => '${destinationDeposit.name}']${input.observation ? ' - ' + input.observation : ''}`;

        const dateOfIssue = input.dateOfIssue || moment.utc().toISOString();

        const transaction: Transaction = await this._database.sequelize.transaction();

        try {

            await this.createPost({
                companyBranchProductId: input.companyBranchProductId,
                depositId: input.originDepositId,
                quantity: input.quantity * (-1),
                dateOfIssue,
                observation
            }, userId, { transaction });

            await this.createPost({
                companyBranchProductId: input.companyBranchProductId,
                depositId: input.destinationDepositId,
                quantity: input.quantity,
                dateOfIssue,
                observation
            }, userId, { transaction });

            await transaction.commit();

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}