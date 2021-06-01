import { NextFunction, Request, Response, Router } from "express";
import { ServicesCollection } from "../providers";
import { checkToken } from "../middlewares/check-token";
import { AccessControlRole } from "../common/enums/access-control-role";
import { checkRole } from "../middlewares/check-role";
import { TokenHelper } from "../common/helpers/token.helper";
import { DeliveryInstructionService } from "../services/delivery-instruction.service";

const DeliveryInstructionsController = Router();

const deliveryInstructionService = ServicesCollection.resolve(DeliveryInstructionService);

DeliveryInstructionsController.get('/default', [checkToken, checkRole(AccessControlRole.EMPLOYEE_AGENT)], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const defaultDeliveryInstructions = await deliveryInstructionService.getDefault(TokenHelper.getPayload(res).userId);
        res.json(defaultDeliveryInstructions);
    } catch (error) {
        next(error);
    }
});

DeliveryInstructionsController.get('/:id', [checkToken, checkRole(AccessControlRole.EMPLOYEE_AGENT)], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const defaultDeliveryInstruction = await deliveryInstructionService.getById(Number(req.params.id), TokenHelper.getPayload(res).userId);
        res.json(defaultDeliveryInstruction);
    } catch (error) {
        next(error);
    }
});

DeliveryInstructionsController.post('/', [checkToken, checkRole(AccessControlRole.EMPLOYEE_AGENT)], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const defaultDeliveryInstruction = await deliveryInstructionService.create(req.body, TokenHelper.getPayload(res).userId);
        res.json(defaultDeliveryInstruction);
    } catch (error) {
        next(error);
    }
});

DeliveryInstructionsController.delete('/:id', [checkToken, checkRole(AccessControlRole.EMPLOYEE_AGENT)], async (req: Request, res: Response, next: NextFunction) => {
    try {
        await deliveryInstructionService.delete(Number(req.params.id), TokenHelper.getPayload(res).userId);
        res.json({ ok: true });
    } catch (error) {
        next(error);
    }
});

export { DeliveryInstructionsController };