import { DeviceSyncDataInputModel } from "../../models/input-models/abstraction/device-sync-data.input-model";
import { DeviceSyncDataViewModel } from "../../models/view-models/abstraction/device-sync-data.view-model";
import { Strategy } from "../abstraction/strategy";

export class DeviceSyncDataStrategy extends Strategy<DeviceSyncDataInputModel, Promise<DeviceSyncDataViewModel>> {

    constructor(type: string) {
        super(type, ['gasLevel']);
    }

    public async gasLevel(input: DeviceSyncDataInputModel): Promise<DeviceSyncDataViewModel> {
        throw new Error('Not implemented');
    }
}