import { NotificationConfiguration } from "../entities/notification-configuration";
import { DateHelper } from "../../common/helpers/date.helper";

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
        config.lastNotification = DateHelper.toStringViewModel(nc.lastNotification);
        config.minNotificationIntervalMinutes = nc.minNotificationIntervalMinutes;
        config.phonesToNotify = nc.phonesToNotify;
        config.emailsToNotify = nc.emailsToNotify;
        config.alreadyNotified = nc.alreadyNotified;
        config.isActive = nc.isActive;

        return config;
    }
}