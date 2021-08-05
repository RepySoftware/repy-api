import { CustomException } from "../exceptions/setup/custom.exception";

export function onError(error, req, res, next) {
    console.error(error);

    let message: string;
    let statusCode: number;

    if (error instanceof CustomException) {
        message = error.message;
        statusCode = error.statusCode;
    } else if (error.sql) {
        const sqlMessage = error.original.sqlMessage;

        message = `Algo errado 🙁 - [${sqlMessage || 'sql_error'}]`;
        statusCode = 400;
    } else {
        message = 'Algo errado 🙁';
        statusCode = 400;
    }

    res.status(statusCode)
        .json({
            statusCode,
            message,
            stack: error.stack
        });
}