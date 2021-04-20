import { CustomException } from "./setup/custom.exception";

export class DeliveryException extends CustomException {

    constructor(message = 'Algo errado com a entrega', statusCode = 400) {
        super(statusCode, message);
    }
}