import { NextFunction, Request, Response, Router } from "express";
import { ServicesCollection } from "../providers";
import { checkToken } from "../middlewares/check-token";
import { AccessControlRole } from "../common/enums/access-control-role";
import { checkRole } from "../middlewares/check-role";
import { TokenHelper } from "../common/helpers/token.helper";
import { ProductService } from "../services/product.service";

const ProductsController = Router();

const productService = ServicesCollection.resolve(ProductService);

ProductsController.post('/', [checkToken, checkRole([AccessControlRole.EMPLOYEE_AGENT])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await productService.create(req.body, TokenHelper.getPayload(res).userId);
        res.json(product);
    } catch (error) {
        next(error);
    }
});

ProductsController.put('/', [checkToken, checkRole([AccessControlRole.EMPLOYEE_AGENT])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await productService.update(req.body, TokenHelper.getPayload(res).userId);
        res.json(product);
    } catch (error) {
        next(error);
    }
});

ProductsController.get('/sales', [checkToken, checkRole([AccessControlRole.EMPLOYEE_AGENT])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await productService.getAllForSales(req.query, Number(req.query.companyBranchId), TokenHelper.getPayload(res).userId);
        res.json(products);
    } catch (error) {
        next(error);
    }
});

ProductsController.get('/:companyBranchProductId/related', [checkToken, checkRole([AccessControlRole.EMPLOYEE_AGENT])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await productService.getRelated(Number(req.params.companyBranchProductId), TokenHelper.getPayload(res).userId);
        res.json(products);
    } catch (error) {
        next(error);
    }
});

export { ProductsController };