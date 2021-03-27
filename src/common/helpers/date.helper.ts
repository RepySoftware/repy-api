import * as moment from 'moment-timezone';

export abstract class DateHelper {

    public static toStringViewModel(date: Date): string {
        // return date ? moment.utc(date).local().format(DEFAULT_DATETIME_FORMAT) : null;
        return date ? moment(date).toISOString() : null;
    }
}