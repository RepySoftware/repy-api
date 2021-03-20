import { inject, injectable } from "inversify";
import { PaymentMethod } from "../models/entities/payment-method";
import { User } from "../models/entities/user";
import { PaymentMethodViewModel } from "../models/view-models/payment-method.view-model";
import { UserService } from "./user.service";

@injectable()
export class PaymentMethodService {

    constructor(
        @inject(UserService) private _userService: UserService
    ) { }

    public async getAll(userId: number): Promise<PaymentMethodViewModel[]> {

        const user: User = await this._userService.getEntityById(userId);

        const paymentMethods: PaymentMethod[] = await PaymentMethod.findAll({
            where: {
                companyId: user.companyId
            },
            order: [['name', 'ASC']]
        });

        return paymentMethods.map(PaymentMethodViewModel.fromEntity);
    }
}