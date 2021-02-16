import { injectable } from "inversify";
import { CONFIG } from "../config";
import { Sequelize } from 'sequelize-typescript';
import { User } from "../models/entities/user";
import { Address } from "../models/entities/address";
import { Cylinder } from "../models/entities/cylinder";
import { DeviceGasLevel } from "../models/entities/device-gas-level";
import { Device } from "../models/entities/device";
import { NotificationConfiguration } from "../models/entities/notification-configuration";
import { Person } from "../models/entities/person";
import { PersonPhone } from "../models/entities/person-phone";
import { Company } from "../models/entities/company";
import { CompanyBranchItemPrice } from "../models/entities/company-branch-item-price";
import { CompanyBranchItem } from "../models/entities/company-branch-item";
import { CompanyBranch } from "../models/entities/company-branch";
import { Employee } from "../models/entities/employee";
import { ItemCategory } from "../models/entities/item-category";
import { Item } from "../models/entities/item";
import { SaleOrderItem } from "../models/entities/sale-order-item";
import { SaleOrder } from "../models/entities/sale-order";

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
            CompanyBranchItemPrice,
            CompanyBranchItem,
            CompanyBranch,
            Company,
            Cylinder,
            DeviceGasLevel,
            Device,
            Employee,
            ItemCategory,
            Item,
            PersonPhone,
            Person,
            SaleOrderItem,
            SaleOrder,
            NotificationConfiguration,
            User
        ]);
    }
}