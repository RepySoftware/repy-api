import { NextFunction, Request, Response, Router } from "express";
import { ServicesCollection } from "../providers";
import { checkToken } from "../middlewares/check-token";
import { TokenHelper } from "../common/helpers/token.helper";
import { PaymentMethodService } from "../services/payment-method.service";
import { AccessControlRole } from "../common/enums/access-control-role";
import { checkRole } from "../middlewares/check-role";

const PaymentMethodsController = Router();

const paymentMethodService = ServicesCollection.resolve(PaymentMethodService);

PaymentMethodsController.get('/', [checkToken, checkRole([
    AccessControlRole.EMPLOYEE
])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const paymentMethods = await paymentMethodService.getAll(TokenHelper.getPayload(res).userId);
        res.json(paymentMethods);
    } catch (error) {
        next(error);
    }
});

export { PaymentMethodsController };