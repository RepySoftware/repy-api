import { DeviceSyncDataViewModel } from "./abstraction/device-sync-data.view-model";

export class DeviceGasLevelSyncDataViewModel implements DeviceSyncDataViewModel {
    deviceKey: number;
    calibrate: boolean;
    setTare: boolean;
}