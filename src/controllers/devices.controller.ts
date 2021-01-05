import { NextFunction, Request, Response, Router } from "express";
import { ServicesCollection } from "../providers";
import { TokenHelper } from "../common/helpers/token.helper";
import { checkToken } from "../middlewares/check-token";
import { DeviceService } from "../services/device.service";

const DevicesController = Router();

const deviceService = ServicesCollection.resolve(DeviceService);

DevicesController.get('/', [checkToken], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const devices = await deviceService.get(String(req.query.strategy), TokenHelper.getPayload(res).userId, req.query);
        res.json(devices);
    } catch (error) {
        next(error);
    }
});

export { DevicesController };