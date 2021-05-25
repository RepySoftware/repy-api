import { DateHelper } from "../../common/helpers/date.helper";
import { Coordinates } from "../entities/coordinates";

export class CoordinateViewModel {

    public id: number;
    public latitude: number;
    public longitude: number;
    public speed: number;
    public createdAt: string;
    public updatedAt: string;

    public static fromEntity(c: Coordinates): CoordinateViewModel {

        const coordinate = new CoordinateViewModel();

        coordinate.id = c.id;
        coordinate.latitude = c.latitude;
        coordinate.longitude = c.longitude;
        coordinate.createdAt = DateHelper.toStringViewModel(c.createdAt);
        coordinate.updatedAt = DateHelper.toStringViewModel(c.updatedAt);

        return coordinate;
    }
}