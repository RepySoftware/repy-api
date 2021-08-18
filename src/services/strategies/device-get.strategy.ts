import { Includeable, Op } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { AccessControlRole } from "../../common/enums/access-control-role";
import { DeviceType } from "../../common/enums/device-type";
import { NotFoundException } from "../../common/exceptions/not-fount.exception";
import { verifyUserRole } from "../../middlewares/check-role";
import { Address } from "../../models/entities/address";
import { Device } from "../../models/entities/device";
import { DeviceGasLevel } from "../../models/entities/device-gas-level";
import { Employee } from "../../models/entities/employee";
import { Person } from "../../models/entities/person";
import { User } from "../../models/entities/user";
import { ViewDeviceGasLevelDangerDay } from "../../models/entities/views/view-device-gas-level-danger-day";
import { DeviceFilter } from "../../models/input-models/filter/device.filter";
import { Strategy } from "../abstraction/strategy";
import { UserService } from "../user.service";

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

    constructor(
        type: string,
        private _userService: UserService,
        private _sequelize: Sequelize
    ) {
        super(type || 'default', ['default', 'employee', 'customer']);
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

        if (user.employee && (user.employee.isAgent || user.employee.isManager))
            return this.employee(params);
        else if (user.person && user.person.isCustomer)
            return this.customer(params);
        else
            return [];
    }

    private async customer(params: { userId: number, filter: DeviceFilter }): Promise<Device[]> {

        const user = await this._userService.getEntityById(params.userId, [
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
        ]);

        await this.loadDevicesGasLevelsDangerDay(user.person.devices);

        return user.person.devices;
    }

    private async employee(params: { userId: number, filter: DeviceFilter }): Promise<Device[]> {

        const user = await this._userService.getEntityById(params.userId);

        await verifyUserRole(user.id, AccessControlRole.EMPLOYEE_MANAGER);
        await verifyUserRole(user.id, AccessControlRole.EMPLOYEE_AGENT);

        const devices: Device[] = await Device.findAll({
            include: [
                ...this._defaultDeviceIncludes
            ],
            where: {
                companyId: user.companyId
            }
        });

        await this.loadDevicesGasLevelsDangerDay(devices);

        return devices;
    }

    private async loadDevicesGasLevelsDangerDay(devices: Device[]): Promise<void> {

        const dangerDayModel = ViewDeviceGasLevelDangerDay.getDefinedModel(this._sequelize);
        const dangerDays: ViewDeviceGasLevelDangerDay[] = await dangerDayModel.findAll({
            where: {
                id: { [Op.in]: devices.filter(d => d.type == DeviceType.GAS_LEVEL).map(d => d.deviceGasLevelId) }
            }
        });

        dangerDays.forEach(dd => {
            const device = devices.find(d => d.deviceGasLevelId == dd.vId);
            device.deviceGasLevel.setDangerDay(dd);
        });
    }
}