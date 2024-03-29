import { inject, injectable } from "inversify";
import { Op, Transaction } from "sequelize";
import { SaleOrderStatus } from "../common/enums/sale-order-status";
import { NotFoundException } from "../common/exceptions/not-fount.exception";
import { Database } from "../data/database-config";
import { Address } from "../models/entities/address";
import { CompanyBranch } from "../models/entities/company-branch";
import { CompanyBranchProduct } from "../models/entities/company-branch-product";
import { Employee } from "../models/entities/employee";
import { Person } from "../models/entities/person";
import { Product } from "../models/entities/product";
import { SaleOrder } from "../models/entities/sale-order";
import { SaleOrderProduct } from "../models/entities/sale-order-product";
import { SaleOrderFilter } from "../models/input-models/filter/sale-order.filter";
import { SaleOrderCreateInputModel } from "../models/input-models/sale-order-create.input-model";
import { SaleOrderViewModel } from "../models/view-models/sale-order.view-model";
import { UserService } from "./user.service";
import * as moment from 'moment-timezone';
import { PaymentMethod } from "../models/entities/payment-method";
import { SaleOrderUpdateInputModel } from "../models/input-models/sale-order-update.input-model";
import { CompanyBranchProductPrice } from "../models/entities/company-branch-product-price";
import { ProductCategory } from "../models/entities/product-category";
import { DeliveryService } from "./delivery.service";
import { SaleOrderDriverFilter } from "../models/input-models/filter/sale-order-driver.filter";
import { DriverSaleOrderViewModel } from "../models/view-models/driver-sale-order.view-model";
import { GeocodingService } from "./geocoding.service";
import { SaleOrderException } from "../common/exceptions/sale-order.exception";
import { SaleOrderPayment } from "../models/entities/sale-order-payment";
import { AddressHelper } from "../common/helpers/address.helper";
import { ExternalSaleOrderInputModel } from "../models/input-models/external/external-sale-order.input-model";
import { PersonService } from "./person.service";
import { ExternalSaleOrderViewModel } from "../models/view-models/external/external-sale-order.view-model";

@injectable()
export class SaleOrderService {

    constructor(
        @inject(UserService) private _userService: UserService,
        @inject(Database) private _database: Database,
        @inject(DeliveryService) private _deliveryService: DeliveryService,
        @inject(GeocodingService) private _geocodingService: GeocodingService,
        @inject(PersonService) private _personService: PersonService,
    ) { }

    public async getById(id: number, userId: number): Promise<SaleOrder | SaleOrderViewModel> {

        const user = await this._userService.getEntityById(userId);

        const saleOrder: SaleOrder = await SaleOrder.findOne({
            where: {
                id,
                '$companyBranch.companyId$': user.companyId
            },
            include: [
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
                                    as: 'product',
                                    include: [
                                        {
                                            model: ProductCategory,
                                            as: 'category'
                                        }
                                    ]
                                },
                                {
                                    model: CompanyBranchProductPrice,
                                    as: 'prices'
                                }
                            ]
                        },
                        {
                            model: CompanyBranchProductPrice,
                            as: 'companyBranchProductPrice'
                        }
                    ]
                }
            ]
        });

        if (!saleOrder)
            throw new NotFoundException('Pedido não encontrado');

        return SaleOrderViewModel.fromEntity(saleOrder);
    }

    public async getAll(input: SaleOrderFilter, userId: number): Promise<SaleOrderViewModel[]> {

        const user = await this._userService.getEntityById(userId);

        const limit = Number(input.limit || 20);
        const offset = Number((input.index || 0) * limit);

        const whereAnd: any[] = [
            { '$companyBranch.companyId$': user.companyId }
        ];

        if (input.status) {
            const statusList: SaleOrderStatus[] = input.status.split(',').map(s => SaleOrderStatus[s]);
            whereAnd.push({ status: { [Op.in]: statusList } });
        }

        if (input.employeeDriverId) {
            whereAnd.push({ employeeDriverId: input.employeeDriverId });
        }

        if (input.startDateOfIssue) {
            whereAnd.push({ dateOfIssue: { [Op.gte]: moment.utc(input.startDateOfIssue).toDate() } });
        }

        if (input.endDateOfIssue) {
            whereAnd.push({ dateOfIssue: { [Op.lte]: moment.utc(input.endDateOfIssue).toDate() } });
        }

        if (input.startDeliveredAt) {
            whereAnd.push({ deliveredAt: { [Op.gte]: moment.utc(input.startDeliveredAt).toDate() } });
        }

        if (input.endDeliveredAt) {
            whereAnd.push({ deliveredAt: { [Op.lte]: moment.utc(input.endDeliveredAt).toDate() } });
        }

        if (input.personCustomerId) {
            whereAnd.push({ personCustomerId: input.personCustomerId });
        }

        if (input.paymentMethodId) {

            const paymentsSaleOrdersIds: { saleOrderId: number }[] = await SaleOrderPayment.findAll({
                attributes: ['saleOrderId'],
                where: {
                    '$saleOrder.companyBranch.companyId$': user.companyId,
                    paymentMethodId: input.paymentMethodId,
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
                    }
                ],
                limit,
                offset,
                order: [[{ model: SaleOrder, as: 'saleOrder' }, 'createdAt', 'DESC']]
            });

            whereAnd.push({ id: { [Op.in]: paymentsSaleOrdersIds.map(x => x.saleOrderId) } });
        }

        const saleOrders: SaleOrder[] = await SaleOrder.findAll({
            where: {
                [Op.and]: whereAnd
            },
            include: [
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
                    separate: true,
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
            ],
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        return saleOrders.map(SaleOrderViewModel.fromEntity);
    }

    public async getByDriver(input: SaleOrderDriverFilter, userId: number): Promise<DriverSaleOrderViewModel[]> {

        const user = await this._userService.getEntityById(userId, [
            {
                model: Employee,
                as: 'employee'
            }
        ]);

        const limit = Number(input.limit || 20);
        const offset = Number((input.index || 0) * limit);

        const whereAnd: any[] = [
            { '$companyBranch.companyId$': user.companyId },
            { employeeDriverId: user.employeeId },
            { status: SaleOrderStatus.FINISHED }
        ];

        if (input.startDeliveredAt) {
            whereAnd.push({ deliveredAt: { [Op.gte]: moment.utc(input.startDeliveredAt).toDate() } });
        }

        if (input.endDeliveredAt) {
            whereAnd.push({ deliveredAt: { [Op.lte]: moment.utc(input.endDeliveredAt).toDate() } });
        }

        const saleOrders: SaleOrder[] = await SaleOrder.findAll({
            where: {
                [Op.and]: whereAnd
            },
            include: [
                {
                    model: CompanyBranch,
                    as: 'companyBranch'
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
                    separate: true,
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
            ],
            limit,
            offset,
            order: [['deliveredAt', 'DESC']]
        });

        return saleOrders.map(DriverSaleOrderViewModel.fromEntity);
    }

    public async create(input: SaleOrderCreateInputModel, userId: number): Promise<SaleOrderViewModel> {

        const user = await this._userService.getEntityById(userId);

        const personCustomer: Person = await Person.findOne({
            where: {
                id: input.personCustomerId,
                companyId: user.companyId
            },
            include: [
                {
                    model: Address,
                    as: 'address'
                }
            ]
        });

        if (!personCustomer)
            throw new NotFoundException('Cliente não encontrado');

        if (!personCustomer.address.latitude || !personCustomer.address.longitude) {
            const coordinates = await this._geocodingService.addressToCoordinates(
                AddressHelper.format(personCustomer.address, { includeComplement: false })
            );

            if (!coordinates)
                throw new SaleOrderException('Erro ao buscar endereço. Por favor revise o endereço do cliente');

            personCustomer.address.latitude = coordinates.latitude;
            personCustomer.address.longitude = coordinates.longitude;

            await personCustomer.address.save();
        }

        const index = await this._deliveryService.getNextIndex(user.companyId);

        const transaction: Transaction = await this._database.sequelize.transaction();

        try {

            const deliveryAddress = Address.create({
                description: personCustomer.address.description,
                street: personCustomer.address.street,
                number: personCustomer.address.number,
                zipCode: personCustomer.address.zipCode,
                neighborhood: personCustomer.address.neighborhood,
                city: personCustomer.address.city,
                region: personCustomer.address.region,
                country: personCustomer.address.country,
                complement: personCustomer.address.complement,
                referencePoint: personCustomer.address.referencePoint,
                latitude: personCustomer.address.latitude,
                longitude: personCustomer.address.longitude
            });

            await deliveryAddress.save({ transaction });

            const saleOrder = SaleOrder.create({
                companyBranchId: input.companyBranchId,
                employeeAgentId: user.employeeId,
                employeeDriverId: input.employeeDriverId,
                personCustomerId: input.personCustomerId,
                deliveryAddressId: deliveryAddress.id,
                totalSalePrice: 0,
                status: SaleOrderStatus.PENDING,
                observation: input.observation,
                dateOfIssue: moment.utc().toDate(),
                index,
                scheduledAt: input.scheduledAt ? moment.utc(input.scheduledAt).toDate() : null,
                deliveredAt: null
            });

            await saleOrder.save({ transaction });

            const saleOrderProducts = input.products.map(inputProduct => SaleOrderProduct.create({
                saleOrderId: saleOrder.id,
                companyBranchProductId: inputProduct.companyBranchProductId,
                companyBranchProductPriceId: inputProduct.companyBranchProductPriceId,
                quantity: inputProduct.quantity,
                salePrice: inputProduct.salePrice
            }));

            for (const p of saleOrderProducts) {
                await p.save({ transaction });
            }

            saleOrder.calculeTotalSalePrice(saleOrderProducts);
            await saleOrder.save({ transaction });

            for (const inputPayment of input.payments) {
                const p = SaleOrderPayment.create({
                    saleOrderId: saleOrder.id,
                    paymentMethodId: inputPayment.paymentMethodId,
                    value: inputPayment.value,
                    dueDate: inputPayment.dueDate ? moment.utc(inputPayment.dueDate).toDate() : moment.utc().toDate(),
                    payDate: inputPayment.payDate ? moment.utc(inputPayment.payDate).toDate() : null,
                });

                await p.save({ transaction });
            }

            await transaction.commit();

            return SaleOrderViewModel.fromEntity(saleOrder);

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    public async update(input: SaleOrderUpdateInputModel, userId: number): Promise<SaleOrderViewModel> {

        const user = await this._userService.getEntityById(userId);

        const personCustomer: Person = await Person.findOne({
            where: {
                id: input.personCustomerId,
                companyId: user.companyId
            },
            include: [
                {
                    model: Address,
                    as: 'address'
                }
            ]
        });

        if (!personCustomer)
            throw new NotFoundException('Cliente não encontrado');

        const saleOrder: SaleOrder = await SaleOrder.findOne({
            where: {
                '$companyBranch.companyId$': user.companyId,
                id: input.id
            },
            include: [
                {
                    model: CompanyBranch,
                    as: 'companyBranch'
                },
                {
                    model: Address,
                    as: 'deliveryAddress'
                },
                {
                    model: SaleOrderProduct,
                    as: 'products'
                },
                {
                    model: SaleOrderPayment,
                    as: 'payments'
                }
            ]
        });

        if (!saleOrder)
            throw new NotFoundException('Pedido não encontrado');

        const transaction: Transaction = await this._database.sequelize.transaction();

        try {

            // saleOrder.deliveryAddress.description = input.deliveryAddress.description;
            // saleOrder.deliveryAddress.street = input.deliveryAddress.street;
            // saleOrder.deliveryAddress.number = input.deliveryAddress.number;
            // saleOrder.deliveryAddress.zipCode = input.deliveryAddress.zipCode;
            // saleOrder.deliveryAddress.neighborhood = input.deliveryAddress.neighborhood;
            // saleOrder.deliveryAddress.city = input.deliveryAddress.city;
            // saleOrder.deliveryAddress.region = input.deliveryAddress.region;
            // saleOrder.deliveryAddress.country = input.deliveryAddress.country;
            // saleOrder.deliveryAddress.complement = input.deliveryAddress.complement;
            // saleOrder.deliveryAddress.referencePoint = input.deliveryAddress.referencePoint;
            // saleOrder.deliveryAddress.latitude = input.deliveryAddress.latitude;
            // saleOrder.deliveryAddress.longitude = input.deliveryAddress.longitude;

            // await saleOrder.deliveryAddress.save({ transaction });

            saleOrder.status = input.status;
            saleOrder.companyBranchId = input.companyBranchId;
            saleOrder.employeeDriverId = input.employeeDriverId || null;
            saleOrder.personCustomerId = input.personCustomerId;
            saleOrder.observation = input.observation || null;
            saleOrder.dateOfIssue = moment.utc(input.dateOfIssue).toDate();
            saleOrder.scheduledAt = input.scheduledAt ? moment.utc(input.scheduledAt).toDate() : null;
            saleOrder.deliveredAt = input.deliveredAt ? moment.utc(input.deliveredAt).toDate() : null;

            await saleOrder.save({ transaction });

            //#region payments
            // update payments
            for (const sopInput of input.payments) {
                const saleOrderPayment = saleOrder.payments.find(x => x.id == sopInput.id);

                if (saleOrderPayment) {
                    saleOrderPayment.paymentMethodId = sopInput.paymentMethodId;
                    saleOrderPayment.value = sopInput.value;
                    saleOrderPayment.dueDate = sopInput.dueDate ? moment.utc(sopInput.dueDate).toDate() : moment.utc().toDate();
                    saleOrderPayment.payDate = sopInput.payDate ? moment.utc(sopInput.payDate).toDate() : null;

                    await saleOrderPayment.save({ transaction });
                }
            }

            // delete payments
            for (const sop of saleOrder.payments) {
                if (!input.payments.find(x => x.id == sop.id)) {
                    await SaleOrderPayment.destroy({
                        where: { id: sop.id },
                        transaction
                    });

                    saleOrder.payments.splice(
                        saleOrder.payments.findIndex(x => x.id == sop.id),
                        1
                    );
                }
            }

            // add payments
            for (const sopInput of input.payments) {
                if (!sopInput.id) {
                    const newSaleOrderPayment = SaleOrderPayment.create({
                        saleOrderId: saleOrder.id,
                        paymentMethodId: sopInput.paymentMethodId,
                        value: sopInput.value,
                        dueDate: sopInput.dueDate ? moment.utc(sopInput.dueDate).toDate() : moment.utc().toDate(),
                        payDate: sopInput.payDate ? moment.utc(sopInput.payDate).toDate() : null,
                    });

                    await newSaleOrderPayment.save({ transaction });

                    saleOrder.payments.push(newSaleOrderPayment);
                }
            }
            //#endregion payments

            //#region products
            // update products
            for (const sopInput of input.products) {
                const saleOrderProduct = saleOrder.products.find(x => x.id == sopInput.id);

                if (saleOrderProduct) {
                    saleOrderProduct.companyBranchProductId = sopInput.companyBranchProductId;
                    saleOrderProduct.companyBranchProductPriceId = sopInput.companyBranchProductPriceId;
                    saleOrderProduct.quantity = sopInput.quantity;
                    saleOrderProduct.salePrice = sopInput.salePrice;

                    await saleOrderProduct.save({ transaction });
                }
            }

            // delete products
            for (const sop of saleOrder.products) {
                if (!input.products.find(x => x.id == sop.id)) {
                    await SaleOrderProduct.destroy({
                        where: { id: sop.id },
                        transaction
                    });

                    saleOrder.products.splice(
                        saleOrder.products.findIndex(x => x.id == sop.id),
                        1
                    );
                }
            }

            // add products
            for (const sopInput of input.products) {
                if (!sopInput.id) {
                    const newSaleOrderProduct = SaleOrderProduct.create({
                        companyBranchProductId: sopInput.companyBranchProductId,
                        companyBranchProductPriceId: sopInput.companyBranchProductPriceId,
                        quantity: sopInput.quantity,
                        salePrice: sopInput.salePrice,
                        saleOrderId: saleOrder.id
                    });

                    await newSaleOrderProduct.save({ transaction });

                    saleOrder.products.push(newSaleOrderProduct);
                }
            }
            //#endregion products

            saleOrder.calculeTotalSalePrice();
            await saleOrder.save({ transaction });

            await transaction.commit();

            saleOrder.sendWebhook();

            return SaleOrderViewModel.fromEntity(saleOrder);

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    public async delete(id: number, userId: number): Promise<void> {

        const user = await this._userService.getEntityById(userId);

        const saleOrder: SaleOrder = await SaleOrder.findOne({
            where: {
                id,
                '$companyBranch.companyId$': user.companyId
            },
            include: [
                {
                    model: CompanyBranch,
                    as: 'companyBranch'
                }
            ]
        });

        if (!saleOrder)
            throw new NotFoundException('Pedido não encontrado');

        const transaction: Transaction = await this._database.sequelize.transaction();

        try {

            await SaleOrderPayment.destroy({
                where: {
                    saleOrderId: saleOrder.id
                },
                transaction
            });

            await SaleOrderProduct.destroy({
                where: {
                    saleOrderId: saleOrder.id
                },
                transaction
            });

            await SaleOrder.destroy({
                where: {
                    id: saleOrder.id
                },
                transaction
            });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    public async externalCreate(input: ExternalSaleOrderInputModel): Promise<ExternalSaleOrderViewModel> {

        const companyBranch: CompanyBranch = await CompanyBranch.findOne({
            where: {
                id: input.salePointId
            }
        });

        if (!companyBranch)
            throw new SaleOrderException('Ponto de venda não encontrado');

        const transaction: Transaction = await this._database.sequelize.transaction();

        try {

            let personCustomer: Person;

            if (input.personCustomer.id) {
                personCustomer = await Person.findOne({
                    where: {
                        externalId: input.personCustomer.id
                    }
                });

                // create new
                if (!personCustomer) {
                    personCustomer = await this._personService.externalCreateCustomer(
                        input.personCustomer,
                        companyBranch.companyId,
                        { transaction }
                    );
                }

                // update
                // p.type = input.personCustomer.type;
                // p.documentNumber = input.personCustomer.documentNumber;
                // p.name = input.personCustomer.name;
                // p.email = input.personCustomer.email;

                if (personCustomer.address) {
                    personCustomer.address.description = input.personCustomer.address.description;
                    personCustomer.address.street = input.personCustomer.address.street;
                    personCustomer.address.number = input.personCustomer.address.number;
                    personCustomer.address.zipCode = input.personCustomer.address.zipCode;
                    personCustomer.address.neighborhood = input.personCustomer.address.neighborhood;
                    personCustomer.address.city = input.personCustomer.address.city;
                    personCustomer.address.region = input.personCustomer.address.region;
                    personCustomer.address.country = input.personCustomer.address.country;
                    personCustomer.address.complement = input.personCustomer.address.complement;
                    personCustomer.address.referencePoint = input.personCustomer.address.referencePoint;
                    personCustomer.address.latitude = input.personCustomer.address.latitude;
                    personCustomer.address.longitude = input.personCustomer.address.longitude;
                } else {
                    personCustomer.address = Address.create({
                        description: input.personCustomer.address.description,
                        street: input.personCustomer.address.street,
                        number: input.personCustomer.address.number,
                        zipCode: input.personCustomer.address.zipCode,
                        neighborhood: input.personCustomer.address.neighborhood,
                        city: input.personCustomer.address.city,
                        region: input.personCustomer.address.region,
                        country: input.personCustomer.address.country,
                        complement: input.personCustomer.address.complement,
                        referencePoint: input.personCustomer.address.referencePoint,
                        latitude: input.personCustomer.address.latitude,
                        longitude: input.personCustomer.address.longitude
                    });
                }

                await personCustomer.address.save({ transaction });

                personCustomer.addressId = personCustomer.address.id;
                await personCustomer.save({ transaction });

            } else {
                // create new
                personCustomer = await this._personService.externalCreateCustomer(
                    input.personCustomer,
                    companyBranch.companyId,
                    { transaction }
                );
            }

            const deliveryAddress = Address.create({
                description: input.deliveryAddress.description,
                street: input.deliveryAddress.street,
                number: input.deliveryAddress.number,
                zipCode: input.deliveryAddress.zipCode,
                neighborhood: input.deliveryAddress.neighborhood,
                city: input.deliveryAddress.city,
                region: input.deliveryAddress.region,
                country: input.deliveryAddress.country,
                complement: input.deliveryAddress.complement,
                referencePoint: input.deliveryAddress.referencePoint,
                latitude: input.deliveryAddress.latitude,
                longitude: input.deliveryAddress.longitude
            });

            await deliveryAddress.save({ transaction });

            const index = await this._deliveryService.getNextIndex(companyBranch.companyId);

            const saleOrder = SaleOrder.create({
                companyBranchId: companyBranch.id,
                personCustomerId: personCustomer.id,
                deliveryAddressId: deliveryAddress.id,
                totalSalePrice: 0,
                status: SaleOrderStatus.WAITING_FOR_APPROVAL,
                observation: input.observation,
                index,
                source: input.source,
                dateOfIssue: moment.utc(input.dateOfIssue).toDate(),
                scheduledAt: input.scheduledAt ? moment.utc(input.scheduledAt).toDate() : null
            });

            await saleOrder.save({ transaction });

            const companyBranchProducts: CompanyBranchProduct[] = await CompanyBranchProduct.findAll({
                where: {
                    '$product.code$': { [Op.in]: input.products.map(p => p.productCode) },
                    '$product.companyId$': companyBranch.companyId
                },
                include: [
                    {
                        model: Product,
                        as: 'product'
                    },
                    {
                        model: CompanyBranchProductPrice,
                        as: 'prices',
                        separate: true,
                        where: {
                            isExternal: true
                        }
                    }
                ]
            });

            const saleOrderProducts = input.products.map(inputProduct => {

                const companyBranchProduct = companyBranchProducts.find(cbp => cbp.product.code == inputProduct.productCode);

                if (!companyBranchProduct)
                    throw new SaleOrderException(`O produto ${inputProduct.productCode} não foi encontrado`);

                const price = companyBranchProduct.prices[0];

                if (!price)
                    throw new SaleOrderException(`O produto ${inputProduct.productCode} não tem preço definido`);

                return SaleOrderProduct.create({
                    saleOrderId: saleOrder.id,
                    companyBranchProductId: companyBranchProduct.id,
                    companyBranchProductPriceId: price.id,
                    quantity: inputProduct.quantity,
                    salePrice: inputProduct.price
                });
            });

            for (const p of saleOrderProducts) {
                await p.save({ transaction });
            }

            saleOrder.calculeTotalSalePrice(saleOrderProducts);
            await saleOrder.save({ transaction });

            const paymentMethods: PaymentMethod[] = await PaymentMethod.findAll({
                where: {
                    code: { [Op.in]: input.payments.map(p => p.code) }
                }
            });

            for (const inputPayment of input.payments) {

                const paymentMethod = paymentMethods.find(pm => pm.code == inputPayment.code);

                if (!paymentMethod)
                    throw new SaleOrderException(`O método de pagamento ${inputPayment.code} não foi encontrado`);

                const p = SaleOrderPayment.create({
                    saleOrderId: saleOrder.id,
                    paymentMethodId: paymentMethod.id,
                    value: inputPayment.value,
                    dueDate: input.scheduledAt ? moment.utc(input.scheduledAt).toDate() : moment.utc().toDate()
                });

                await p.save({ transaction });
            }

            await transaction.commit();

            const newSaleOrder: SaleOrder = await SaleOrder.findOne({
                where: {
                    id: saleOrder.id
                },
                include: [
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
                ]
            });

            return ExternalSaleOrderViewModel.fromEntity(newSaleOrder);

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}