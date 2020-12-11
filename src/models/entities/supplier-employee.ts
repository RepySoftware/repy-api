import { AllowNull, BelongsTo, Column, CreatedAt, DataType, ForeignKey, Table, UpdatedAt } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";
import { Address } from "./address";

@Table({
    name: { plural: 'SupplierEmployees' },
})
export class SupplierEmployee extends Entity<SupplierEmployee> {

  d=
}