PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_faction_headquarters` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`faction_id` integer NOT NULL,
	`location_id` integer NOT NULL,
	`description` text NOT NULL,
	`creative_prompts` text NOT NULL,
	FOREIGN KEY (`faction_id`) REFERENCES `factions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_faction_headquarters`("id", "faction_id", "location_id", "description", "creative_prompts") SELECT "id", "faction_id", "location_id", "description", "creative_prompts" FROM `faction_headquarters`;--> statement-breakpoint
DROP TABLE `faction_headquarters`;--> statement-breakpoint
ALTER TABLE `__new_faction_headquarters` RENAME TO `faction_headquarters`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `faction_headquarters_faction_id_location_id_unique` ON `faction_headquarters` (`faction_id`,`location_id`);--> statement-breakpoint
CREATE TABLE `__new_faction_relationships` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`faction_id` integer NOT NULL,
	`other_faction_id` integer NOT NULL,
	`strength` text NOT NULL,
	`type` text NOT NULL,
	`description` text NOT NULL,
	`creative_prompts` text NOT NULL,
	FOREIGN KEY (`faction_id`) REFERENCES `factions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`other_faction_id`) REFERENCES `factions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_faction_relationships`("id", "faction_id", "other_faction_id", "strength", "type", "description", "creative_prompts") SELECT "id", "faction_id", "other_faction_id", "strength", "type", "description", "creative_prompts" FROM `faction_relationships`;--> statement-breakpoint
DROP TABLE `faction_relationships`;--> statement-breakpoint
ALTER TABLE `__new_faction_relationships` RENAME TO `faction_relationships`;--> statement-breakpoint
CREATE UNIQUE INDEX `faction_relationships_faction_id_other_faction_id_unique` ON `faction_relationships` (`faction_id`,`other_faction_id`);--> statement-breakpoint
ALTER TABLE `quests` DROP COLUMN `prerequisites`;