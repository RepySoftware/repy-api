import { AllowNull, BelongsTo, Column, CreatedAt, ForeignKey, Table, UpdatedAt } from "sequelize-typescript";
import { MeasurementUnit } from "../../common/enums/measurement-unit";
import { Entity } from "../abstraction/entity";
import { Company } from "./company";
import { ItemCategory } from "./item-category";

@Table({
    tableName: 'Items',
    timestamps: true
})
export class Item extends Entity<Item> {

    @ForeignKey(() => Company)
    @AllowNull(false)
    @Column
    public companyId: number;
    @BelongsTo(() => Company, 'companyId')
    public company: Company;

    @ForeignKey(() => ItemCategory)
    @AllowNull(false)
    @Column
    public categoryId: number;
    @BelongsTo(() => ItemCategory, 'categoryId')
    public category: ItemCategory;

    @AllowNull(false)
    @Column
    public code: string;

    @AllowNull(false)
    @Column
    public name: string;

    @Column
    public description: string;

    @AllowNull(false)
    @Column
    public measurementUnit: MeasurementUnit;

    @AllowNull(false)
    @CreatedAt
    @Column
    public createdAt: Date;

    @AllowNull(false)
    @UpdatedAt
    @Column
    public updatedAt: Date;
}