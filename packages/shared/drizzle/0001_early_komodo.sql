ALTER TABLE "location_encounters" ALTER COLUMN "encounter_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "location_encounters" ALTER COLUMN "danger_level" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "location_encounters" ALTER COLUMN "difficulty" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "location_encounters" ALTER COLUMN "embedding" SET DATA TYPE vector(3072);--> statement-breakpoint
ALTER TABLE "location_links" ALTER COLUMN "link_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "location_secrets" ALTER COLUMN "secret_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "location_secrets" ALTER COLUMN "difficulty" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "location_secrets" ALTER COLUMN "embedding" SET DATA TYPE vector(3072);--> statement-breakpoint
ALTER TABLE "locations" ALTER COLUMN "location_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "locations" ALTER COLUMN "embedding" SET DATA TYPE vector(3072);--> statement-breakpoint
ALTER TABLE "region_connections" ALTER COLUMN "connection_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "regions" ALTER COLUMN "danger_level" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "regions" ALTER COLUMN "type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "regions" ALTER COLUMN "embedding" SET DATA TYPE vector(3072);--> statement-breakpoint
ALTER TABLE "faction_culture" ALTER COLUMN "embedding" SET DATA TYPE vector(3072);--> statement-breakpoint
ALTER TABLE "faction_diplomacy" ALTER COLUMN "strength" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "faction_diplomacy" ALTER COLUMN "diplomatic_status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "faction_operations" ALTER COLUMN "type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "faction_operations" ALTER COLUMN "scale" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "faction_operations" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "faction_operations" ALTER COLUMN "priority" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "faction_operations" ALTER COLUMN "embedding" SET DATA TYPE vector(3072);--> statement-breakpoint
ALTER TABLE "faction_regions" ALTER COLUMN "control_level" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "factions" ALTER COLUMN "alignment" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "factions" ALTER COLUMN "size" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "factions" ALTER COLUMN "wealth" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "factions" ALTER COLUMN "reach" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "factions" ALTER COLUMN "type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "factions" ALTER COLUMN "embedding" SET DATA TYPE vector(3072);--> statement-breakpoint
ALTER TABLE "decision_outcomes" ALTER COLUMN "outcome_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "decision_outcomes" ALTER COLUMN "severity" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "decision_outcomes" ALTER COLUMN "visibility" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "decision_outcomes" ALTER COLUMN "delay_factor" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "quest_dependencies" ALTER COLUMN "dependency_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "quest_stages" ALTER COLUMN "embedding" SET DATA TYPE vector(3072);--> statement-breakpoint
ALTER TABLE "quest_twists" ALTER COLUMN "twist_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "quest_twists" ALTER COLUMN "impact" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "quest_twists" ALTER COLUMN "narrative_placement" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "quest_unlock_conditions" ALTER COLUMN "condition_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "quest_unlock_conditions" ALTER COLUMN "importance" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "quests" ALTER COLUMN "type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "quests" ALTER COLUMN "urgency" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "quests" ALTER COLUMN "visibility" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "quests" ALTER COLUMN "embedding" SET DATA TYPE vector(3072);--> statement-breakpoint
ALTER TABLE "stage_decisions" ALTER COLUMN "condition_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "stage_decisions" ALTER COLUMN "decision_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "character_relationships" ALTER COLUMN "type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "character_relationships" ALTER COLUMN "strength" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "npc_factions" ALTER COLUMN "loyalty" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "npcs" ALTER COLUMN "alignment" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "npcs" ALTER COLUMN "gender" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "npcs" ALTER COLUMN "race" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "npcs" ALTER COLUMN "trust_level" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "npcs" ALTER COLUMN "wealth" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "npcs" ALTER COLUMN "adaptability" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "npcs" ALTER COLUMN "embedding" SET DATA TYPE vector(3072);--> statement-breakpoint
ALTER TABLE "clues" ALTER COLUMN "embedding" SET DATA TYPE vector(3072);--> statement-breakpoint
ALTER TABLE "faction_quest_involvement" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "faction_regional_power" ALTER COLUMN "power_level" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ALTER COLUMN "embedding" SET DATA TYPE vector(3072);--> statement-breakpoint
ALTER TABLE "npc_quest_roles" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "npc_quest_roles" ALTER COLUMN "importance" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "quest_hook_npcs" ALTER COLUMN "trust_required" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "quest_introductions" ALTER COLUMN "introduction_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "quest_introductions" ALTER COLUMN "presentation_style" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "region_connection_details" ALTER COLUMN "route_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "region_connection_details" ALTER COLUMN "travel_difficulty" SET NOT NULL;