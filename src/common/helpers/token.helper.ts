import { Response } from "express";

export class TokenHelper {
    public static getPayload(res: Response): TokenPayload {
        const payload = res.locals.jwtPayload;
        return payload;
    }
}

export interface TokenPayload {
    userId: number;
}