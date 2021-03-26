import { CustomException } from "./setup/custom.exception";

export class SaleOrderException extends CustomException {

    constructor(message = 'Algo errado com o pedido', statusCode = 400) {
        super(statusCode, message);
    }
}