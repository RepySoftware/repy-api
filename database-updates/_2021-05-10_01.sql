create table SaleOrdersPayments (
	ID bigint not null primary key auto_increment,
	SaleOrderID bigint not null,
	PaymentMethodID bigint not null,
	Value decimal(10,2) not null,
	DueDate date not null,
	PayDate date,
	CreatedAt datetime not null default current_timestamp,
	UpdatedAt datetime not null default current_timestamp on update current_timestamp
);

select
JSON_ARRAYAGG(JSON_OBJECT('id', ID, 'paymentMethodId', PaymentMethodID, 'totalSalePrice', TotalSalePrice, 'dateOfIssue', DateOfIssue))
from SaleOrders so;

-- result = rawData.map(x => `insert into SaleOrdersPayments (SaleOrderID, PaymentMethodID, Value, DueDate, PayDate) values (${x.id}, ${x.paymentMethodId || 1}, ${x.totalSalePrice}, '${x.dateOfIssue.split(' ')[0]}', '${x.dateOfIssue.split(' ')[0]}');`).join('\n')

-- copy(result);

RENAME TABLE SaleOrdersPayments TO SaleOrderPayments;

ALTER TABLE SaleOrders DROP FOREIGN KEY FK_SaleOrders_PaymentMethods;
ALTER TABLE SaleOrders DROP INDEX FK_SaleOrders_PaymentMethods;
ALTER TABLE SaleOrders DROP COLUMN PaymentMethodID;
ALTER TABLE SaleOrders DROP COLUMN PaymentInstallments;
