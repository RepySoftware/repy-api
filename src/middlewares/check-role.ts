import { Request, Response, NextFunction } from "express";
import { NotFoundException } from "../common/exceptions/not-fount.exception";
import { AuthException } from "../common/exceptions/auth.exception";
import { User } from "../models/entities/user";
import { RoleType } from "../common/enums/role-type";
import { UserType } from "../common/enums/user-type";

export async function verifyUserRole(userId: number, roles: RoleType | RoleType[]): Promise<void> {

    const user: User = await User.findOne({
        where: { id: userId }
    });

    if (!user)
        throw new NotFoundException('Usuário não encontrado');

    const r = Array.isArray(roles) ? roles : [roles];

    if (r.includes(RoleType.admin)) {
        if (!user.isAdmin) {
            throw new AuthException('Não autorizado');
        }
    }

    if (r.includes(RoleType.customer)) {
        if (user.type != UserType.customer) {
            throw new AuthException('Não autorizado');
        }
    }

    if (r.includes(RoleType.employee)) {
        if (user.type != UserType.employee) {
            throw new AuthException('Não autorizado');
        }
    }
}

export function checkRole(roles: RoleType | RoleType[]) {
    return async (req: Request, res: Response, next: NextFunction) => {

        const id = res.locals.jwtPayload.userId;

        try {
            await verifyUserRole(id, roles);
        } catch (error) {
            next(error);
        }

    };
};