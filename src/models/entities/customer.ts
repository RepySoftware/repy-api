import { AllowNull, Column, Table } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";

@Table({
    name: { plural: 'Customers' },
})
export class Customer extends Entity<Customer> {

    // @AllowNull(false)
    // @Column
    // public documentNumber: string;

    // @AllowNull(false)
    // @Column
    // public phoneNumber: string;


}