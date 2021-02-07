import { injectable } from "inversify";
import { LoginInputModel } from "../models/input-models/login.input-model";
import { NotFoundException } from "../common/exceptions/not-fount.exception";
import * as jwt from 'jsonwebtoken';
import { CONFIG } from "../config";
import { TokenPayload } from "../common/helpers/token.helper";
import { User } from "../models/entities/user";
import { UserViewModel } from "../models/view-models/user.view-model";
import { UserTokenViewModel } from "../models/view-models/user-token.view-model";
import { LoginStrategy } from "./strategies/login.strategy";

@injectable()
export class AuthService {

    public async login(input: LoginInputModel): Promise<UserTokenViewModel> {

        const user = await (new LoginStrategy(input.strategy).call(input));

        return {
            user: UserViewModel.fromEntity(user),
            token: this.makeToken(user)
        };
    }

    public async refresh(tokenPayload: TokenPayload) {

        const user: User = await User.findOne({
            where: { id: tokenPayload.userId }
        });

        if (!user)
            throw new NotFoundException('Usuário não encontrado');

        const token = this.makeToken(user);

        return {
            user: UserViewModel.fromEntity(user),
            token
        };
    }

    public makeToken(user: User): string {

        const payload: TokenPayload = { userId: user.id };

        const token = jwt.sign(
            payload,
            CONFIG.JWT_SECRET,
            { expiresIn: "120h" }
        );

        return token;
    }
}