import { NextFunction, Request, Response, Router } from "express";
import { ServicesCollection } from "../providers";
import { checkToken } from "../middlewares/check-token";
import { TokenHelper } from "../common/helpers/token.helper";
import { PaymentMethodService } from "../services/payment-method.service";

const PaymentMethodsController = Router();

const paymentMethodService = ServicesCollection.resolve(PaymentMethodService);

PaymentMethodsController.get('/', [checkToken], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const paymentMethods = await paymentMethodService.getAll(TokenHelper.getPayload(res).userId);
        res.json(paymentMethods);
    } catch (error) {
        next(error);
    }
});

export { PaymentMethodsController };