import { DeviceUpdateInputModel } from "./abstraction/device-update.input-model";

export interface DeviceGasLevelUpdateInputModel extends DeviceUpdateInputModel {
    name: string;
    cylinderId: number;
    cylinderWeight: number;
}