import { Router } from "express";
import { AuthController } from "./controllers/auth.controller";
import { UsersController } from "./controllers/users.controller";
import { ProductsController } from "./controllers/products.controller";
import { BrandsController } from "./controllers/brands.controller";
import { ProductCategoriesController } from "./controllers/product-categories.controller";
import { MeasurementUnitsController } from "./controllers/measurement-units.controller";
import { PackingsController } from "./controllers/packings.controller";
import { SuppliersController } from "./controllers/suppliers.controller";
import { FilesController } from "./controllers/files.controller";
import { VERSION } from "./version";
import { CreditCardsController } from "./controllers/credit-cards.controller";
import { PurchaseOrdersController } from "./controllers/purchase-order.controller";

const routes = Router();

routes.get('/', (req, res) => res.json({
    name: 'Saudefy Market API',
    version: VERSION
}));

routes.use('/files', FilesController);
routes.use('/auth', AuthController);
routes.use('/users', UsersController);
routes.use('/products', ProductsController);
routes.use('/productCategories', ProductCategoriesController);
routes.use('/brands', BrandsController);
routes.use('/measurementUnits', MeasurementUnitsController);
routes.use('/packings', PackingsController);
routes.use('/suppliers', SuppliersController);
routes.use('/creditCards', CreditCardsController);
routes.use('/purchaseOrders', PurchaseOrdersController);

export { routes };