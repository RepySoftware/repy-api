import { AllowNull, BelongsTo, Column, DataType, ForeignKey, Table } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";
import { Cylinder } from "./cylinder";
import * as moment from 'moment-timezone';
import { DeviceIsOnline } from "../abstraction/device-is-online";
import { Device } from "./device";

@Table({
    tableName: 'DevicesGasLevels',
    timestamps: false
})
export class DeviceGasLevel extends Entity<DeviceGasLevel> implements DeviceIsOnline {

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

    public getCylinderWeight(): number {
        return this.cylinderWeight || (this.cylinder ? this.cylinder.defaultCylinderWeight : null);
    }

    public getContentWeight(): number {
        return this.contentWeight || (this.cylinder ? this.cylinder.defaultContentWeight : null);
    }

    public setCurrentWeight(value: number): void {
        this.currentWeight = value;
        this.lastWeightUpdate = moment().toDate();
    }

    public calculePercentage(): number {

        const cylinderWeight = this.getCylinderWeight();
        const contentWeight = this.getContentWeight();

        let percentage = (this.currentWeight - (cylinderWeight)) * 100 / (contentWeight || 1);

        if (percentage < 0)
            percentage = 0;

        if (percentage > 100)
            percentage = 100;

        return percentage;
    }

    public isOnline(device: Device): boolean {
        return moment().diff(moment.utc(this.lastWeightUpdate).local()) < 30000;
    }
}