import { Device } from "../entities/device";
import { NotificationConfiguration } from "../entities/notification-configuration";

export interface DeviceVerifyNotificationResult {
    config: NotificationConfiguration;

    email: {
        subject: string;
        message: string;
    };

    voiceCall: {
        message: string;
    };

    whatsApp: {
        message: string;
    };
}

export interface DeviceVerifyNotification {
    verifyNotification(device: Device): Promise<DeviceVerifyNotificationResult>;
}