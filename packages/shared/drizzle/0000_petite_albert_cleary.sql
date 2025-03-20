CREATE TABLE `location_areas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`location_id` integer NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
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
CREATE TABLE `locations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`region` text,
	`description` text NOT NULL,
	`history` text,
	`danger_level` text,
	`faction_control` text,
	`notable_features` text
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
	`stats` text NOT NULL,
	`descriptions` text,
	`personality_traits` text,
	`inventory` text,
	`dialogue` text
);
--> statement-breakpoint
CREATE TABLE `quests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`type` text NOT NULL,
	`difficulty` text NOT NULL,
	`description` text NOT NULL,
	`adaptable` integer DEFAULT true,
	`stages` text,
	`objectives` text,
	`completion_paths` text,
	`decision_points` text,
	`decision_choices` text,
	`twists` text,
	`rewards` text
);
--> statement-breakpoint
CREATE TABLE `faction_allies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`faction_id` integer NOT NULL,
	`ally_id` integer NOT NULL,
	`relationship` text,
	`notes` text,
	FOREIGN KEY (`faction_id`) REFERENCES `factions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`ally_id`) REFERENCES `factions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `faction_enemies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`faction_id` integer NOT NULL,
	`enemy_id` integer NOT NULL,
	`conflict` text,
	`severity` text,
	FOREIGN KEY (`faction_id`) REFERENCES `factions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`enemy_id`) REFERENCES `factions`(`id`) ON UPDATE no action ON DELETE cascade
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
	`notes` text
);
--> statement-breakpoint
CREATE TABLE `area_npcs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`location_id` integer NOT NULL,
	`area_id` integer NOT NULL,
	`npc_id` integer NOT NULL,
	`activity` text,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`npc_id`) REFERENCES `npcs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `district_npcs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`location_id` integer NOT NULL,
	`district_id` integer NOT NULL,
	`npc_id` integer NOT NULL,
	`role` text,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`npc_id`) REFERENCES `npcs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `location_factions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`location_id` integer NOT NULL,
	`faction_id` integer NOT NULL,
	`influence` text,
	`description` text,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`faction_id`) REFERENCES `factions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `npc_factions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`npc_id` integer NOT NULL,
	`faction_id` integer NOT NULL,
	`role` text,
	`status` text,
	FOREIGN KEY (`npc_id`) REFERENCES `npcs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `npc_locations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`npc_id` integer NOT NULL,
	`location_id` integer NOT NULL,
	`context` text,
	FOREIGN KEY (`npc_id`) REFERENCES `npcs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `npc_quests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`npc_id` integer NOT NULL,
	`quest_id` integer NOT NULL,
	`role` text,
	FOREIGN KEY (`npc_id`) REFERENCES `npcs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `quest_factions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quest_id` integer NOT NULL,
	`faction_id` integer NOT NULL,
	`role` text,
	`interest` text,
	FOREIGN KEY (`quest_id`) REFERENCES `quests`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`faction_id`) REFERENCES `factions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `quest_locations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quest_id` integer NOT NULL,
	`location_id` integer NOT NULL,
	`description` text,
	`stage` integer,
	FOREIGN KEY (`quest_id`) REFERENCES `quests`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `quest_associated_npcs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quest_id` integer NOT NULL,
	`npc_id` integer NOT NULL,
	`role` text,
	`importance` text,
	FOREIGN KEY (`quest_id`) REFERENCES `quests`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`npc_id`) REFERENCES `npcs`(`id`) ON UPDATE no action ON DELETE no action
);
