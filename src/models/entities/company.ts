import { AllowNull, Column, CreatedAt, Table, UpdatedAt } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";

@Table({
    tableName: 'Companies',
    timestamps: true
})
export class Company extends Entity<Company> {

    @AllowNull(false)
    @Column
    public name: string;

    @Column
    public webhookSaleOrderChanges?: string;

    @AllowNull(false)
    @CreatedAt
    @Column
    public createdAt: Date;

    @AllowNull(false)
    @UpdatedAt
    @Column
    public updatedAt: Date;
}