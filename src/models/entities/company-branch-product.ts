import { AllowNull, BelongsTo, Column, ForeignKey, HasMany, Table } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";
import { CompanyBranch } from "./company-branch";
import { CompanyBranchProductPrice } from "./company-branch-product-price";
import { Product } from "./product";

@Table({
    tableName: 'CompanyBranchesProducts',
    timestamps: false
})
export class CompanyBranchProduct extends Entity<CompanyBranchProduct> {

    @ForeignKey(() => Product)
    @AllowNull(false)
    @Column
    public productId: number;
    @BelongsTo(() => Product, 'productId')
    public product: Product;

    @ForeignKey(() => CompanyBranch)
    @AllowNull(false)
    @Column
    public companyBranchId: number;
    @BelongsTo(() => CompanyBranch, 'companyBranchId')
    public companyBranch: CompanyBranch;

    @HasMany(() => CompanyBranchProductPrice, 'companyBranchProductId')
    public prices: CompanyBranchProductPrice[];
}