import { CustomException } from "./setup/custom.exception";

export class NotAuthorizedException extends CustomException {

    constructor(message = 'Não autorizado', statusCode = 404) {
        super(statusCode, message);
    }
}