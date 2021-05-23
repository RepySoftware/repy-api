ALTER TABLE Employees ADD CurrentLatitude decimal(10,6) NULL;
ALTER TABLE Employees CHANGE CurrentLatitude CurrentLatitude decimal(10,6) NULL AFTER IsActive;
ALTER TABLE Employees ADD CurrentLongitude decimal(10,6) NULL;
ALTER TABLE Employees CHANGE CurrentLongitude CurrentLongitude decimal(10,6) NULL AFTER CurrentLatitude;
ALTER TABLE Employees ADD CurrentSpeed decimal(10,2) NULL;
ALTER TABLE Employees CHANGE CurrentSpeed CurrentSpeed decimal(10,2) NULL AFTER CurrentLongitude;
