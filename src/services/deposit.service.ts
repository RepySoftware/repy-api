import { inject, injectable } from "inversify";
import { NotFoundException } from "../common/exceptions/not-fount.exception";
import { CompanyBranch } from "../models/entities/company-branch";
import { Deposit } from "../models/entities/deposit";
import { DepositInputModel } from "../models/input-models/deposit.input-model";
import { DepositViewModel } from "../models/view-models/deposit.view-model";
import { UserService } from "./user.service";

@injectable()
export class DepositService {

    constructor(
        @inject(UserService) private _userService: UserService
    ) { }

    public async getAll(userId: number): Promise<DepositViewModel[]> {

        const user = await this._userService.getEntityById(userId);

        const deposits: Deposit[] = await Deposit.findAll({
            include: [
                {
                    model: CompanyBranch,
                    as: 'companyBranch'
                }
            ],
            where: {
                '$companyBranch.companyId$': user.companyId
            },
            order: [['name', 'ASC']]
        });

        return deposits.map(DepositViewModel.fromEntity);
    }

    public async getById(id: number, userId: number): Promise<DepositViewModel> {

        const user = await this._userService.getEntityById(userId);

        const deposit: Deposit = await Deposit.findOne({
            include: [
                {
                    model: CompanyBranch,
                    as: 'companyBranch'
                }
            ],
            where: {
                '$companyBranch.companyId$': user.companyId,
                id
            },
            order: [['companyBranch', 'name', 'ASC'], ['name', 'ASC']]
        });

        if (!deposit)
            throw new NotFoundException('Deposito nõa encontrado');

        return DepositViewModel.fromEntity(deposit);
    }

    public async create(input: DepositInputModel, userId: number): Promise<DepositViewModel> {

        const user = await this._userService.getEntityById(userId);

        const companyBranch: CompanyBranch = await CompanyBranch.findOne({
            where: {
                id: input.companyBranchId,
                companyId: user.companyId
            }
        });

        if (!companyBranch)
            throw new NotFoundException('Unidade não encontrada');

        const deposit = Deposit.create({
            name: input.name,
            companyBranchId: input.companyBranchId
        });

        await deposit.save();

        return this.getById(deposit.id, userId);
    }

    public async update(input: DepositInputModel, userId: number): Promise<DepositViewModel> {

        const user = await this._userService.getEntityById(userId);

        const companyBranch: CompanyBranch = await CompanyBranch.findOne({
            where: {
                id: input.companyBranchId,
                companyId: user.companyId
            }
        });

        if (!companyBranch)
            throw new NotFoundException('Unidade não encontrada');

        const deposit: Deposit = await Deposit.findOne({
            include: [
                {
                    model: CompanyBranch,
                    as: 'companyBranch'
                }
            ],
            where: {
                id: input.id,
                '$companyBranch.companyId$': user.companyId,
            }
        });

        if (!deposit)
            throw new NotFoundException('Depósito não encontrado');

        deposit.name = input.name;
        deposit.companyBranchId = input.companyBranchId;

        await deposit.save();

        return this.getById(deposit.id, userId);
    }
}