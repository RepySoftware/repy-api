import { SaleOrderStatus } from "../../../common/enums/sale-order-status";
import { DateHelper } from "../../../common/helpers/date.helper";
import { SaleOrder } from "../../entities/sale-order";
import { ExternalSaleOrderProductViewModel } from "./external-sale-order-product.view-model";

export class ExternalSaleOrderViewModel {

    public id: number;
    public totalPrice: number;
    public status: SaleOrderStatus;
    public dateOfIssue: string;
    public products: ExternalSaleOrderProductViewModel[];

    public static fromEntity(so: SaleOrder): ExternalSaleOrderViewModel {

        const saleOrder = new ExternalSaleOrderViewModel();

        saleOrder.id = so.id;
        saleOrder.totalPrice = so.totalSalePrice;
        saleOrder.status = so.status;
        saleOrder.dateOfIssue = DateHelper.toStringViewModel(so.dateOfIssue);
        saleOrder.products = so.products?.map(ExternalSaleOrderProductViewModel.fromEntity);

        return saleOrder;
    }
}