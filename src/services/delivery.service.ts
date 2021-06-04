import { inject, injectable } from "inversify";
import { Database } from "../data/database-config";
import { DeliveryFinalizeInputModel } from "../models/input-models/delivery-finalize.input-model";
import { UserService } from "./user.service";
import { DriverDeliveryViewModel } from "../models/view-models/driver-delivery.view-model";
import { DeliveryViewModel } from "../models/view-models/delivery.view-model";
import { DeliveryStartStrategy } from "./strategies/delivery-start.strategy";
import { DeliveryFinalizeStrategy } from "./strategies/delivery-finalize.strategy";
import { DeliveryGetStrategy } from "./strategies/delivery-get.strategy";
import { DeliveryType } from "../common/enums/delivery-type";
import { SaleOrder } from "../models/entities/sale-order";
import { Op, Transaction } from "sequelize";
import { CompanyBranch } from "../models/entities/company-branch";
import { SaleOrderStatus } from "../common/enums/sale-order-status";
import { DeliveryInstruction } from "../models/entities/delivery-instruction";
import { DeliveryInstructionStatus } from "../common/enums/delivery-instruction-status";
import { SaleOrderService } from "./sale-order.service";
import { StockService } from "./stock.service";

@injectable()
export class DeliveryService {

    constructor(
        @inject(UserService) private _userService: UserService,
        @inject(Database) private _database: Database,
        @inject(StockService) private _stockService: StockService
    ) { }

    public async get(userId: number, strategy: string): Promise<DeliveryViewModel[] | DriverDeliveryViewModel[]> {

        const deliveries = await (new DeliveryGetStrategy(
            strategy,
            this._userService
        ).call({ userId }));

        return deliveries;
    }

    public async finalize(input: DeliveryFinalizeInputModel, strategy: string, userId: number): Promise<void> {

        await (new DeliveryFinalizeStrategy(
            strategy,
            this._userService,
            this._database,
            this._stockService
        ).call({ input, userId }));
    }

    public async start(id: number, strategy: string, userId: number): Promise<void> {

        await (new DeliveryStartStrategy(
            strategy,
            this._userService
        ).call({ id, userId }));
    }

    public async updateIndex(items: { id: number, index: number, type: DeliveryType }[], userId: number): Promise<void> {

        const user = await this._userService.getEntityById(userId);

        const saleOrderIds = items.filter(x => x.type == DeliveryType.saleOrder);
        const deliveryInstructionIds = items.filter(x => x.type == DeliveryType.deliveryInstruction);

        const saleOrders: SaleOrder[] = await SaleOrder.findAll({
            where: {
                '$companyBranch.companyId$': user.companyId,
                id: { [Op.in]: saleOrderIds.map(x => x.id) }
            },
            include: [
                {
                    model: CompanyBranch,
                    as: 'companyBranch'
                }
            ]
        });

        const deliveryInstructions: DeliveryInstruction[] = await DeliveryInstruction.findAll({
            where: {
                companyId: user.companyId,
                id: { [Op.in]: deliveryInstructionIds.map(x => x.id) }
            }
        });

        const transaction: Transaction = await this._database.sequelize.transaction();

        try {

            for (const so of saleOrders) {
                const item = saleOrderIds.find(x => x.id == so.id);

                if (item) {
                    so.index = item.index;
                    await so.save({ transaction });
                }
            }

            for (const edi of deliveryInstructions) {
                const item = deliveryInstructionIds.find(x => x.id == edi.id);

                if (item) {
                    edi.index = item.index;
                    await edi.save({ transaction });
                }
            }

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    public async updateEmployeeDriver(input: { saleOrderId: number, employeeDriverId: number }, userId: number): Promise<void> {

        const user = await this._userService.getEntityById(userId);

        const saleOrder: SaleOrder = await SaleOrder.findOne({
            where: {
                '$companyBranch.companyId$': user.companyId,
                id: input.saleOrderId
            },
            include: [
                {
                    model: CompanyBranch,
                    as: 'companyBranch'
                }
            ]
        });

        saleOrder.employeeDriverId = input.employeeDriverId || null;

        // if employee is null and is on delivery, change status to PENDING
        if (!saleOrder.employeeDriverId && saleOrder.status == SaleOrderStatus.ON_DELIVERY) {
            saleOrder.setStatus(SaleOrderStatus.PENDING);
        }

        await saleOrder.save();
    }

    public async updateShowObservationToDriver(input: { saleOrderId: number, value: boolean }, userId: number): Promise<void> {

        const user = await this._userService.getEntityById(userId);

        const saleOrder: SaleOrder = await SaleOrder.findOne({
            where: {
                '$companyBranch.companyId$': user.companyId,
                id: input.saleOrderId
            },
            include: [
                {
                    model: CompanyBranch,
                    as: 'companyBranch'
                }
            ]
        });

        saleOrder.showObservationToDriver = input.value;

        await saleOrder.save();
    }

    public async getNextIndex(userId: number): Promise<number> {

        const user = await this._userService.getEntityById(userId);

        const saleOrders: SaleOrder[] = await SaleOrder.findAll({
            where: {
                '$companyBranch.companyId$': user.companyId,
                status: { [Op.in]: [SaleOrderStatus.PENDING, SaleOrderStatus.ON_DELIVERY] }
            },
            include: [
                {
                    model: CompanyBranch,
                    as: 'companyBranch'
                }
            ]
        });

        const deliveryInstructions: DeliveryInstruction[] = DeliveryInstruction.findAll({
            where: {
                companyId: user.companyId,
                status: { [Op.in]: [DeliveryInstructionStatus.PENDING, DeliveryInstructionStatus.IN_PROGRESS] }
            }
        });

        return saleOrders.length + deliveryInstructions.length;
    }
}