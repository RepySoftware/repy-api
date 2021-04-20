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
import { CompanyBranchProductPrice } from "../models/entities/company-branch-product-price";
import { CompanyBranchProduct } from "../models/entities/company-branch-product";
import { CompanyBranch } from "../models/entities/company-branch";
import { Employee } from "../models/entities/employee";
import { ProductCategory } from "../models/entities/product-category";
import { Product } from "../models/entities/product";
import { SaleOrderProduct } from "../models/entities/sale-order-product";
import { SaleOrder } from "../models/entities/sale-order";
import { ViewPersonSearch } from "../models/entities/views/view-person-search";
import { PaymentMethod } from "../models/entities/payment-method";
import { DeliveryInstruction } from "../models/entities/delivery-instruction";
import { EmployeeDeliveryInstruction } from "../models/entities/employee-delivery-instruction";

@injectable()
export class Database {
    public readonly sequelize: Sequelize

    constructor() {
        this.sequelize = new Sequelize(CONFIG.DB_SCHEMA, CONFIG.DB_USER, CONFIG.DB_PASSWORD, {
            host: CONFIG.DB_HOST,
            dialect: 'mysql',
            dialectOptions: {
                decimalNumbers: true,
                useUTC: true, // for reading from database,
            },
            timezone: '+00:00', // for writing to database
        });

        this.sequelize.addModels([
            Address,
            CompanyBranchProductPrice,
            CompanyBranchProduct,
            CompanyBranch,
            Company,
            Cylinder,
            DeviceGasLevel,
            Device,
            Employee,
            PaymentMethod,
            ProductCategory,
            Product,
            PersonPhone,
            Person,
            SaleOrderProduct,
            SaleOrder,
            NotificationConfiguration,
            User,
            DeliveryInstruction,
            EmployeeDeliveryInstruction
        ]);

        this.sequelize.define(ViewPersonSearch.modelName, ViewPersonSearch.model, {
            timestamps: false,
            tableName: ViewPersonSearch.modelName
        });
    }
}