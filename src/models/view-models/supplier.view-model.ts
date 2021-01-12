import { Supplier } from "../entities/supplier";
import { AddressViewModel } from "./address.view-model";
import * as moment from 'moment-timezone';
import { DEFAULT_DATETIME_FORMAT } from "../../config";

export class SupplierViewModel {

    public id: number;
    public documentNumber: string;
    public phoneNumber?: string;
    public address: AddressViewModel;
    public createdAt: string;
    public updatedAt: string;

    public static fromEntity(s: Supplier): SupplierViewModel {

        const supplier = new SupplierViewModel();

        supplier.id = s.id;
        supplier.documentNumber = s.documentNumber;
        supplier.phoneNumber = s.phoneNumber;
        supplier.address = s.address ? AddressViewModel.fromEntity(s.address) : null;
        supplier.createdAt = moment.utc(s.createdAt).local().format(DEFAULT_DATETIME_FORMAT);
        supplier.updatedAt = moment.utc(s.updatedAt).local().format(DEFAULT_DATETIME_FORMAT);

        return supplier;
    }
}