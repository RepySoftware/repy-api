import { AllowNull, BelongsTo, Column, CreatedAt, Default, ForeignKey, Table, UpdatedAt } from "sequelize-typescript";
import { DeliveryInstructionStatus as DeliveryInstructionStatus } from "../../common/enums/delivery-instruction-status";
import { Entity } from "../abstraction/entity";
import { Employee } from "./employee";
import * as moment from 'moment-timezone';
import { Company } from "./company";
import { Address } from "./address";

@Table({
    tableName: 'DeliveryInstructions',
    timestamps: true
})
export class DeliveryInstruction extends Entity<DeliveryInstruction> {

    public static create(input: {
        employeeDriverId: number;
        description: string;
        status: DeliveryInstructionStatus;
        index: number;
        companyId: number;
        addressId?: number;
        checkableByDriver: boolean;
    }): DeliveryInstruction {
        return new DeliveryInstruction(input);
    }

    @ForeignKey(() => Employee)
    @AllowNull(false)
    @Column
    public employeeDriverId: number;
    @BelongsTo(() => Employee, 'employeeDriverId')
    public employeeDriver: Employee;

    @AllowNull(false)
    @Column
    public description: string;

    @AllowNull(false)
    @Column
    public status: DeliveryInstructionStatus;

    @AllowNull(false)
    @Default(0)
    @Column
    public index: number;

    @ForeignKey(() => Company)
    @AllowNull(false)
    @Column
    public companyId: number;
    @BelongsTo(() => Company, 'companyId')
    public company: Company;

    @ForeignKey(() => Address)
    @Column
    public addressId?: number;
    @BelongsTo(() => Address, 'addressId')
    public address?: Address;

    @AllowNull(false)
    @Column
    public checkableByDriver: boolean;

    @Column
    public startedAt: Date;

    @Column
    public finishedAt: Date;

    @AllowNull(false)
    @CreatedAt
    @Column
    public createdAt: Date;

    @AllowNull(false)
    @UpdatedAt
    @Column
    public updatedAt: Date;

    public setStatus(value: DeliveryInstructionStatus): void {

        switch (value) {

            case DeliveryInstructionStatus.PENDING:
                this.startedAt = null;
                this.finishedAt = null;
                break;

            case DeliveryInstructionStatus.IN_PROGRESS:
                this.startedAt = moment.utc().toDate();
                this.finishedAt = null;
                break;

            case DeliveryInstructionStatus.FINISHED:
                this.finishedAt = moment.utc().toDate();
                break;
        }

        this.status = value;
    }
}