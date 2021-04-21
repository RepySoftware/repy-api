import { AllowNull, BelongsTo, Column, ForeignKey, Table } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";
import { Company } from "./company";

@Table({
    tableName: 'DefaultDeliveryInstructions',
    timestamps: false
})
export class DefaultDeliveryInstruction extends Entity<DefaultDeliveryInstruction> {

    @ForeignKey(() => Company)
    @AllowNull(false)
    @Column
    public companyId: number;
    @BelongsTo(() => Company, 'companyId')
    public company: Company;

    @AllowNull(false)
    @Column
    public description: string;
}