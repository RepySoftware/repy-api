create table Coordinates (
	ID bigint not null primary key auto_increment,
	Latitude decimal(10,6) not null,
	Longitude decimal(10,6) not null,
	Speed decimal(10,2) not null,
	CreatedAt datetime not null default current_timestamp,
	UpdatedAt datetime not null default current_timestamp on update current_timestamp
);

ALTER TABLE Employees DROP COLUMN CurrentLatitude;
ALTER TABLE Employees DROP COLUMN CurrentLongitude;
ALTER TABLE Employees DROP COLUMN CurrentSpeed;

ALTER TABLE Employees ADD CoordinatesID bigint NULL;
ALTER TABLE Employees CHANGE CoordinatesID CoordinatesID bigint NULL AFTER IsActive;
