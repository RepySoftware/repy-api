import { AllowNull, BelongsTo, Column, CreatedAt, DataType, ForeignKey, Table, UpdatedAt } from "sequelize-typescript";
import { SupplierEmployeeRole } from "../../common/enums/supplier-employee-role";
import { Entity } from "../abstraction/entity";
import { Supplier } from "./supplier";

@Table({
    name: { plural: 'SupplierEmployees' },
    timestamps: true
})
export class SupplierEmployee extends Entity<SupplierEmployee> {

    @ForeignKey(() => Supplier)
    @AllowNull(false)
    @Column(DataType.BIGINT)
    public supplierId: number;
    @BelongsTo(() => Supplier, 'supplierId')
    public supplier: Supplier;

    @AllowNull(false)
    @Column
    public role: SupplierEmployeeRole;

    @AllowNull(false)
    @CreatedAt
    @Column
    public createdAt: Date;

    @AllowNull(false)
    @UpdatedAt
    @Column
    public updatedAt: Date;
}