import { SaleOrderStatus } from "../../common/enums/sale-order-status";
import { AddressHelper } from "../../common/helpers/address.helper";
import { DateHelper } from "../../common/helpers/date.helper";
import { SaleOrder } from "../entities/sale-order";
import { DriverSaleOrderPaymentViewModel } from "./driver-sale-order-payment.view-model";
import { DriverSaleOrderProductViewModel } from "./driver-sale-order-product.view-model";
import { PaymentMethodViewModel } from "./payment-method.view-model";

export class DriverSaleOrderViewModel {

    id: number;
    personCustomerName: string;
    status: SaleOrderStatus;
    deliveredAt?: string;
    scheduledAt?: string;
    totalSalePrice: number;
    addressFormatted: string;
    addressToMap: string;
    payments: DriverSaleOrderPaymentViewModel[];
    observation?: string;
    products: DriverSaleOrderProductViewModel[];

    public static fromEntity(so: SaleOrder): DriverSaleOrderViewModel {

        const saleOrder = new DriverSaleOrderViewModel();

        saleOrder.id = so.id;
        saleOrder.personCustomerName = so.personCustomer.name;
        saleOrder.status = so.status;
        saleOrder.deliveredAt = DateHelper.toStringViewModel(so.deliveredAt);
        saleOrder.scheduledAt = DateHelper.toStringViewModel(so.scheduledAt);
        saleOrder.totalSalePrice = so.totalSalePrice;
        saleOrder.addressFormatted = AddressHelper.format(so.deliveryAddress);
        saleOrder.addressToMap = AddressHelper.format(so.deliveryAddress, { includeComplement: false });
        saleOrder.payments = so.payments ? so.payments.map(DriverSaleOrderPaymentViewModel.fromEntity) : null;
        saleOrder.observation = so.showObservationToDriver ? so.observation : null;
        saleOrder.products = so.products.map(DriverSaleOrderProductViewModel.fromEntity);

        return saleOrder;
    }
}