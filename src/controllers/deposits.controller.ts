import { NextFunction, Request, Response, Router } from "express";
import { ServicesCollection } from "../providers";
import { TokenHelper } from "../common/helpers/token.helper";
import { checkToken } from "../middlewares/check-token";
import { DepositService } from "../services/deposit.service";
import { checkRole } from "../middlewares/check-role";
import { AccessControlRole } from "../common/enums/access-control-role";

const DepositsController = Router();

const depositService = ServicesCollection.resolve(DepositService);

DepositsController.get('/', [checkToken, checkRole(AccessControlRole.EMPLOYEE_AGENT)], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deposits = await depositService.getAll(req.query, TokenHelper.getPayload(res).userId);
        res.json(deposits);
    } catch (error) {
        next(error);
    }
});

DepositsController.get('/:id', [checkToken, checkRole(AccessControlRole.EMPLOYEE_AGENT)], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deposit = await depositService.getById(Number(req.params.id), TokenHelper.getPayload(res).userId);
        res.json(deposit);
    } catch (error) {
        next(error);
    }
});

DepositsController.post('/', [checkToken, checkRole(AccessControlRole.EMPLOYEE_AGENT)], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deposit = await depositService.create(req.body, TokenHelper.getPayload(res).userId);
        res.json(deposit);
    } catch (error) {
        next(error);
    }
});

DepositsController.put('/', [checkToken, checkRole(AccessControlRole.EMPLOYEE_AGENT)], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deposit = await depositService.update(req.body, TokenHelper.getPayload(res).userId);
        res.json(deposit);
    } catch (error) {
        next(error);
    }
});

export { DepositsController };