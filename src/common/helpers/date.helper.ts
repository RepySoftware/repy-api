import * as moment from 'moment-timezone';
import { DEFAULT_DATETIME_FORMAT } from "../../config";

export abstract class DateHelper {

    public static toStringViewModel(date: Date): string {
        return date ? moment.utc(date).local().format(DEFAULT_DATETIME_FORMAT) : null;
    }
}