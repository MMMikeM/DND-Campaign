CREATE TABLE `location_atmosphere` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`location_id` integer NOT NULL,
	`time_context` text NOT NULL,
	`lighting_level` text NOT NULL,
	`mood` text NOT NULL,
	`soundscape` text NOT NULL,
	`smells` text NOT NULL,
	`weather` text NOT NULL,
	`descriptors` text NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `location_encounters` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`location_id` integer NOT NULL,
	`encounter_type` text NOT NULL,
	`danger_level` text NOT NULL,
	`difficulty` text NOT NULL,
	`description` text NOT NULL,
	`creative_prompts` text NOT NULL,
	`creatures` text NOT NULL,
	`treasure` text NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `location_encounters_name_unique` ON `location_encounters` (`name`);--> statement-breakpoint
CREATE TABLE `location_relations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`location_id` integer NOT NULL,
	`other_location_id` integer,
	`description` text NOT NULL,
	`creative_prompts` text NOT NULL,
	`relation_type` text NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`other_location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `location_secrets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`location_id` integer NOT NULL,
	`secret_type` text NOT NULL,
	`difficulty` text NOT NULL,
	`discovery_method` text NOT NULL,
	`description` text NOT NULL,
	`creative_prompts` text NOT NULL,
	`consequences` text NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `locations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`region_id` integer,
	`location_type` text NOT NULL,
	`name` text NOT NULL,
	`terrain` text NOT NULL,
	`climate` text NOT NULL,
	`creative_prompts` text NOT NULL,
	`creatures` text NOT NULL,
	`description` text NOT NULL,
	`environment` text,
	`features` text NOT NULL,
	`treasures` text NOT NULL,
	FOREIGN KEY (`region_id`) REFERENCES `regions`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `locations_name_unique` ON `locations` (`name`);--> statement-breakpoint
CREATE TABLE `region_relations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`region_id` integer NOT NULL,
	`other_region_id` integer,
	`relation_type` text NOT NULL,
	`description` text NOT NULL,
	`creative_prompts` text NOT NULL,
	FOREIGN KEY (`region_id`) REFERENCES `regions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`other_region_id`) REFERENCES `regions`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `regions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
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
CREATE UNIQUE INDEX `regions_name_unique` ON `regions` (`name`);--> statement-breakpoint
CREATE TABLE `faction_culture` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`faction_id` integer NOT NULL,
	`symbols` text NOT NULL,
	`rituals` text NOT NULL,
	`taboos` text NOT NULL,
	`aesthetics` text NOT NULL,
	`jargon` text NOT NULL,
	`recognition_signs` text NOT NULL,
	FOREIGN KEY (`faction_id`) REFERENCES `factions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `faction_headquarters` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`faction_id` integer NOT NULL,
	`location_id` integer,
	`description` text NOT NULL,
	`creative_prompts` text NOT NULL,
	FOREIGN KEY (`faction_id`) REFERENCES `factions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `faction_operations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`faction_id` integer NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`scale` text NOT NULL,
	`status` text NOT NULL,
	`description` text NOT NULL,
	`creative_prompts` text NOT NULL,
	`objectives` text NOT NULL,
	`locations` text NOT NULL,
	`involved_npcs` text NOT NULL,
	`priority` text NOT NULL,
	FOREIGN KEY (`faction_id`) REFERENCES `factions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `faction_operations_name_unique` ON `faction_operations` (`name`);--> statement-breakpoint
CREATE TABLE `faction_regions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`faction_id` integer NOT NULL,
	`region_id` integer,
	`control_level` text NOT NULL,
	`presence` text NOT NULL,
	`priorities` text NOT NULL,
	FOREIGN KEY (`faction_id`) REFERENCES `factions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`region_id`) REFERENCES `regions`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `faction_relationships` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`faction_id` integer NOT NULL,
	`other_faction_id` integer,
	`strength` text NOT NULL,
	`type` text NOT NULL,
	`description` text NOT NULL,
	`creative_prompts` text NOT NULL,
	FOREIGN KEY (`faction_id`) REFERENCES `factions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`other_faction_id`) REFERENCES `factions`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `factions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`alignment` text NOT NULL,
	`size` text NOT NULL,
	`wealth` text NOT NULL,
	`reach` text NOT NULL,
	`type` text NOT NULL,
	`public_goal` text NOT NULL,
	`public_perception` text NOT NULL,
	`secret_goal` text,
	`description` text NOT NULL,
	`values` text NOT NULL,
	`history` text NOT NULL,
	`notes` text NOT NULL,
	`resources` text NOT NULL,
	`recruitment` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `factions_name_unique` ON `factions` (`name`);--> statement-breakpoint
CREATE TABLE `quest_consequences` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`trigger_stage_id` integer NOT NULL,
	`manifestation_stage_id` integer NOT NULL,
	`delay_factor` text NOT NULL,
	`consequence_type` text NOT NULL,
	`description` text NOT NULL,
	`creative_prompts` text NOT NULL,
	FOREIGN KEY (`trigger_stage_id`) REFERENCES `quest_stages`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`manifestation_stage_id`) REFERENCES `quest_stages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `quest_dependencies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`relation_id` integer NOT NULL,
	`dependency_type` text NOT NULL,
	`unlock_condition` text NOT NULL,
	FOREIGN KEY (`relation_id`) REFERENCES `quest_relations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `quest_relations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quest_id` integer NOT NULL,
	`related_quest_id` integer,
	`relation_type` text NOT NULL,
	`description` text NOT NULL,
	`creative_prompts` text NOT NULL,
	FOREIGN KEY (`quest_id`) REFERENCES `quests`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`related_quest_id`) REFERENCES `quests`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `quest_stage_links` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quest_id` integer NOT NULL,
	`from_stage_id` integer NOT NULL,
	`to_stage_id` integer NOT NULL,
	`condition_type` text NOT NULL,
	`dramatically_interesting` integer,
	`link_name` text NOT NULL,
	`condition_value` text NOT NULL,
	`success_description` text NOT NULL,
	`failure_description` text NOT NULL,
	`narrative_transition` text NOT NULL,
	FOREIGN KEY (`quest_id`) REFERENCES `quests`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`from_stage_id`) REFERENCES `quest_stages`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`to_stage_id`) REFERENCES `quest_stages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `quest_stages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quest_id` integer NOT NULL,
	`location_id` integer,
	`stage` integer NOT NULL,
	`name` text NOT NULL,
	`dramatic_question` text NOT NULL,
	`description` text NOT NULL,
	`creative_prompts` text NOT NULL,
	`objectives` text NOT NULL,
	`completion_paths` text NOT NULL,
	`encounters` text NOT NULL,
	`locations` text NOT NULL,
	`dramatic_moments` text NOT NULL,
	`sensory_elements` text NOT NULL,
	FOREIGN KEY (`quest_id`) REFERENCES `quests`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `quest_stages_name_unique` ON `quest_stages` (`name`);--> statement-breakpoint
CREATE TABLE `quest_twists` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quest_id` integer NOT NULL,
	`twist_type` text NOT NULL,
	`impact` text NOT NULL,
	`narrative_placement` text NOT NULL,
	`description` text NOT NULL,
	`creative_prompts` text NOT NULL,
	FOREIGN KEY (`quest_id`) REFERENCES `quests`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `quests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`region_id` integer,
	`type` text NOT NULL,
	`urgency` text NOT NULL,
	`visibility` text NOT NULL,
	`mood` text NOT NULL,
	`description` text NOT NULL,
	`creative_prompts` text NOT NULL,
	`failure_outcomes` text NOT NULL,
	`success_outcomes` text NOT NULL,
	`objectives` text NOT NULL,
	`prerequisites` text NOT NULL,
	`rewards` text NOT NULL,
	`themes` text NOT NULL,
	`inspirations` text NOT NULL,
	FOREIGN KEY (`region_id`) REFERENCES `regions`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `quests_name_unique` ON `quests` (`name`);--> statement-breakpoint
CREATE TABLE `quest_decisions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quest_stage_id` integer NOT NULL,
	`decision_type` text NOT NULL,
	`potential_player_reactions` text NOT NULL,
	`description` text NOT NULL,
	`creative_prompts` text NOT NULL,
	`options` text NOT NULL,
	`consequences` text NOT NULL,
	FOREIGN KEY (`quest_stage_id`) REFERENCES `quest_stages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `npc_factions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`npc_id` integer NOT NULL,
	`faction_id` integer,
	`loyalty` text NOT NULL,
	`justification` text NOT NULL,
	`role` text NOT NULL,
	`rank` text NOT NULL,
	`secrets` text NOT NULL,
	FOREIGN KEY (`npc_id`) REFERENCES `npcs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`faction_id`) REFERENCES `factions`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `npc_locations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`npc_id` integer NOT NULL,
	`location_id` integer,
	`description` text NOT NULL,
	`creative_prompts` text NOT NULL,
	FOREIGN KEY (`npc_id`) REFERENCES `npcs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `npc_relationships` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`npc_id` integer NOT NULL,
	`related_npc_id` integer,
	`relationship_strength` text NOT NULL,
	`type` text NOT NULL,
	`strength` text NOT NULL,
	`history` text NOT NULL,
	`description` text NOT NULL,
	`creative_prompts` text NOT NULL,
	`narrative_tensions` text NOT NULL,
	`shared_goals` text NOT NULL,
	`relationship_dynamics` text NOT NULL,
	FOREIGN KEY (`npc_id`) REFERENCES `npcs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`related_npc_id`) REFERENCES `npcs`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `npcs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`alignment` text NOT NULL,
	`disposition` text NOT NULL,
	`gender` text NOT NULL,
	`race` text NOT NULL,
	`trust_level` text NOT NULL,
	`wealth` text NOT NULL,
	`adaptability` text NOT NULL,
	`age` text NOT NULL,
	`attitude` text NOT NULL,
	`occupation` text NOT NULL,
	`quirk` text NOT NULL,
	`social_status` text NOT NULL,
	`appearance` text NOT NULL,
	`avoid_topics` text NOT NULL,
	`background` text NOT NULL,
	`biases` text NOT NULL,
	`dialogue` text NOT NULL,
	`drives` text NOT NULL,
	`fears` text NOT NULL,
	`knowledge` text NOT NULL,
	`mannerisms` text NOT NULL,
	`personality_traits` text NOT NULL,
	`preferred_topics` text NOT NULL,
	`rumours` text NOT NULL,
	`secrets` text NOT NULL,
	`voice_notes` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `npcs_name_unique` ON `npcs` (`name`);--> statement-breakpoint
CREATE TABLE `clues` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quest_stage_id` integer NOT NULL,
	`faction_id` integer,
	`location_id` integer,
	`npc_id` integer,
	`description` text NOT NULL,
	`creative_prompts` text NOT NULL,
	`discovery_condition` text NOT NULL,
	`reveals` text NOT NULL,
	FOREIGN KEY (`quest_stage_id`) REFERENCES `quest_stages`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`faction_id`) REFERENCES `factions`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`npc_id`) REFERENCES `npcs`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `faction_influence` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quest_id` integer,
	`faction_id` integer,
	`influence_level` text NOT NULL,
	`description` text NOT NULL,
	`creative_prompts` text NOT NULL,
	FOREIGN KEY (`quest_id`) REFERENCES `quests`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`faction_id`) REFERENCES `factions`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `faction_quests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quest_id` integer NOT NULL,
	`faction_id` integer,
	`role` text NOT NULL,
	`interest` text NOT NULL,
	FOREIGN KEY (`quest_id`) REFERENCES `quests`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`faction_id`) REFERENCES `factions`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`npc_id` integer,
	`faction_id` integer,
	`location_id` integer,
	`quest_id` integer,
	`stage_id` integer,
	`type` text NOT NULL,
	`description` text NOT NULL,
	`creative_prompts` text NOT NULL,
	`significance` text NOT NULL,
	FOREIGN KEY (`npc_id`) REFERENCES `npcs`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`faction_id`) REFERENCES `factions`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`quest_id`) REFERENCES `quests`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`stage_id`) REFERENCES `quest_stages`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `items_name_unique` ON `items` (`name`);--> statement-breakpoint
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
CREATE TABLE `quest_hooks` (
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
	`hook_type` text,
	`presentation` text,
	`hook_content` text NOT NULL,
	FOREIGN KEY (`quest_id`) REFERENCES `quests`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`stage_id`) REFERENCES `quest_stages`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`faction_id`) REFERENCES `factions`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`item_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `quest_npcs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`npc_id` integer NOT NULL,
	`quest_id` integer,
	`role` text NOT NULL,
	`importance` text NOT NULL,
	`description` text NOT NULL,
	`creative_prompts` text NOT NULL,
	`dramatic_moments` text NOT NULL,
	`hidden_aspects` text NOT NULL,
	FOREIGN KEY (`npc_id`) REFERENCES `npcs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`quest_id`) REFERENCES `quests`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `region_connections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`relation_id` integer NOT NULL,
	`route_type` text NOT NULL,
	`travel_difficulty` text NOT NULL,
	`travel_time` text NOT NULL,
	`controlling_faction` integer,
	`travel_hazards` text NOT NULL,
	`points_of_interest` text NOT NULL,
	`description` text NOT NULL,
	`creative_prompts` text NOT NULL,
	FOREIGN KEY (`relation_id`) REFERENCES `region_relations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`controlling_faction`) REFERENCES `factions`(`id`) ON UPDATE no action ON DELETE set null
);
