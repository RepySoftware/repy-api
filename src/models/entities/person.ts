import { AllowNull, BelongsTo, BelongsToMany, Column, CreatedAt, Default, ForeignKey, HasMany, Table, UpdatedAt } from "sequelize-typescript";
import { PersonIcmsContributorType } from "../../common/enums/person-icms-contributor.type";
import { PersonTaxRegime } from "../../common/enums/person-tax-regime";
import { PersonType } from "../../common/enums/person-type";
import { Entity } from "../abstraction/entity";
import { Address } from "./address";
import { Company } from "./company";
import { Device } from "./device";
import { PersonPhone } from "./person-phone";

@Table({
    tableName: 'Persons',
    timestamps: true
})
export class Person extends Entity<Person> {

    @AllowNull(false)
    @Column
    public type: PersonType;

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
    @Column
    public addressId?: number;
    @BelongsTo(() => Address, 'addressId')
    public address?: Address;

    @ForeignKey(() => Company)
    @AllowNull(false)
    @Column
    public companyId: number;
    @BelongsTo(() => Company, 'companyId')
    public company: Company;

    @AllowNull(false)
    @Column
    public isSupplier: boolean;

    @AllowNull(false)
    @Column
    public isCustomer: boolean;

    @AllowNull(false)
    @Column
    public taxRegime: PersonTaxRegime;

    @Column
    public icmsContributorType: PersonIcmsContributorType;

    @Column
    public stateRegistration: string;

    @Column
    public municipalRegistration: string;

    @AllowNull(false)
    @Default(false)
    @Column
    public isGasCustomer: boolean;

    @AllowNull(false)
    @Default(true)
    @Column
    public isActive: boolean;

    @AllowNull(false)
    @CreatedAt
    @Column
    public createdAt: Date;

    @AllowNull(false)
    @UpdatedAt
    @Column
    public updatedAt: Date;

    @HasMany(() => PersonPhone)
    public personPhones: PersonPhone[];

    @HasMany(() => Device)
    public devices: Device[];
}