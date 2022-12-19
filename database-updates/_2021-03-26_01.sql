ALTER TABLE Addresses ADD Neighborhood varchar(400) NULL;
ALTER TABLE Addresses CHANGE Neighborhood Neighborhood varchar(400) NULL AFTER ZipCode;
ALTER TABLE Addresses CHANGE ZipCode ZipCode varchar(40) CHARACTER SET utf8 COLLATE utf8_general_ci NULL AFTER `Number`;
ALTER TABLE Addresses ADD `Number` varchar(100) NULL;
ALTER TABLE Addresses CHANGE `Number` `Number` varchar(100) NULL AFTER Street;

ALTER TABLE Addresses ADD Description varchar(400) NOT NULL;
ALTER TABLE Addresses CHANGE Description Description varchar(400) NOT NULL AFTER ID;


CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `ViewPersonsSearch` AS
select
    `p`.`ID` AS `ID`,
    `p`.`Name` AS `Name`,
    `p`.`TradeName` AS `TradeName`,
    `p`.`DocumentNumber` AS `DocumentNumber`,
    `p`.`CompanyID` AS `CompanyID`,
    `p`.`IsSupplier` AS `IsSupplier`,
    `p`.`IsCustomer` AS `IsCustomer`,
    `p`.`IsGasCustomer` AS `IsGasCustomer`,
    `p`.`IsActive` AS `IsActive`,
    (
    select
        group_concat(`pp`.`Phone` separator ',')
    from
        `PersonsPhones` `pp`
    where
        (`pp`.`PersonID` = `p`.`ID`)) AS `Phones`,
    `a`.`Description` AS `AddressDescription`,
    `a`.`Street` AS `AddressStreet`,
    `a`.`Number` AS `AddressNumber`,
    `a`.`Neighborhood` AS `AddressNeighborhood`,
    `a`.`City` AS `AddressCity`,
    `a`.`Region` AS `AddressRegion`,
    `a`.`Country` AS `AddressCountry`,
    `a`.`Complement` AS `AddressComplement`,
    `a`.`ReferencePoint` AS `AddressReferencePoint`,
    concat(ifnull(`a`.`Description`, ''), ifnull(`a`.`Street`, ''), ifnull(`a`.`Number`, ''), ifnull(`a`.`Neighborhood`, ''), ifnull(`a`.`Complement`, ''), ifnull(`a`.`ReferencePoint`, '')) AS `AddressSearch`,
    (
    select
        group_concat(`pp`.`Phone` separator ',')
    from
        `PersonsPhones` `pp`
    where
        (`pp`.`PersonID` = `p`.`ID`)) AS `PhonesSearch`,
    concat(ifnull(`p`.`Name`, ''), ifnull(`p`.`TradeName`, '')) AS `NameSearch`,
    cast(concat(ifnull(`p`.`ID`, ''), ifnull(`p`.`Name`, ''), ifnull(`p`.`TradeName`, ''), ifnull(`p`.`DocumentNumber`, ''), ifnull(`p`.`IsSupplier`, ''), ifnull(`p`.`IsCustomer`, ''), ifnull(`p`.`IsActive`, ''), ifnull(`a`.`Description`, ''), ifnull(`a`.`Complement`, ''), ifnull(`a`.`ReferencePoint`, ''), ifnull((select group_concat(`pp`.`Phone` separator ',') from `PersonsPhones` `pp`), '')) as char(800) charset utf8) AS `GeneralSearch`
from
    (`Persons` `p`
left join `Addresses` `a` on
    ((`p`.`AddressID` = `a`.`ID`)));

CREATE DEFINER=`rootdb`@`%` FUNCTION `SPLIT_STR`(
  x VARCHAR(255),
  delim VARCHAR(12),
  pos INT
) RETURNS varchar(255) CHARSET utf8
RETURN REPLACE(SUBSTRING(SUBSTRING_INDEX(x, delim, pos),
       LENGTH(SUBSTRING_INDEX(x, delim, pos -1)) + 1),
       delim, '')


update Addresses set Street = Description;
update Addresses set Street = trim(split_str(Description, ',', 1));
update Addresses set Number = trim(split_str(trim(split_str(Description, ',', 2)), ' ', 1));
update Addresses set Neighborhood = trim(split_str(Description, '-', 2));

delete from PersonsPhones
where ID in (
	select ID from Persons p 
	where AddressID in (
		select ID from Addresses a where Neighborhood = 'Curitiba'
	)
)

delete from Persons
where AddressID in (
	select ID from Addresses a where Neighborhood = 'Curitiba'
);

delete from Addresses where Neighborhood = 'Curitiba';

update Addresses
set Number = null
where trim(Number) = '';

update Addresses
set Complement = null
where trim(Complement) = '';

update Addresses
set ReferencePoint = null
where trim(ReferencePoint) = '';

update Addresses
set ZipCode = null
where trim(ZipCode) = '';