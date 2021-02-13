import { AllowNull, Column, Table } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";

@Table({
    tableName: 'Addresses',
    timestamps: false
})
export class Address extends Entity<Address> {

    @AllowNull(false)
    @Column
    public description: string;

    @Column
    public zipCode?: string;

    @AllowNull(false)
    @Column
    public city: string;

    @AllowNull(false)
    @Column
    public region: string;

    @AllowNull(false)
    @Column
    public country: string;

    @Column
    public complement: string;

    @Column
    public referencePoint: string;

    @AllowNull(false)
    @Column
    public latitude: number;

    @AllowNull(false)
    @Column
    public longitude: number;
}