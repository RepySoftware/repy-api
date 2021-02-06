import { DeviceSyncDataInputModel } from "./abstraction/device-sync-data.input-model";

export interface DeviceGasLevelSyncData extends DeviceSyncDataInputModel {

    currentWeight: number;
}