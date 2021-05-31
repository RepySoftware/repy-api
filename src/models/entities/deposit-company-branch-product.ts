import { AllowNull, BelongsTo, Column, CreatedAt, ForeignKey, Table, UpdatedAt } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";
import { CompanyBranchProduct } from "./company-branch-product";
import { Deposit } from "./deposit";

@Table({
    tableName: 'DepositsCompanyBranchProducts',
    timestamps: true
})
export class DepositCompanyBranchProduct extends Entity<DepositCompanyBranchProduct> {

    @ForeignKey(() => Deposit)
    @AllowNull(false)
    @Column
    public depositId: number;
    @BelongsTo(() => Deposit, 'depositId')
    public deposit: Deposit;

    @ForeignKey(() => CompanyBranchProduct)
    @AllowNull(false)
    @Column
    public companyBranchProductId: number;
    @BelongsTo(() => CompanyBranchProduct, 'companyBranchProductId')
    public companyBranchProduct: CompanyBranchProduct;

    @AllowNull(false)
    @Column
    public quantity: number;
}