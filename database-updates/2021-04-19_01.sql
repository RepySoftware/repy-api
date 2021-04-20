create table DeliveryInstructions (
	ID bigint not null primary key auto_increment,
	Description varchar(100) not null
)

create table EmployeeDeliveryInstructions (
	ID bigint not null primary key auto_increment,
	DeliveryInstructionID bigint not null,
	EmployeeID bigint not null,
	Status varchar(100) not null,
	StartedAt datetime,
	FinishedAt datetime,
	CreatedAt datetime not null default current_timestamp
)

ALTER TABLE EmployeeDeliveryInstructions ADD UpdatedAt datetime DEFAULT current_timestamp on update current_timestamp NOT NULL;
ALTER TABLE EmployeeDeliveryInstructions CHANGE UpdatedAt UpdatedAt datetime DEFAULT current_timestamp on update current_timestamp NOT NULL AFTER FinishedAt;

ALTER TABLE EmployeeDeliveryInstructions ADD CONSTRAINT FK_EmployeeDeliveryInstructions_DeliveryInstructions FOREIGN KEY (DeliveryInstructionID) REFERENCES DeliveryInstructions(ID);
ALTER TABLE EmployeeDeliveryInstructions ADD CONSTRAINT FK_EmployeeDeliveryInstructions_Employees FOREIGN KEY (EmployeeID) REFERENCES Employees(ID);

ALTER TABLE SaleOrders ADD DeliveryStartedAt datetime NULL;
ALTER TABLE SaleOrders CHANGE DeliveryStartedAt DeliveryStartedAt datetime NULL AFTER ScheduledAt;

ALTER TABLE EmployeeDeliveryInstructions ADD `Index` int DEFAULT 0 NOT NULL;
ALTER TABLE EmployeeDeliveryInstructions CHANGE `Index` `Index` int DEFAULT 0 NOT NULL AFTER Status;

ALTER TABLE DeliveryInstructions ADD CompanyID bigint NOT NULL;
ALTER TABLE DeliveryInstructions CHANGE CompanyID CompanyID bigint NOT NULL AFTER ID;

ALTER TABLE EmployeeDeliveryInstructions CHANGE EmployeeID EmployeeDriverID bigint(20) NOT NULL;

ALTER TABLE SaleOrders ADD ShowObservationToDriver bit DEFAULT b'1' NOT NULL;
ALTER TABLE SaleOrders CHANGE ShowObservationToDriver ShowObservationToDriver bit DEFAULT b'1' NOT NULL AFTER Observation;
ALTER TABLE SaleOrders MODIFY COLUMN ShowObservationToDriver bit(1) NOT NULL;

