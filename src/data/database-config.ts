import { injectable } from "inversify";
import { CONFIG } from "../config";
import { Sequelize } from 'sequelize-typescript';
import { User } from "../models/entities/user";
import { Address } from "../models/entities/address";
import { Customer } from "../models/entities/customer";
import { Cylinder } from "../models/entities/cylinder";
import { DeviceGasLevel } from "../models/entities/device-gas-level";
import { Device } from "../models/entities/device";
import { NotificationConfiguration } from "../models/entities/notification-configuration";
import { SupplierEmployee } from "../models/entities/supplier-employee";
import { Supplier } from "../models/entities/supplier";
import { UserDevice } from "../models/entities/user-device";

@injectable()
export class Database {
    public readonly sequelize: Sequelize

    constructor() {
        this.sequelize = new Sequelize(CONFIG.DB_SCHEMA, CONFIG.DB_USER, CONFIG.DB_PASSWORD, {
            host: CONFIG.DB_HOST,
            dialect: 'mysql',
            dialectOptions: {
                decimalNumbers: true
            }
        });

        this.sequelize.addModels([
            Address,
            Customer,
            Cylinder,
            DeviceGasLevel,
            Device,
            NotificationConfiguration,
            SupplierEmployee,
            Supplier,
            UserDevice,
            User
        ]);
    }
}