import { DeviceType } from "../../common/enums/device-type";
import { Device } from "../entities/device";
import { AddressViewModel } from "./address.view-model";
import { DeviceGasLevelViewModel } from "./device-gas-level.view-mode";
import * as moment from 'moment-timezone';
import { DEFAULT_DATETIME_FORMAT } from "../../config";
import { SupplierViewModel } from "./supplier.view-model";
import { NotificationConfigurationViewModel } from "./notification-configuration.view-model";

export class DeviceViewModel {

    public id: number;
    public deviceKey: string;
    public token: string;
    public name: string;
    public address: AddressViewModel;
    public supplier: SupplierViewModel;
    public type: DeviceType;
    public notificationConfiguration: NotificationConfigurationViewModel;
    public isOnline: boolean;
    public createdAt: string;
    public updatedAt: string;
    public deviceGasLevel: DeviceGasLevelViewModel;

    public static fromEntity(d: Device): DeviceViewModel {

        const device = new DeviceViewModel();

        device.id = d.id;
        device.deviceKey = d.deviceKey;
        device.token = d.token;
        device.name = d.name;
        device.address = d.address ? AddressViewModel.fromEntity(d.address) : null;
        device.supplier = d.supplier ? SupplierViewModel.fromEntity(d.supplier) : null;
        device.type = d.type;
        device.notificationConfiguration = d.notificationConfiguration ? NotificationConfigurationViewModel.fromEntity(d.notificationConfiguration) : null;
        device.isOnline = d.isOnline();
        device.createdAt = moment.utc(d.createdAt).local().format(DEFAULT_DATETIME_FORMAT);
        device.updatedAt = moment.utc(d.updatedAt).local().format(DEFAULT_DATETIME_FORMAT);
        device.deviceGasLevel = d.deviceGasLevel ? DeviceGasLevelViewModel.fromEntity(d.deviceGasLevel) : null;

        return device;
    }
}