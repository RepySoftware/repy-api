import { Router } from "express";
import { AuthController } from "./controllers/auth.controller";
import { DevicesController } from "./controllers/devices.controller";
import { VERSION } from "./version";

const routes = Router();

routes.get('/', (req, res) => res.json({
    name: 'Repy API',
    version: VERSION
}));

routes.use('/auth', AuthController);
routes.use('/devices', DevicesController);

export { routes };