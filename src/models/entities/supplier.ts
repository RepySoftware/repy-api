import { AllowNull, BelongsTo, Column, CreatedAt, DataType, ForeignKey, Table, Unique, UpdatedAt } from "sequelize-typescript";
import { DeviceType } from "../../common/enums/device-type";
import { Entity } from "../abstraction/entity";
import { Address } from "./address";

@Table({
    name: { plural: 'Suppliers' },
    timestamps: true
})
export class Supplier extends Entity<Supplier> {

    @AllowNull(false)
    @Column
    public documentNumber: string;

    @Column
    public phoneNumber?: string;

    @ForeignKey(() => Address)
    @AllowNull(false)
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