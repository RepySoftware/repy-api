import { inject, injectable } from "inversify";
import { DeviceViewModel } from "../models/view-models/device.view-model";
import { DeviceFilter } from "../models/input-models/filter/device.filter";
import { DeviceGetStrategy } from "./strategies/device-get.strategy";
import { Device } from "../models/entities/device";
import { NotFoundException } from "../common/exceptions/not-fount.exception";
import { Address } from "../models/entities/address";
import { DeviceGasLevel } from "../models/entities/device-gas-level";
import { User } from "../models/entities/user";
import { NotAuthorizedException } from "../common/exceptions/not-authorized.exception";
import { Cylinder } from "../models/entities/cylinder";
import { DeviceSyncDataInputModel } from "../models/input-models/abstraction/device-sync-data.input-model";
import { DeviceSyncDataViewModel } from "../models/view-models/abstraction/device-sync-data.view-model";
import { DeviceSyncDataStrategy } from "./strategies/device-sync-data.strategy";
import { Person } from "../models/entities/person";
import { Database } from "../data/database-config";
import { MessagingService } from "./messaging.service";
import { DeviceGasLevelHistoryReadViewModel } from "../models/view-models/device-gas-level-history-read.view-model";
import { DeviceGasLevelHistoryRead } from "../models/entities/device-gas-level-history-read";
import { UserService } from "./user.service";
import { DeviceGasLevelHistoryReadFilter } from "../models/input-models/filter/device-gas-level-histpry-read.filter";
import { DeviceUpdateInputModel } from "../models/input-models/abstraction/device-update.input-model";
import { DeviceUpdateStrategy } from "./strategies/device-update.strategy";
import { CustomException } from "../common/exceptions/setup/custom.exception";

@injectable()
export class DeviceService {

    constructor(
        @inject(Database) private _database: Database,
        @inject(MessagingService) private _messagingService: MessagingService,
        @inject(UserService) private _userService: UserService
    ) { }

    public async get(strategy: string, userId: number, filter: DeviceFilter): Promise<DeviceViewModel[]> {

        const devices = await (new DeviceGetStrategy(strategy).call({ userId, filter }));
        return devices.map(DeviceViewModel.fromEntity);
    }

    public async getById(id: number, userId: number): Promise<DeviceViewModel> {

        const device: Device = await Device.findOne({
            where: { id },
            include: [
                {
                    model: Address,
                    as: 'address'
                },
                {
                    model: Person,
                    as: 'person'
                },
                {
                    model: DeviceGasLevel,
                    as: 'deviceGasLevel',
                    include: [
                        {
                            model: Cylinder,
                            as: 'cylinder'
                        }
                    ]
                }
            ]
        });

        if (!device)
            throw new NotFoundException('Dispositivo não encontrado');

        await this.validatePersonDevice(device.id, userId);

        return DeviceViewModel.fromEntity(device);
    }

    public async update(input: DeviceUpdateInputModel, userId: number): Promise<DeviceViewModel> {

        const user = this._userService.getEntityById(userId);

        const device: Device = await Device.findOne({
            where: { id: input.id }
        });

        if (!device)
            throw new NotFoundException('Dispositivo não encontrado');

        if (!device.settingsEnabled)
            throw new CustomException(400, 'Você não pode editar este dispositivo');

        await this.validatePersonDevice(device.id, userId);

        return await (new DeviceUpdateStrategy(device.type, this._database.sequelize).call(input));
    }

    public async syncData(input: DeviceSyncDataInputModel): Promise<DeviceSyncDataViewModel> {

        const device: Device = await Device.findOne({
            where: {
                id: input.deviceId,
                token: input.token
            }
        });

        if (!device)
            throw new NotFoundException('Dispositivo não encontrado');

        const result = await (new DeviceSyncDataStrategy(
            device.type,
            this._database.sequelize,
            this._messagingService
        ).call(input));

        return result;
    }

    private async validatePersonDevice(deviceId: number, userId: number): Promise<void> {

        const user: User = await User.findOne({
            where: { id: userId },
            include: [
                {
                    model: Person,
                    as: 'person'
                }
            ]
        });

        if (user.isAdmin) {
            return;
        } else {
            const device: Device = await Device.findOne({
                where: {
                    id: deviceId,
                    personId: user.person.id
                }
            });

            if (device) {
                return;
            }
        }

        throw new NotAuthorizedException('Usuário não tem acesso ao dispositivo');
    }

    public async getHistoryReads(
        deviceId: number,
        filter: DeviceGasLevelHistoryReadFilter,
        userId: number
    ): Promise<DeviceGasLevelHistoryReadViewModel[]> {

        const user = await this._userService.getEntityById(userId);

        const limit = Number(filter.limit || 20);
        const offset = Number((filter.index || 0) * limit);

        const device: Device = await Device.findOne({
            where: {
                id: deviceId,
                companyId: user.companyId
            },
            include: [
                {
                    model: DeviceGasLevel,
                    as: 'deviceGasLevel'
                }
            ]
        });

        if (!device)
            throw new NotFoundException('Dispositivo não encontrado');

        const historyReads: DeviceGasLevelHistoryRead[] = await DeviceGasLevelHistoryRead.findAll({
            where: {
                deviceGasLevelId: device.deviceGasLevelId
            },
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        return historyReads.map(DeviceGasLevelHistoryReadViewModel.fromEntity);
    }
}