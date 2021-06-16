ALTER TABLE DevicesGasLevels ADD WarningPercentage decimal(10,2) DEFAULT 20 NOT NULL;
ALTER TABLE DevicesGasLevels ADD DangerPercentage decimal(10,2) DEFAULT 10 NOT NULL;
