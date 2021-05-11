import { DateHelper } from "../../common/helpers/date.helper";
import { SaleOrderPayment } from "../entities/sale-order-payment";
import { PaymentMethodViewModel } from "./payment-method.view-model";

export class DriverSaleOrderPaymentViewModel {

    public id: number;
    public paymentMethod: PaymentMethodViewModel;
    public value: number;
    public dueDate: string;
    public payDate?: string;

    public static fromEntity(sop: SaleOrderPayment): DriverSaleOrderPaymentViewModel {

        const payment = new DriverSaleOrderPaymentViewModel();

        payment.id = sop.id;
        payment.paymentMethod = sop.paymentMethod ? PaymentMethodViewModel.fromEntity(sop.paymentMethod) : null;
        payment.value = sop.value;
        payment.dueDate = DateHelper.toStringViewModel(sop.dueDate);
        payment.payDate = DateHelper.toStringViewModel(sop.payDate);

        return payment;
    }
}