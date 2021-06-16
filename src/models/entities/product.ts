import { AllowNull, BelongsTo, Column, CreatedAt, ForeignKey, HasMany, Table, UpdatedAt } from "sequelize-typescript";
import { MeasurementUnit } from "../../common/enums/measurement-unit";
import { Entity } from "../abstraction/entity";
import { Company } from "./company";
import { CompanyBranchProduct } from "./company-branch-product";
import { ProductCategory } from "./product-category";

@Table({
    tableName: 'Products',
    timestamps: true
})
export class Product extends Entity<Product> {

    public static create(input: {
        companyId: number;
        categoryId: number;
        code: string;
        name: string;
        description: string;
        measurementUnit: MeasurementUnit;
        isGas: boolean;
    }): Product {
        return new Product(input);
    }

    @ForeignKey(() => Company)
    @AllowNull(false)
    @Column
    public companyId: number;
    @BelongsTo(() => Company, 'companyId')
    public company: Company;

    @ForeignKey(() => ProductCategory)
    @AllowNull(false)
    @Column
    public categoryId: number;
    @BelongsTo(() => ProductCategory, 'categoryId')
    public category: ProductCategory;

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
    @Column
    public isGas: boolean;

    @AllowNull(false)
    @CreatedAt
    @Column
    public createdAt: Date;

    @AllowNull(false)
    @UpdatedAt
    @Column
    public updatedAt: Date;

    @HasMany(() => CompanyBranchProduct)
    public companyBranchesProduct: CompanyBranchProduct[];
}