import { PersonIcmsContributorType } from "../../common/enums/person-icms-contributor.type";
import { PersonTaxRegime } from "../../common/enums/person-tax-regime";
import { PersonType } from "../../common/enums/person-type";
import { AddressInputModel } from "./address.input-model";
import { PersonPhoneInputModel } from "./person-phone.input-model";

export interface PersonInputModel {
    id?: number;
    type: PersonType;
    documentNumber: string;
    name: string;
    tradeName: string;
    email: string;
    address: AddressInputModel;
    isCustomer: boolean;
    isSupplier: boolean;
    taxRegime: PersonTaxRegime;
    icmsContributorType: PersonIcmsContributorType;
    stateRegistration: string;
    municipalRegistration: string;
    isActive: boolean;
    observation?: string;
    personPhones: PersonPhoneInputModel[];
}