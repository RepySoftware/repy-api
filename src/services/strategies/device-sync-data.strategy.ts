import { Sequelize, Transaction } from "sequelize";
import { DeviceType } from "../../common/enums/device-type";
import { NotFoundException } from "../../common/exceptions/not-fount.exception";
import { Device } from "../../models/entities/device";
import { DeviceGasLevel } from "../../models/entities/device-gas-level";
import { DeviceSyncDataInputModel } from "../../models/input-models/abstraction/device-sync-data.input-model";
import { DeviceGasLevelSyncDataInputModel } from "../../models/input-models/device-gas-level-sync-data.input-model";
import { DeviceSyncDataViewModel } from "../../models/view-models/abstraction/device-sync-data.view-model";
import { DeviceGasLevelSyncDataViewModel } from "../../models/view-models/device-gas-level-sync-data.view-mode";
import { Strategy } from "../abstraction/strategy";

export class DeviceSyncDataStrategy extends Strategy<DeviceSyncDataInputModel, Promise<DeviceSyncDataViewModel>> {

    constructor(
        type: string,
        private _sequelize: Sequelize
    ) {
        super(type, [DeviceType.GAS_LEVEL]);
    }

    public async GAS_LEVEL(input: DeviceGasLevelSyncDataInputModel): Promise<DeviceGasLevelSyncDataViewModel> {

        const device: Device = await Device.findOne({
            where: {
                id: input.deviceId,
                token: input.token
            },
            include: [
                {
                    model: DeviceGasLevel,
                    as: 'deviceGasLevel'
                }
            ]
        });

        device.deviceGasLevel.setCurrentWeight(input.currentWeight);

        const canSetTare = device.deviceGasLevel.setTare;

        if (canSetTare) {
            device.deviceGasLevel.setTare = false;
        }

        const transaction: Transaction = await this._sequelize.transaction();

        try {
            await device.save({ transaction });

            await device.deviceGasLevel.save({ transaction });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }

        return {
            deviceId: device.id,
            canSetTare
        }
    }
}