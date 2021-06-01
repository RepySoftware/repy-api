import { NextFunction, Request, Response, Router } from "express";
import { ServicesCollection } from "../providers";
import { checkToken } from "../middlewares/check-token";
import { AccessControlRole } from "../common/enums/access-control-role";
import { checkRole } from "../middlewares/check-role";
import { TokenHelper } from "../common/helpers/token.helper";
import { SaleOrderService } from "../services/sale-order.service";

const SaleOrdersController = Router();

const saleOrderService = ServicesCollection.resolve(SaleOrderService);

SaleOrdersController.get('/', [checkToken, checkRole([AccessControlRole.EMPLOYEE_AGENT])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const saleOrders = await saleOrderService.getAll(req.query, TokenHelper.getPayload(res).userId);
        res.json(saleOrders);
    } catch (error) {
        next(error);
    }
});

SaleOrdersController.get('/driver', [checkToken, checkRole(AccessControlRole.EMPLOYEE_DRIVER)], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const saleOrders = await saleOrderService.getByDriver(req.query, TokenHelper.getPayload(res).userId);
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

SaleOrdersController.put('/', [checkToken, checkRole([AccessControlRole.EMPLOYEE_MANAGER, AccessControlRole.EMPLOYEE_AGENT])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const saleOrder = await saleOrderService.update(req.body, TokenHelper.getPayload(res).userId);
        res.json(saleOrder);
    } catch (error) {
        next(error);
    }
});

SaleOrdersController.delete('/:id', [checkToken, checkRole([AccessControlRole.EMPLOYEE_MANAGER])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        await saleOrderService.delete(Number(req.params.id), TokenHelper.getPayload(res).userId);
        res.json({ ok: true });
    } catch (error) {
        next(error);
    }
});

export { SaleOrdersController };