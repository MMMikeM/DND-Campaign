ALTER TABLE `quest_prerequisites` RENAME TO `quest_unlock_conditions`;--> statement-breakpoint
ALTER TABLE `quest_unlock_conditions` RENAME COLUMN "prerequisite_type" TO "condition_type";--> statement-breakpoint
ALTER TABLE `quest_unlock_conditions` RENAME COLUMN "unlock_condition" TO "condition_details";--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_quest_unlock_conditions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`relation_id` integer NOT NULL,
	`condition_type` text NOT NULL,
	`condition_details` text NOT NULL,
	`importance` text NOT NULL,
	FOREIGN KEY (`relation_id`) REFERENCES `quest_relations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
DROP TABLE `quest_unlock_conditions`;--> statement-breakpoint
ALTER TABLE `__new_quest_unlock_conditions` RENAME TO `quest_unlock_conditions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;