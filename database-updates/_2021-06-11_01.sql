create table DevicesGasLevelsHistoryReads (
	ID bigint not null primary key auto_increment,
	DeviceGasLevelID bigint not null,
	CylinderWeight decimal(10,2) not null,
	ContentWeight decimal(10,2) not null,
	Weight decimal(10,2) not null,
	CreatedAt datetime not null default current_timestamp,
	UpdatedAt datetime not null default current_timestamp on update current_timestamp
);

ALTER TABLE DevicesGasLevelsHistoryReads ADD CONSTRAINT FK_DevicesGasLevelsHistoryReads_DevicesGasLevels FOREIGN KEY (DeviceGasLevelID) REFERENCES DevicesGasLevels(ID);

ALTER TABLE DevicesGasLevels ADD LastHistoryRead datetime DEFAULT '1970-01-01 00:00:00' NOT NULL;
ALTER TABLE DevicesGasLevels ADD AlreadyHistoryRead bit DEFAULT b'0' NOT NULL;
