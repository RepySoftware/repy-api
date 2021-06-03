import { AllowNull, BelongsTo, Column, CreatedAt, ForeignKey, Table, UpdatedAt } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";
import { Deposit } from "./deposit";
import { DepositProduct } from "./deposit-product";

@Table({
    tableName: 'StockPosts',
    timestamps: true
})
export class StockPost extends Entity<StockPost> {

    public static create(input: {
        depositId: number;
        depositProductId: number;
        quantity: number;
        observation?: string;
        dateOfIssue: Date;
    }): StockPost {
        return new StockPost(input);
    }

    @ForeignKey(() => Deposit)
    @AllowNull(false)
    @Column
    public depositId: number;
    @BelongsTo(() => Deposit, 'depositId')
    public deposit: Deposit;

    @ForeignKey(() => DepositProduct)
    @AllowNull(false)
    @Column
    public depositProductId: number;
    @BelongsTo(() => DepositProduct, 'depositProductId')
    public depositProduct: DepositProduct;

    @AllowNull(false)
    @Column
    public quantity: number;

    @Column
    public observation?: string;

    @AllowNull(false)
    @Column
    public dateOfIssue: Date;

    @AllowNull(false)
    @CreatedAt
    @Column
    public createdAt: Date;

    @AllowNull(false)
    @UpdatedAt
    @Column
    public updatedAt: Date;
}