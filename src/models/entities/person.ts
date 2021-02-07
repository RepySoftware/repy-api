import { AllowNull, BelongsTo, Column, CreatedAt, ForeignKey, HasMany, Table, UpdatedAt } from "sequelize-typescript";
import { PersonRole } from "../../common/enums/person-role";
import { PersonType } from "../../common/enums/person-type";
import { Entity } from "../abstraction/entity";
import { Address } from "./address";
import { PersonDevice } from "./person-device";
import { PersonPhone } from "./person-phone";

@Table({
    tableName: 'Persons',
    timestamps: true
})
export class Person extends Entity<Person> {

    @AllowNull(false)
    @Column
    public type: PersonType;

    @AllowNull(false)
    @Column({ field: 'roles' })
    private _roles: string;
    public get roles(): PersonRole[] {
        return <PersonRole[]>this._roles.split(';').filter(x => !!x);
    }
    public set roles(value: PersonRole[]) {
        this._roles = value.join(';');
    }

    @AllowNull(false)
    @Column
    public documentNumber: string;

    @AllowNull(false)
    @Column
    public name: string;

    @Column
    public tradeName: string;

    @Column
    public email: string;

    @ForeignKey(() => Address)
    @AllowNull(false)
    @Column
    public addressId: number;
    @BelongsTo(() => Address, 'addressId')
    public address: Address;

    @ForeignKey(() => Person)
    @AllowNull(false)
    @Column
    public personSupplierId: number;
    @BelongsTo(() => Person, 'personSupplierId')
    public personSupplier: Person;

    @AllowNull(false)
    @CreatedAt
    @Column
    public createdAt: Date;

    @AllowNull(false)
    @UpdatedAt
    @Column
    public updatedAt: Date;

    @HasMany(() => PersonPhone)
    personPhones: PersonPhone[];

    @HasMany(() => PersonDevice)
    personDevices: PersonDevice[];

    public isSupplier(): boolean {
        return this.roles.includes(PersonRole.SUPPLIER);
    }

    public isCustomer(): boolean {
        return this.roles.includes(PersonRole.CUSTOMER);
    }

    public isSupplierEmployee(): boolean {
        return this.roles.includes(PersonRole.SUPPLIER_MANAGER || PersonRole.SUPPLIER_AGENT);
    }

    public isDriver(): boolean {
        return this.roles.includes(PersonRole.DRIVER);
    }
}