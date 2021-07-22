import { AllowNull, BelongsTo, Column, CreatedAt, DataType, Default, ForeignKey, HasMany, Table, Unique, UpdatedAt } from "sequelize-typescript";
import { DeviceType } from "../../common/enums/device-type";
import { Entity } from "../abstraction/entity";
import { Address } from "./address";
import { DeviceGasLevel } from "./device-gas-level";
import { NotificationConfiguration } from "./notification-configuration";
import * as moment from 'moment-timezone';
import { DeviceIsOnline } from "../abstraction/device-is-online";
import { Person } from "./person";
import { DeviceVerifyNotification, DeviceVerifyNotificationResult } from "../abstraction/device-verify-notification";
import { Company } from "./company";

@Table({
    tableName: 'Devices',
    timestamps: true
})
export class Device extends Entity<Device> {

    @ForeignKey(() => Company)
    @AllowNull(false)
    @Column
    public companyId: number;
    @BelongsTo(() => Company, 'companyId')
    public company: Company;

    @AllowNull(false)
    @Unique
    @Column
    public token: string;

    @AllowNull(false)
    @Column
    public name: string;

    @ForeignKey(() => Address)
    @AllowNull(false)
    @Column
    public addressId: number;
    @BelongsTo(() => Address, 'addressId')
    public address: Address;

    @ForeignKey(() => Person)
    @AllowNull(false)
    @Column
    public personId: number;
    @BelongsTo(() => Person, 'personId')
    public person: Person;

    @AllowNull(false)
    @Column
    public type: DeviceType;

    @ForeignKey(() => NotificationConfiguration)
    @Column
    public notificationConfigurationId?: number;
    @BelongsTo(() => NotificationConfiguration, 'notificationConfigurationId')
    public notificationConfiguration?: NotificationConfiguration;

    @AllowNull(false)
    @Default(false)
    @Column
    public isBluetooth: boolean;

    @AllowNull(false)
    @Default(false)
    @Column
    public settingsEnabled: boolean;

    @AllowNull(false)
    @CreatedAt
    @Column
    public createdAt: Date;

    @AllowNull(false)
    @UpdatedAt
    @Column
    public updatedAt: Date;

    @ForeignKey(() => DeviceGasLevel)
    @Column
    public deviceGasLevelId: number;
    @BelongsTo(() => DeviceGasLevel, 'deviceGasLevelId')
    public deviceGasLevel: DeviceGasLevel;

    private deviceByType(): DeviceGasLevel | any {
        switch (this.type) {
            case DeviceType.GAS_LEVEL: return this.deviceGasLevel;
            default: return null;
        }
    }

    public isOnline(): boolean {
        const device: DeviceIsOnline = this.deviceByType();
        return device ? device.isOnline(this) : moment().diff(moment.utc(this.updatedAt)) < 30000;
    }

    public async verifyNotification(): Promise<DeviceVerifyNotificationResult> {
        const device: DeviceVerifyNotification = this.deviceByType();
        return device.verifyNotification(this);
    }
}