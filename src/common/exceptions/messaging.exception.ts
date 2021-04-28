
import { CustomException } from "./setup/custom.exception";

export class MessagingException extends CustomException {

    constructor(message = 'Algo errado no envio de mensagens', statusCode = 400) {
        super(statusCode, message);
    }
}