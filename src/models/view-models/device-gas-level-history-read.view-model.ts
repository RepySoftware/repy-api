import { DateHelper } from "../../common/helpers/date.helper";
import { DeviceGasLevelHistoryRead } from "../entities/device-gas-level-history-read";

export class DeviceGasLevelHistoryReadViewModel {

    public id: number;
    public cylinderWeight: number;
    public contentWeight: number;
    public weight: number;
    public gasWeight: number;
    public percentage: number;
    public createdAt: string;
    public updatedAt: string;

    public static fromEntity(dglhr: DeviceGasLevelHistoryRead): DeviceGasLevelHistoryReadViewModel {

        const historyRead = new DeviceGasLevelHistoryReadViewModel();

        historyRead.id = dglhr.id;
        historyRead.cylinderWeight = dglhr.cylinderWeight;
        historyRead.contentWeight = dglhr.contentWeight;
        historyRead.weight = dglhr.weight;
        historyRead.gasWeight = dglhr.getGasWeight();
        historyRead.percentage = dglhr.getPercentage();
        historyRead.createdAt = DateHelper.toStringViewModel(dglhr.createdAt);
        historyRead.updatedAt = DateHelper.toStringViewModel(dglhr.updatedAt);

        return historyRead;
    }
}