import { AllowNull, BelongsTo, Column, ForeignKey, Table } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";
import { Person } from "./person";

@Table({
    tableName: 'PersonsPhones',
    timestamps: false
})
export class PersonPhone extends Entity<PersonPhone> {

    @ForeignKey(() => Person)
    @AllowNull(false)
    @Column
    public personId: number;
    @BelongsTo(() => Person, 'personId')
    public person: Person;

    @AllowNull(false)
    @Column
    public phone: string;
}