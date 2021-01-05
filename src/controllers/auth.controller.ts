import { NextFunction, Request, Response, Router } from "express";
import { ServicesCollection } from "../providers";
import { AuthService } from "../services/auth.service";
import { TokenHelper } from "../common/helpers/token.helper";
import { checkToken } from "../middlewares/check-token";

const AuthController = Router();

const authService = ServicesCollection.resolve(AuthService);

AuthController.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userToken = await authService.login(req.body);
        res.json(userToken);
    } catch (error) {
        next(error);
    }
});

AuthController.post('/refresh', checkToken, async (rreq: Request, res: Response, next: NextFunction) => {
    try {
        const userToken = await authService.refresh(TokenHelper.getPayload(res));
        res.json(userToken);
    } catch (error) {
        next(error);
    }
});

export { AuthController };