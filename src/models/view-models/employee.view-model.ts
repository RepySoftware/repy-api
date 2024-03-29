import { DateHelper } from "../../common/helpers/date.helper";
import { Employee } from "../entities/employee";
import { CoordinateViewModel } from "./coordinate.view-model";
import { VehicleViewModel } from "./vehicle.view-model";

export class EmployeeViewModel {

    public id: number;
    public name: string;
    public documentNumber: string;
    public email: string;
    public color?: string;
    public vehicle?: VehicleViewModel;
    public isManager: boolean;
    public isAgent: boolean;
    public isDriver: boolean;
    public isActive: boolean;
    public coordinates?: CoordinateViewModel;
    public createdAt: string;
    public updatedAt: string;

    public static fromEntity(e: Employee): EmployeeViewModel {

        const employee = new EmployeeViewModel();

        employee.id = e.id;
        employee.name = e.name;
        employee.documentNumber = e.documentNumber;
        employee.email = e.email;
        employee.color = e.color;
        employee.vehicle = e.vehicle ? VehicleViewModel.fromEntity(e.vehicle) : null;
        employee.isManager = e.isManager;
        employee.isAgent = e.isAgent;
        employee.isDriver = e.isDriver;
        employee.isActive = e.isActive;
        employee.coordinates = e.coordinates ? CoordinateViewModel.fromEntity(e.coordinates) : null;
        employee.createdAt = DateHelper.toStringViewModel(e.createdAt);
        employee.updatedAt = DateHelper.toStringViewModel(e.updatedAt);

        return employee;
    }
}