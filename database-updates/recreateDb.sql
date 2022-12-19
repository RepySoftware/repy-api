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

alter table ApiKeys add constraint UK_Addresses_Key unique key (`Key`);

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

create table ProductCategories (
    ID bigint not null primary key auto_increment,
    CompanyID bigint not null,
    Name varchar(100) not null
);

alter table ProductCategories add constraint FK_ProductCategories_Companies foreign key (CompanyID) references Companies(ID);

create table Products (
    ID bigint not null primary key auto_increment,
    CompanyID bigint not null,
    CategoryID bigint not null,
    Code varchar(100) not null,
    Name varchar(100) not null,
    Description varchar(200),
    MeasurementUnit varchar(30) not null,
    IsGas bit not null,
    CreatedAt datetime not null default current_timestamp,
    UpdatedAt datetime not null default current_timestamp on update current_timestamp
);

alter table Products add constraint FK_Products_Companies foreign key (CompanyID) references Companies(ID);

alter table Products add constraint FK_Products_ProductCategories foreign key (CategoryID) references ProductCategories(ID);

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

create table Deposits (
    ID bigint not null primary key auto_increment,
    Name varchar(100) not null,
    CompanyBranchID bigint not null,
    CreatedAt datetime not null default current_timestamp,
    UpdatedAt datetime not null default current_timestamp on update current_timestamp
);

alter table Deposits add constraint FK_Deposits_CompanyBranches foreign key (CompanyBranchID) references CompanyBranches(ID);

create table Vehicles (
    ID bigint not null primary key auto_increment,
    Description varchar(200) not null,
    Nickname varchar(100),
    LicensePlate varchar(100) not null,
    CompanyID bigint not null,
    DepositID bigint,
    CreatedAt datetime not null default current_timestamp,
    UpdatedAt datetime not null default current_timestamp on update current_timestamp
);

alter table Vehicles add constraint FK_Vehicles_Companies foreign key (CompanyID) references Companies(ID);

alter table Vehicles add constraint FK_Vehicles_Deposits foreign key (DepositID) references Deposits(ID);

create table Employees (
    ID bigint not null primary key auto_increment,
    Name varchar(100) not null,
    DocumentNumber varchar(100),
    Email varchar(100),
    CompanyID bigint not null,
    VehicleID bigint,
    Color varchar(20),
    IsManager bit not null,
    IsAgent bit not null,
    IsDriver bit not null,
    IsActive bit not null default b'1',
    CoordinatesID bigint,
    CreatedAt datetime not null default current_timestamp,
    UpdatedAt datetime not null default current_timestamp on update current_timestamp
);

alter table Employees add constraint FK_Employees_Companies foreign key (CompanyID) references Companies(ID);

alter table Employees add constraint FK_Employees_Vehicles foreign key (VehicleID) references Vehicles(ID);

alter table Employees add constraint FK_Employees_Coordinates foreign key (CoordinatesID) references Coordinates(ID);

create table DeliveryInstructions (
    ID bigint not null primary key auto_increment,
    EmployeeDriverID bigint not null,
    Description varchar(500) not null,
    Status varchar(30) not null,
    `Index` int not null default 0,
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

create table DepositsProducts (
    ID bigint not null primary key auto_increment,
    DepositID bigint not null,
    CompanyBranchProductID bigint not null,
    Quantity decimal(10,2) not null
);

alter table DepositsProducts add constraint FK_DepositsProducts_Deposits foreign key (DepositID) references Deposits(ID);

alter table DepositsProducts add constraint FK_DepositsProducts_CompanyBranchesProducts foreign key (CompanyBranchProductID) references CompanyBranchesProducts(ID);

create table DevicesGasLevels (
    ID bigint not null primary key auto_increment,
    CylinderID bigint not null,
    CurrentWeight decimal(12,4) not null,
    ContentWeight decimal(12,4),
    PercentageToNotify decimal(10,2),
    SetTare bit not null default b'0',
    LastWeightUpdate datetime not null default current_timestamp,
    LastHistoryRead datetime not null default current_timestamp,
    AlreadyHistoryRead bit not null default b'0',
    WarningPercentage decimal(12,4) not null,
    DangerPercentage decimal(12,4) not null
);

alter table DevicesGasLevels add constraint FK_DevicesGasLevels_Cylinders foreign key (CylinderID) references Cylinders(ID);

create table DevicesGasLevelsHistoryReads (
    ID bigint not null primary key auto_increment,
    DeviceGasLevelID bigint not null,
    CylinderWeight decimal(10,2) not null,
    ContentWeight decimal(10,2) not null,
    Weight decimal(10,2) not null,
    CreatedAt datetime not null default current_timestamp,
    UpdatedAt datetime not null default current_timestamp on update current_timestamp
);

alter table DevicesGasLevelsHistoryReads add constraint FK_DevicesGasLevelsHistoryReads_DevicesGasLevels foreign key (DeviceGasLevelID) references DevicesGasLevels(ID);

create table NotificationsConfigurations (
    ID bigint not null primary key auto_increment,
    LastNotification datetime not null default '1970-01-01 09:00:00',
    MinNotificationIntervalMinutes int not null default 60,
    PhonesToNotify varchar(500) not null default '[]',
    EmailsToNotify varchar(500) not null default '[]',
    WhatsAppsToNotify varchar(500) not null default '[]',
    AlreadyNotified bit not null default b'1',
    IsActive bit not null default b'1'
);

create table Persons (
    ID bigint not null primary key auto_increment,
    Type varchar(30) not null,
    DocumentNumber varchar(50),
    Name varchar(100),
    TradeName varchar(100),
    Email varchar(100),
    AddressID bigint,
    CompanyID bigint not null,
    IsSupplier bit not null,
    IsCustomer bit not null,
    TaxRegime varchar(50) not null default 'UNDEFINED',
    IcmsContributorType varchar(20),
    StateRegistration varchar(50),
    MunicipalRegistration varchar(50),
    IsGasCostumer bit not null default b'0',
    IsActive bit not null default b'1',
    Observation varchar(200),
    ExternalId bigint,
    CreatedAt datetime not null default current_timestamp,
    UpdatedAt datetime not null default current_timestamp on update current_timestamp
);

alter table Persons add constraint FK_Persons_Addresses foreign key (AddressID) references Addresses(ID);

alter table Persons add constraint FK_Persons_Companies foreign key (CompanyID) references Companies(ID);

create table Devices (
    ID bigint not null primary key auto_increment,
    CompanyID bigint not null,
    Token varchar(60) not null,
    Name varchar(200) not null,
    AddressID bigint not null,
    PersonID bigint not null,
    Type varchar(50) not null,
    NotificationConfigurationID bigint,
    IsBluetooth bit not null default b'0',
    SettingsEnabled bit not null default b'0',
    IsActive bit not null default b'1',
    DeviceGasLevelID bigint,
    CreatedAt datetime not null default current_timestamp,
    UpdatedAt datetime not null default current_timestamp on update current_timestamp
);

ALTER TABLE Devices ADD CONSTRAINT UK_Devices_Token UNIQUE KEY (Token);

alter table Devices add constraint FK_Devices_Companies foreign key (CompanyID) references Companies(ID);

alter table Devices add constraint FK_Devices_Addresses foreign key (AddressID) references Addresses(ID);

alter table Devices add constraint FK_Devices_Persons foreign key (PersonID) references Persons(ID);

alter table Devices add constraint FK_Devices_NotificationsConfigurations foreign key (NotificationConfigurationID) references NotificationsConfigurations(ID);

alter table Devices add constraint FK_Devices_DevicesGasLevels foreign key (DeviceGasLevelID) references DevicesGasLevels(ID);

create table PaymentMethods (
    ID bigint not null primary key auto_increment,
    Code varchar(100) not null,
    Name varchar(100) not null,
    CompanyID bigint not null,
    HasInstallments bit not null,
    IsDefault bit not null default b'0'
);

alter table PaymentMethods add constraint FK_PaymentMethods_Companies foreign key (CompanyID) references Companies(ID);

create table PersonsPhones (
    ID bigint not null primary key auto_increment,
    PersonID bigint not null,
    Phone varchar(50) not null
);

alter table PersonsPhones add constraint FK_PersonsPhones_Persons foreign key (PersonID) references Persons(ID);

create table RelatedProducts (
    ID bigint not null primary key auto_increment,
    CompanyBranchProductID bigint not nulL,
    ReferencedCompanyBranchProductID bigint not null,
    IsDefault bit not null
);

alter table RelatedProducts add constraint FK_RelatedProducts_CompanyBranchesProducts foreign key (CompanyBranchProductID) references CompanyBranchesProducts(ID);

alter table RelatedProducts add constraint FK_RelatedProducts_CompanyBranchesProducts2 foreign key (ReferencedCompanyBranchProductID) references CompanyBranchesProducts(ID);

create table SaleOrders (
    ID bigint not null primary key auto_increment,
    CompanyBranchID bigint not null,
    EmployeeAgentID bigint not null,
    EmployeeDriverID bigint,
    PersonCustomerID bigint not null,
    DeliveryAddressID bigint not null,
    TotalSalePrice decimal(10,2) not null,
    Status varchar(50) not null,
    `Index` int not null default 0,
    Observation varchar(500),
    ShowObservationToDriver bit not null,
    Source varchar(50) not null default 'REPY',
    DateOfIssue datetime not null,
    ScheduledAt datetime,
    DeliveryStartedAt datetime,
    DeliveredAt datetime,
    CreatedAt datetime not null default current_timestamp,
    UpdatedAt datetime not null default current_timestamp on update current_timestamp
);

alter table SaleOrders add constraint FK_SaleOrders_CompanyBranches foreign key (CompanyBranchID) references CompanyBranches(ID);

alter table SaleOrders add constraint FK_SaleOrders_Employees foreign key (EmployeeAgentID) references Employees(ID);

alter table SaleOrders add constraint FK_SaleOrders_Employees2 foreign key (EmployeeDriverID) references Employees(ID);

alter table SaleOrders add constraint FK_SaleOrders_Persons foreign key (PersonCustomerID) references Persons(ID);

alter table SaleOrders add constraint FK_SaleOrders_Addresses foreign key (DeliveryAddressID) references Addresses(ID);

create table SaleOrderPayments (
    ID bigint not null primary key auto_increment,
    SaleOrderID bigint not null,
    PaymentMethodID bigint not null,
    Value decimal(10,2) not null,
    DueDate datetime not null,
    PayDate datetime,
    CreatedAt datetime not null default current_timestamp,
    UpdatedAt datetime not null default current_timestamp on update current_timestamp
);

alter table SaleOrderPayments add constraint FK_SaleOrderPayments_SaleOrders foreign key (SaleOrderID) references SaleOrders(ID);

alter table SaleOrderPayments add constraint FK_SaleOrderPayments_PaymentMethods foreign key (PaymentMethodID) references PaymentMethods(ID);

create table SaleOrderProducts (
    ID bigint not null primary key auto_increment,
    SaleOrderID bigint not null,
    CompanyBranchProductID bigint not null,
    CompanyBranchProductPriceID bigint not null,
    Quantity decimal(12,4) not null,
    SalePrice decimal(10,2) not null
);

alter table SaleOrderProducts add constraint FK_SaleOrderProducts_SaleOrders foreign key (SaleOrderID) references SaleOrders(ID);

alter table SaleOrderProducts add constraint FK_SaleOrderProducts_CompanyBranchesProducts foreign key (CompanyBranchProductID) references CompanyBranchesProducts(ID);

alter table SaleOrderProducts add constraint FK_SaleOrderProducts_CompanyBranchesProductsPrices foreign key (CompanyBranchProductPriceID) references CompanyBranchesProductsPrices(ID);

create table StockPosts (
    ID bigint not null primary key auto_increment,
    DepositID bigint not null,
    DepositProductID bigint not null,
    Quantity decimal(12,4),
    Observation varchar(200),
    SaleOrderID bigint,
    DateOfIssue datetime not null,
    CreatedAt datetime not null default current_timestamp,
    UpdatedAt datetime not null default current_timestamp on update current_timestamp
);

alter table StockPosts add constraint FK_StockPosts_Deposits foreign key (DepositID) references Deposits(ID);

alter table StockPosts add constraint FK_StockPosts_DepositsProducts foreign key (DepositProductID) references DepositsProducts(ID);

alter table StockPosts add constraint FK_StockPosts_SaleOrders foreign key (SaleOrderID) references SaleOrders(ID);

create table Users (
    ID bigint not null primary key auto_increment,
    `Key` varchar(60) not null,
    CompanyID bigint not null,
    PersonID bigint not null,
    EmployeeID bigint not null,
    Username varchar(100) not null,
    Password varchar(100) not null,
    IsAdmin bit not null,
    IsActive bit not null default b'1',
    CreatedAt datetime not null default current_timestamp,
    UpdatedAt datetime not null default current_timestamp on update current_timestamp
);

alter table Users add constraint UK_Users_Key unique key (`Key`);
alter table Users add constraint UK_Users_Username unique key (Username);

alter table Users add constraint FK_Users_Companies foreign key (CompanyID) references Companies(ID);
alter table Users add constraint FK_Users_Persons foreign key (PersonID) references Persons(ID);
alter table Users add constraint FK_Users_Employees foreign key (EmployeeID) references Employees(ID);