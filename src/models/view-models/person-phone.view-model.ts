import { PersonPhone } from "../entities/person-phone";

export class PersonPhoneViewModel {

    public id: number;
    public phone: string;

    public static fromEntity(pp: PersonPhone): PersonPhoneViewModel {

        const personPhone = new PersonPhoneViewModel();

        personPhone.id = pp.id;
        personPhone.phone = pp.phone;

        return personPhone;
    }
}