import { DateHelper } from "../../common/helpers/date.helper";
import { Vehicle } from "../entities/vehicle";
import { DepositViewModel } from "./deposit.view-model";

export class VehicleViewModel {

    public id: number;
    public description: string;
    public nickname: string;
    public licensePlate: string;
    public deposit: DepositViewModel;
    public createdAt: string;
    public updatedAt: string;

    public static fromEntity(v: Vehicle): VehicleViewModel {

        const vehicle = new VehicleViewModel();

        vehicle.id = v.id;
        vehicle.description = v.description;
        vehicle.nickname = v.nickname;
        vehicle.licensePlate = v.licensePlate;
        vehicle.deposit = v.deposit ? DepositViewModel.fromEntity(v.deposit) : null;
        vehicle.createdAt = DateHelper.toStringViewModel(v.createdAt);
        vehicle.updatedAt = DateHelper.toStringViewModel(v.updatedAt);

        return vehicle;
    }
}