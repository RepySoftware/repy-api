import { AllowNull, BelongsTo, BelongsToMany, Column, CreatedAt, ForeignKey, HasMany, Table, UpdatedAt } from "sequelize-typescript";
import { PersonType } from "../../common/enums/person-type";
import { Entity } from "../abstraction/entity";
import { Address } from "./address";
import { Company } from "./company";
import { CompanyBranchProduct } from "./company-branch-product";
import { Device } from "./device";
import { PersonPhone } from "./person-phone";
import { SaleOrder } from "./sale-order";

@Table({
    tableName: 'SaleOrdersProducts'
})
export class SaleOrderProduct extends Entity<SaleOrderProduct> {
    
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

    @AllowNull(false)
    @Column
    public quantity: number;

    @AllowNull(false)
    @Column
    public purchasePrice: number;

    @AllowNull(false)
    @Column
    public salePrice: number;

    @AllowNull(false)
    @Column
    public finalPrice: number;
}