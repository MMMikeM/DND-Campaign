-- Step 1: Add columns as nullable
ALTER TABLE `locations` ADD `time_context` text;--> statement-breakpoint
ALTER TABLE `locations` ADD `lighting_level` text;--> statement-breakpoint
ALTER TABLE `locations` ADD `mood` text;--> statement-breakpoint
ALTER TABLE `locations` ADD `soundscape` text;--> statement-breakpoint
ALTER TABLE `locations` ADD `smells` text;--> statement-breakpoint
ALTER TABLE `locations` ADD `weather` text;--> statement-breakpoint
ALTER TABLE `locations` ADD `descriptors` text;--> statement-breakpoint

-- Step 2: Update from location_atmosphere
UPDATE `locations` 
SET 
    time_context = (SELECT time_context FROM `location_atmosphere` WHERE `location_atmosphere`.location_id = `locations`.id),
    lighting_level = (SELECT lighting_level FROM `location_atmosphere` WHERE `location_atmosphere`.location_id = `locations`.id),
    mood = (SELECT mood FROM `location_atmosphere` WHERE `location_atmosphere`.location_id = `locations`.id),
    soundscape = (SELECT soundscape FROM `location_atmosphere` WHERE `location_atmosphere`.location_id = `locations`.id),
    smells = (SELECT smells FROM `location_atmosphere` WHERE `location_atmosphere`.location_id = `locations`.id),
    weather = (SELECT weather FROM `location_atmosphere` WHERE `location_atmosphere`.location_id = `locations`.id),
    descriptors = (SELECT descriptors FROM `location_atmosphere` WHERE `location_atmosphere`.location_id = `locations`.id);--> statement-breakpoint

-- Step 3: Set default values for NULLs
UPDATE `locations` SET time_context = '"always"' WHERE time_context IS NULL;--> statement-breakpoint
UPDATE `locations` SET lighting_level = '"well-lit"' WHERE lighting_level IS NULL;--> statement-breakpoint
UPDATE `locations` SET mood = '"peaceful"' WHERE mood IS NULL;--> statement-breakpoint
UPDATE `locations` SET soundscape = '[]' WHERE soundscape IS NULL;--> statement-breakpoint
UPDATE `locations` SET smells = '[]' WHERE smells IS NULL;--> statement-breakpoint
UPDATE `locations` SET weather = '[]' WHERE weather IS NULL;--> statement-breakpoint
UPDATE `locations` SET descriptors = '[]' WHERE descriptors IS NULL;--> statement-breakpoint




DROP TABLE `location_atmosphere`;--> statement-breakpoint











CREATE UNIQUE INDEX `location_encounters_location_id_name_unique` ON `location_encounters` (`location_id`,`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `location_relations_location_id_other_location_id_unique` ON `location_relations` (`location_id`,`other_location_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `region_relations_region_id_other_region_id_unique` ON `region_relations` (`region_id`,`other_region_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `faction_culture_faction_id_unique` ON `faction_culture` (`faction_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `faction_headquarters_faction_id_location_id_unique` ON `faction_headquarters` (`faction_id`,`location_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `faction_operations_faction_id_name_unique` ON `faction_operations` (`faction_id`,`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `faction_regions_faction_id_region_id_unique` ON `faction_regions` (`faction_id`,`region_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `faction_relationships_faction_id_other_faction_id_unique` ON `faction_relationships` (`faction_id`,`other_faction_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `decision_consequences_consequence_type_decision_id_unique` ON `decision_consequences` (`consequence_type`,`decision_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `quest_relations_quest_id_related_quest_id_unique` ON `quest_relations` (`quest_id`,`related_quest_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `stage_decisions_quest_id_from_stage_id_to_stage_id_unique` ON `stage_decisions` (`quest_id`,`from_stage_id`,`to_stage_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `npc_factions_npc_id_faction_id_unique` ON `npc_factions` (`npc_id`,`faction_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `npc_locations_npc_id_location_id_unique` ON `npc_locations` (`npc_id`,`location_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `npc_relationships_npc_id_related_npc_id_unique` ON `npc_relationships` (`npc_id`,`related_npc_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `faction_quests_quest_id_faction_id_unique` ON `faction_quests` (`quest_id`,`faction_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `quest_hook_npcs_hook_id_npc_id_unique` ON `quest_hook_npcs` (`hook_id`,`npc_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `quest_npcs_npc_id_quest_id_role_unique` ON `quest_npcs` (`npc_id`,`quest_id`,`role`);--> statement-breakpoint
CREATE UNIQUE INDEX `region_connections_relation_id_unique` ON `region_connections` (`relation_id`);--> statement-breakpoint
ALTER TABLE `quest_stages` DROP COLUMN `locations`;