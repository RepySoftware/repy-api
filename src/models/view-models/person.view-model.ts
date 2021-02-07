import { AddressViewModel } from "./address.view-model";
import * as moment from 'moment-timezone';
import { DEFAULT_DATETIME_FORMAT } from "../../config";
import { PersonRole } from "../../common/enums/person-role";
import { PersonType } from "../../common/enums/person-type";
import { Person } from "../entities/person";
import { PersonDeviceViewModel } from "./person-device.view-model";

export class PersonViewModel {

    public id: number;
    public type: PersonType;
    public roles: PersonRole[];
    public documentNumber: string;
    public name: string;
    public tradeName: string;
    public email: string;
    public phones: string[];
    public address: AddressViewModel;
    public personSupplier: PersonViewModel;
    public personDevices: PersonDeviceViewModel[];
    public createdAt: string;
    public updatedAt: string;

    public static fromEntity(p: Person): PersonViewModel {

        const person = new PersonViewModel();

        person.id = p.id;
        person.type = p.type;
        person.roles = p.roles;
        person.documentNumber = p.documentNumber;
        person.name = p.name;
        person.tradeName = p.tradeName;
        person.email = p.email;
        person.phones = p.personPhones ? p.personPhones.map(pp => pp.phone) : null;
        person.address = p.address ? AddressViewModel.fromEntity(p.address) : null;
        person.personSupplier = p.personSupplier ? PersonViewModel.fromEntity(p.personSupplier) : null;
        person.personDevices = p.personDevices ? p.personDevices.map(PersonDeviceViewModel.fromEntity) : null;
        person.createdAt = moment.utc(p.createdAt).local().format(DEFAULT_DATETIME_FORMAT);
        person.updatedAt = moment.utc(p.updatedAt).local().format(DEFAULT_DATETIME_FORMAT);

        return person;
    }
}