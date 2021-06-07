import { inject, injectable } from "inversify";
import { Op } from "sequelize";
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
                    quantityDelivered: sop.saleOrder.deliveredAt ? sop.quantity : 0,
                    totalIssuedSalePrice: sop.quantity * sop.salePrice,
                    totalDeliveredSalePrice: sop.saleOrder.deliveredAt ? sop.quantity * sop.salePrice : 0
                });
            } else {
                resultProduct.quantityIssued += sop.quantity;
                resultProduct.quantityDelivered += sop.saleOrder.deliveredAt ? sop.quantity : 0;
                resultProduct.totalIssuedSalePrice += sop.quantity * sop.salePrice;
                resultProduct.totalDeliveredSalePrice += sop.saleOrder.deliveredAt ? sop.quantity * sop.salePrice : 0;
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
}