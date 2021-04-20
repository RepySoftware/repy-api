import { AllowNull, BelongsTo, Column, CreatedAt, ForeignKey, HasMany, Table, UpdatedAt } from "sequelize-typescript";
import { SaleOrderStatus } from "../../common/enums/sale-order-status";
import { Entity } from "../abstraction/entity";
import { Address } from "./address";
import { CompanyBranch } from "./company-branch";
import { Employee } from "./employee";
import { PaymentMethod } from "./payment-method";
import { Person } from "./person";
import { SaleOrderProduct } from "./sale-order-product";
import * as moment from 'moment-timezone';

@Table({
    tableName: 'SaleOrders',
    timestamps: true
})
export class SaleOrder extends Entity<SaleOrder> {

    public static create(input: {
        companyBranchId: number;
        employeeAgentId: number;
        employeeDriverId: number;
        personCustomerId: number;
        deliveryAddressId: number;
        paymentMethodId: number;
        totalSalePrice: number;
        paymentInstallments: number;
        status: SaleOrderStatus;
        index: number;
        observation: string;
        dateOfIssue: Date;
        scheduledAt: Date;
        deliveredAt: Date;
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
    @AllowNull(false)
    @Column
    public employeeAgentId: number;
    @BelongsTo(() => Employee, 'employeeAgentId')
    public employeeAgent: Employee;

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

    @ForeignKey(() => PaymentMethod)
    @Column
    public paymentMethodId: number;
    @BelongsTo(() => PaymentMethod, 'paymentMethodId')
    public paymentMethod: PaymentMethod;

    @AllowNull(false)
    @Column
    public totalSalePrice: number;

    @Column
    public paymentInstallments?: number;

    @AllowNull(false)
    @Column
    public status: SaleOrderStatus;

    @AllowNull(false)
    @Column
    public index: number;

    @Column
    public observation: string;

    @Column
    public showObservationToDriver: boolean;

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
}