import { Includeable, Op } from "sequelize";
import { AccessControlRole } from "../../common/enums/access-control-role";
import { NotFoundException } from "../../common/exceptions/not-fount.exception";
import { verifyUserRole } from "../../middlewares/check-role";
import { Address } from "../../models/entities/address";
import { Device } from "../../models/entities/device";
import { DeviceGasLevel } from "../../models/entities/device-gas-level";
import { Employee } from "../../models/entities/employee";
import { Person } from "../../models/entities/person";
import { User } from "../../models/entities/user";
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
        super(type || 'default', ['default', 'all', 'customer', 'managerAgent']);
    }

    private async default(params: { userId: number, filter: DeviceFilter }): Promise<Device[]> {

        const user: User = await User.findOne({
            where: { id: params.userId },
            include: [
                {
                    model: Person,
                    as: 'person'
                },
                {
                    model: Employee,
                    as: 'employee'
                }
            ]
        });

        if (!user)
            throw new NotFoundException('Usuário não encontrado');

        if (user.isAdmin)
            return this.all(params);
        else if (user.person && user.person.isCustomer)
            return this.customer(params);
        else if (user.employee && (user.employee.isAgent || user.employee.isManager))
            return this.managerAgent(params);
        else
            return [];
    }

    private async all(params: { userId: number, filter: DeviceFilter }): Promise<Device[]> {

        await verifyUserRole(params.userId, AccessControlRole.ADMIN);

        const devices: Device[] = await Device.findAll({
            include: [
                ...this._defaultDeviceIncludes
            ]
        });
        return devices;
    }

    private async customer(params: { userId: number, filter: DeviceFilter }): Promise<Device[]> {

        const user: User = await User.findOne({
            where: {
                id: params.userId
            },
            include: [
                {
                    model: Person,
                    as: 'person',
                    include: [
                        {
                            model: Device,
                            as: 'devices',
                            include: this._defaultDeviceIncludes
                        }
                    ]
                }
            ]
        });

        return user.person.devices;
    }

    private async managerAgent(params: { userId: number, filter: DeviceFilter }): Promise<Device[]> {

        await verifyUserRole(params.userId, AccessControlRole.EMPLOYEE_MANAGER);
        await verifyUserRole(params.userId, AccessControlRole.EMPLOYEE_AGENT);

        const devices: Device[] = await Device.findAll({
            include: [
                ...this._defaultDeviceIncludes
            ],
            where: {
                'person.companyId': params.filter.companyId
            }
        });

        return devices;
    }
}