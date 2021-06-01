import { AllowNull, BelongsTo, Column, CreatedAt, ForeignKey, Table, Unique, UpdatedAt } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";
import { Company } from "./company";
import { Coordinates } from "./coordinates";
import { Vehicle } from "./vehicle";

@Table({
    tableName: 'Employees',
    timestamps: true
})
export class Employee extends Entity<Employee> {

    public static create(input: {
        name: string;
        documentNumber?: string;
        email?: string;
        companyId: number;
        vehicleId?: number;
        color?: string;
        isManager: boolean;
        isAgent: boolean;
        isDriver: boolean;
        isActive: boolean;
    }): Employee {
        return new Employee(input);
    }

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

    @ForeignKey(() => Vehicle)
    @Column
    public vehicleId?: number;
    @BelongsTo(() => Vehicle, 'vehicleId')
    public vehicle?: Vehicle;

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