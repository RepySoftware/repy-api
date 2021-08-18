import { Sequelize } from "sequelize-typescript";

export interface DeviceLoadExtras {
    loadExtras(sequelize: Sequelize): Promise<void>;
}