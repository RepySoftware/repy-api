import { AllowNull, Column, Default, Table } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";

@Table({
    name: { plural: 'NotificationsConfigurations' }
})
export class NotificationConfiguration extends Entity<NotificationConfiguration> {

    @AllowNull(false)
    @Column
    public lastNotification: Date;

    @AllowNull(false)
    @Column
    public minNotificationIntervalMinutes: number;

    @AllowNull(false)
    @Default('[]')
    @Column({
        field: 'phonesToNotify'
    })
    private _phonesToNotify: string;
    public get phonesToNotify(): string[] {
        return JSON.parse(this._phonesToNotify);
    }
    public set phonesToNotify(value: string[]) {
        this._phonesToNotify = JSON.stringify(value);
    }

    @AllowNull(false)
    @Default('[]')
    @Column({
        field: 'emailsToNotify'
    })
    private _emailsToNotify: string;
    public get emailsToNotify(): string[] {
        return JSON.parse(this._emailsToNotify);
    }
    public set emailsToNotify(value: string[]) {
        this._emailsToNotify = JSON.stringify(value);
    }

    @AllowNull(false)
    @Column
    public alreadyNotified: boolean;

    @AllowNull(false)
    @Column
    public isActive: boolean;
}