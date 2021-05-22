import { AllowNull, BelongsTo, Column, CreatedAt, ForeignKey, Table, Unique, UpdatedAt } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";
import { Company } from "./company";

@Table({
    tableName: 'Employees',
    timestamps: true
})
export class Employee extends Entity<Employee> {

    @AllowNull(false)
    @Column
    public name: string;

    @Column
    public documentNumber: string;

    @Column
    public email: string;

    @ForeignKey(() => Company)
    @AllowNull(false)
    @Column
    public companyId: number;
    @BelongsTo(() => Company, 'companyId')
    public company: Company;

    @Column
    public color?: string;

    @AllowNull(false)
    @Column
    public isManager: boolean;

    @AllowNull(false)
    @Column
    public isAgent: boolean;

    @AllowNull(false)
    @Column
    public isDriver: boolean;

    @AllowNull(false)
    @Column
    public isActive: boolean;

    @Column
    public currentLatitude: number;

    @Column
    public currentLongitude: number;

    @Column
    public currentSpeed: number;

    @AllowNull(false)
    @CreatedAt
    @Column
    public createdAt: Date;

    @AllowNull(false)
    @UpdatedAt
    @Column
    public updatedAt: Date;
}