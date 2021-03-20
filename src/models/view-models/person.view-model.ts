import { AddressViewModel } from "./address.view-model";
import { PersonType } from "../../common/enums/person-type";
import { Person } from "../entities/person";
import { DeviceViewModel } from "./device.view-model";
import { PersonPhoneViewModel } from "./person-phone.view-model";
import { DateHelper } from "../../common/helpers/date.helper";
import { PersonTaxRegime } from "../../common/enums/person-tax-regime";
import { PersonIcmsContributorType } from "../../common/enums/person-icms-contributor.type";

export class PersonViewModel {

    public id: number;
    public type: PersonType;
    public documentNumber: string;
    public name: string;
    public tradeName: string;
    public email: string;
    public phones: PersonPhoneViewModel[];
    public address: AddressViewModel;
    public isSupplier: boolean;
    public isCustomer: boolean;
    public taxRegime: PersonTaxRegime;
    public icmsContributorType: PersonIcmsContributorType;
    public stateRegistration: string;
    public municipalRegistration: string;
    public isGasCustomer: boolean;
    public isActive: boolean;
    public devices: DeviceViewModel[];
    public createdAt: string;
    public updatedAt: string;

    public static fromEntity(p: Person): PersonViewModel {

        const person = new PersonViewModel();

        person.id = p.id;
        person.type = p.type;
        person.documentNumber = p.documentNumber;
        person.name = p.name;
        person.tradeName = p.tradeName;
        person.email = p.email;
        person.phones = p.personPhones ? p.personPhones.map(PersonPhoneViewModel.fromEntity) : null;
        person.address = p.address ? AddressViewModel.fromEntity(p.address) : null;
        person.isSupplier = p.isSupplier;
        person.isCustomer = p.isCustomer;
        person.taxRegime = p.taxRegime;
        person.icmsContributorType = p.icmsContributorType;
        person.stateRegistration = p.stateRegistration;
        person.municipalRegistration = p.municipalRegistration;
        person.isGasCustomer = p.isGasCustomer;
        person.isActive = p.isActive;
        person.devices = p.devices ? p.devices.map(DeviceViewModel.fromEntity) : null;
        person.createdAt = DateHelper.toStringViewModel(p.createdAt);
        person.updatedAt = DateHelper.toStringViewModel(p.updatedAt);

        return person;
    }
}