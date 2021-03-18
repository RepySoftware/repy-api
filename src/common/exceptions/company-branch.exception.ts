import { CustomException } from "./setup/custom.exception";

export class CompanyBranchException extends CustomException {

    constructor(message: string, statusCode = 400) {
        super(statusCode, message);
    }
}