import { AllowNull, BelongsTo, Column, DataType, ForeignKey, Table } from "sequelize-typescript";
import { PersonDeviceRole } from "../../common/enums/person-device-role";
import { Entity } from "../abstraction/entity";
import { Device } from "./device";
import { Person } from "./person";

@Table({
    tableName: 'PersonsDevices',
    timestamps: false
})
export class PersonDevice extends Entity<PersonDevice> {

    @AllowNull(false)
    @ForeignKey(() => Person)
    @Column
    public personId: number;
    @BelongsTo(() => Person, 'personId')
    public person: Person;

    @AllowNull(false)
    @ForeignKey(() => Device)
    @Column
    public deviceId: number;
    @BelongsTo(() => Device, 'deviceId')
    public device: Device;

    @AllowNull(false)
    @Column
    public role: PersonDeviceRole;
}