import { Response } from "express";
import { HttpResponseFormat } from "../enums/http-response-format";
import { ObjectHelper } from "./object.helper";

export abstract class HttpHelper {

    private static formatter = {
        [HttpResponseFormat.JSON]: (
            value: any,
            options: {
                res?: Response;
            } = {}
        ) => {
            if (options.res)
                options.res.send(value);

            return value;
        },
        [HttpResponseFormat.RAW]: (
            value: any,
            options: {
                res?: Response;
                delimiter?: string;
                subDelimiter?: string;
            } = {}
        ) => {
            const raw = ObjectHelper.objectToRawValues(value, options.delimiter, options.subDelimiter);

            if (options.res)
                options.res.send(raw);

            return raw;
        }
    }

    public static formatResponse(
        value: any,
        options: {
            format: HttpResponseFormat | string;
            rawDelimiter?: string;
            rawSubDelimiter?: string;
            res?: Response;
        }
    ): any {
        return HttpHelper.formatter[options.format.toUpperCase()](value, {
            res: options.res,
            delimiter: options.rawDelimiter,
            subDelimiter: options.rawSubDelimiter
        });
    }
}