import { CustomException } from "./setup/custom.exception";

export class NotFoundException extends CustomException {

    constructor(message = 'Não encontrado', statusCode = 404) {
        super(statusCode, message);
    }
}