import { CustomException } from "./setup/custom.exception";

export class ParamException extends CustomException {

    constructor(message, statusCode = 400) {
        super(statusCode, message);
    }
}