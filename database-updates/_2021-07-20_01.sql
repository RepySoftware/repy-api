ALTER TABLE Devices ADD IsBluetooth bit DEFAULT 0 NOT NULL;
ALTER TABLE Devices CHANGE IsBluetooth IsBluetooth bit DEFAULT 0 NOT NULL AFTER NotificationConfigurationID;