import { Device } from "../entities/device";

export interface DeviceIsOnline {
    isOnline(device: Device): boolean;
}