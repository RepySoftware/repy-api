import { Container } from 'inversify';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { ProductService } from './services/product.service';
import { BrandService } from './services/brand.service';
import { MeasurementUnitService } from './services/measurement-unit.service';
import { PackingService } from './services/packing.service';
import { ProductCategoryService } from './services/product-category.service';
import { SupplierService } from './services/supplier.service';
import { FileService } from './services/file.service';
import { CreditCardService } from './services/credit-card.service';
import { PurchaseOrderService } from './services/purchase-order.service';
import { Database } from './data/database-config';

const ServicesCollection = new Container();

ServicesCollection.bind(Database).toSelf();

ServicesCollection.bind(AuthService).toSelf();
ServicesCollection.bind(UserService).toSelf();
ServicesCollection.bind(ProductService).toSelf();
ServicesCollection.bind(BrandService).toSelf();
ServicesCollection.bind(MeasurementUnitService).toSelf();
ServicesCollection.bind(PackingService).toSelf();
ServicesCollection.bind(ProductCategoryService).toSelf();
ServicesCollection.bind(SupplierService).toSelf();
ServicesCollection.bind(FileService).toSelf();
ServicesCollection.bind(CreditCardService).toSelf();
ServicesCollection.bind(PurchaseOrderService).toSelf();

export { ServicesCollection };