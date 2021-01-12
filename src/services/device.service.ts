import { injectable } from "inversify";
import { DeviceViewModel } from "../models/view-models/device.view-model";
import { DeviceFilter } from "../models/input-models/filter/device.filter";
import { DeviceGetStrategy } from "./strategies/device-get.strategy";
import { Device } from "../models/entities/device";
import { NotFoundException } from "../common/exceptions/not-fount.exception";
import { Address } from "../models/entities/address";
import { DeviceGasLevel } from "../models/entities/device-gas-level";
import { User } from "../models/entities/user";
import { NotAuthorizedException } from "../common/exceptions/not-authorized.exception";
import { UserDevice } from "../models/entities/user-device";

@injectable()
export class DeviceService {

    public async get(strategy: string, userId: number, filter: DeviceFilter): Promise<DeviceViewModel[]> {

        const devices = await (new DeviceGetStrategy(strategy).call({ userId, filter }));
        return devices.map(DeviceViewModel.fromEntity);
    }

    public async getByKey(key: string, userId: number): Promise<DeviceViewModel> {

        const device: Device = await Device.findOne({
            where: { deviceKey: key },
            include: [
                {
                    model: Address,
                    as: 'address'
                },
                {
                    model: DeviceGasLevel,
                    as: 'deviceGasLevel'
                }
            ]
        });

        if (!device)
            throw new NotFoundException('Dispositivo não encontrado');

        await this.validateUserDevice(device.id, userId);

        return DeviceViewModel.fromEntity(device);
    }

    private async validateUserDevice(deviceId: number, userId: number): Promise<void> {

        const user: User = await User.findOne({
            where: { id: userId },
            include: []
        });

        if (user.isAdmin) {
            return;
        } else {
            const userDevice: UserDevice = await UserDevice.findOne({
                where: { deviceId, userId }
            });

            if (userDevice) {
                return;
            }
        }

        throw new NotAuthorizedException('Usuário não tem acesso ao dispositivo');
    }
}