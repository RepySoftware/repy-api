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

export { ServicesCollection };