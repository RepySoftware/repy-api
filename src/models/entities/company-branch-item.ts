import { AllowNull, BelongsTo, Column, ForeignKey, Table } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";
import { CompanyBranch } from "./company-branch";
import { Item } from "./item";
import { ItemCategory } from "./item-category";

@Table({
    tableName: 'CompanyBranchesItems'
})
export class CompanyBranchItem extends Entity<CompanyBranchItem> {

    @ForeignKey(() => Item)
    @AllowNull(false)
    @Column
    public itemId: number;
    @BelongsTo(() => Item, 'itemId')
    public item: Item;

    @ForeignKey(() => CompanyBranch)
    @AllowNull(false)
    @Column
    public companyBranchId: number;
    @BelongsTo(() => CompanyBranch, 'companyBranchId')
    public companyBranch: CompanyBranch;
}