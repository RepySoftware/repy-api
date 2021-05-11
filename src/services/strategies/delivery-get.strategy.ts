import { Includeable, Op } from "sequelize";
import { AccessControlRole } from "../../common/enums/access-control-role";
import { DeliveryInstructionStatus } from "../../common/enums/delivery-instruction-status";
import { SaleOrderStatus } from "../../common/enums/sale-order-status";
import { verifyUserRole } from "../../middlewares/check-role";
import { Address } from "../../models/entities/address";
import { CompanyBranch } from "../../models/entities/company-branch";
import { CompanyBranchProduct } from "../../models/entities/company-branch-product";
import { DeliveryInstruction } from "../../models/entities/delivery-instruction";
import { Employee } from "../../models/entities/employee";
import { PaymentMethod } from "../../models/entities/payment-method";
import { Person } from "../../models/entities/person";
import { Product } from "../../models/entities/product";
import { SaleOrder } from "../../models/entities/sale-order";
import { SaleOrderPayment } from "../../models/entities/sale-order-payment";
import { SaleOrderProduct } from "../../models/entities/sale-order-product";
import { DeliveryViewModel } from "../../models/view-models/delivery.view-model";
import { DriverDeliveryViewModel } from "../../models/view-models/driver-delivery.view-model";
import { Strategy } from "../abstraction/strategy";
import { UserService } from "../user.service";

export class DeliveryGetStrategy extends Strategy<{ userId: number }, Promise<DeliveryViewModel[] | DriverDeliveryViewModel[]>> {

    private readonly _defaultSaleOrderIncludes: Includeable[] = [
        {
            model: CompanyBranch,
            as: 'companyBranch'
        },
        {
            model: Employee,
            as: 'employeeAgent'
        },
        {
            model: Employee,
            as: 'employeeDriver'
        },
        {
            model: Person,
            as: 'personCustomer'
        },
        {
            model: Address,
            as: 'deliveryAddress'
        },
        {
            model: SaleOrderPayment,
            as: 'payments',
            include: [
                {
                    model: PaymentMethod,
                    as: 'paymentMethod'
                }
            ]
        },
        {
            model: SaleOrderProduct,
            as: 'products',
            separate: true,
            include: [
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
        }
    ];

    constructor(
        type: string,
        private _userService: UserService
    ) {
        super(type, ['agent', 'driver']);
    }

    private async agent(params: { userId: number }): Promise<DeliveryViewModel[] | DriverDeliveryViewModel[]> {

        await verifyUserRole(params.userId, [AccessControlRole.EMPLOYEE_AGENT, AccessControlRole.EMPLOYEE_MANAGER]);

        const user = await this._userService.getEntityById(params.userId);

        const saleOrders: SaleOrder[] = await SaleOrder.findAll({
            where: {
                '$companyBranch.companyId$': user.companyId,
                status: { [Op.in]: [SaleOrderStatus.PENDING, SaleOrderStatus.ON_DELIVERY] }
            },
            include: this._defaultSaleOrderIncludes,
            order: [['createdAt', 'DESC']]
        });

        const deliveryInstructions: DeliveryInstruction[] = await DeliveryInstruction.findAll({
            where: {
                '$employeeDriver.companyId$': user.companyId,
                status: { [Op.in]: [DeliveryInstructionStatus.PENDING, DeliveryInstructionStatus.IN_PROGRESS] }
            },
            include: [
                {
                    model: Employee,
                    as: 'employeeDriver'
                }
            ]
        });

        const deliveries: DeliveryViewModel[] = [
            ...saleOrders.map(DeliveryViewModel.fromSaleOrder),
            ...deliveryInstructions.map(DeliveryViewModel.fromDeliveryInstruction)
        ];

        return deliveries;
    }

    private async driver(params: { userId: number }): Promise<DeliveryViewModel[] | DriverDeliveryViewModel[]> {

        await verifyUserRole(params.userId, [AccessControlRole.EMPLOYEE_DRIVER]);

        const user = await this._userService.getEntityById(params.userId, [
            {
                model: Employee,
                as: 'employee'
            }
        ]);

        const saleOrders: SaleOrder[] = await SaleOrder.findAll({
            where: {
                '$companyBranch.companyId$': user.companyId,
                status: { [Op.in]: [SaleOrderStatus.PENDING, SaleOrderStatus.ON_DELIVERY] },
                employeeDriverId: user.employeeId
            },
            include: this._defaultSaleOrderIncludes,
            order: [['index', 'ASC']],
            limit: 2
        });

        const deliveryInstructions: DeliveryInstruction[] = await DeliveryInstruction.findAll({
            where: {
                '$employeeDriver.companyId$': user.companyId,
                status: { [Op.in]: [DeliveryInstructionStatus.PENDING, DeliveryInstructionStatus.IN_PROGRESS] },
                employeeDriverId: user.employeeId
            },
            include: [
                {
                    model: Employee,
                    as: 'employeeDriver'
                }
            ],
            order: [['index', 'ASC']],
            limit: 2
        });

        const deliveries: DriverDeliveryViewModel[] = [
            ...saleOrders.map(DriverDeliveryViewModel.fromSaleOrder),
            ...deliveryInstructions.map(DriverDeliveryViewModel.fromDeliveryInstruction)
        ].sort((a, b) => a.index - b.index).splice(0, 2);

        return deliveries;
    }
}