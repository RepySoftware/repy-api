import { DateHelper } from "../../common/helpers/date.helper";
import { Employee } from "../entities/employee";

export class EmployeeViewModel {

    public id: number;
    public name: string;
    public documentNumber: string;
    public email: string;
    public isManager: boolean;
    public isAgent: boolean;
    public isDriver: boolean;
    public isActive: boolean;
    public createdAt: string;
    public updatedAt: string;

    public static fromEntity(e: Employee): EmployeeViewModel {

        const employee = new EmployeeViewModel();

        employee.id = e.id;
        employee.name = e.name;
        employee.documentNumber = e.documentNumber;
        employee.email = e.email;
        employee.isManager = e.isManager;
        employee.isAgent = e.isAgent;
        employee.isDriver = e.isDriver;
        employee.isActive = e.isActive;
        employee.createdAt = DateHelper.toStringViewModel(e.createdAt);
        employee.updatedAt = DateHelper.toStringViewModel(e.updatedAt);

        return employee;
    }
}