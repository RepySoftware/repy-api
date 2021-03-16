import { AllowNull, BelongsTo, Column, CreatedAt, Default, ForeignKey, Table, UpdatedAt } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";
import { CompanyBranchItem } from "./company-branch-item";

@Table({
    tableName: 'CompanyBranchesItemsPrices',
    timestamps: true
})
export class CompanyBranchItemPrice extends Entity<CompanyBranchItemPrice> {

    @AllowNull(false)
    @Column
    public name: string;

    @ForeignKey(() => CompanyBranchItem)
    @AllowNull(false)
    @Column
    public companyBranchItemId: number;
    @BelongsTo(() => CompanyBranchItem, 'companyBranchItemId')
    public companyBranchItem: CompanyBranchItem;

    @AllowNull(false)
    @Column
    public salePrice: number;

    @AllowNull(false)
    @Default(0)
    @Column
    public maxPriceDiscount: number;

    @AllowNull(false)
    @CreatedAt
    @Column
    public createdAt: Date;

    @AllowNull(false)
    @UpdatedAt
    @Column
    public updatedAt: Date;
}