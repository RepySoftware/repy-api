import { AllowNull, Column, CreatedAt, Table, UpdatedAt } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";

@Table({
    tableName: 'Coordinates',
    timestamps: true
})
export class Coordinates extends Entity<Coordinates> {

    public static create(input: {
        latitude: number,
        longitude: number,
        speed: number
    }): Coordinates {
        return new Coordinates(input);
    }

    @Column
    public latitude: number;

    @Column
    public longitude: number;

    @Column
    public speed: number;

    @AllowNull(false)
    @CreatedAt
    @Column
    public createdAt: Date;

    @AllowNull(false)
    @UpdatedAt
    @Column
    public updatedAt: Date;
}