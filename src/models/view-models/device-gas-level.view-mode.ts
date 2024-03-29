import { DeviceGasLevel } from "../entities/device-gas-level";
import { CylinderViewModel } from "./cylinder.view-model";
import { DateHelper } from "../../common/helpers/date.helper";
import { DeviceGasLevelStatus } from "../../common/enums/device-gas-level-status";

export class DeviceGasLevelViewModel {

    public id: number;
    public cylinder: CylinderViewModel;
    public currentWeight: number;
    public cylinderWeight?: number;
    public contentWeight?: number;
    public percentageToNotify?: number;
    public setTare: boolean;
    public lastWeightUpdate: string;
    public percentage: number;
    public status: DeviceGasLevelStatus;
    public daysToDangerPercentage: number;
    public dangerDate: string;
    public consumptionDays: number;

    public static fromEntity(dgl: DeviceGasLevel): DeviceGasLevelViewModel {

        const device = new DeviceGasLevelViewModel();

        device.id = dgl.id;
        device.cylinder = dgl.cylinder ? CylinderViewModel.fromEntity(dgl.cylinder) : null;
        device.currentWeight = dgl.currentWeight;
        device.cylinderWeight = dgl.getCylinderWeight();
        device.contentWeight = dgl.getContentWeight();
        device.percentageToNotify = dgl.percentageToNotify;
        device.setTare = dgl.setTare;
        device.lastWeightUpdate = DateHelper.toStringViewModel(dgl.lastWeightUpdate);
        device.percentage = dgl.calculePercentage();
        device.status = dgl.getStatus();
        device.daysToDangerPercentage = dgl.getDaysToDangerPercentage();
        device.dangerDate = DateHelper.toStringViewModel(dgl.getDangerDate());
        device.consumptionDays = dgl.getConsumptionDays();

        return device;
    }
}