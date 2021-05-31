create table Deposits (
	ID bigint not null primary key auto_increment,
	Name varchar(100) not null,
	CompantBranchID bigint not null,
	CreatedAt datetime not null default current_timestamp,
	UpdatedAt datetime not null default current_timestamp on update current_timestamp
);

ALTER TABLE Deposits ADD CONSTRAINT FK_Deposits_CompanyBranches FOREIGN KEY (CompantBranchID) REFERENCES CompanyBranches(ID);

create table Vehicles (
	ID bigint not null primary key auto_increment,
	Description varchar(150) not null,
	Nickname varchar(100),
	LicensePlate varchar(15) not null,
	DepositID bigint not null,
	CreatedAt datetime not null default current_timestamp,
	UpdatedAt datetime not null default current_timestamp on update current_timestamp
);

ALTER TABLE Vehicles ADD CONSTRAINT FK_Vehicles_Deposits FOREIGN KEY (DepositID) REFERENCES Deposits(ID);

ALTER TABLE Employees ADD VehicleID bigint NULL;
ALTER TABLE Employees CHANGE VehicleID VehicleID bigint NULL AFTER CoordinatesID;

ALTER TABLE Employees ADD CONSTRAINT FK_Employees_Vehicles FOREIGN KEY (VehicleID) REFERENCES Vehicles(ID);

create table DepositsCompanyBranchProducts (
	ID bigint not null primary key auto_increment,
	DepositID bigint not null,
	CompanyBranchProductID bigint not null,
	Quantity int not null
);

ALTER TABLE DepositsCompanyBranchProducts
ADD CONSTRAINT FK_DepositsCompanyBranchProducts_Deposits
FOREIGN KEY (DepositID) REFERENCES Deposits(ID);

ALTER TABLE DepositsCompanyBranchProducts
ADD CONSTRAINT FK_DepositsCompanyBranchProducts_CompanyBranchesProducts
FOREIGN KEY (CompanyBranchProductID) REFERENCES CompanyBranchesProducts(ID);