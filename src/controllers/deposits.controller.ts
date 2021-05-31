import { NextFunction, Request, Response, Router } from "express";
import { ServicesCollection } from "../providers";
import { TokenHelper } from "../common/helpers/token.helper";
import { checkToken } from "../middlewares/check-token";
import { DepositService } from "../services/deposit.service";

const DepositsController = Router();

const depositService = ServicesCollection.resolve(DepositService);

DepositsController.get('/', [checkToken], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deposits = await depositService.getAll(TokenHelper.getPayload(res).userId);
        res.json(deposits);
    } catch (error) {
        next(error);
    }
});

DepositsController.get('/:id', [checkToken], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deposit = await depositService.getById(Number(req.params.id), TokenHelper.getPayload(res).userId);
        res.json(deposit);
    } catch (error) {
        next(error);
    }
});

DepositsController.post('/', [checkToken], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deposit = await depositService.create(req.body, TokenHelper.getPayload(res).userId);
        res.json(deposit);
    } catch (error) {
        next(error);
    }
});

DepositsController.put('/', [checkToken], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deposit = await depositService.update(req.body, TokenHelper.getPayload(res).userId);
        res.json(deposit);
    } catch (error) {
        next(error);
    }
});

export { DepositsController };