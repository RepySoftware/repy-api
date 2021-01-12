import { Customer } from "../entities/customer";
import { AddressViewModel } from "./address.view-model";
import * as moment from 'moment-timezone';
import { DEFAULT_DATETIME_FORMAT } from "../../config";

export class CustomerViewModel {

    public id: number;
    public documentNumber: string;
    public phoneNumber: string;
    public address: AddressViewModel;
    public createdAt: string;
    public updatedAt: string;

    public static fromEntity(c: Customer): CustomerViewModel {

        const customer = new CustomerViewModel();

        customer.id = c.id;
        customer.documentNumber = c.documentNumber;
        customer.phoneNumber = c.phoneNumber;
        customer.address = c.address ? AddressViewModel.fromEntity(c.address) : null;
        customer.createdAt = moment.utc(c.createdAt).local().format(DEFAULT_DATETIME_FORMAT);
        customer.updatedAt = moment.utc(c.updatedAt).local().format(DEFAULT_DATETIME_FORMAT);

        return customer;
    }
}