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
    public createdAt: string;
    public updatedAt: string;
    public deviceGasLevel: DeviceGasLevelViewModel;

    public static fromEntity(d: Device): DeviceViewModel {

        const device = new DeviceViewModel();

        device.id = d.id;
        device.deviceKey = d.deviceKey;
        device.token = d.token;
        device.name = d.name;
        device.address = AddressViewModel.fromEntity(d.address);
        device.supplier = SupplierViewModel.fromEntity(d.supplier);
        device.type = d.type;
        device.notificationConfiguration = NotificationConfigurationViewModel.fromEntity(d.notificationConfiguration);
        device.createdAt = moment(d.createdAt).format(DEFAULT_DATETIME_FORMAT);
        device.updatedAt = moment(d.updatedAt).format(DEFAULT_DATETIME_FORMAT);
        device.deviceGasLevel = DeviceGasLevelViewModel.fromEntity(d.deviceGasLevel);

        return device;
    }
}