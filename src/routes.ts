import { Router } from "express";
import { AuthController } from "./controllers/auth.controller";
import { CompanyBranchesController } from "./controllers/company-branches.controller";
import { DashboardController } from "./controllers/dashboard.controller";
import { DeliveryInstructionsController } from "./controllers/delivery-instructions.controller";
import { DeliveriesController } from "./controllers/delivery.controller";
import { DepositsController } from "./controllers/deposits.controller";
import { DevicesController } from "./controllers/devices.controller";
import { EmployeesController } from "./controllers/employees.controller";
import { PaymentMethodsController } from "./controllers/payment-methods.controller";
import { PersonsController } from "./controllers/persons.controller";
import { ProductsController } from "./controllers/product.controller";
import { SaleOrdersController } from "./controllers/sale-orders.controller";
import { VehiclesController } from "./controllers/vehicles.controller";
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
routes.use('/paymentMethods', PaymentMethodsController);
routes.use('/saleOrders', SaleOrdersController);
routes.use('/dashboard', DashboardController);
routes.use('/deliveries', DeliveriesController);
routes.use('/deliveryInstructions', DeliveryInstructionsController);
routes.use('/deposits', DepositsController);
routes.use('/vehicles', VehiclesController);

export { routes };