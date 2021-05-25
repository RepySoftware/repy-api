import { DateHelper } from "../../common/helpers/date.helper";
import { Employee } from "../entities/employee";

export class EmployeeCoordinatesViewModel {

    public id: number;
    public name: string;
    public color?: string;
    public latitude: number;
    public longitude: number;
    public speed: number;
    public coordinatesUpdatedAt: string;

    public static fromEntity(e: Employee): EmployeeCoordinatesViewModel {

        const ec = new EmployeeCoordinatesViewModel();

        ec.id = e.id;
        ec.name = e.name;
        ec.color = e.color;
        ec.latitude = e.coordinates.latitude;
        ec.longitude = e.coordinates.longitude;
        ec.speed = e.coordinates.speed;
        ec.coordinatesUpdatedAt = DateHelper.toStringViewModel(e.coordinates.updatedAt);

        return ec;
    }
}