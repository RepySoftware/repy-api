import { AllowNull, BelongsTo, Column, CreatedAt, ForeignKey, Table, Unique, UpdatedAt } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";
import { Company } from "./company";
import { Coordinates } from "./coordinates";

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

    @ForeignKey(() => Coordinates)
    @Column
    public coordinatesId?: number;
    @BelongsTo(() => Coordinates, 'coordinatesId')
    public coordinates?: Coordinates;

    @AllowNull(false)
    @CreatedAt
    @Column
    public createdAt: Date;

    @AllowNull(false)
    @UpdatedAt
    @Column
    public updatedAt: Date;
}