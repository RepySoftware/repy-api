import { Request, Response, NextFunction } from "express";
import { NotFoundException } from "../common/exceptions/not-fount.exception";
import { AuthException } from "../common/exceptions/auth.exception";
import { User } from "../models/entities/user";
import { AccessControlRole } from "../common/enums/access-control-role";
import { Person } from "../models/entities/person";

export async function verifyUserRole(userId: number, roles: AccessControlRole | AccessControlRole[]): Promise<void> {

    const user: User = await User.findOne({
        where: { id: userId },
        include: [
            {
                model: Person,
                as: 'person'
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

    if (r.includes(AccessControlRole.CUSTOMER)) {
        if (!user.person.isCustomer) {
            throw new AuthException('Não autorizado');
        }
    }

    if (r.includes(AccessControlRole.MANAGER)) {
        if (!user.person.isManager) {
            throw new AuthException('Não autorizado');
        }
    }

    if (r.includes(AccessControlRole.DRIVER)) {
        if (!user.person.isDriver) {
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