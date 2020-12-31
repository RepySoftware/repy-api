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
        customer.address = AddressViewModel.fromEntity(c.address);
        customer.createdAt = moment(c.createdAt).format(DEFAULT_DATETIME_FORMAT);
        customer.updatedAt = moment(c.updatedAt).format(DEFAULT_DATETIME_FORMAT);

        return customer;
    }
}