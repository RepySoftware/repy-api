ALTER TABLE Employees ADD Color varchar(100) NULL;
ALTER TABLE Employees CHANGE Color Color varchar(100) NULL AFTER CompanyID;
