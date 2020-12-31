import { AllowNull, BelongsTo, Column, CreatedAt, DataType, Default, ForeignKey, Table, Unique, UpdatedAt } from "sequelize-typescript";
import { UserType } from "../../common/enums/user-type";
import { Entity } from "../abstraction/entity";
import { Customer } from "./customer";
import { SupplierEmployee } from "./supplier-employee";

@Table({
    name: { plural: 'Users' },
    timestamps: true,
})
export class User extends Entity<User> {

    @AllowNull(false)
    @Column
    public name: string;

    @AllowNull(false)
    @Unique
    @Column
    public username: string;

    @Unique
    @Column
    public email: string;

    @AllowNull(false)
    @Column
    public password: string;

    @AllowNull(false)
    @Column
    public type: UserType;

    @ForeignKey(() => SupplierEmployee)
    @Column(DataType.BIGINT)
    public supplierEmployeeId: number;
    @BelongsTo(() => SupplierEmployee, 'supplierEmployeeId')
    public supplierEmployee: SupplierEmployee;

    @ForeignKey(() => Customer)
    @Column(DataType.BIGINT)
    public customerId: number;
    @BelongsTo(() => Customer, 'customerId')
    public customer: Customer;

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