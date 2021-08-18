import { ModelAttributes, Sequelize } from "sequelize";
import { DataType } from "sequelize-typescript";

export class ViewDeviceGasLevelDangerDay {

    public static modelName: string = 'ViewDevicesGasLevelsDangerDays';

    public static model: ModelAttributes = {

        vId: { field: 'id', type: DataType.BIGINT, primaryKey: true },
        vDaysToDangerPercentage: { field: 'daysToDangerPercentage', type: DataType.NUMBER },
        vDangerDate: { field: 'dangerDate', type: DataType.DATE },
        vConsumptionDays: { field: 'consumptionDays', type: DataType.NUMBER }
    };

    public static getDefinedModel(sequelize: Sequelize) {
        return sequelize.models[ViewDeviceGasLevelDangerDay.modelName];
    }
}

export interface ViewDeviceGasLevelDangerDay {
    vId: number;
    vDaysToDangerPercentage: number;
    vDangerDate: Date;
    vConsumptionDays: number;
}