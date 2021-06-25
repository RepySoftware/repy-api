ALTER TABLE Companies ADD WebhookSaleOrderChanges varchar(1000) NULL;
ALTER TABLE Companies CHANGE WebhookSaleOrderChanges WebhookSaleOrderChanges varchar(1000) NULL AFTER Name;

create table ApiKeys (
	ID bigint not null primary key auto_increment,
	Name varchar(100) not null,
	`Key` varchar(50) not null
);

ALTER TABLE ApiKeys ADD CONSTRAINT UK_ApiKeys_Name UNIQUE KEY (Name);
ALTER TABLE ApiKeys ADD CONSTRAINT UK_ApiKeys_Key UNIQUE KEY (`Key`);

ALTER TABLE PaymentMethods DROP COLUMN ErpPaymentMethodID;
ALTER TABLE PaymentMethods ADD Code varchar(100) NOT NULL;
ALTER TABLE PaymentMethods CHANGE Code Code varchar(100) NOT NULL AFTER ID;

ALTER TABLE PaymentMethods ADD CONSTRAINT UK_PaymentMethods_Code UNIQUE KEY (Code);

ALTER TABLE CompanyBranches CHANGE ErpCompanyBranchID ExternalID bigint(20) NULL;

ALTER TABLE CompanyBranches ADD CONSTRAINT FK_CompanyBranches_Addresses FOREIGN KEY (AddressID) REFERENCES Addresses(ID);

ALTER TABLE Persons ADD ExternalID bigint NULL;
ALTER TABLE Persons CHANGE ExternalID ExternalID bigint NULL AFTER Observation;

ALTER TABLE SaleOrders ADD Source varchar(100) DEFAULT 'REPY' NOT NULL;
ALTER TABLE SaleOrders CHANGE Source Source varchar(100) DEFAULT REPY NOT NULL AFTER ShowObservationToDriver;

ALTER TABLE SaleOrders MODIFY COLUMN EmployeeAgentID bigint(20) NULL;

ALTER TABLE CompanyBranchesProductsPrices DROP COLUMN MaxPriceDiscount;

