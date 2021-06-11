import { AllowNull, BelongsTo, Column, CreatedAt, ForeignKey, Table, UpdatedAt } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";
import { DeviceGasLevel } from "./device-gas-level";

@Table({
    tableName: 'DevicesGasLevelsHistoryReads',
    timestamps: true
})
export class DeviceGasLevelHistoryRead extends Entity<DeviceGasLevelHistoryRead> {

    public static create(input: {
        deviceGasLevelId: number;
        cylinderWeight: number;
        contentWeight: number;
        weight: number;
    }): DeviceGasLevelHistoryRead {
        return new DeviceGasLevelHistoryRead(input);
    }

    @ForeignKey(() => DeviceGasLevel)
    @AllowNull(false)
    @Column
    public deviceGasLevelId: number;
    @BelongsTo(() => DeviceGasLevel, 'deviceGasLevelId')
    public deviceGasLevel: DeviceGasLevel;

    @AllowNull(false)
    @Column
    public cylinderWeight: number;

    @AllowNull(false)
    @Column
    public contentWeight: number;

    @AllowNull(false)
    @Column
    public weight: number;

    @AllowNull(false)
    @CreatedAt
    @Column
    public createdAt: Date;

    @AllowNull(false)
    @UpdatedAt
    @Column
    public updatedAt: Date;
}