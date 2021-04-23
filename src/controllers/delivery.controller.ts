import { NextFunction, Request, Response, Router } from "express";
import { ServicesCollection } from "../providers";
import { checkToken } from "../middlewares/check-token";
import { AccessControlRole } from "../common/enums/access-control-role";
import { checkRole } from "../middlewares/check-role";
import { TokenHelper } from "../common/helpers/token.helper";
import { DeliveryService } from "../services/delivery.service";

const DeliveriesController = Router();

const deliveryService = ServicesCollection.resolve(DeliveryService);

DeliveriesController.get('/', [checkToken, checkRole([
    AccessControlRole.EMPLOYEE_MANAGER,
    AccessControlRole.EMPLOYEE_AGENT,
    AccessControlRole.EMPLOYEE_DRIVER
])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deliveries = await deliveryService.get(TokenHelper.getPayload(res).userId, (req.query.strategy as string));
        res.json(deliveries);
    } catch (error) {
        next(error);
    }
});

DeliveriesController.patch('/updateIndex', [checkToken, checkRole([
    AccessControlRole.EMPLOYEE_MANAGER,
    AccessControlRole.EMPLOYEE_AGENT
])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        await deliveryService.updateIndex(req.body, TokenHelper.getPayload(res).userId);
        res.json({ ok: true });
    } catch (error) {
        next(error);
    }
});

DeliveriesController.patch('/updateEmployeeDriver', [checkToken, checkRole([
    AccessControlRole.EMPLOYEE_MANAGER,
    AccessControlRole.EMPLOYEE_AGENT
])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        await deliveryService.updateEmployeeDriver(req.body, TokenHelper.getPayload(res).userId);
        res.json({ ok: true });
    } catch (error) {
        next(error);
    }
});

DeliveriesController.patch('/updateShowObservationToDriver', [checkToken, checkRole([
    AccessControlRole.EMPLOYEE_MANAGER,
    AccessControlRole.EMPLOYEE_AGENT
])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        await deliveryService.updateShowObservationToDriver(req.body, TokenHelper.getPayload(res).userId);
        res.json({ ok: true });
    } catch (error) {
        next(error);
    }
});

DeliveriesController.patch('/start', [checkToken, checkRole(
    AccessControlRole.EMPLOYEE_DRIVER
)], async (req: Request, res: Response, next: NextFunction) => {
    try {
        await deliveryService.start(req.body.id, (req.query.strategy as string), TokenHelper.getPayload(res).userId);
        res.json({ ok: true });
    } catch (error) {
        next(error);
    }
});

DeliveriesController.patch('/finalize', [checkToken, checkRole([
    AccessControlRole.EMPLOYEE_MANAGER,
    AccessControlRole.EMPLOYEE_AGENT,
    AccessControlRole.EMPLOYEE_DRIVER
])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        await deliveryService.finalize(req.body, (req.query.strategy as string), TokenHelper.getPayload(res).userId)
        res.json({ ok: true });
    } catch (error) {
        next(error);
    }
});

export { DeliveriesController };