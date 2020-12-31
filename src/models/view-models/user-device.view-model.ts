import { UserDeviceRole } from "../../common/enums/user-device-role";
import { UserDevice } from "../entities/user-device";
import { DeviceViewModel } from "./device.view-model";

export class UserDeviceViewModel {

    public id: number;
    public device: DeviceViewModel;
    public role: UserDeviceRole;

    public static fromEntity(ud: UserDevice): UserDeviceViewModel {

        const userDevice = new UserDeviceViewModel();

        userDevice.id = ud.id;
        userDevice.device = DeviceViewModel.fromEntity(ud.device);
        userDevice.role = ud.role;

        return userDevice;
    }
}