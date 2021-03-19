import { Router } from "express";
import { AuthController } from "./controllers/auth.controller";
import { CompanyBranchesController } from "./controllers/company-branches.controller";
import { DevicesController } from "./controllers/devices.controller";
import { EmployeesController } from "./controllers/employees.controller";
import { PersonsController } from "./controllers/persons.controller";
import { ProductsController } from "./controllers/product.controller";
import { VERSION } from "./version";

const routes = Router();

routes.get('/', (req, res) => res.json({
    name: 'Repy API',
    version: VERSION
}));

routes.use('/auth', AuthController);
routes.use('/persons', PersonsController);
routes.use('/devices', DevicesController);
routes.use('/products', ProductsController);
routes.use('/companyBranches', CompanyBranchesController);
routes.use('/employees', EmployeesController);

export { routes };