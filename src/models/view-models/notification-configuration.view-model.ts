import { NotificationConfiguration } from "../entities/notification-configuration";
import * as moment from 'moment-timezone';
import { DEFAULT_DATETIME_FORMAT } from "../../config";

export class NotificationConfigurationViewModel {

    public id: number;
    public lastNotification: string;
    public minNotificationIntervalMinutes: number;
    public phonesToNotify: string[];
    public emailsToNotify: string[];
    public alreadyNotified: boolean;
    public isActive: boolean;

    public static fromEntity(nc: NotificationConfiguration): NotificationConfigurationViewModel {

        const config = new NotificationConfigurationViewModel();

        config.id = nc.id;
        config.lastNotification = moment(nc.lastNotification).format(DEFAULT_DATETIME_FORMAT);
        config.minNotificationIntervalMinutes = nc.minNotificationIntervalMinutes;
        config.phonesToNotify = nc.phonesToNotify;
        config.emailsToNotify = nc.emailsToNotify;
        config.alreadyNotified = nc.alreadyNotified;
        config.isActive = nc.isActive;

        return config;
    }
}