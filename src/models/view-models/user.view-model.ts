import { User } from "../entities/user";
import { PersonViewModel } from "./person.view-model";
import { DateHelper } from "../../common/helpers/date.helper";
import { EmployeeViewModel } from "./employee.view-model";

export class UserViewModel {

    public id: number;
    public person?: PersonViewModel;
    public employee?: EmployeeViewModel;
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
        user.employee = u.employee ? EmployeeViewModel.fromEntity(u.employee) : null;
        user.username = u.username;
        user.isAdmin = u.isAdmin;
        user.isActive = u.isActive;
        user.createdAt = DateHelper.toStringViewModel(u.createdAt);
        user.updatedAt = DateHelper.toStringViewModel(u.updatedAt);

        return user;
    }
}