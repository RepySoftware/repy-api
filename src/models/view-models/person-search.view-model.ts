import { ViewPersonSearch } from "../entities/views/view-person-search";

export class PersonSearchViewModel {

    public id: number;
    public name: string;
    public tradeName: string;
    public documentNumber: string;
    public isSupplier: boolean;
    public isCustomer: boolean;
    public isActive: boolean;
    public phones: string[];
    public addressDescription: string;
    public addressComplement: string;
    public addressReferencePoint: string;

    public static fromEntity(p: ViewPersonSearch): PersonSearchViewModel {

        const person = new PersonSearchViewModel();

        person.id = p.id;
        person.name = p.name;
        person.tradeName = p.tradeName;
        person.documentNumber = p.documentNumber;
        person.isSupplier = p.isSupplier;
        person.isCustomer = p.isCustomer;
        person.isActive = p.isActive;
        person.phones = p.phones.split(',').filter(x => !!x);
        person.addressDescription = p.addressDescription;
        person.addressComplement = p.addressComplement;
        person.addressReferencePoint = p.addressReferencePoint;

        return person;
    }
}