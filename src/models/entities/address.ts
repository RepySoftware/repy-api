import { AllowNull, Column, Table } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";

@Table({
    tableName: 'Addresses',
    timestamps: false
})
export class Address extends Entity<Address> {

    public static create(input: {
        description: string;
        street: string;
        number: string;
        zipCode: string;
        neighborhood: string;
        city: string;
        region: string;
        country: string;
        complement: string;
        referencePoint: string;
        latitude?: number;
        longitude?: number;
    }): Address {
        return new Address(input);
    }

    @AllowNull(false)
    @Column
    public description: string;

    @AllowNull(false)
    @Column
    public street: string;

    @Column
    public number?: string;

    @Column
    public zipCode?: string;

    @Column
    public neighborhood?: string;

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

    @Column
    public latitude?: number;

    @Column
    public longitude?: number;
}