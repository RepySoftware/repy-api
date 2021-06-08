create table RelatedProducts (
	ID bigint not null primary key auto_increment,
	CompanyBranchProductID bigint not null,
	ReferencedCompanyBranchProductID bigint not null
);

ALTER TABLE RelatedProducts ADD CONSTRAINT FK_RelatedProducts_CompanyBranchesProducts FOREIGN KEY (CompanyBranchProductID) REFERENCES CompanyBranchesProducts(ID);
ALTER TABLE RelatedProducts ADD CONSTRAINT FK_RelatedProducts_CompanyBranchesProducts2 FOREIGN KEY (ReferencedCompanyBranchProductID) REFERENCES CompanyBranchesProducts(ID);

ALTER TABLE RelatedProducts ADD IsDefault bit DEFAULT b'0' NOT NULL;
