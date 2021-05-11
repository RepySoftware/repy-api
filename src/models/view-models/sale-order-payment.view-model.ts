import { DateHelper } from "../../common/helpers/date.helper";
import { SaleOrderPayment } from "../entities/sale-order-payment";
import { PaymentMethodViewModel } from "./payment-method.view-model";

export class SaleOrderPaymentViewModel {

    public id: number;
    public paymentMethod: PaymentMethodViewModel;
    public value: number;
    public dueDate: string;
    public payDate?: string;
    public createdAt: string;
    public updatedAt: string;

    public static fromEntity(sop: SaleOrderPayment): SaleOrderPaymentViewModel {

        const payment = new SaleOrderPaymentViewModel();

        payment.id = sop.id;
        payment.paymentMethod = sop.paymentMethod ? PaymentMethodViewModel.fromEntity(sop.paymentMethod) : null;
        payment.value = sop.value;
        payment.dueDate = DateHelper.toStringViewModel(sop.dueDate);
        payment.payDate = DateHelper.toStringViewModel(sop.payDate);
        payment.createdAt = DateHelper.toStringViewModel(sop.createdAt);
        payment.updatedAt = DateHelper.toStringViewModel(sop.updatedAt);

        return payment;
    }
}