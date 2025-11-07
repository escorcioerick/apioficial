CREATE TABLE `calculations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`country` varchar(100) NOT NULL,
	`volume` int NOT NULL,
	`messageType` enum('marketing','utility','authentication') NOT NULL,
	`currency` enum('USD','BRL') NOT NULL,
	`totalCost` varchar(50) NOT NULL,
	`costPerMessage` varchar(50) NOT NULL,
	`exchangeRate` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `calculations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `countryRates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`country` varchar(100) NOT NULL,
	`marketingRate` varchar(20) NOT NULL,
	`utilityRate` varchar(20) NOT NULL,
	`authenticationRate` varchar(20) NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `countryRates_id` PRIMARY KEY(`id`),
	CONSTRAINT `countryRates_country_unique` UNIQUE(`country`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`surname` varchar(255),
	`phone` varchar(50) NOT NULL,
	`email` varchar(320) NOT NULL,
	`company` varchar(255) NOT NULL,
	`country` varchar(100),
	`volume` int,
	`messageType` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `calculations` ADD CONSTRAINT `calculations_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;