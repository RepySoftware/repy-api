import { PaymentMethod } from "../entities/payment-method";

export class PaymentMethodViewModel {

    public id: number;
    public name: string;
    public hasInstallments: boolean;
    public isDefault: boolean;

    public static fromEntity(pm: PaymentMethod): PaymentMethodViewModel {

        const paymentMethod = new PaymentMethodViewModel();

        paymentMethod.id = pm.id;
        paymentMethod.name = pm.name;
        paymentMethod.hasInstallments = pm.hasInstallments;
        paymentMethod.isDefault = pm.isDefault;

        return paymentMethod;
    }
}