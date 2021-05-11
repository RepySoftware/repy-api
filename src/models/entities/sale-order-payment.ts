import { AllowNull, BelongsTo, Column, CreatedAt, ForeignKey, Table, UpdatedAt } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";
import { PaymentMethod } from "./payment-method";
import { SaleOrder } from "./sale-order";

@Table({
    tableName: 'SaleOrderPayments',
    timestamps: true
})
export class SaleOrderPayment extends Entity<SaleOrderPayment> {

    public static create(input: {
        saleOrderId: number,
        paymentMethodId: number,
        value: number,
        dueDate: Date,
        payDate: Date
    }): SaleOrderPayment {
        return new SaleOrderPayment(input);
    }

    @AllowNull(false)
    @ForeignKey(() => SaleOrder)
    @Column
    public saleOrderId: number;
    @BelongsTo(() => SaleOrder, 'saleOrderId')
    public saleOrder: SaleOrder;

    @AllowNull(false)
    @ForeignKey(() => PaymentMethod)
    @Column
    public paymentMethodId: number;
    @BelongsTo(() => PaymentMethod, 'paymentMethodId')
    public paymentMethod: PaymentMethod;

    @AllowNull(false)
    @Column
    public value: number;

    @AllowNull(false)
    @Column
    public dueDate: Date;

    @Column
    public payDate?: Date;

    @AllowNull(false)
    @CreatedAt
    @Column
    public createdAt: Date;

    @AllowNull(false)
    @UpdatedAt
    @Column
    public updatedAt: Date;
}