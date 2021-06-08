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

    public async createPosts(input: StockPostInputModel[], userId: number, options?: { transaction?: Transaction }): Promise<StockPostViewModel[]> {

        const user = await this._userService.getEntityById(userId);

        const companyBranchProducts: CompanyBranchProduct[] = await CompanyBranchProduct.findAll({
            where: {
                id: { [Op.in]: input.map(x => x.companyBranchProductId) },
                '$companyBranch.companyId$': user.companyId
            },
            include: [
                {
                    model: CompanyBranch,
                    as: 'companyBranch'
                }
            ]
        });

        const stockPosts: StockPost[] = [];

        const transaction: Transaction = options?.transaction || await this._database.sequelize.transaction();

        try {

            for (const inputItem of input) {

                const companyBranchProduct = companyBranchProducts.find(cbp => cbp.id == inputItem.companyBranchProductId);

                if (!companyBranchProduct)
                    throw new NotFoundException('Produto não encontrado');

                let depositProduct: DepositProduct = await DepositProduct.findOne({
                    where: {
                        depositId: inputItem.depositId,
                        companyBranchProductId: companyBranchProduct.id
                    }
                });

                if (!depositProduct) {
                    depositProduct = DepositProduct.create({
                        depositId: inputItem.depositId,
                        companyBranchProductId: companyBranchProduct.id,
                        quantity: 0
                    });

                    await depositProduct.save({ transaction });
                }

                const stockPost: StockPost = StockPost.create({
                    depositId: inputItem.depositId,
                    depositProductId: depositProduct.id,
                    quantity: inputItem.quantity,
                    observation: inputItem.observation,
                    saleOrderId: inputItem?.saleOrderId,
                    dateOfIssue: moment.utc(inputItem.dateOfIssue).toDate()
                });

                await stockPost.save({ transaction });

                depositProduct.quantity += inputItem.quantity;

                await depositProduct.save({ transaction });

                stockPosts.push(stockPost);
            }

            if (!options?.transaction)
                await transaction.commit();

            return stockPosts.map(StockPostViewModel.fromEntity);

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

    public async depositTransfer(input: DepositTransferInputModel[], userId: number): Promise<void> {

        const user = await this._userService.getEntityById(userId);

        const deposits: Deposit[] = await Deposit.findAll({
            where: {
                id: {
                    [Op.in]: [
                        ...input.map(x => x.originDepositId),
                        ...input.map(x => x.destinationDepositId)
                    ]
                },
                '$companyBranch.companyId$': user.companyId
            },
            include: [
                {
                    model: CompanyBranch,
                    as: 'companyBranch'
                }
            ]
        });

        const companyBranchProducts: CompanyBranchProduct[] = await CompanyBranchProduct.findAll({
            where: {
                id: { [Op.in]: input.map(x => x.companyBranchProductId) },
                '$companyBranch.companyId$': user.companyId
            },
            include: [
                {
                    model: CompanyBranch,
                    as: 'companyBranch'
                }
            ]
        });

        const transaction: Transaction = await this._database.sequelize.transaction();

        try {

            for (const inputItem of input) {

                const originDeposit = deposits.find(od => od.id == inputItem.originDepositId);
                const destinationDeposit = deposits.find(dd => dd.id == inputItem.destinationDepositId);

                if (!originDeposit || !destinationDeposit)
                    throw new NotFoundException('Depósito não encontrado');

                const companyBranchProduct = companyBranchProducts.find(cbp => cbp.id == inputItem.companyBranchProductId);

                if (!companyBranchProduct)
                    throw new NotFoundException('Produto não encontrado');

                const observation = `[Transferência '${originDeposit.name}' => '${destinationDeposit.name}']${inputItem.observation ? ' - ' + inputItem.observation : ''}`;

                const dateOfIssue = inputItem.dateOfIssue || moment.utc().toISOString();

                await this.createPosts([
                    {
                        companyBranchProductId: inputItem.companyBranchProductId,
                        depositId: inputItem.originDepositId,
                        quantity: inputItem.quantity * (-1),
                        dateOfIssue,
                        observation
                    },
                    {
                        companyBranchProductId: inputItem.companyBranchProductId,
                        depositId: inputItem.destinationDepositId,
                        quantity: inputItem.quantity,
                        dateOfIssue,
                        observation
                    }
                ], userId, { transaction });
            }

            await transaction.commit();

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}