import { Request, Response, NextFunction } from "express";
import { NotFoundException } from "../common/exceptions/not-fount.exception";
import { AuthException } from "../common/exceptions/auth.exception";
import { User } from "../models/entities/user";
import { AccessControlRole } from "../common/enums/access-control-role";
import { Person } from "../models/entities/person";
import { Employee } from "../models/entities/employee";

export async function verifyUserRole(userId: number, roles: AccessControlRole | AccessControlRole[]): Promise<void> {

    const user: User = await User.findOne({
        where: { id: userId },
        include: [
            {
                model: Person,
                as: 'person'
            },
            {
                model: Employee,
                as: 'employee'
            }
        ]
    });

    if (!user)
        throw new NotFoundException('Usuário não encontrado');

    const r = Array.isArray(roles) ? roles : [roles];

    if (r.includes(AccessControlRole.ADMIN)) {
        if (!user.isAdmin) {
            throw new AuthException('Não autorizado');
        }
    }

    if (r.includes(AccessControlRole.EMPLOYEE)) {
        if (!user.employee) {
            throw new AuthException('Não autorizado');
        }
    }

    if (r.includes(AccessControlRole.EMPLOYEE_MANAGER)) {
        if (!user.employee || !user.employee.isManager) {
            throw new AuthException('Não autorizado');
        }
    }

    if (r.includes(AccessControlRole.EMPLOYEE_AGENT)) {
        if (!user.employee || !user.employee.isAgent) {
            throw new AuthException('Não autorizado');
        }
    }

    if (r.includes(AccessControlRole.EMPLOYEE_DRIVER)) {
        if (!user.employee || !user.employee.isDriver) {
            throw new AuthException('Não autorizado');
        }
    }

    if (r.includes(AccessControlRole.CUSTOMER)) {
        if (!user.person.isCustomer) {
            throw new AuthException('Não autorizado');
        }
    }
}

export function checkRole(roles: AccessControlRole | AccessControlRole[]) {
    return async (req: Request, res: Response, next: NextFunction) => {

        const id = res.locals.jwtPayload.userId;

        try {
            await verifyUserRole(id, roles);
            next();
        } catch (error) {
            next(error);
        }

    };
};