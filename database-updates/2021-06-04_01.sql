ALTER TABLE StockPosts ADD SaleOrderID bigint NULL;
ALTER TABLE StockPosts CHANGE SaleOrderID SaleOrderID bigint NULL AFTER Observation;
ALTER TABLE StockPosts ADD CONSTRAINT FK_StockPosts_SaleOrders FOREIGN KEY (SaleOrderID) REFERENCES SaleOrders(ID);