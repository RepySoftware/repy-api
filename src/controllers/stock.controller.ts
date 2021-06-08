import { NextFunction, Request, Response, Router } from "express";
import { ServicesCollection } from "../providers";
import { checkToken } from "../middlewares/check-token";
import { AccessControlRole } from "../common/enums/access-control-role";
import { checkRole } from "../middlewares/check-role";
import { TokenHelper } from "../common/helpers/token.helper";
import { StockService } from "../services/stock.service";

const StockController = Router();

const stockService = ServicesCollection.resolve(StockService);

StockController.get('/posts', [checkToken, checkRole([AccessControlRole.EMPLOYEE_AGENT])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const posts = await stockService.getPosts(req.query as any, TokenHelper.getPayload(res).userId);
        res.json(posts);
    } catch (error) {
        next(error);
    }
});

StockController.get('/deposits', [checkToken, checkRole([AccessControlRole.EMPLOYEE_AGENT])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deposits = await stockService.getDeposits(Number(req.query.companyBranchId), TokenHelper.getPayload(res).userId);
        res.json(deposits);
    } catch (error) {
        next(error);
    }
});

StockController.get('/deposits/:depositId', [checkToken, checkRole([AccessControlRole.EMPLOYEE_AGENT])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deposit = await stockService.getDepositById(Number(req.params.depositId), TokenHelper.getPayload(res).userId);
        res.json(deposit);
    } catch (error) {
        next(error);
    }
});

StockController.post('/depositTransfer', [checkToken, checkRole([AccessControlRole.EMPLOYEE_AGENT])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        await stockService.depositTransfer(req.body, TokenHelper.getPayload(res).userId);
        res.json({ ok: true });
    } catch (error) {
        next(error);
    }
});

StockController.post('/posts', [checkToken, checkRole([AccessControlRole.EMPLOYEE_AGENT])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const stockPosts = await stockService.createPosts(req.body, TokenHelper.getPayload(res).userId);
        res.json(stockPosts);
    } catch (error) {
        next(error);
    }
});

StockController.delete('/posts/:postId', [checkToken, checkRole([AccessControlRole.EMPLOYEE_AGENT])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        await stockService.deletePost(Number(req.params.postId), TokenHelper.getPayload(res).userId);
        res.json({ ok: true });
    } catch (error) {
        next(error);
    }
});

export { StockController };