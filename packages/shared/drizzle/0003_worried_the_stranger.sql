CREATE TABLE `decision_consequences` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`decision_id` integer NOT NULL,
	`affected_stage_id` integer,
	`delay_factor` text NOT NULL,
	`consequence_type` text NOT NULL,
	`description` text NOT NULL,
	`creative_prompts` text NOT NULL,
	`severity` text NOT NULL,
	`visibility` text NOT NULL,
	FOREIGN KEY (`decision_id`) REFERENCES `stage_decisions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`affected_stage_id`) REFERENCES `quest_stages`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `stage_decisions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quest_id` integer NOT NULL,
	`from_stage_id` integer NOT NULL,
	`to_stage_id` integer,
	`condition_type` text NOT NULL,
	`dramatically_interesting` integer,
	`name` text NOT NULL,
	`condition_value` text NOT NULL,
	`success_description` text NOT NULL,
	`failure_description` text NOT NULL,
	`narrative_transition` text NOT NULL,
	`decision_type` text NOT NULL,
	`potential_player_reactions` text NOT NULL,
	`description` text NOT NULL,
	`creative_prompts` text NOT NULL,
	`options` text NOT NULL,
	FOREIGN KEY (`quest_id`) REFERENCES `quests`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`from_stage_id`) REFERENCES `quest_stages`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`to_stage_id`) REFERENCES `quest_stages`(`id`) ON UPDATE no action ON DELETE set null
);
