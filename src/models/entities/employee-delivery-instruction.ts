import { AllowNull, BelongsTo, Column, CreatedAt, Default, ForeignKey, Table, UpdatedAt } from "sequelize-typescript";
import { EmployeeDeliveryInstructionStatus } from "../../common/enums/delivery-instruction-status";
import { Entity } from "../abstraction/entity";
import { DeliveryInstruction } from "./delivery-instruction";
import { Employee } from "./employee";
import * as moment from 'moment-timezone';

@Table({
    tableName: 'EmployeeDeliveryInstructions',
    timestamps: true
})
export class EmployeeDeliveryInstruction extends Entity<EmployeeDeliveryInstruction> {

    @ForeignKey(() => DeliveryInstruction)
    @AllowNull(false)
    @Column
    public deliveryInstructionId: number;
    @BelongsTo(() => DeliveryInstruction, 'deliveryInstructionId')
    public deliveryInstruction: DeliveryInstruction;

    @ForeignKey(() => Employee)
    @AllowNull(false)
    @Column
    public employeeDriverId: number;
    @BelongsTo(() => Employee, 'employeeDriverId')
    public employeeDriver: Employee;

    @AllowNull(false)
    @Column
    public status: EmployeeDeliveryInstructionStatus;

    @AllowNull(false)
    @Default(0)
    @Column
    public index: number;

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

    public setStatus(value: EmployeeDeliveryInstructionStatus): void {

        switch (value) {

            case EmployeeDeliveryInstructionStatus.PENDING:
                this.startedAt = null;
                this.finishedAt = null;
                break;

            case EmployeeDeliveryInstructionStatus.IN_PROGRESS:
                this.startedAt = moment.utc().toDate();
                this.finishedAt = null;
                break;

            case EmployeeDeliveryInstructionStatus.FINISHED:
                this.finishedAt = moment.utc().toDate();
                break;
        }

        this.status = value;
    }
}