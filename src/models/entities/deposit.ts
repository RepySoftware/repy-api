import { AllowNull, BelongsTo, Column, CreatedAt, ForeignKey, HasMany, Table, UpdatedAt } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";
import { Company } from "./company";
import { CompanyBranch } from "./company-branch";
import { DepositProduct } from "./deposit-product";

@Table({
    tableName: 'Deposits',
    timestamps: true
})
export class Deposit extends Entity<Deposit> {

    public static create(input: {
        name: string;
        companyBranchId: number
    }): Deposit {
        return new Deposit(input);
    }

    @AllowNull(false)
    @Column
    public name: string;

    @ForeignKey(() => CompanyBranch)
    @AllowNull(false)
    @Column
    public companyBranchId: number;
    @BelongsTo(() => CompanyBranch, 'companyBranchId')
    public companyBranch: CompanyBranch;

    @AllowNull(false)
    @CreatedAt
    @Column
    public createdAt: Date;

    @AllowNull(false)
    @UpdatedAt
    @Column
    public updatedAt: Date;

    @HasMany(() => DepositProduct)
    public products: DepositProduct[];
}