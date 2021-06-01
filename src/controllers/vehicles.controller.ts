import { NextFunction, Request, Response, Router } from "express";
import { ServicesCollection } from "../providers";
import { TokenHelper } from "../common/helpers/token.helper";
import { checkToken } from "../middlewares/check-token";
import { VehicleService } from "../services/vehicle.service";
import { checkRole } from "../middlewares/check-role";
import { AccessControlRole } from "../common/enums/access-control-role";

const VehiclesController = Router();

const vehicleService = ServicesCollection.resolve(VehicleService);

VehiclesController.get('/', [checkToken, checkRole(AccessControlRole.EMPLOYEE)], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vehicles = await vehicleService.getAll(TokenHelper.getPayload(res).userId);
        res.json(vehicles);
    } catch (error) {
        next(error);
    }
});

VehiclesController.get('/:id', [checkToken, checkRole(AccessControlRole.EMPLOYEE)], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vehicle = await vehicleService.getById(Number(req.params.id), TokenHelper.getPayload(res).userId);
        res.json(vehicle);
    } catch (error) {
        next(error);
    }
});

VehiclesController.post('/', [checkToken, checkRole(AccessControlRole.EMPLOYEE_AGENT)], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vehicle = await vehicleService.create(req.body, TokenHelper.getPayload(res).userId);
        res.json(vehicle);
    } catch (error) {
        next(error);
    }
});

VehiclesController.put('/', [checkToken, checkRole(AccessControlRole.EMPLOYEE_AGENT)], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vehicle = await vehicleService.update(req.body, TokenHelper.getPayload(res).userId);
        res.json(vehicle);
    } catch (error) {
        next(error);
    }
});

export { VehiclesController };