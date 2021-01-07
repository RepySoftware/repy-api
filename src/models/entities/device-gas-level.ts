import { AllowNull, BelongsTo, Column, DataType, ForeignKey, Table } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";
import { Cylinder } from "./cylinder";

@Table({
    tableName: 'DevicesGasLevels',
    timestamps: false
})
export class DeviceGasLevel extends Entity<DeviceGasLevel> {

    @ForeignKey(() => Cylinder)
    @AllowNull(false)
    @Column(DataType.BIGINT)
    public cylinderId: number;
    @BelongsTo(() => Cylinder, 'cylinderId')
    public cylinder: Cylinder;

    @AllowNull(false)
    @Column
    public currentWeight: number;

    @Column
    public cylinderWeight?: number;

    @Column
    public contentWeight?: number;

    @Column
    public percentageToNotify?: number;

    @AllowNull(false)
    @Column
    public setTare: boolean;

    @AllowNull(false)
    @Column
    public lastWeightUpdate: Date;

    public calculePercentage(): number {
        // TODO: calcular %
        return 32;
    }
}