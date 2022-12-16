create table Addresses (
    ID bigint not null primary key auto_increment,
    Description varchar(200) not null,
    Street varchar(100) not null,
    Number varchar(30),
    ZipCode varchar(30),
    Neighborhood varchar(100),
    City varchar(100) not null,
    Region varchar(50) not null,
    Country varchar(50) not null,
    Complement varchar(100),
    ReferencePoint varchar(100),
    Latitude decimal(12,7),
    Longitude decimal(12,7)
);

create table ApiKeys (
    ID bigint not null primary key auto_increment,
    Name varchar(200) not null,
    `Key` varchar(100) not null
);

alter table Addresses add constraint UK_Addresses_Key unique key (`Key`);

create table Companies (
    ID bigint not null primary key auto_increment,
    Name varchar(100) not null,
    WekhookSaleOrderChanges varchar(300),
    CreatedAt datetime not null default current_timestamp,
    UpdatedAt datetime not null default current_timestamp on update current_timestamp
);

create table CompanyBranches (
    ID bigint not null primary key auto_increment,
    CompanyID bigint not null,
    Name varchar(100) not null,
    TraedName varchar(100),
    DocumentNumber varchar(20),
    AddressID bigint not null,
    IsDefault bit not null default b'0',
    CreatedAt datetime not null default current_timestamp,
    UpdatedAt datetime not null default current_timestamp on update current_timestamp
);

alter table CompanyBranches add constraint FK_CompanyBranches_Companies foreign key (CompanyID) references Companies(ID);

alter table CompanyBranches add constraint FK_CompanyBranches_Addresses foreign key (AddressID) references Addresses(ID);

create table CompanyBranchesProducts (
    ID bigint not null primary key auto_increment,
    ProductID bigint not null,
    CompanyBranchID bigint not null,
    IsDefault bit not null default b'0'
);

alter table CompanyBranchesProducts add constraint FK_CompanyBranchesProducts_Products foreign key (ProductID) references Products(ID);

alter table CompanyBranchesProducts add constraint FK_CompanyBranchesProducts_CompanyBranches foreign key (CompanyBranchID) references CompanyBranches(ID);

create table CompanyBranchesProductsPrices (
    ID bigint not null primary key auto_increment,
    Name varchar(200) not null,
    CompanyBranchProductID bigint not null,
    SalePrice decimal(10,2) not null,
    IsDefault bit not null default b'0',
    IsExternal bit not null default b'0',
    IsActive bit not null default b'1',
    CreatedAt datetime not null default current_timestamp,
    UpdatedAt datetime not null default current_timestamp on update current_timestamp
);

alter table CompanyBranchesProductsPrices add constraint FK_CompanyBranchesProductsPrices_CompanyBranchesProducts foreign key (CompanyBranchProductID) references CompanyBranchesProducts(ID);

create table Coordinates (
    ID bigint not null primary key auto_increment,
    Latitude decimal(12,7),
    Longitude decimal(12,7), 
    Speed decimal(12,7), 
    CreatedAt datetime not null default current_timestamp,
    UpdatedAt datetime not null default current_timestamp on update current_timestamp
);

create table Cylinders (
    ID bigint not null primary key auto_increment,
    Name varchar(100) not null,
    DefaultCylinderWeight decimal(10,4) not null,
    DefaultContentWeight decimal(10,4) not null
);

create table DefaultDeliveryInstructions (
    ID bigint not null primary key auto_increment,
    CompanyID bigint not null,
    Description varchar(500) not null
);

alter table DefaultDeliveryInstructions add constraint FK_DefaultDeliveryInstructions_Companies foreign key (CompanyID) references Companies(ID);

create table DeliveryInstructions (
    ID bigint not null primary key auto_increment,
    EmployeeDriverID bigint not null,
    Description varchar(500) not null,
    Status varchar(30) not null,
    Index int not null default 0,
    CompanyID bigint not null,
    AddressID bigint,
    CheckableByDriver bit not null,
    StartedAt datetime,
    FinishedAt datetime,
    CreatedAt datetime not null default current_timestamp,
    UpdatedAt datetime not null default current_timestamp on update current_timestamp
);

alter table DeliveryInstructions add constraint FK_DeliveryInstructions_Employees foreign key (EmployeeDriverID) references Employees(ID);

alter table DeliveryInstructions add constraint FK_DeliveryInstructions_Companies foreign key (CompanyID) references Companies(ID);

alter table DeliveryInstructions add constraint FK_DeliveryInstructions_Addresses foreign key (AddressID) references Addresses(ID);