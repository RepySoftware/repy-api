import { inject, injectable } from "inversify";
import { NotFoundException } from "../common/exceptions/not-fount.exception";
import { CompanyBranch } from "../models/entities/company-branch";
import { Deposit } from "../models/entities/deposit";
import { Vehicle } from "../models/entities/vehicle";
import { DepositInputModel } from "../models/input-models/deposit.input-model";
import { VehicleInputModel } from "../models/input-models/vehicle.input-model";
import { DepositViewModel } from "../models/view-models/deposit.view-model";
import { VehicleViewModel } from "../models/view-models/vehicle.view-model";
import { UserService } from "./user.service";

@injectable()
export class VehicleService {

    constructor(
        @inject(UserService) private _userService: UserService
    ) { }

    public async getAll(userId: number): Promise<VehicleViewModel[]> {

        const user = await this._userService.getEntityById(userId);

        const vehicles: Vehicle[] = await Vehicle.findAll({
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
            ],
            where: {
                companyId: user.companyId
            },
            order: [['nickname', 'ASC']]
        });

        return vehicles.map(VehicleViewModel.fromEntity);
    }

    public async getById(id: number, userId: number): Promise<VehicleViewModel> {

        const user = await this._userService.getEntityById(userId);

        const vehicle: Vehicle = await Vehicle.findOne({
            include: [
                {
                    model: Deposit,
                    as: 'deposit'
                }
            ],
            where: {
                companyId: user.companyId,
                id
            }
        });

        if (!vehicle)
            throw new NotFoundException('Veículo não encontrado');

        return VehicleViewModel.fromEntity(vehicle);
    }

    public async create(input: VehicleInputModel, userId: number): Promise<VehicleViewModel> {

        const user = await this._userService.getEntityById(userId);

        const vehicle = Vehicle.create({
            description: input.description,
            nickname: input.nickname,
            licensePlate: input.licensePlate,
            companyId: user.companyId,
            depositId: input.depositId
        });

        await vehicle.save();

        return this.getById(vehicle.id, userId);
    }

    public async update(input: VehicleInputModel, userId: number): Promise<VehicleViewModel> {

        const user = await this._userService.getEntityById(userId);

        const vehicle: Vehicle = await Vehicle.findOne({
            include: [
                {
                    model: Deposit,
                    as: 'deposit'
                }
            ],
            where: {
                companyId: user.companyId,
                id: input.id
            }
        });

        if (!vehicle)
            throw new NotFoundException('Veículo não encontrado');

        vehicle.description = input.description;
        vehicle.nickname = input.nickname;
        vehicle.licensePlate = input.licensePlate;
        vehicle.depositId = input.depositId;

        await vehicle.save();

        return this.getById(vehicle.id, userId);
    }
}