import { AllowNull, BelongsTo, BelongsToMany, Column, CreatedAt, ForeignKey, HasMany, Table, UpdatedAt } from "sequelize-typescript";
import { PersonType } from "../../common/enums/person-type";
import { Entity } from "../abstraction/entity";
import { Address } from "./address";
import { Company } from "./company";
import { CompanyBranchItem } from "./company-branch-item";
import { Device } from "./device";
import { PersonPhone } from "./person-phone";
import { SaleOrder } from "./sale-order";

@Table({
    tableName: 'SaleOrdersItems'
})
export class SaleOrderItem extends Entity<SaleOrderItem> {
    
    @ForeignKey(() => SaleOrder)
    @AllowNull(false)
    @Column
    public saleOrderId: number;
    @BelongsTo(() => SaleOrder, 'saleOrderId')
    public saleOrder: SaleOrder;

    @ForeignKey(() => CompanyBranchItem)
    @AllowNull(false)
    @Column
    public companyBranchItemId: number;
    @BelongsTo(() => CompanyBranchItem, 'companyBranchItemId')
    public companyBranchItem: CompanyBranchItem;

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