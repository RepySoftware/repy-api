ALTER TABLE DeliveryInstructions ADD CheckableByDriver bit DEFAULT b'0' NOT NULL;
ALTER TABLE DeliveryInstructions CHANGE CheckableByDriver CheckableByDriver bit DEFAULT b'0' NOT NULL AFTER CompanyID;

ALTER TABLE DeliveryInstructions MODIFY COLUMN CheckableByDriver bit(1) NOT NULL;