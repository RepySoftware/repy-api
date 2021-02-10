import { AddressViewModel } from "./address.view-model";
import * as moment from 'moment-timezone';
import { DEFAULT_DATETIME_FORMAT } from "../../config";
import { PersonType } from "../../common/enums/person-type";
import { Person } from "../entities/person";
import { DeviceViewModel } from "./device.view-model";
import { PersonPhoneViewModel } from "./person-phone.view-model";

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
    public isManager: boolean;
    public isDriver: boolean;
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
        person.isManager = p.isManager;
        person.isDriver = p.isDriver;
        person.devices = p.devices ? p.devices.map(DeviceViewModel.fromEntity) : null;
        person.createdAt = moment.utc(p.createdAt).local().format(DEFAULT_DATETIME_FORMAT);
        person.updatedAt = moment.utc(p.updatedAt).local().format(DEFAULT_DATETIME_FORMAT);

        return person;
    }
}