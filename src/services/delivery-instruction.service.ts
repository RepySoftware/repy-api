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
import { EmployeeDeliveryInstruction } from "../models/entities/employee-delivery-instruction";
import { Employee } from "../models/entities/employee";
import { SaleOrderStatus } from "../common/enums/sale-order-status";
import { DeliveryInstruction } from "../models/entities/delivery-instruction";
import { DeliveryInstructionViewModel } from "../models/view-models/delivery-instruction.view-model";

@injectable()
export class DeliveryInstructionService {

    constructor(
        @inject(UserService) private _userService: UserService
    ) { }

    public async getAll(userId: number): Promise<DeliveryInstructionViewModel[]> {

        const user = await this._userService.getEntityById(userId);

        const deliveryInstructions: DeliveryInstruction[] = await DeliveryInstruction.findAll({
            where: {
                companyId: user.companyId
            }
        });

        return deliveryInstructions.map(DeliveryInstructionViewModel.fromEntity);
    }
}