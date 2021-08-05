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

ProductsController.get('/categories', [checkToken, checkRole([AccessControlRole.EMPLOYEE_AGENT])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await productService.getCategories(TokenHelper.getPayload(res).userId);
        res.json(categories);
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

ProductsController.get('/:id', [checkToken, checkRole([AccessControlRole.EMPLOYEE_AGENT])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await productService.getById(Number(req.params.id), TokenHelper.getPayload(res).userId);
        res.json(product);
    } catch (error) {
        next(error);
    }
});

ProductsController.get('/', [checkToken, checkRole([AccessControlRole.EMPLOYEE_AGENT])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await productService.getAll(req.query, TokenHelper.getPayload(res).userId);
        res.json(products);
    } catch (error) {
        next(error);
    }
});

ProductsController.get('/:productId/prices', [checkToken, checkRole([AccessControlRole.EMPLOYEE_AGENT])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prices = await productService.getPrices(Number(req.params.productId), TokenHelper.getPayload(res).userId);
        res.json(prices);
    } catch (error) {
        next(error);
    }
});

ProductsController.get('/:productId/prices/:companyBranchProductPriceId', [checkToken, checkRole([AccessControlRole.EMPLOYEE_AGENT])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const price = await productService.getPriceById(
            Number(req.params.productId),
            Number(req.params.companyBranchProductPriceId),
            TokenHelper.getPayload(res).userId
        );
        res.json(price);
    } catch (error) {
        next(error);
    }
});

ProductsController.post('/prices', [checkToken, checkRole([AccessControlRole.EMPLOYEE_AGENT])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const price = await productService.createPrice(req.body, TokenHelper.getPayload(res).userId);
        res.json(price);
    } catch (error) {
        next(error);
    }
});

ProductsController.put('/prices', [checkToken, checkRole([AccessControlRole.EMPLOYEE_AGENT])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const price = await productService.updatePrice(req.body, TokenHelper.getPayload(res).userId);
        res.json(price);
    } catch (error) {
        next(error);
    }
});

export { ProductsController };