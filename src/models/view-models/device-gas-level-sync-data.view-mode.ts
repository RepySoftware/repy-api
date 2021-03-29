import { DeviceSyncDataViewModel } from "./abstraction/device-sync-data.view-model";

export class DeviceGasLevelSyncDataViewModel implements DeviceSyncDataViewModel {
    deviceId: number;
    canSetTare: boolean;
}