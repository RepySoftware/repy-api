import { NextFunction, Request, Response, Router } from "express";
import { ServicesCollection } from "../providers";
import { checkToken } from "../middlewares/check-token";
import { AccessControlRole } from "../common/enums/access-control-role";
import { checkRole } from "../middlewares/check-role";
import { TokenHelper } from "../common/helpers/token.helper";
import { DeliveryInstructionService } from "../services/delivery-instruction.service";

const DeliveryInstructionsController = Router();

const deliveryInstructionService = ServicesCollection.resolve(DeliveryInstructionService);

DeliveryInstructionsController.get('/', [checkToken, checkRole([
    AccessControlRole.EMPLOYEE_MANAGER,
    AccessControlRole.EMPLOYEE_AGENT
])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deliveryInstructions = await deliveryInstructionService.getAll(TokenHelper.getPayload(res).userId);
        res.json(deliveryInstructions);
    } catch (error) {
        next(error);
    }
});

export { DeliveryInstructionsController };