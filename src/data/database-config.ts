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
import { DefaultDeliveryInstruction } from "../models/entities/default-delivery-instruction";
import { SaleOrderPayment } from "../models/entities/sale-order-payment";
import { Coordinates } from "../models/entities/coordinates";
import { Deposit } from "../models/entities/deposit";
import { Vehicle } from "../models/entities/vehicle";
import { StockPost } from "../models/entities/stock-post";
import { DepositProduct } from "../models/entities/deposit-product";
import { RelatedProduct } from "../models/entities/related-product";
import { DeviceGasLevelHistoryRead } from "../models/entities/device-gas-level-history-read";
import { ApiKey } from "../models/entities/api-keys";
import { PersonCustomerNextGasSale } from "../models/entities/person-customer-next-gas-sale";
import { ViewDeviceGasLevelDangerDay } from "../models/entities/views/view-device-gas-level-danger-day";

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
            DefaultDeliveryInstruction,
            SaleOrderPayment,
            Coordinates,
            Deposit,
            Vehicle,
            StockPost,
            DepositProduct,
            RelatedProduct,
            DeviceGasLevelHistoryRead,
            ApiKey,
            PersonCustomerNextGasSale
        ]);

        this.sequelize.define(ViewPersonSearch.modelName, ViewPersonSearch.model, {
            timestamps: false,
            tableName: ViewPersonSearch.modelName
        });

        this.sequelize.define(ViewDeviceGasLevelDangerDay.modelName, ViewDeviceGasLevelDangerDay.model, {
            timestamps: false,
            tableName: ViewDeviceGasLevelDangerDay.modelName
        });
    }
}