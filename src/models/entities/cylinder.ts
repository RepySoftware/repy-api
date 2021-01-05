import { AllowNull, Column, Table } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";

@Table({
    tableName: 'Cylinders',
    timestamps: false
})
export class Cylinder extends Entity<Cylinder> {

    @AllowNull(false)
    @Column
    public name: string;

    @AllowNull(false)
    @Column
    public defaultCylinderWeight: number;

    @AllowNull(false)
    @Column
    public defaultContentWeight: number;
}