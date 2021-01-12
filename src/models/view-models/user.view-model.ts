import { UserType } from "../../common/enums/user-type";
import { User } from "../entities/user";
import * as moment from 'moment-timezone';
import { SupplierEmployeeViewModel } from "./supplier-employee.view-model";
import { CustomerViewModel } from "./customer.view-model";
import { UserDeviceViewModel } from "./user-device.view-model";
import { DEFAULT_DATETIME_FORMAT } from "../../config";

export class UserViewModel {

    public id: number;
    public name: string;
    public username: string;
    public email: string;
    public type: UserType;
    public supplierEmployee?: SupplierEmployeeViewModel;
    public customer?: CustomerViewModel;
    public isActive: boolean;
    public createdAt: string;
    public updatedAt: string;
    public userDevices: UserDeviceViewModel[];

    public static fromEntity(u: User): UserViewModel {

        const user = new UserViewModel();

        user.id = u.id;
        user.name = u.name;
        user.username = u.username;
        user.email = u.email;
        user.type = u.type;
        user.supplierEmployee = u.supplierEmployee ? SupplierEmployeeViewModel.fromEntity(u.supplierEmployee) : null;
        user.customer = u.customer ? CustomerViewModel.fromEntity(u.customer) : null;
        user.isActive = u.isActive;
        user.createdAt = moment.utc(u.createdAt).local().format(DEFAULT_DATETIME_FORMAT);
        user.updatedAt = moment.utc(u.updatedAt).local().format(DEFAULT_DATETIME_FORMAT);
        user.userDevices = u.userDevices ? u.userDevices.map(UserDeviceViewModel.fromEntity) : null;

        return user;
    }
}