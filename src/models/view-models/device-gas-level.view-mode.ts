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

    public static fromEntity(dgl: DeviceGasLevel): DeviceGasLevelViewModel {

        const device = new DeviceGasLevelViewModel();

        device.id = dgl.id;
        device.cylinder = CylinderViewModel.fromEntity(dgl.cylinder);
        device.currentWeight = dgl.currentWeight;
        device.cylinderWeight = dgl.cylinderWeight;
        device.contentWeight = dgl.contentWeight;
        device.percentageToNotify = dgl.percentageToNotify;
        device.setTare = dgl.setTare;
        device.lastWeightUpdate = moment(dgl.lastWeightUpdate).format(DEFAULT_DATETIME_FORMAT);

        return device;
    }
}