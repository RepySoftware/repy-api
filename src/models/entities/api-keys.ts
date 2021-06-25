import { AllowNull, Column, Table } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";

@Table({
    tableName: 'ApiKeys',
    timestamps: false
})
export class ApiKey extends Entity<ApiKey> {

    @AllowNull(false)
    @Column
    public name: string;

    @AllowNull(false)
    @Column
    public key: string;
}