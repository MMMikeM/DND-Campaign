PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_faction_influence` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`faction_id` integer NOT NULL,
	`quest_id` integer,
	`region_id` integer,
	`location_id` integer,
	`influence_level` text NOT NULL,
	`description` text NOT NULL,
	`creative_prompts` text NOT NULL,
	FOREIGN KEY (`faction_id`) REFERENCES `factions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`quest_id`) REFERENCES `quests`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`region_id`) REFERENCES `regions`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_faction_influence`("id", "faction_id", "quest_id", "region_id", "location_id", "influence_level", "description", "creative_prompts") SELECT "id", "faction_id", "quest_id", "region_id", "location_id", "influence_level", "description", "creative_prompts" FROM `faction_influence`;--> statement-breakpoint
DROP TABLE `faction_influence`;--> statement-breakpoint
ALTER TABLE `__new_faction_influence` RENAME TO `faction_influence`;--> statement-breakpoint
PRAGMA foreign_keys=ON;