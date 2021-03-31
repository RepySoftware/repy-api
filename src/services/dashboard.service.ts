import { inject, injectable } from "inversify";
import { cast, col, Op, where } from "sequelize";
import { CompanyBranch } from "../models/entities/company-branch";
import { SaleOrder } from "../models/entities/sale-order";
import { SaleOrderProduct } from "../models/entities/sale-order-product";
import { User } from "../models/entities/user";
import { ProductViewModel } from "../models/view-models/product.view-model";
import { UserService } from "./user.service";
import * as moment from 'moment-timezone';
import { CompanyBranchProduct } from "../models/entities/company-branch-product";
import { Product } from "../models/entities/product";
import { SalesByDayViewModel } from "../models/view-models/sales-by-day.view-model";
import { SalesByDayItemViewModel } from "../models/view-models/sales-by-day-item.view-model";

@injectable()
export class DashboardService {

    constructor(
        @inject(UserService) private _userService: UserService
    ) { }

    public async getSalesByDay(
        input: {
            date: string,
            companyBranchId: number
        },
        userId: number
    ): Promise<SalesByDayViewModel> {

        const user: User = await this._userService.getEntityById(userId);

        const salesOrderProducts: SaleOrderProduct[] = await SaleOrderProduct.findAll({
            where: {
                [Op.and]: [
                    { '$saleOrder.companyBranch.companyId$': user.companyId },
                    { '$saleOrder.companyBranchId$': input.companyBranchId },
                    where(
                        cast(col('saleOrder.deliveredAt'), 'date'),
                        input.date
                    )
                ]
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

        const items: SalesByDayItemViewModel[] = [];

        salesOrderProducts.forEach(sop => {

            const resultProduct = items.find(x => x.product.id == sop.companyBranchProduct.product.id);

            if (!resultProduct) {
                items.push({
                    product: ProductViewModel.fromEntity(sop.companyBranchProduct.product),
                    quantity: sop.quantity,
                    totalSalePrice: sop.quantity * sop.salePrice
                });
            } else {
                resultProduct.quantity += sop.quantity;
                resultProduct.totalSalePrice += sop.quantity * sop.salePrice;
            }
        });

        return {
            items,
            totalItems: items.map(x => x.quantity).reduce((a, b) => a + b, 0),
            totalSalePrice: items.map(x => x.totalSalePrice).reduce((a, b) => a + b, 0)
        };
    }
}