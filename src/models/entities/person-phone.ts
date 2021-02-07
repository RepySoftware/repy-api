import { AllowNull, BelongsTo, Column, CreatedAt, DataType, ForeignKey, Table, UpdatedAt } from "sequelize-typescript";
import { PersonRole } from "../../common/enums/person-role";
import { PersonType } from "../../common/enums/person-type";
import { Entity } from "../abstraction/entity";
import { Address } from "./address";
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