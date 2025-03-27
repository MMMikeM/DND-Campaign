PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_locations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`region_id` integer,
	`location_type` text NOT NULL,
	`name` text NOT NULL,
	`terrain` text NOT NULL,
	`climate` text NOT NULL,
	`mood` text NOT NULL,
	`environment` text NOT NULL,
	`creative_prompts` text NOT NULL,
	`creatures` text NOT NULL,
	`description` text NOT NULL,
	`features` text NOT NULL,
	`treasures` text NOT NULL,
	`lighting_description` text NOT NULL,
	`soundscape` text NOT NULL,
	`smells` text NOT NULL,
	`weather` text NOT NULL,
	`descriptors` text NOT NULL,
	FOREIGN KEY (`region_id`) REFERENCES `regions`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
-- Insert data from old table but handle environment appropriately
INSERT INTO `__new_locations` (
    `id`, `region_id`, `location_type`, `name`, `terrain`, `climate`, 
    `mood`, `environment`, `creative_prompts`, `creatures`, 
    `description`, `features`, `treasures`, `lighting_description`, 
    `soundscape`, `smells`, `weather`, `descriptors`
) 
SELECT 
    `id`, `region_id`, `location_type`, `name`, `terrain`, `climate`, 
    COALESCE(`mood`, '"peaceful"'), 
    COALESCE(`environment`, '"urban"'),
    `creative_prompts`, `creatures`, `description`, 
    `features`, `treasures`, 
    COALESCE(`lighting_level`, '[]'),
    COALESCE(`soundscape`, '[]'),
    COALESCE(`smells`, '[]'),
    COALESCE(`weather`, '[]'),
    COALESCE(`descriptors`, '[]')
FROM `locations`;
--> statement-breakpoint
DROP TABLE `locations`;--> statement-breakpoint
ALTER TABLE `__new_locations` RENAME TO `locations`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `locations_name_unique` ON `locations` (`name`);--> statement-breakpoint
CREATE TABLE `__new_regions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`danger_level` text NOT NULL,
	`type` text NOT NULL,
	`economy` text NOT NULL,
	`history` text NOT NULL,
	`population` text NOT NULL,
	`cultural_notes` text NOT NULL,
	`description` text NOT NULL,
	`creative_prompts` text NOT NULL,
	`hazards` text NOT NULL,
	`points_of_interest` text NOT NULL,
	`rumors` text NOT NULL,
	`secrets` text NOT NULL,
	`defenses` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_regions`("id", "name", "danger_level", "type", "economy", "history", "population", "cultural_notes", "description", "creative_prompts", "hazards", "points_of_interest", "rumors", "secrets", "defenses") SELECT "id", "name", "danger_level", "type", "economy", "history", "population", "cultural_notes", "description", "creative_prompts", "hazards", "points_of_interest", "rumors", "secrets", "defenses" FROM `regions`;--> statement-breakpoint
DROP TABLE `regions`;--> statement-breakpoint
ALTER TABLE `__new_regions` RENAME TO `regions`;--> statement-breakpoint
CREATE UNIQUE INDEX `regions_name_unique` ON `regions` (`name`);--> statement-breakpoint
CREATE TABLE `__new_quest_hooks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quest_id` integer NOT NULL,
	`location_id` integer,
	`stage_id` integer,
	`faction_id` integer,
	`item_id` integer,
	`source` text NOT NULL,
	`description` text NOT NULL,
	`creative_prompts` text NOT NULL,
	`discovery_condition` text NOT NULL,
	`hook_type` text NOT NULL,
	`presentation` text NOT NULL,
	`hook_content` text NOT NULL,
	FOREIGN KEY (`quest_id`) REFERENCES `quests`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`stage_id`) REFERENCES `quest_stages`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`faction_id`) REFERENCES `factions`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`item_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_quest_hooks`("id", "quest_id", "location_id", "stage_id", "faction_id", "item_id", "source", "description", "creative_prompts", "discovery_condition", "hook_type", "presentation", "hook_content") SELECT "id", "quest_id", "location_id", "stage_id", "faction_id", "item_id", "source", "description", "creative_prompts", "discovery_condition", "hook_type", "presentation", "hook_content" FROM `quest_hooks`;--> statement-breakpoint
DROP TABLE `quest_hooks`;--> statement-breakpoint
ALTER TABLE `__new_quest_hooks` RENAME TO `quest_hooks`;--> statement-breakpoint
ALTER TABLE `stage_decisions` DROP COLUMN `dramatically_interesting`;