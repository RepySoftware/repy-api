import { AllowNull, BelongsTo, Column, CreatedAt, ForeignKey, Table, Unique, UpdatedAt } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";
import { Company } from "./company";
import { Employee } from "./employee";
import { Person } from "./person";

@Table({
    tableName: 'Users',
    timestamps: true
})
export class User extends Entity<User> {

    @ForeignKey(() => Company)
    @AllowNull(false)
    @Column
    public companyId: number;
    @BelongsTo(() => Company, 'companyId')
    public company: Company;

    @ForeignKey(() => Person)
    @AllowNull(false)
    @Column
    public personId: number;
    @BelongsTo(() => Person, 'personId')
    public person: Person;

    @ForeignKey(() => Employee)
    @AllowNull(false)
    @Column
    public employeeId: number;
    @BelongsTo(() => Employee, 'employeeId')
    public employee: Employee;

    @AllowNull(false)
    @Unique
    @Column
    public username: string;

    @AllowNull(false)
    @Column
    public password: string;

    @AllowNull(false)
    @Column
    public isAdmin: boolean;

    @AllowNull(false)
    @Column
    public isActive: boolean;

    @AllowNull(false)
    @CreatedAt
    @Column
    public createdAt: Date;

    @AllowNull(false)
    @UpdatedAt
    @Column
    public updatedAt: Date;
}