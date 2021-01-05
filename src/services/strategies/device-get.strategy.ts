import { Includeable, Op } from "sequelize";
import { RoleType } from "../../common/enums/role-type";
import { UserType } from "../../common/enums/user-type";
import { NotFoundException } from "../../common/exceptions/not-fount.exception";
import { CustomException } from "../../common/exceptions/setup/custom.exception";
import { verifyUserRole } from "../../middlewares/check-role";
import { Address } from "../../models/entities/address";
import { Device } from "../../models/entities/device";
import { DeviceGasLevel } from "../../models/entities/device-gas-level";
import { User } from "../../models/entities/user";
import { UserDevice } from "../../models/entities/user-device";
import { DeviceFilter } from "../../models/input-models/filter/device.filter";
import { Strategy } from "../abstraction/strategy";

export class DeviceGetStrategy extends Strategy<{ userId: number, filter: DeviceFilter }, Promise<Device[]>> {

    private readonly _defaultDeviceIncludes: Includeable[] = [
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
        super(type || 'default', ['default', 'all', 'user', 'supplier']);
    }

    private async default(params: { userId: number, filter: DeviceFilter }): Promise<Device[]> {

        const user: User = await User.findOne({
            where: { id: params.userId }
        });

        if (!user)
            throw new NotFoundException('Usuário não encontrado');

        if (user.isAdmin)
            return this.all(params);
        else if (user.type == UserType.customer)
            return this.user(params);
        else if (user.type == UserType.employee)
            return this.supplier(params);
        else
            throw new CustomException(400, 'Usuário não possui tipo definido');
    }

    private async all(params: { userId: number, filter: DeviceFilter }): Promise<Device[]> {

        await verifyUserRole(params.userId, RoleType.admin);

        const devices: Device[] = await Device.findAll({
            include: [
                ...this._defaultDeviceIncludes
            ]
        });
        return devices;
    }

    private async user(params: { userId: number, filter: DeviceFilter }): Promise<Device[]> {

        const devicesIds: { deviceId: number }[] = await UserDevice.findAll({
            where: {
                userId: params.userId
            },
            attributes: ['deviceId']
        });

        const devices: Device[] = await Device.findAll({
            where: {
                id: { [Op.in]: devicesIds.map(di => di.deviceId) }
            },
            include: [
                ...this._defaultDeviceIncludes,
                {
                    model: UserDevice,
                    as: 'usersDevice'
                }
            ]
        });

        return devices;
    }

    private async supplier(params: { userId: number, filter: DeviceFilter }): Promise<Device[]> {

        await verifyUserRole(params.userId, RoleType.employee);

        const devices: Device[] = await Device.findAll({
            include: [
                ...this._defaultDeviceIncludes
            ],
            where: {
                supplierId: params.filter.supplierId
            }
        });

        return devices;
    }
}