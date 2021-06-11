import { Sequelize, Transaction } from "sequelize";
import { DeviceType } from "../../common/enums/device-type";
import { NotFoundException } from "../../common/exceptions/not-fount.exception";
import { Device } from "../../models/entities/device";
import { DeviceGasLevel } from "../../models/entities/device-gas-level";
import { NotificationConfiguration } from "../../models/entities/notification-configuration";
import { DeviceSyncDataInputModel } from "../../models/input-models/abstraction/device-sync-data.input-model";
import { DeviceGasLevelSyncDataInputModel } from "../../models/input-models/device-gas-level-sync-data.input-model";
import { DeviceSyncDataViewModel } from "../../models/view-models/abstraction/device-sync-data.view-model";
import { DeviceGasLevelSyncDataViewModel } from "../../models/view-models/device-gas-level-sync-data.view-mode";
import { Strategy } from "../abstraction/strategy";
import { MessagingService } from "../messaging.service";

export class DeviceSyncDataStrategy extends Strategy<DeviceSyncDataInputModel, Promise<DeviceSyncDataViewModel>> {

    constructor(
        type: string,
        private _sequelize: Sequelize,
        private _messagingService: MessagingService
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
                },
                {
                    model: NotificationConfiguration,
                    as: 'notificationConfiguration'
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

            await device.deviceGasLevel.historyRead({ transaction });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }

        const notificationResult = await device.verifyNotification();

        if (notificationResult) {

            if (notificationResult.config.emailsToNotify.length) {
                this._messagingService.sendEmail({
                    emails: notificationResult.config.emailsToNotify,
                    subject: notificationResult.email.subject,
                    message: notificationResult.email.message
                });
            }

            if (notificationResult.config.phonesToNotify) {
                this._messagingService.sendVoiceCall({
                    phones: notificationResult.config.phonesToNotify,
                    message: notificationResult.voiceCall.message
                });
            }

            if (notificationResult.config.whatsAppsToNotify.length) {
                // TODO: send whatsapp messages
                // this._messagingService.sendWhatsApp({
                //     whatsAppPhones: notificationResult.config.whatsAppsToNotify,
                //     message: notificationResult.whatsApp.message
                // });
            }

        }

        return {
            deviceId: device.id,
            canSetTare
        }
    }
}