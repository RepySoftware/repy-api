import { Model, PrimaryKey, AutoIncrement, Column, AllowNull } from "sequelize-typescript";

export abstract class Entity<T> extends Model<T>{
    
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column({
        field: 'ID'
    })
    public id: number;
}