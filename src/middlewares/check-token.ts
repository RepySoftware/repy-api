import { NextFunction, Response, Request } from "express";
import * as jwt from "jsonwebtoken";
import { CONFIG } from '../config';
import { AuthException } from "../common/exceptions/auth.exception";

export function checkToken(req: Request, res: Response, next: NextFunction) {

    const token = <string>req.headers["authorization"];
    let jwtPayload;

    try {
        jwtPayload = <any>jwt.verify(token.split(' ')[1], CONFIG.JWT_SECRET);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        next(new AuthException());
    }

    next();
};