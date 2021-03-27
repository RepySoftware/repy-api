ALTER TABLE SaleOrders ADD Observation varchar(1000) NULL;
ALTER TABLE SaleOrders CHANGE Observation Observation varchar(1000) NULL AFTER `Index`;
