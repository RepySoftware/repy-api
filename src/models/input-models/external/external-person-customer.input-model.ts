import { PersonType } from "../../../common/enums/person-type";
import { ExternalAddressInputModel } from "./external-address.input-model";

export interface ExternalPersonCustomerInputModel {

    id?: number;
    type: PersonType;
    documentNumber?: string;
    name: string;
    email: string;
    address: ExternalAddressInputModel;
    phones?: string[];
}