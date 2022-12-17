import { NextFunction, Request, Response, Router } from "express";
import { ServicesCollection } from "../providers";
import { TokenHelper } from "../common/helpers/token.helper";
import { checkToken } from "../middlewares/check-token";
import { DeviceService } from "../services/device.service";
import { HttpHelper } from "../common/helpers/http.helper";
import { HttpResponseFormat } from "../common/enums/http-response-format";
import { checkRole } from "../middlewares/check-role";
import { AccessControlRole } from "../common/enums/access-control-role";

import * as fs from 'fs';

const DevicesController = Router();

const deviceService = ServicesCollection.resolve(DeviceService);

DevicesController.get('/', [checkToken], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const devices = await deviceService.get(req.query.strategy ? String(req.query.strategy) : null, TokenHelper.getPayload(res).userId, req.query);
        res.json(devices);
    } catch (error) {
        next(error);
    }
});

DevicesController.get('/:id', [checkToken], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const device = await deviceService.getById(Number(req.params.id), TokenHelper.getPayload(res).userId);
        res.json(device);
    } catch (error) {
        next(error);
    }
});

DevicesController.put('/', [checkToken], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const device = await deviceService.update(req.body, TokenHelper.getPayload(res).userId);
        res.json(device);
    } catch (error) {
        next(error);
    }
});

DevicesController.get('/historyReads/:deviceId', [checkToken], async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const device = await deviceService.getHistoryReads(
            Number(req.params.deviceId),
            req.query,
            TokenHelper.getPayload(res).userId
        );

        res.json(device);
    } catch (error) {
        next(error);
    }
});

DevicesController.post('/syncData', async (req: Request, res: Response, next: NextFunction) => {
    try {

        // const {
        //     responseFormat,
        //     rawDelimiter,
        //     rawSubDelimiter
        // } = req.query;

        // const result = await deviceService.syncData(req.body);
        // HttpHelper.formatResponse(result, {
        //     format: (responseFormat as HttpResponseFormat) || HttpResponseFormat.JSON,
        //     res,
        //     rawDelimiter: rawDelimiter as string,
        //     rawSubDelimiter: rawSubDelimiter as string
        // });

        // fs.appendFileSync('/home/projects/Repy/repy-devices.log', `${JSON.stringify(req)}`);
        console.log(JSON.stringify(req))

        res.status(500).send();
    } catch (error) {
        next(error);
    }
});

export { DevicesController };