import { AllowNull, BelongsTo, Column, ForeignKey, Table } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";
import { Company } from "./company";

@Table({
    tableName: 'ProductCategories'
})
export class ProductCategory extends Entity<ProductCategory> {

    @ForeignKey(() => Company)
    @AllowNull(false)
    @Column
    public companyId: number;
    @BelongsTo(() => Company, 'companyId')
    public company: Company;

    @AllowNull(false)
    @Column
    public name: string;
}