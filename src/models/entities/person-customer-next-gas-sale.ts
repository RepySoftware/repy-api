import { AllowNull, Column, Table } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";

@Table({
    tableName: 'PersonsCustomersNextGasSales',
    timestamps: false,
    
})
export class PersonCustomerNextGasSale extends Entity<PersonCustomerNextGasSale> {

    @AllowNull(false)
    @Column
    public personCustomerId: number;

    @Column
    public personCustomerName: string;

    @AllowNull(false)
    @Column
    public companyId: number;

    @AllowNull(false)
    @Column
    public salesCount: number;

    @AllowNull(false)
    @Column
    public lastSale: Date;

    @AllowNull(false)
    @Column
    public nextSaleMinDate: Date;

    @AllowNull(false)
    @Column
    public nextSaleAverageDate: Date;

    @AllowNull(false)
    @Column
    public nextSaleMaxDate: Date;
}