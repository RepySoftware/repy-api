import { AllowNull, BelongsTo, Column, CreatedAt, DataType, ForeignKey, HasMany, Table, Unique, UpdatedAt } from "sequelize-typescript";
import { DeviceType } from "../../common/enums/device-type";
import { Entity } from "../abstraction/entity";
import { Address } from "./address";
import { DeviceGasLevel } from "./device-gas-level";
import { NotificationConfiguration } from "./notification-configuration";
import { Supplier } from "./supplier";
import { UserDevice } from "./user-device";

@Table({
    name: { plural: 'Devices' }
})
export class Device extends Entity<Device> {

    @AllowNull(false)
    @Unique
    @Column
    public deviceKey: string;

    @AllowNull(false)
    @Unique
    @Column
    public token: string;

    @AllowNull(false)
    @Column
    public name: string;

    @ForeignKey(() => Address)
    @AllowNull(false)
    @Column(DataType.BIGINT)
    public addressId: number;
    @BelongsTo(() => Address, 'addressId')
    public address: Address;

    @ForeignKey(() => Supplier)
    @AllowNull(false)
    @Column(DataType.BIGINT)
    public supplierId: number;
    @BelongsTo(() => Supplier, 'supplierId')
    public supplier: Supplier;

    @AllowNull(false)
    @Column
    public type: DeviceType;

    @ForeignKey(() => NotificationConfiguration)
    @Column(DataType.BIGINT)
    public notificationConfigurationId?: number;
    @BelongsTo(() => NotificationConfiguration, 'notificationConfigurationId')
    public notificationConfiguration?: NotificationConfiguration;

    @AllowNull(false)
    @CreatedAt
    @Column
    public createdAt: Date;

    @AllowNull(false)
    @UpdatedAt
    @Column
    public updatedAt: Date;

    @ForeignKey(() => DeviceGasLevel)
    @Column(DataType.BIGINT)
    public deviceGasLevelId: number;
    @BelongsTo(() => DeviceGasLevel, 'deviceGasLevelId')
    public deviceGasLevel: DeviceGasLevel;

    @HasMany(() => UserDevice)
    public usersDevice: UserDevice[];
}