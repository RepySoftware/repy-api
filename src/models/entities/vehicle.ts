import { AllowNull, BelongsTo, Column, CreatedAt, ForeignKey, Table, UpdatedAt } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";
import { Company } from "./company";
import { Deposit } from "./deposit";

@Table({
    tableName: 'Vehicles',
    timestamps: true
})
export class Vehicle extends Entity<Vehicle> {

    public static create(input: {
        description: string;
        nickname?: string;
        licensePlate: string;
        companyId: number;
        depositId?: number;
    }): Vehicle {
        return new Vehicle(input);
    }

    @AllowNull(false)
    @Column
    public description: string;

    @Column
    public nickname?: string;

    @AllowNull(false)
    @Column
    public licensePlate: string;

    @ForeignKey(() => Company)
    @AllowNull(false)
    @Column
    public companyId: number;
    @BelongsTo(() => Company, 'companyId')
    public company: Company;

    @ForeignKey(() => Deposit)
    @Column
    public depositId?: number;
    @BelongsTo(() => Deposit, 'depositId')
    public deposit?: Deposit;

    @AllowNull(false)
    @CreatedAt
    @Column
    public createdAt: Date;

    @AllowNull(false)
    @UpdatedAt
    @Column
    public updatedAt: Date;
}