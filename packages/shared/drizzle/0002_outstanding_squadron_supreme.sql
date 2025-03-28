CREATE TABLE `quest_hook_npcs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`hook_id` integer NOT NULL,
	`npc_id` integer NOT NULL,
	`relationship` text NOT NULL,
	`trust_required` text NOT NULL,
	`dialogue_hint` text NOT NULL,
	FOREIGN KEY (`hook_id`) REFERENCES `quest_hooks`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`npc_id`) REFERENCES `npcs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `quest_hook_npcs_hook_id_npc_id_unique` ON `quest_hook_npcs` (`hook_id`,`npc_id`);--> statement-breakpoint
CREATE TABLE `quest_hooks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`stage_id` integer NOT NULL,
	`location_id` integer,
	`faction_id` integer,
	`item_id` integer,
	`source` text NOT NULL,
	`description` text NOT NULL,
	`creative_prompts` text NOT NULL,
	`discovery_condition` text NOT NULL,
	`hook_type` text NOT NULL,
	`presentation` text NOT NULL,
	`hook_content` text NOT NULL,
	FOREIGN KEY (`stage_id`) REFERENCES `quest_stages`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`faction_id`) REFERENCES `factions`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE set null
);
