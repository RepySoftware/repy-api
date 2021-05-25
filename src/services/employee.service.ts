import { inject, injectable } from "inversify";
import { Op, Transaction, WhereOptions } from "sequelize";
import { EmployeeException } from "../common/exceptions/employee.exception";
import { NotFoundException } from "../common/exceptions/not-fount.exception";
import { Database } from "../data/database-config";
import { Coordinates } from "../models/entities/coordinates";
import { Employee } from "../models/entities/employee";
import { User } from "../models/entities/user";
import { EmployeeGeolocationInputModel } from "../models/input-models/employee-geolocation.input-model";
import { EmployeeFilter } from "../models/input-models/filter/employee.filter";
import { CompanyBranchProductViewModel } from "../models/view-models/company-branch-product.view-model";
import { EmployeeCoordinatesViewModel } from "../models/view-models/employee-coordinates.view-model";
import { EmployeeViewModel } from "../models/view-models/employee.view-model";
import { UserService } from "./user.service";

@injectable()
export class EmployeeService {

    constructor(
        @inject(UserService) private _userService: UserService,
        @inject(Database) private _database: Database
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
            where['isDriver'] = typeof (input.isDriver) == 'string' ? JSON.parse(input.isDriver) : input.isDriver;
        }

        const employees: Employee[] = await Employee.findAll({
            where,
            limit,
            offset,
            order: [['name', 'ASC']]
        });

        return employees.map(EmployeeViewModel.fromEntity);
    }

    public async updateGeolocation(input: EmployeeGeolocationInputModel, userId: number): Promise<void> {

        const user = await this._userService.getEntityById(userId);

        if (!user.employeeId)
            throw new EmployeeException('Usuário nao é um funcionário');

        const employee: Employee = await Employee.findOne({
            where: {
                companyId: user.companyId,
                id: user.employeeId
            },
            include: [
                {
                    model: Coordinates,
                    as: 'coordinates'
                }
            ]
        });

        if (!employee)
            throw new NotFoundException('Funcionário não encontrado');

        if (employee.coordinates) {
            employee.coordinates.latitude = input.latitude;
            employee.coordinates.longitude = input.longitude;
            employee.coordinates.speed = input.speed;

            await employee.coordinates.save();
        } else {
            const transaction: Transaction = await this._database.sequelize.transaction();

            try {
                const coordinate = Coordinates.create(input);
                await coordinate.save({ transaction });

                employee.coordinatesId = coordinate.id;
                await employee.save({ transaction });

                await transaction.commit();
            } catch (error) {
                await transaction.rollback();
                throw error;
            }
        }
    }

    public async getCoordinates(employeesIds: number[], userId: number): Promise<EmployeeCoordinatesViewModel[]> {

        const user = await this._userService.getEntityById(userId);

        const employees: Employee[] = await Employee.findAll({
            where: {
                companyId: user.companyId,
                id: { [Op.in]: employeesIds },
                coordinatesId: { [Op.not]: null }
            },
            include: [
                {
                    model: Coordinates,
                    as: 'coordinates'
                }
            ]
        });

        return employees.map(EmployeeCoordinatesViewModel.fromEntity);
    }
}