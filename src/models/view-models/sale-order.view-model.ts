import { SaleOrderStatus } from "../../common/enums/sale-order-status";
import { DateHelper } from "../../common/helpers/date.helper";
import { SaleOrder } from "../entities/sale-order";
import { AddressViewModel } from "./address.view-model";
import { CompanyBranchViewModel } from "./company-branch.view-model";
import { EmployeeViewModel } from "./employee.view-model";
import { PaymentMethodViewModel } from "./payment-method.view-model";
import { PersonViewModel } from "./person.view-model";
import { SaleOrderProductViewModel } from "./sale-order-product.view-model";

export class SaleOrderViewModel {

    public id: number;
    public companyBranch: CompanyBranchViewModel;
    public employeeAgent: EmployeeViewModel;
    public employeeDriver?: EmployeeViewModel;
    public personCustomer: PersonViewModel;
    public deliveryAddress: AddressViewModel;
    public paymentMethod: PaymentMethodViewModel;
    public totalSalePrice: number;
    public paymentInstallments: number;
    public status: SaleOrderStatus;
    public index: number;
    public scheduledAt?: string;
    public deliveredAt?: string;
    public createdAt: string;
    public updatedAt: string;
    public products: SaleOrderProductViewModel[];

    public static fromEntity(so: SaleOrder): SaleOrderViewModel {

        const saleOrder = new SaleOrderViewModel();

        saleOrder.id = so.id;
        saleOrder.companyBranch = so.companyBranch ? CompanyBranchViewModel.fromEntity(so.companyBranch) : null;
        saleOrder.employeeAgent = so.employeeAgent ? EmployeeViewModel.fromEntity(so.employeeAgent) : null;
        saleOrder.employeeDriver = so.employeeDriver ? EmployeeViewModel.fromEntity(so.employeeDriver) : null;
        saleOrder.personCustomer = so.personCustomer ? PersonViewModel.fromEntity(so.personCustomer) : null;
        saleOrder.deliveryAddress = so.deliveryAddress ? AddressViewModel.fromEntity(so.deliveryAddress) : null;
        saleOrder.paymentMethod = so.paymentMethod;
        saleOrder.totalSalePrice = so.totalSalePrice;
        saleOrder.paymentInstallments = so.paymentInstallments;
        saleOrder.status = so.status;
        saleOrder.index = so.index;
        saleOrder.scheduledAt = DateHelper.toStringViewModel(so.scheduledAt);
        saleOrder.deliveredAt = DateHelper.toStringViewModel(so.deliveredAt);
        saleOrder.createdAt = DateHelper.toStringViewModel(so.createdAt);
        saleOrder.updatedAt = DateHelper.toStringViewModel(so.updatedAt);
        saleOrder.products = so.products ? so.products.map(SaleOrderProductViewModel.fromEntity) : null;

        return saleOrder;
    }
}