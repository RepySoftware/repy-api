import { DataTypes, ModelAttributes, Sequelize } from "sequelize";
import { DataType } from "sequelize-typescript";

export class ViewPersonSearch {

    public static modelName: string = 'ViewPersonsSearch';

    public static model: ModelAttributes = {

        id: { type: DataType.BIGINT, primaryKey: true },
        name: DataType.STRING,
        tradeName: DataType.STRING,
        documentNumber: DataType.STRING,
        companyId: DataType.BIGINT,
        isSupplier: DataType.BOOLEAN,
        isCustomer: DataType.BOOLEAN,
        isActive: DataType.BOOLEAN,
        phones: DataType.STRING,
        addressDescription: DataType.STRING,
        addressComplement: DataType.STRING,
        addressReferencePoint: DataType.STRING,
        addressSearch: DataType.STRING,
        phonesSearch: DataType.STRING,
        nameSearch: DataType.STRING,
        generalSearch: DataType.STRING
    };

    public static getDefinedModel(sequelize: Sequelize) {
        return sequelize.models[ViewPersonSearch.modelName];
    }
}

export interface ViewPersonSearch {
    id: number;
    name: string;
    tradeName: string;
    documentNumber: string;
    isSupplier: boolean;
    isCustomer: boolean;
    isActive: boolean;
    phones: string;
    addressDescription: string;
    addressComplement: string;
    addressReferencePoint: string;
    addressSearch: string;
    phonesSearch: string;
    nameSearch: string;
    generalSearch: string;
}