ALTER TABLE Devices ADD SettingsEnabled bit DEFAULT 0 NOT NULL;
ALTER TABLE Devices CHANGE SettingsEnabled SettingsEnabled bit DEFAULT 0 NOT NULL AFTER IsBluetooth;