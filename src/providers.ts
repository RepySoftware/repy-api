import { Container } from 'inversify';
import { AuthService } from './services/auth.service';
import { Database } from './data/database-config';

const ServicesCollection = new Container();

ServicesCollection.bind(Database).toSelf();

ServicesCollection.bind(AuthService).toSelf();

export { ServicesCollection };