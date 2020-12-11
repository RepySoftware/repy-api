import { RoleType } from "../../common/enums/user-type";
import { User } from "../entities/user";
import * as moment from 'moment-timezone';

export class UserViewModel {
    public id: number;
    public name: string;
    public email: string;
    public documentNumber?: string;
    public phone?: string;
    public roles: RoleType[];
    public createdAt: string;
    public updatedAt: string;

    public static fromEntity(u: User): UserViewModel {

        const user = new UserViewModel();

        user.id = u.id;
        user.name = u.name;
        user.email = u.email;
        user.documentNumber = u.documentNumber;
        user.phone = u.phone;
        user.roles = u.roles;
        user.createdAt = moment(u.createdAt).format('YYYY-MM-DD HH:m:ss');
        user.updatedAt = moment(u.updatedAt).format('YYYY-MM-DD HH:m:ss');

        return user;
    }
}