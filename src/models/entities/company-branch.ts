import { AllowNull, BelongsTo, Column, CreatedAt, Default, ForeignKey, Table, Unique, UpdatedAt } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";
import { Address } from "./address";
import { Company } from "./company";

@Table({
    tableName: 'CompanyBranches',
    timestamps: true
})
export class CompanyBranch extends Entity<CompanyBranch> {

    @ForeignKey(() => Company)
    @AllowNull(false)
    @Column
    public companyId: number;
    @BelongsTo(() => Company, 'companyId')
    public company: Company;

    @AllowNull(false)
    @Column
    public name: string;

    @Column
    public tradeName: string;

    @Column
    public documentNumber: string;

    @ForeignKey(() => Address)
    @AllowNull(false)
    @Column
    public addressId: number;
    @BelongsTo(() => Address, 'addressId')
    public address: Address;

    @AllowNull(false)
    @Default(0)
    @Column
    public isDefault: boolean;

    @AllowNull(false)
    @CreatedAt
    @Column
    public createdAt: Date;

    @AllowNull(false)
    @UpdatedAt
    @Column
    public updatedAt: Date;
}