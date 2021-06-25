import { Request, Response, NextFunction } from "express";
import { AuthException } from "../common/exceptions/auth.exception";
import { ApiKey } from "../models/entities/api-keys";

export async function checkApiKey(req: Request, res: Response, next: NextFunction) {

    const key = <string>req.query.apiKey;

    if (!key)
        throw new AuthException('Chave de API é obrigatória');

    try {

        const apiKey = await ApiKey.findOne({
            where: { key }
        });

        if (!apiKey)
            throw new AuthException('Chave de API inválida');

    } catch (error) {
        next(new AuthException());
    }

    next();
};