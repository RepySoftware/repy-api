import { NextFunction, Request, Response, Router } from "express";
import { ServicesCollection } from "../providers";
import { checkToken } from "../middlewares/check-token";
import { AccessControlRole } from "../common/enums/access-control-role";
import { checkRole } from "../middlewares/check-role";
import { TokenHelper } from "../common/helpers/token.helper";
import { SaleOrderService } from "../services/sale-order.service";

const SaleOrdersController = Router();

const saleOrderService = ServicesCollection.resolve(SaleOrderService);

SaleOrdersController.get('/', [checkToken, checkRole([AccessControlRole.EMPLOYEE_MANAGER, AccessControlRole.EMPLOYEE_AGENT])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const saleOrders = await saleOrderService.getAll(req.query, TokenHelper.getPayload(res).userId);
        res.json(saleOrders);
    } catch (error) {
        next(error);
    }
});

SaleOrdersController.get('/:id', [checkToken, checkRole([AccessControlRole.EMPLOYEE_MANAGER, AccessControlRole.EMPLOYEE_AGENT])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const saleOrder = await saleOrderService.getById(Number(req.params.id), TokenHelper.getPayload(res).userId);
        res.json(saleOrder);
    } catch (error) {
        next(error);
    }
});

SaleOrdersController.post('/', [checkToken, checkRole([AccessControlRole.EMPLOYEE_MANAGER, AccessControlRole.EMPLOYEE_AGENT])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const saleOrder = await saleOrderService.create(req.body, TokenHelper.getPayload(res).userId);
        res.json(saleOrder);
    } catch (error) {
        next(error);
    }
});

SaleOrdersController.patch('/updateIndex', [checkToken, checkRole([AccessControlRole.EMPLOYEE_MANAGER, AccessControlRole.EMPLOYEE_AGENT])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        await saleOrderService.updateIndex(req.body, TokenHelper.getPayload(res).userId);
        res.json({ ok: true });
    } catch (error) {
        next(error);
    }
});


SaleOrdersController.patch('/updateEmployeeDriver', [checkToken, checkRole([AccessControlRole.EMPLOYEE_MANAGER, AccessControlRole.EMPLOYEE_AGENT])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        await saleOrderService.updateEmployeeDriver(req.body, TokenHelper.getPayload(res).userId);
        res.json({ ok: true });
    } catch (error) {
        next(error);
    }
});

SaleOrdersController.post('/confirmDelivery', [checkToken, checkRole([AccessControlRole.EMPLOYEE_MANAGER, AccessControlRole.EMPLOYEE_AGENT])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        await saleOrderService.confirmDelivery(req.body, TokenHelper.getPayload(res).userId);
        res.json({ ok: true });
    } catch (error) {
        next(error);
    }
});

export { SaleOrdersController };