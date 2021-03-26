import { AllowNull, BelongsTo, Column, Default, ForeignKey, Table } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";
import { Company } from "./company";

@Table({
    tableName: 'PaymentMethods',
    timestamps: false
})
export class PaymentMethod extends Entity<PaymentMethod> {

    @AllowNull(false)
    @Column
    public name: string;

    @ForeignKey(() => Company)
    @AllowNull(false)
    @Column
    public companyId: number;
    @BelongsTo(() => Company, 'companyId')
    public company: Company;

    @AllowNull(false)
    @Column
    public hasInstallments: boolean;

    @Column
    public erpPaymentMethodId: string;

    @AllowNull(false)
    @Default(0)
    @Column
    public isDefault: boolean;
}