RENAME TABLE DepositsCompanyBranchProducts TO DepositsProducts;

create table StockPosts (
	ID bigint not null primary key auto_increment,
	DepositID bigint not null,
	DepositProductID bigint not null,
	Quantity int not null,
	Observation varchar(200),
	CreatedAt datetime default current_timestamp,
	UpdatedAt datetime default current_timestamp on update current_timestamp
);

ALTER TABLE StockPosts ADD CONSTRAINT FK_StockPosts_Deposits FOREIGN KEY (DepositID) REFERENCES Deposits(ID);
ALTER TABLE StockPosts ADD CONSTRAINT FK_StockPosts_DepositsProducts FOREIGN KEY (DepositProductID) REFERENCES DepositsProducts(ID);

ALTER TABLE DepositsProducts ADD CONSTRAINT DepositsProducts_Deposits FOREIGN KEY (DepositID) REFERENCES Deposits(ID);
ALTER TABLE DepositsProducts ADD CONSTRAINT DepositsProducts_CompanyBranchesProducts FOREIGN KEY (CompanyBranchProductID) REFERENCES CompanyBranchesProducts(ID);