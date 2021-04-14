import { AllowNull, BelongsTo, Column, ForeignKey, Table } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";
import { CompanyBranchProduct } from "./company-branch-product";
import { CompanyBranchProductPrice } from "./company-branch-product-price";
import { SaleOrder } from "./sale-order";

@Table({
    tableName: 'SaleOrderProducts',
    timestamps: false
})
export class SaleOrderProduct extends Entity<SaleOrderProduct> {

    public static create(input: {
        saleOrderId: number;
        companyBranchProductId: number;
        companyBranchProductPriceId: number;
        quantity: number;
        salePrice: number;
    }): SaleOrderProduct {
        return new SaleOrderProduct(input);
    }

    @ForeignKey(() => SaleOrder)
    @AllowNull(false)
    @Column
    public saleOrderId: number;
    @BelongsTo(() => SaleOrder, 'saleOrderId')
    public saleOrder: SaleOrder;

    @ForeignKey(() => CompanyBranchProduct)
    @AllowNull(false)
    @Column
    public companyBranchProductId: number;
    @BelongsTo(() => CompanyBranchProduct, 'companyBranchProductId')
    public companyBranchProduct: CompanyBranchProduct;

    @ForeignKey(() => CompanyBranchProductPrice)
    @AllowNull(false)
    @Column
    public companyBranchProductPriceId: number;
    @BelongsTo(() => CompanyBranchProductPrice, 'companyBranchProductPriceId')
    public companyBranchProductPrice: CompanyBranchProductPrice;

    @AllowNull(false)
    @Column
    public quantity: number;

    @AllowNull(false)
    @Column
    public salePrice: number;
}