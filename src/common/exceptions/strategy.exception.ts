import { CustomException } from "./setup/custom.exception";

export class StrategyException extends CustomException {

    constructor(message = 'Algo errado...', statusCode = 400) {
        super(statusCode, message);
    }
}