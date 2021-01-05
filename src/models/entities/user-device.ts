import { AllowNull, BelongsTo, Column, DataType, ForeignKey, Table } from "sequelize-typescript";
import { UserDeviceRole } from "../../common/enums/user-device-role";
import { Entity } from "../abstraction/entity";
import { Device } from "./device";
import { User } from "./user";

@Table({
    tableName: 'UsersDevices',
    timestamps: false
})
export class UserDevice extends Entity<UserDevice> {

    @AllowNull(false)
    @ForeignKey(() => User)
    @Column(DataType.BIGINT)
    public userId: number;
    @BelongsTo(() => User, 'userId')
    public user: User;

    @AllowNull(false)
    @ForeignKey(() => Device)
    @Column(DataType.BIGINT)
    public deviceId: number;
    @BelongsTo(() => Device, 'deviceId')
    public device: Device;

    @AllowNull(false)
    @Column
    public role: UserDeviceRole;
}