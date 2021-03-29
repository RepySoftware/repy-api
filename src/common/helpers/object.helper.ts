export abstract class ObjectHelper {

    public static objectToRawValues(obj: any, delimiter: string = '&', subDelimiter: string = '='): string {
        return Object.entries(obj)
            .map(x => {

                let value = x[1];

                if (typeof (x[1]) === 'boolean') {
                    value = !!value ? '1' : '0';
                }

                return `${x[0]}${subDelimiter}${value}`;
            })
            .join(delimiter);
    }
}