ALTER TABLE Persons ADD Observation varchar(1000) NULL;
ALTER TABLE Persons CHANGE Observation Observation varchar(1000) NULL AFTER IsActive;
