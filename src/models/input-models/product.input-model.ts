import { MeasurementUnit } from "../../common/enums/measurement-unit";

export interface ProductInputModel {

    id?: number;
    categoryId: number;
    code: string;
    name: string;
    description: string;
    measurementUnit: MeasurementUnit;
    isGas: boolean;
}