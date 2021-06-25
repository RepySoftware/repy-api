import { AllowNull, BelongsTo, Column, CreatedAt, Default, ForeignKey, HasMany, Table, UpdatedAt } from "sequelize-typescript";
import { SaleOrderStatus } from "../../common/enums/sale-order-status";
import { Entity } from "../abstraction/entity";
import { Address } from "./address";
import { CompanyBranch } from "./company-branch";
import { Employee } from "./employee";
import { PaymentMethod } from "./payment-method";
import { Person } from "./person";
import { SaleOrderProduct } from "./sale-order-product";
import * as moment from 'moment-timezone';
import { SaleOrderPayment } from "./sale-order-payment";
import axios from 'axios';
import { Company } from "./company";

@Table({
    tableName: 'SaleOrders',
    timestamps: true
})
export class SaleOrder extends Entity<SaleOrder> {

    public static create(input: {
        companyBranchId: number;
        employeeAgentId?: number;
        employeeDriverId?: number;
        personCustomerId: number;
        deliveryAddressId: number;
        totalSalePrice: number;
        status: SaleOrderStatus;
        index?: number;
        observation: string;
        source?: string;
        dateOfIssue: Date;
        scheduledAt?: Date;
        deliveredAt?: Date;
    }): SaleOrder {
        return new SaleOrder(input);
    }

    @ForeignKey(() => CompanyBranch)
    @AllowNull(false)
    @Column
    public companyBranchId: number;
    @BelongsTo(() => CompanyBranch, 'companyBranchId')
    public companyBranch: CompanyBranch;

    @ForeignKey(() => Employee)
    @Column
    public employeeAgentId?: number;
    @BelongsTo(() => Employee, 'employeeAgentId')
    public employeeAgent?: Employee;

    @ForeignKey(() => Employee)
    @Column
    public employeeDriverId?: number;
    @BelongsTo(() => Employee, 'employeeDriverId')
    public employeeDriver?: Employee;

    @ForeignKey(() => Person)
    @AllowNull(false)
    @Column
    public personCustomerId: number;
    @BelongsTo(() => Person, 'personCustomerId')
    public personCustomer: Person;

    @ForeignKey(() => Address)
    @AllowNull(false)
    @Column
    public deliveryAddressId: number;
    @BelongsTo(() => Address, 'deliveryAddressId')
    public deliveryAddress: Address;

    @AllowNull(false)
    @Column
    public totalSalePrice: number;

    @AllowNull(false)
    @Column
    public status: SaleOrderStatus;

    @AllowNull(false)
    @Default(0)
    @Column
    public index: number;

    @Column
    public observation: string;

    @AllowNull(true)
    @Column
    public showObservationToDriver: boolean;

    @AllowNull(true)
    @Default('REPY')
    @Column
    public source: string;

    @AllowNull(false)
    @Column
    public dateOfIssue: Date;

    @Column
    public scheduledAt?: Date;

    @Column
    public deliveryStartedAt?: Date;

    @Column
    public deliveredAt?: Date;

    @AllowNull(false)
    @CreatedAt
    @Column
    public createdAt: Date;

    @AllowNull(false)
    @UpdatedAt
    @Column
    public updatedAt: Date;

    @HasMany(() => SaleOrderProduct)
    public products: SaleOrderProduct[];

    @HasMany(() => SaleOrderPayment)
    public payments: SaleOrderPayment[];

    public calculeTotalSalePrice(products: SaleOrderProduct[] = this.products): void {
        this.totalSalePrice = products
            .map(p => p.quantity * p.salePrice)
            .reduce((a, b) => a + b, 0);
    }

    public setStatus(value: SaleOrderStatus): void {

        switch (value) {

            case SaleOrderStatus.PENDING:
                this.deliveredAt = null;
                this.deliveryStartedAt = null;
                break;

            case SaleOrderStatus.ON_DELIVERY:
                this.deliveryStartedAt = moment.utc().toDate();
                this.deliveredAt = null;
                break;

            case SaleOrderStatus.FINISHED:
                this.deliveredAt = moment.utc().toDate();
                break;

            case SaleOrderStatus.CANCELED:
                break;
        }

        this.status = value;
    }

    public async sendWebhook(): Promise<void> {

        const companyBranch: CompanyBranch = await CompanyBranch.findOne({
            where: { id: this.companyBranchId },
            include: [
                {
                    model: Company,
                    as: 'company'
                }
            ]
        });

        if (companyBranch.company.webhookSaleOrderChanges){
            await axios.post(companyBranch.company.webhookSaleOrderChanges, {
                id: this.id,
                status: this.status
            });
        }
    }
}