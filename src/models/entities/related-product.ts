import { AllowNull, BelongsTo, Column, ForeignKey, Table } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";
import { CompanyBranch } from "./company-branch";
import { CompanyBranchProduct } from "./company-branch-product";

@Table({
    tableName: 'RelatedProducts',
    timestamps: false
})
export class RelatedProduct extends Entity<RelatedProduct> {

    @ForeignKey(() => CompanyBranchProduct)
    @AllowNull(false)
    @Column
    public companyBranchProductId: number;
    @BelongsTo(() => CompanyBranchProduct, 'companyBranchProductId')
    public companyBranchProduct: CompanyBranchProduct;

    @ForeignKey(() => CompanyBranchProduct)
    @AllowNull(false)
    @Column
    public referencedCompanyBranchProductId: number;
    @BelongsTo(() => CompanyBranchProduct, 'referencedCompanyBranchProductId')
    public referencedCompanyBranchProduct: CompanyBranchProduct;

    @AllowNull(false)
    @Column
    public isDefault: boolean;
}