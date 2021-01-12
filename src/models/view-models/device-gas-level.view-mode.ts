import { DeviceGasLevel } from "../entities/device-gas-level";
import { CylinderViewModel } from "./cylinder.view-model";
import * as moment from 'moment-timezone';
import { DEFAULT_DATETIME_FORMAT } from "../../config";

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

    public static fromEntity(dgl: DeviceGasLevel): DeviceGasLevelViewModel {

        const device = new DeviceGasLevelViewModel();

        device.id = dgl.id;
        device.cylinder = dgl.cylinder ? CylinderViewModel.fromEntity(dgl.cylinder) : null;
        device.currentWeight = dgl.currentWeight;
        device.cylinderWeight = dgl.getCylinderWeight();
        device.contentWeight = dgl.getContentWeight();
        device.percentageToNotify = dgl.percentageToNotify;
        device.setTare = dgl.setTare;
        device.lastWeightUpdate = moment.utc(dgl.lastWeightUpdate).local().format(DEFAULT_DATETIME_FORMAT);
        device.percentage = dgl.calculePercentage();

        return device;
    }
}