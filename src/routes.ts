import { Router } from "express";
import { AuthController } from "./controllers/auth.controller";
import { VERSION } from "./version";

const routes = Router();

routes.get('/', (req, res) => res.json({
    name: 'Repy API',
    version: VERSION
}));

routes.use('/auth', AuthController);

export { routes };