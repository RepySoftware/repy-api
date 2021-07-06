import { inject, injectable } from "inversify";
import { UserService } from "./user.service";
import { DeliveryInstruction } from "../models/entities/delivery-instruction";
import { DefaultDeliveryInstructionViewModel } from "../models/view-models/default-delivery-instruction.view-model";
import { DeliveryInstructionViewModel } from "../models/view-models/delivery-instruction.view-model";
import { DeliveryInstructionInputModel } from "../models/input-models/delivery-instruction.input-model";
import { DeliveryInstructionStatus } from "../common/enums/delivery-instruction-status";
import { Op } from "sequelize";
import { Employee } from "../models/entities/employee";
import { DefaultDeliveryInstruction } from "../models/entities/default-delivery-instruction";
import { DeliveryService } from "./delivery.service";
import { User } from "../models/entities/user";
import { NotFoundException } from "../common/exceptions/not-fount.exception";
import { NotificationService } from "./notification.service";

@injectable()
export class DeliveryInstructionService {

    constructor(
        @inject(UserService) private _userService: UserService,
        @inject(DeliveryService) private _deliveryService: DeliveryService,
        @inject(NotificationService) private _notificationService: NotificationService,
    ) { }

    public async getDefault(userId: number): Promise<DefaultDeliveryInstructionViewModel[]> {

        const user = await this._userService.getEntityById(userId);

        const deliveryInstructions: DefaultDeliveryInstruction[] = await DefaultDeliveryInstruction.findAll({
            where: {
                companyId: user.companyId
            }
        });

        return deliveryInstructions.map(DefaultDeliveryInstructionViewModel.fromEntity);
    }

    public async create(input: DeliveryInstructionInputModel, userId: number): Promise<DeliveryInstructionViewModel> {

        const user = await this._userService.getEntityById(userId);

        const index = input.index !== undefined && input.index !== null
            ? input.index
            : await this._deliveryService.getNextIndex(userId);

        const deliveryInstruction = DeliveryInstruction.create({
            employeeDriverId: input.employeeDriverId,
            description: input.description,
            status: DeliveryInstructionStatus.PENDING,
            index,
            companyId: user.companyId,
            checkableByDriver: input.checkableByDriver
        });

        await deliveryInstruction.save();

        const userToNotify: User = await User.findOne({
            where: {
                employeeId: deliveryInstruction.employeeDriverId
            }
        });

        if (!userToNotify)
            throw new NotFoundException('Usuário entregador não encontrado');

        if (input.firstPosition) {
            this._notificationService.createNotification([userToNotify.key], {
                title: '🚨🚨 Atenção!',
                message: 'Você tem uma nova instrução!'
            });
        }

        return await this.getById(deliveryInstruction.id, userId);
    }

    public async delete(id: number, userId: number): Promise<void> {

        const user = await this._userService.getEntityById(userId);

        await DeliveryInstruction.destroy({
            where: {
                companyId: user.companyId,
                id
            }
        });
    }

    public async getById(id: number, userId: number): Promise<DeliveryInstructionViewModel> {

        const user = await this._userService.getEntityById(userId);

        const deliveryInstruction: DeliveryInstruction = await DeliveryInstruction.findOne({
            where: {
                companyId: user.companyId,
                id
            },
            include: [
                {
                    model: Employee,
                    as: 'employeeDriver'
                }
            ]
        });

        return DeliveryInstructionViewModel.fromEntity(deliveryInstruction);
    }

}