import { AllowNull, BelongsTo, Column, CreatedAt, DataType, ForeignKey, Table, UpdatedAt } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";
import { Address } from "./address";

@Table({
    name: { plural: 'Customers' },
})
export class Customer extends Entity<Customer> {

    @AllowNull(false)
    @Column
    public documentNumber: string;

    @AllowNull(false)
    @Column
    public phoneNumber: string;

    @AllowNull(false)
    @ForeignKey(() => Address)
    @Column(DataType.BIGINT)
    public addressId: number;
    @BelongsTo(() => Address, 'addressId')
    public address: Address;

    @AllowNull(false)
    @CreatedAt
    @Column
    public createdAt: Date;

    @AllowNull(false)
    @UpdatedAt
    @Column
    public updatedAt: Date;
}