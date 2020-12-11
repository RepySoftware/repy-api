import { Request, Response, NextFunction } from "express";
import { NotFoundException } from "../common/exceptions/not-fount.exception";
import { RoleType } from "../common/enums/user-type";
import { AuthException } from "../common/exceptions/auth.exception";
import { User } from "../models/entities/user";

export function checkRole(roles: RoleType | Array<RoleType>) {
    return async (req: Request, res: Response, next: NextFunction) => {

        const id = res.locals.jwtPayload.userId;

        const user: User = await User.findOne({
            where: { id }
        });

        if (!user)
            next(new NotFoundException('Usuário não encontrado'));

        const r = Array.isArray(roles) ? roles : [roles];

        if (r.includes(RoleType.ADMIN)) {
            if (!user.roles || !user.roles.includes(RoleType.ADMIN)) {
                next(new AuthException('Não autorizado'));
            }
        }

        if (r.includes(RoleType.SUPPORTER)) {
            if (!user.roles || (
                !user.roles.includes(RoleType.SUPPORTER) && !user.roles.includes(RoleType.ADMIN)
            )) {
                next(new AuthException('Não autorizado'));
            }
        }

        next();
    };
};