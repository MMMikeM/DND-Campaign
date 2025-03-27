ALTER TABLE `quest_dependencies` RENAME TO `quest_prerequisites`;--> statement-breakpoint
ALTER TABLE `quest_prerequisites` RENAME COLUMN "dependency_type" TO "prerequisite_type";--> statement-breakpoint
DROP TABLE `quest_consequences`;--> statement-breakpoint
DROP TABLE `quest_stage_links`;--> statement-breakpoint
DROP TABLE `quest_decisions`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_quest_prerequisites` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`relation_id` integer NOT NULL,
	`prerequisite_type` text NOT NULL,
	`unlock_condition` text NOT NULL,
	FOREIGN KEY (`relation_id`) REFERENCES `quest_relations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_quest_prerequisites`("id", "relation_id", "prerequisite_type", "unlock_condition") SELECT "id", "relation_id", "prerequisite_type", "unlock_condition" FROM `quest_prerequisites`;--> statement-breakpoint
DROP TABLE `quest_prerequisites`;--> statement-breakpoint
ALTER TABLE `__new_quest_prerequisites` RENAME TO `quest_prerequisites`;--> statement-breakpoint
PRAGMA foreign_keys=ON;