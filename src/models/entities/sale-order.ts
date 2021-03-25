import { AllowNull, BelongsTo, Column, CreatedAt, ForeignKey, HasMany, Table, UpdatedAt } from "sequelize-typescript";
import { SaleOrderStatus } from "../../common/enums/sale-order-status";
import { Entity } from "../abstraction/entity";
import { Address } from "./address";
import { CompanyBranch } from "./company-branch";
import { Employee } from "./employee";
import { PaymentMethod } from "./payment-method";
import { Person } from "./person";
import { SaleOrderProduct } from "./sale-order-product";

@Table({
    tableName: 'SaleOrders',
    timestamps: true
})
export class SaleOrder extends Entity<SaleOrder> {

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
    @AllowNull(false)
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
    public scheduledAt?: Date;

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
}