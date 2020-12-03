import { CustomException } from "./setup/custom.exception";

export class AuthException extends CustomException {

    constructor(message = 'Erro na autenticação', statusCode = 401) {
        super(statusCode, message);
    }
}