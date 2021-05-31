import { AllowNull, BelongsTo, Column, CreatedAt, ForeignKey, Table, UpdatedAt } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";
import { Deposit } from "./deposit";

@Table({
    tableName: 'Vehicles',
    timestamps: true
})
export class Vehicle extends Entity<Vehicle> {

    @AllowNull(false)
    @Column
    public description: string;

    @Column
    public nickname: string;

    @AllowNull(false)
    @Column
    public licensePlate: string;

    @ForeignKey(() => Deposit)
    @AllowNull(false)
    @Column
    public depositId: number;
    @BelongsTo(() => Deposit, 'depositId')
    public deposit: Deposit;

    @AllowNull(false)
    @CreatedAt
    @Column
    public createdAt: Date;

    @AllowNull(false)
    @UpdatedAt
    @Column
    public updatedAt: Date;
}