import { inject, injectable } from "inversify";
import { UserService } from "./user.service";
import { DeliveryInstruction } from "../models/entities/delivery-instruction";
import { DefaultDeliveryInstructionViewModel } from "../models/view-models/default-delivery-instruction.view-model";
import { DeliveryInstructionViewModel } from "../models/view-models/delivery-instruction.view-model";
import { DeliveryInstructionInputModel } from "../models/input-models/delivery-instruction.input-model";
import { DeliveryInstructionStatus } from "../common/enums/delivery-instruction-status";
import { Op, Transaction } from "sequelize";
import { Employee } from "../models/entities/employee";
import { DefaultDeliveryInstruction } from "../models/entities/default-delivery-instruction";
import { DeliveryService } from "./delivery.service";
import { User } from "../models/entities/user";
import { NotFoundException } from "../common/exceptions/not-fount.exception";
import { NotificationService } from "./notification.service";
import { Database } from "../data/database-config";
import { Address } from "../models/entities/address";
import { GeocodingService } from "./geocoding.service";

@injectable()
export class DeliveryInstructionService {

    constructor(
        @inject(UserService) private _userService: UserService,
        @inject(DeliveryService) private _deliveryService: DeliveryService,
        @inject(NotificationService) private _notificationService: NotificationService,
        @inject(GeocodingService) private _geocodingService: GeocodingService,
        @inject(Database) private _database: Database
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

        const transaction: Transaction = await this._database.sequelize.transaction();

        let deliveryInstruction: DeliveryInstruction;

        try {
            let address: Address;

            if (input.address) {
                address = Address.create({
                    description: input.address.description,
                    street: input.address.street,
                    number: input.address.number,
                    zipCode: input.address.zipCode,
                    neighborhood: input.address.neighborhood,
                    city: input.address.city,
                    region: input.address.region,
                    country: input.address.country,
                    complement: input.address.complement,
                    referencePoint: input.address.referencePoint,
                    latitude: input.address.latitude,
                    longitude: input.address.longitude
                });

                await address.setCoordinatesFromGeocoding(this._geocodingService);

                await address.save({ transaction });
            }

            deliveryInstruction = DeliveryInstruction.create({
                employeeDriverId: input.employeeDriverId,
                description: input.description,
                status: DeliveryInstructionStatus.PENDING,
                index,
                companyId: user.companyId,
                addressId: address?.id,
                checkableByDriver: input.checkableByDriver
            });

            await deliveryInstruction.save({ transaction });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }

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

        const transaction: Transaction = await this._database.sequelize.transaction();

        try {
            const deliveryInstruction: DeliveryInstruction = await DeliveryInstruction.findOne({
                where: {
                    companyId: user.companyId,
                    id
                },
                include: [
                    {
                        model: Address,
                        as: 'address'
                    }
                ]
            });

            await deliveryInstruction.destroy({ transaction });

            if (deliveryInstruction.addressId) {
                await deliveryInstruction.address.destroy({ transaction });
            }

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
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
                },
                {
                    model: Address,
                    as: 'address'
                }
            ]
        });

        return DeliveryInstructionViewModel.fromEntity(deliveryInstruction);
    }

}