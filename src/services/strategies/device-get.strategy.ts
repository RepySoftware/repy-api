import { Includeable } from "sequelize/types";
import { Address } from "../../models/entities/address";
import { Device } from "../../models/entities/device";
import { DeviceGasLevel } from "../../models/entities/device-gas-level";
import { UserDevice } from "../../models/entities/user-device";
import { DeviceFilter } from "../../models/input-models/filter/device.filter";
import { Strategy } from "../abstraction/strategy";

export class DeviceGetStrategy extends Strategy<{ userId: number, filter: DeviceFilter }, Promise<Device[]>> {

    private readonly _defaultIncludes: Includeable[] = [
        {
            model: Address,
            as: 'address'
        },
        {
            model: DeviceGasLevel,
            as: 'deviceGasLevel'
        }
    ];

    constructor(type: string) {
        super(type, ['all', 'user', 'supplier']);
    }

    private async all(params: { userId: number, filter: DeviceFilter }): Promise<Device[]> {

        const devices: Device[] = await Device.findAll({
            include: [
                ...this._defaultIncludes
            ]
        });
        return devices;
    }

    private async user(params: { userId: number, filter: DeviceFilter }): Promise<Device[]> {

        const devices: Device[] = await Device.findAll({
            where: {
                'usersDevice.userId': params.userId
            },
            include: [
                ...this._defaultIncludes,
                {
                    model: UserDevice,
                    as: 'usersDevice'
                }
            ]
        });

        return devices;
    }

    private async supplier(params: { userId: number, filter: DeviceFilter }): Promise<Device[]> {

        const devices: Device[] = await Device.findAll({
            include: [
                ...this._defaultIncludes
            ],
            where: {
                supplierId: params.filter.supplierId
            }
        });

        return devices;
    }
}