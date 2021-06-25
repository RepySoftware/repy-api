import { AllowNull, BelongsTo, Column, CreatedAt, Default, ForeignKey, Table, UpdatedAt } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";
import { CompanyBranchProduct } from "./company-branch-product";

@Table({
    tableName: 'CompanyBranchesProductsPrices',
    timestamps: true
})
export class CompanyBranchProductPrice extends Entity<CompanyBranchProductPrice> {

    @AllowNull(false)
    @Column
    public name: string;

    @ForeignKey(() => CompanyBranchProduct)
    @AllowNull(false)
    @Column
    public companyBranchProductId: number;
    @BelongsTo(() => CompanyBranchProduct)
    public companyBranchProduct: CompanyBranchProduct;

    @AllowNull(false)
    @Column
    public salePrice: number;

    @AllowNull(false)
    @Default(0)
    @Column
    public isDefault: boolean;

    @AllowNull(false)
    @Default(0)
    @Column
    public isExternal: boolean;

    @AllowNull(false)
    @CreatedAt
    @Column
    public createdAt: Date;

    @AllowNull(false)
    @UpdatedAt
    @Column
    public updatedAt: Date;
}