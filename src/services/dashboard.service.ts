import { inject, injectable } from "inversify";
import { Op, where, WhereOptions } from "sequelize";
import { CompanyBranch } from "../models/entities/company-branch";
import { SaleOrder } from "../models/entities/sale-order";
import { SaleOrderProduct } from "../models/entities/sale-order-product";
import { User } from "../models/entities/user";
import { ProductViewModel } from "../models/view-models/product.view-model";
import { UserService } from "./user.service";
import * as moment from 'moment-timezone';
import { CompanyBranchProduct } from "../models/entities/company-branch-product";
import { Product } from "../models/entities/product";
import { SalesByDateViewModel } from "../models/view-models/sales-by-date.view-model";
import { SalesByDateItemViewModel } from "../models/view-models/sales-by-date-item.view-model";
import { SaleOrderStatus } from "../common/enums/sale-order-status";
import { PersonCustomerNextGasSaleViewModel } from "../models/view-models/person-customer-next-gas-sale.view-model";
import { PersonCustomerNextGasSaleFilter } from "../models/input-models/filter/person-customer-next-gas-sale.filter";
import { PersonCustomerNextGasSale } from "../models/entities/person-customer-next-gas-sale";

@injectable()
export class DashboardService {

    constructor(
        @inject(UserService) private _userService: UserService
    ) { }

    public async getSalesByDay(
        input: {
            startDateOfIssue: string,
            endDateOfIssue: string
        },
        userId: number
    ): Promise<SalesByDateViewModel> {

        const user: User = await this._userService.getEntityById(userId);

        const salesOrderProducts: SaleOrderProduct[] = await SaleOrderProduct.findAll({
            where: {
                [Op.and]: [
                    { '$saleOrder.companyBranch.companyId$': user.companyId },
                    { '$saleOrder.companyBranchId$': user.companyId },
                    { '$saleOrder.status$': { [Op.not]: SaleOrderStatus.CANCELED } },
                    { '$saleOrder.dateOfIssue$': { [Op.gte]: moment.utc(input.startDateOfIssue).toDate() } },
                    { '$saleOrder.dateOfIssue$': { [Op.lte]: moment.utc(input.endDateOfIssue).toDate() } }
                ]
                // TODO: filter paymentNextDays
            },
            include: [
                {
                    model: SaleOrder,
                    as: 'saleOrder',
                    include: [
                        {
                            model: CompanyBranch,
                            as: 'companyBranch'
                        }
                    ]
                },
                {
                    model: CompanyBranchProduct,
                    as: 'companyBranchProduct',
                    include: [
                        {
                            model: Product,
                            as: 'product'
                        }
                    ]
                }
            ]
        });

        const items: SalesByDateItemViewModel[] = [];

        salesOrderProducts.forEach(sop => {

            const resultProduct = items.find(x => x.product.id == sop.companyBranchProduct.product.id);

            if (!resultProduct) {
                items.push({
                    product: ProductViewModel.fromEntity(sop.companyBranchProduct.product),
                    quantityIssued: sop.quantity,
                    quantityDelivered: sop.saleOrder.status == SaleOrderStatus.FINISHED ? sop.quantity : 0,
                    totalIssuedSalePrice: sop.quantity * sop.salePrice,
                    totalDeliveredSalePrice: sop.saleOrder.status == SaleOrderStatus.FINISHED ? sop.quantity * sop.salePrice : 0
                });
            } else {
                resultProduct.quantityIssued += sop.quantity;
                resultProduct.quantityDelivered += sop.saleOrder.status == SaleOrderStatus.FINISHED ? sop.quantity : 0;
                resultProduct.totalIssuedSalePrice += sop.quantity * sop.salePrice;
                resultProduct.totalDeliveredSalePrice += sop.saleOrder.status == SaleOrderStatus.FINISHED ? sop.quantity * sop.salePrice : 0;
            }
        });

        // TODO: verificar UTC
        return {
            items,
            totalIssuedItems: items.map(x => x.quantityIssued).reduce((a, b) => a + b, 0),
            totalDeliveredItems: items.map(x => x.quantityDelivered).reduce((a, b) => a + b, 0),
            totalIssuedSalePrice: items.map(x => x.totalIssuedSalePrice).reduce((a, b) => a + b, 0),
            totalDeliveredSalePrice: items.map(x => x.totalDeliveredSalePrice).reduce((a, b) => a + b, 0)
        };
    }

    public async getPersonsCustomersNextGasSales(input: PersonCustomerNextGasSaleFilter, userId: number): Promise<PersonCustomerNextGasSaleViewModel[]> {

        const user = await this._userService.getEntityById(userId);

        const limit = Number(input.limit || 20);
        const offset = Number((input.index || 0) * limit);

        let whereAnd: any[] = [
            { companyId: user.companyId }
        ]

        if (input.personCustomer) {
            if (input.personCustomer.startsWith('id:')) {
                whereAnd.push({ personCustomerId: input.personCustomer.split(':')[1] });
            } else {
                whereAnd.push({ personCustomerName: { [Op.like]: `%${input.personCustomer}%` } });
            }
        }

        if (input.startNextSaleMinDate)
            whereAnd.push({ nextSaleMinDate: { [Op.gte]: moment.utc(input.startNextSaleMinDate).toDate() } });

        if (input.endNextSaleMinDate)
            whereAnd.push({ nextSaleMinDate: { [Op.lte]: moment.utc(input.endNextSaleMinDate).toDate() } });

        if (input.startNextSaleMaxDate)
            whereAnd.push({ nextSaleMaxDate: { [Op.gte]: moment.utc(input.startNextSaleMaxDate).toDate() } });

        if (input.endNextSaleMaxDate)
            whereAnd.push({ nextSaleMaxDate: { [Op.lte]: moment.utc(input.endNextSaleMaxDate).toDate() } });

        const personsCustomersNextGasSales: PersonCustomerNextGasSale[] = await PersonCustomerNextGasSale.findAll({
            where: {
                [Op.and]: whereAnd
            },
            limit,
            offset,
            order: [['nextSaleMinDate', 'DESC']]
        });

        return personsCustomersNextGasSales.map(PersonCustomerNextGasSaleViewModel.fromEntity);
    }
}