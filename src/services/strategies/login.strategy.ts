import { NotFoundException } from "../../common/exceptions/not-fount.exception";
import { Person } from "../../models/entities/person";
import { User } from "../../models/entities/user";
import { LoginInputModel } from "../../models/input-models/login.input-model";
import { Strategy } from "../abstraction/strategy";
import * as bcrypt from 'bcryptjs';
import { AuthException } from "../../common/exceptions/auth.exception";
import { PersonException } from "../../common/exceptions/person.exception";
import { Employee } from "../../models/entities/employee";

export class LoginStrategy extends Strategy<LoginInputModel, Promise<User>> {

    constructor(type: string) {
        super(type, ['employee', 'customer', 'driver']);
    }

    private verifyPassword(inputPassword: string, userPassword: string): void {
        if (!bcrypt.compareSync(inputPassword, userPassword))
            throw new AuthException('E-mail ou senha inválida');
    }

    private async getUser(input: LoginInputModel): Promise<User> {

        const user: User = await User.findOne({
            where: { username: input.username },
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

        return user;
    }

    public async employee(input: LoginInputModel): Promise<User> {

        const user = await this.getUser(input);

        if (!user.employeeId)
            throw new PersonException('Usuário não é um funcionário');

        this.verifyPassword(input.password, user.password);

        return user;
    }

    public async customer(input: LoginInputModel): Promise<User> {

        const user = await this.getUser(input);

        if (!user.person?.isCustomer)
            throw new PersonException('Usuário não é um fornecedor');

        this.verifyPassword(input.password, user.password);

        return user;
    }

    public async driver(input: LoginInputModel): Promise<User> {

        const user = await this.getUser(input);

        if (!user.employee.isDriver)
            throw new PersonException('Usuário não é entregador');

        this.verifyPassword(input.password, user.password);

        return user;
    }
}