import { Container } from 'inversify';
import { AuthService } from './services/auth.service';
import { Database } from './data/database-config';
import { DeviceService } from './services/device.service';
import { PersonService } from './services/person.service';
import { ProductService } from './services/product.service';
import { CompanyBranchService } from './services/company-branch.service';
import { EmployeeService } from './services/employee.service';
import { UserService } from './services/user.service';
import { PaymentMethodService } from './services/payment-method.service';
import { SaleOrderService } from './services/sale-order.service';
import { DashboardService } from './services/dashboard.service';
import { MessagingService } from './services/messaging.service';
import { DeliveryInstructionService } from './services/delivery-instruction.service';
import { DeliveryService } from './services/delivery.service';
import { GeocodingService } from './services/geocoding.service';
import { DepositService } from './services/deposit.service';
import { VehicleService } from './services/vehicle.service';
import { StockService } from './services/stock.service';
import { NotificationService } from './services/notification.service';

const ServicesCollection = new Container();

ServicesCollection.bind(Database).toSelf();

ServicesCollection.bind(AuthService).toSelf();
ServicesCollection.bind(DeviceService).toSelf();
ServicesCollection.bind(PersonService).toSelf();
ServicesCollection.bind(ProductService).toSelf();
ServicesCollection.bind(CompanyBranchService).toSelf();
ServicesCollection.bind(EmployeeService).toSelf();
ServicesCollection.bind(UserService).toSelf();
ServicesCollection.bind(PaymentMethodService).toSelf();
ServicesCollection.bind(SaleOrderService).toSelf();
ServicesCollection.bind(DashboardService).toSelf();
ServicesCollection.bind(MessagingService).toSelf();
ServicesCollection.bind(DeliveryService).toSelf();
ServicesCollection.bind(DeliveryInstructionService).toSelf();
ServicesCollection.bind(GeocodingService).toSelf();
ServicesCollection.bind(DepositService).toSelf();
ServicesCollection.bind(VehicleService).toSelf();
ServicesCollection.bind(StockService).toSelf();
ServicesCollection.bind(NotificationService).toSelf();

export { ServicesCollection };