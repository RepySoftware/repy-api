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
import { Cylinder } from "../models/entities/cylinder";
import { DeviceSyncDataInputModel } from "../models/input-models/abstraction/device-sync-data.input-model";
import { DeviceSyncDataViewModel } from "../models/view-models/abstraction/device-sync-data.view-model";
import { DeviceSyncDataStrategy } from "./strategies/device-sync-data.strategy";
import { Person } from "../models/entities/person";
import { PersonDevice } from "../models/entities/person-device";

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

    public async syncData(input: DeviceSyncDataInputModel): Promise<DeviceSyncDataViewModel> {

        const device: Device = Device.findOne({
            where: {
                deviceKey: input.deviceKey,
                token: input.deviceToken
            }
        });

        if (!device)
            throw new NotFoundException('Dispositivo não encontrado');

        const result = await (new DeviceSyncDataStrategy(device.type).call(input));

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
            const personDevice: PersonDevice = await PersonDevice.findOne({
                where: { deviceId, personId: user.person.id }
            });

            if (personDevice) {
                return;
            }
        }

        throw new NotAuthorizedException('Usuário não tem acesso ao dispositivo');
    }
}