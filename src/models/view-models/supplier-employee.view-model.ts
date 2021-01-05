import { SupplierEmployeeRole } from "../../common/enums/supplier-employee-role";
import { SupplierEmployee } from "../entities/supplier-employee";
import * as moment from 'moment-timezone';
import { DEFAULT_DATETIME_FORMAT } from "../../config";
import { SupplierViewModel } from "./supplier.view-model";

export class SupplierEmployeeViewModel {

    public id: number;
    public supplier: SupplierViewModel;
    public role: SupplierEmployeeRole;
    public createdAt: string;
    public updatedAt: string;

    public static fromEntity(se: SupplierEmployee): SupplierEmployeeViewModel {

        const employee = new SupplierEmployeeViewModel();

        employee.id = se.id;
        employee.supplier = se.supplier ? SupplierViewModel.fromEntity(se.supplier) : null;
        employee.role = se.role;
        employee.createdAt = moment(se.createdAt).format(DEFAULT_DATETIME_FORMAT);
        employee.updatedAt = moment(se.updatedAt).format(DEFAULT_DATETIME_FORMAT);

        return employee;
    }
}