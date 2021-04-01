import { NextFunction, Request, Response, Router } from "express";
import { ServicesCollection } from "../providers";
import { checkToken } from "../middlewares/check-token";
import { AccessControlRole } from "../common/enums/access-control-role";
import { checkRole } from "../middlewares/check-role";
import { TokenHelper } from "../common/helpers/token.helper";
import { DashboardService } from "../services/dashboard.service";

const DashboardController = Router();

const dashboardService = ServicesCollection.resolve(DashboardService);

DashboardController.get('/salesByDay', [checkToken, checkRole([AccessControlRole.EMPLOYEE_MANAGER, AccessControlRole.EMPLOYEE_AGENT])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await dashboardService.getSalesByDay(req.query as any, TokenHelper.getPayload(res).userId);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

export { DashboardController };