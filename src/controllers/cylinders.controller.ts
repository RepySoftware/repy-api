import { NextFunction, Request, Response, Router } from "express";
import { ServicesCollection } from "../providers";
import { checkToken } from "../middlewares/check-token";
import { CylinderService } from "../services/cylinder.service";
import { TokenHelper } from "../common/helpers/token.helper";

const CylindersController = Router();

const cylinderService = ServicesCollection.resolve(CylinderService);

CylindersController.get('/', [checkToken], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cylinders = await cylinderService.getAll(TokenHelper.getPayload(res).userId);
        res.json(cylinders);
    } catch (error) {
        next(error);
    }
});

export { CylindersController };