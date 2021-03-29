import { DeviceSyncDataInputModel } from "./abstraction/device-sync-data.input-model";

export interface DeviceGasLevelSyncDataInputModel extends DeviceSyncDataInputModel {

    tareOk: boolean;
    currentWeight: number;
}