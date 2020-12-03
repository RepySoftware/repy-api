import { AllowNull, Column, CreatedAt, Default, Table, Unique, UpdatedAt } from "sequelize-typescript";
import { RoleType } from "../../common/enums/role-type";
import { Entity } from "../abstraction/entity";

@Table({
    name: { plural: 'Users' },
    timestamps: true,
})
export class User extends Entity<User> {

    @AllowNull(false)
    @Column
    public name: string;

    @AllowNull(false)
    @Unique
    @Column
    public email: string;

    @AllowNull(false)
    @Column
    public password: string;

    @Column
    public documentNumber?: string;

    @Column
    public phone?: string;

    @AllowNull(false)
    @Default('[]')
    @Column({
        field: 'roles'
    })
    private _roles: string;
    public get roles(): RoleType[] {
        return JSON.parse(this._roles);
    }
    public set roles(value: RoleType[]) {
        this._roles = JSON.stringify(value);
    }

    @AllowNull(false)
    @CreatedAt
    @Column
    public createdAt: Date;

    @AllowNull(false)
    @UpdatedAt
    @Column
    public updatedAt: Date;
}