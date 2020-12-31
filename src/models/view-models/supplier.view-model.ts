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
        supplier.address = AddressViewModel.fromEntity(s.address);
        supplier.createdAt = moment(s.createdAt).format(DEFAULT_DATETIME_FORMAT);
        supplier.updatedAt = moment(s.updatedAt).format(DEFAULT_DATETIME_FORMAT);

        return supplier;
    }
}