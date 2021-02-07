import { PersonDeviceRole } from "../../common/enums/person-device-role";
import { PersonDevice } from "../entities/person-device";
import { DeviceViewModel } from "./device.view-model";

export class PersonDeviceViewModel {

    public id: number;
    public device: DeviceViewModel;
    public role: PersonDeviceRole;

    public static fromEntity(ud: PersonDevice): PersonDeviceViewModel {

        const userDevice = new PersonDeviceViewModel();

        userDevice.id = ud.id;
        userDevice.device = ud.device ? DeviceViewModel.fromEntity(ud.device) : null;
        userDevice.role = ud.role;

        return userDevice;
    }
}