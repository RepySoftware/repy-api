ALTER TABLE SaleOrders ADD DateOfIssue datetime NULL;
ALTER TABLE SaleOrders CHANGE DateOfIssue DateOfIssue datetime NULL FIRST;
ALTER TABLE SaleOrders CHANGE DateOfIssue DateOfIssue datetime NULL AFTER Observation;

update SaleOrders set DateOfIssue = CreatedAt;

ALTER TABLE SaleOrders MODIFY COLUMN DateOfIssue datetime NOT NULL;

