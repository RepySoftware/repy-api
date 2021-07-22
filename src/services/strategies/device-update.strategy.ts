import { Sequelize, Transaction } from "sequelize";
import { DeviceType } from "../../common/enums/device-type";
import { NotFoundException } from "../../common/exceptions/not-fount.exception";
import { Cylinder } from "../../models/entities/cylinder";
import { Device } from "../../models/entities/device";
import { DeviceGasLevel } from "../../models/entities/device-gas-level";
import { DeviceUpdateInputModel } from "../../models/input-models/abstraction/device-update.input-model";
import { DeviceGasLevelUpdateInputModel } from "../../models/input-models/device-gas-level-update.input-model";
import { DeviceViewModel } from "../../models/view-models/device.view-model";
import { Strategy } from "../abstraction/strategy";

export class DeviceUpdateStrategy extends Strategy<DeviceUpdateInputModel, Promise<DeviceViewModel>> {

    constructor(
        type: string,
        private _sequelize: Sequelize
    ) {
        super(type, [DeviceType.GAS_LEVEL]);
    }

    public async GAS_LEVEL(input: DeviceGasLevelUpdateInputModel): Promise<DeviceViewModel> {

        const device: Device = await Device.findOne({
            where: {
                id: input.id,
            },
            include: [
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

        const cylinder: Cylinder = await Cylinder.findOne({
            where: {
                id: input.cylinderId
            }
        });

        if (!cylinder)
            throw new NotFoundException('Cilindro não encontrado');

        device.name = input.name;
        device.deviceGasLevel.cylinderId = cylinder.id;
        device.deviceGasLevel.cylinderWeight = input.cylinderWeight;
        device.deviceGasLevel.contentWeight = cylinder.defaultContentWeight;

        const transaction: Transaction = await this._sequelize.transaction();

        try {
            await device.save({ transaction });
            await device.deviceGasLevel.save({ transaction });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }

        return DeviceViewModel.fromEntity(device);
    }
}