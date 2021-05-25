import { NextFunction, Request, Response, Router } from "express";
import { ServicesCollection } from "../providers";
import { checkToken } from "../middlewares/check-token";
import { AccessControlRole } from "../common/enums/access-control-role";
import { checkRole } from "../middlewares/check-role";
import { TokenHelper } from "../common/helpers/token.helper";
import { EmployeeService } from "../services/employee.service";

const EmployeesController = Router();

const employeeService = ServicesCollection.resolve(EmployeeService);

EmployeesController.get('/', [checkToken, checkRole([AccessControlRole.EMPLOYEE_MANAGER, AccessControlRole.EMPLOYEE_AGENT])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const employees = await employeeService.getAll(req.query, TokenHelper.getPayload(res).userId);
        res.json(employees);
    } catch (error) {
        next(error);
    }
});

EmployeesController.patch('/geolocation', [checkToken, checkRole([AccessControlRole.EMPLOYEE_MANAGER, AccessControlRole.EMPLOYEE_AGENT, AccessControlRole.EMPLOYEE_DRIVER])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        await employeeService.updateGeolocation(req.body, TokenHelper.getPayload(res).userId);
        res.json({ ok: true });
    } catch (error) {
        next(error);
    }
});

EmployeesController.get('/geolocation', [checkToken, checkRole([AccessControlRole.EMPLOYEE_MANAGER, AccessControlRole.EMPLOYEE_AGENT, AccessControlRole.EMPLOYEE_DRIVER])], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const employeesIds: number[] = (<string>req.query.employeesIds).split(',').map(x => Number(x));

        const employeesCoordinates = await employeeService.getCoordinates(employeesIds, TokenHelper.getPayload(res).userId);
        res.json(employeesCoordinates);
    } catch (error) {
        next(error);
    }
});

export { EmployeesController };