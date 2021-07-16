ALTER TABLE Devices ADD CompanyID bigint NULL;
ALTER TABLE Devices CHANGE CompanyID CompanyID bigint NULL AFTER ID;

update Devices set CompanyID = 1;

ALTER TABLE Devices ADD CONSTRAINT FK_Devices_Companies FOREIGN KEY (CompanyID) REFERENCES Companies(ID);

