import { User } from "../entities/user";
import * as moment from 'moment-timezone';
import { PersonViewModel } from "./person.view-model";
import { DEFAULT_DATETIME_FORMAT } from "../../config";

export class UserViewModel {

    public id: number;
    public person: PersonViewModel;
    public username: string;
    public password: string;
    public isAdmin: boolean;
    public isActive: boolean;
    public createdAt: string;
    public updatedAt: string;

    public static fromEntity(u: User): UserViewModel {

        const user = new UserViewModel();

        user.id = u.id;
        user.person = u.person ? PersonViewModel.fromEntity(u.person) : null;
        user.username = u.username;
        user.isAdmin = u.isAdmin;
        user.isActive = u.isActive;
        user.createdAt = moment.utc(u.createdAt).local().format(DEFAULT_DATETIME_FORMAT);
        user.updatedAt = moment.utc(u.updatedAt).local().format(DEFAULT_DATETIME_FORMAT);

        return user;
    }
}