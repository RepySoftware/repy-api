ALTER TABLE NotificationsConfigurations ADD WhatsAppsToNotify varchar(5000) DEFAULT '[]' NULL;
ALTER TABLE NotificationsConfigurations CHANGE WhatsAppsToNotify WhatsAppsToNotify varchar(5000) DEFAULT '[]' NULL AFTER EmailsToNotify;
