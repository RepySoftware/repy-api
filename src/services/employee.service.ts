import { inject, injectable } from "inversify";
import { Op, WhereOptions } from "sequelize";
import { NotFoundException } from "../common/exceptions/not-fount.exception";
import { Database } from "../data/database-config";
import { Employee } from "../models/entities/employee";
import { User } from "../models/entities/user";
import { EmployeeFilter } from "../models/input-models/filter/employee.filter";
import { CompanyBranchProductViewModel } from "../models/view-models/company-branch-product.view-model";
import { EmployeeViewModel } from "../models/view-models/employee.view-model";
import { UserService } from "./user.service";

@injectable()
export class EmployeeService {

    constructor(
        @inject(UserService) private _userService: UserService
    ) { }

    public async getAll(input: EmployeeFilter, userId: number): Promise<EmployeeViewModel[]> {

        const user = await this._userService.getEntityById(userId);

        const limit = Number(input.limit || 20);
        const offset = Number((input.index || 0) * limit);

        let where: WhereOptions = {
            companyId: user.companyId
        };

        if (input.q) {
            where['name'] = {
                [Op.like]: `%${input.q}%`
            }
        }

        if (input.isDriver !== undefined && input.isDriver !== null) {
            where['isDriver'] = typeof(input.isDriver) == 'string' ? JSON.parse(input.isDriver) : input.isDriver;
        }

        const employees: Employee[] = await Employee.findAll({
            where,
            limit,
            offset,
            order: [['name', 'ASC']]
        });

        return employees.map(EmployeeViewModel.fromEntity);
    }
}