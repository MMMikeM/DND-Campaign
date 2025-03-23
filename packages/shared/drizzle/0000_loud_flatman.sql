CREATE TABLE `location_areas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`location_id` integer NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`area_type` text NOT NULL,
	`environment` text NOT NULL,
	`terrain` text NOT NULL,
	`climate` text NOT NULL,
	`features` text NOT NULL,
	`encounters` text NOT NULL,
	`treasures` text NOT NULL,
	`creatures` text NOT NULL,
	`plants` text NOT NULL,
	`loot` text NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `location_encounters` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`location_id` integer NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`encounter_type` text NOT NULL,
	`difficulty` text,
	`creatures` text,
	`treasure` text,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `location_relations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`location_id` integer NOT NULL,
	`other_location_id` integer NOT NULL,
	`description` text,
	`notes` text,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`other_location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `locations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`region` text NOT NULL,
	`description` text NOT NULL,
	`history` text NOT NULL,
	`danger_level` text NOT NULL,
	`notable_features` text NOT NULL,
	`secrets` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `npc_relationships` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`npc_id` integer NOT NULL,
	`related_npc_id` integer NOT NULL,
	`relationship_type` text NOT NULL,
	`description` text NOT NULL,
	FOREIGN KEY (`npc_id`) REFERENCES `npcs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`related_npc_id`) REFERENCES `npcs`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `npcs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`race` text NOT NULL,
	`gender` text NOT NULL,
	`occupation` text NOT NULL,
	`role` text,
	`quirk` text,
	`background` text NOT NULL,
	`motivation` text NOT NULL,
	`secret` text NOT NULL,
	`descriptions` text,
	`personality_traits` text,
	`items` text,
	`knowledge` text,
	`dialogue` text
);
--> statement-breakpoint
CREATE TABLE `quest_decisions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quest_stage_id` integer NOT NULL,
	`description` text NOT NULL,
	`options` text NOT NULL,
	`consequences` text,
	FOREIGN KEY (`quest_stage_id`) REFERENCES `quest_stages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `quest_stages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quest_id` integer NOT NULL,
	`stage` integer NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`objectives` text,
	`completion_paths` text,
	`encounters` text,
	`locations` text,
	FOREIGN KEY (`quest_id`) REFERENCES `quests`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `quests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`difficulty` text NOT NULL,
	`description` text NOT NULL,
	`objectives` text,
	`rewards` text,
	`prerequisites` text,
	`hooks` text,
	`clues` text,
	`timeframe` text
);
--> statement-breakpoint
CREATE TABLE `related_quests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quest_id` integer NOT NULL,
	`related_quest_id` integer NOT NULL,
	`relationship_type` text NOT NULL,
	`description` text,
	`is_required` integer DEFAULT false,
	FOREIGN KEY (`quest_id`) REFERENCES `quests`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`related_quest_id`) REFERENCES `quests`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `faction_relationships` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`faction_id` integer NOT NULL,
	`other_faction_id` integer NOT NULL,
	`type` text NOT NULL,
	`description` text,
	`strength` text,
	`notes` text,
	FOREIGN KEY (`faction_id`) REFERENCES `factions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`other_faction_id`) REFERENCES `factions`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `factions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`alignment` text,
	`description` text,
	`public_goal` text,
	`true_goal` text,
	`headquarters` text,
	`territory` text,
	`history` text,
	`notes` text,
	`resources` text
);
--> statement-breakpoint
CREATE TABLE `location_factions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`location_id` integer NOT NULL,
	`faction_id` integer NOT NULL,
	`influence` text,
	`description` text NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`faction_id`) REFERENCES `factions`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `area_npcs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`location_id` integer NOT NULL,
	`area_id` integer NOT NULL,
	`npc_id` integer NOT NULL,
	`activity` text NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`npc_id`) REFERENCES `npcs`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `npc_factions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`npc_id` integer NOT NULL,
	`faction_id` integer NOT NULL,
	`role` text NOT NULL,
	`status` text NOT NULL,
	FOREIGN KEY (`npc_id`) REFERENCES `npcs`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`faction_id`) REFERENCES `factions`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `npc_locations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`npc_id` integer NOT NULL,
	`location_id` integer NOT NULL,
	`context` text,
	FOREIGN KEY (`npc_id`) REFERENCES `npcs`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `npc_quests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`npc_id` integer NOT NULL,
	`quest_id` integer NOT NULL,
	`role` text NOT NULL,
	`notes` text,
	FOREIGN KEY (`npc_id`) REFERENCES `npcs`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`quest_id`) REFERENCES `quests`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `npc_significant_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`npc_id` integer NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`type` text NOT NULL,
	`significance` text NOT NULL,
	`quest_id` integer,
	FOREIGN KEY (`npc_id`) REFERENCES `npcs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`quest_id`) REFERENCES `quests`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `quest_clues` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quest_id` integer NOT NULL,
	`description` text NOT NULL,
	`location_id` integer,
	`npc_id` integer,
	`discovery_condition` text,
	`points_to` text NOT NULL,
	FOREIGN KEY (`quest_id`) REFERENCES `quests`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`npc_id`) REFERENCES `npcs`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `quest_factions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quest_id` integer NOT NULL,
	`faction_id` integer NOT NULL,
	`role` text NOT NULL,
	`interest` text,
	FOREIGN KEY (`quest_id`) REFERENCES `quests`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`faction_id`) REFERENCES `factions`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `quest_locations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quest_id` integer NOT NULL,
	`location_id` integer NOT NULL,
	`description` text NOT NULL,
	`stage` integer,
	FOREIGN KEY (`quest_id`) REFERENCES `quests`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `quest_associated_npcs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quest_id` integer NOT NULL,
	`npc_id` integer NOT NULL,
	`role` text NOT NULL,
	`importance` text,
	`notes` text,
	FOREIGN KEY (`quest_id`) REFERENCES `quests`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`npc_id`) REFERENCES `npcs`(`id`) ON UPDATE no action ON DELETE set null
);
