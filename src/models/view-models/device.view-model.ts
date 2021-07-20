import { DeviceType } from "../../common/enums/device-type";
import { Device } from "../entities/device";
import { AddressViewModel } from "./address.view-model";
import { DeviceGasLevelViewModel } from "./device-gas-level.view-mode";
import { NotificationConfigurationViewModel } from "./notification-configuration.view-model";
import { PersonViewModel } from "./person.view-model";
import { DateHelper } from "../../common/helpers/date.helper";

export class DeviceViewModel {

    public id: number;
    public token: string;
    public name: string;
    public address: AddressViewModel;
    public person: PersonViewModel;
    public type: DeviceType;
    public notificationConfiguration: NotificationConfigurationViewModel;
    public isOnline: boolean;
    public isBluetooth: boolean;
    public createdAt: string;
    public updatedAt: string;
    public deviceGasLevel: DeviceGasLevelViewModel;

    public static fromEntity(d: Device): DeviceViewModel {

        const device = new DeviceViewModel();

        device.id = d.id;
        device.token = d.token;
        device.name = d.name;
        device.address = d.address ? AddressViewModel.fromEntity(d.address) : null;
        device.person = d.person ? PersonViewModel.fromEntity(d.person) : null;
        device.type = d.type;
        device.notificationConfiguration = d.notificationConfiguration ? NotificationConfigurationViewModel.fromEntity(d.notificationConfiguration) : null;
        device.isOnline = d.isOnline();
        device.isBluetooth = d.isBluetooth;
        device.createdAt = DateHelper.toStringViewModel(d.createdAt);
        device.updatedAt = DateHelper.toStringViewModel(d.updatedAt);

        device.deviceGasLevel = d.deviceGasLevel ? DeviceGasLevelViewModel.fromEntity(d.deviceGasLevel) : null;

        return device;
    }
}