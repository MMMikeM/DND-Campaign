PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_quest_unlock_conditions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quest_id` integer NOT NULL,
	`condition_type` text NOT NULL,
	`condition_details` text NOT NULL,
	`importance` text NOT NULL,
	FOREIGN KEY (`quest_id`) REFERENCES `quests`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
DROP TABLE `quest_unlock_conditions`;--> statement-breakpoint
ALTER TABLE `__new_quest_unlock_conditions` RENAME TO `quest_unlock_conditions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;