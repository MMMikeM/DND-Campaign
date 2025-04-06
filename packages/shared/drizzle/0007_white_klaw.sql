ALTER TABLE "clues" ALTER COLUMN "quest_stage_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "clues" ALTER COLUMN "quest_stage_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "clues" ALTER COLUMN "faction_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "clues" ALTER COLUMN "faction_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "clues" ALTER COLUMN "site_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "clues" ALTER COLUMN "site_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "clues" ALTER COLUMN "npc_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "clues" ALTER COLUMN "npc_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "faction_quest_involvement" ALTER COLUMN "quest_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "faction_quest_involvement" ALTER COLUMN "quest_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "faction_quest_involvement" ALTER COLUMN "faction_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "faction_quest_involvement" ALTER COLUMN "faction_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "faction_regional_power" ALTER COLUMN "faction_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "faction_regional_power" ALTER COLUMN "faction_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "faction_regional_power" ALTER COLUMN "quest_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "faction_regional_power" ALTER COLUMN "quest_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "faction_regional_power" ALTER COLUMN "region_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "faction_regional_power" ALTER COLUMN "region_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "faction_regional_power" ALTER COLUMN "area_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "faction_regional_power" ALTER COLUMN "area_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "faction_regional_power" ALTER COLUMN "site_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "faction_regional_power" ALTER COLUMN "site_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ALTER COLUMN "npc_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "items" ALTER COLUMN "npc_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ALTER COLUMN "faction_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "items" ALTER COLUMN "faction_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ALTER COLUMN "site_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "items" ALTER COLUMN "site_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ALTER COLUMN "quest_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "items" ALTER COLUMN "quest_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ALTER COLUMN "stage_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "items" ALTER COLUMN "stage_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "npc_quest_roles" ALTER COLUMN "npc_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "npc_quest_roles" ALTER COLUMN "npc_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "npc_quest_roles" ALTER COLUMN "quest_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "npc_quest_roles" ALTER COLUMN "quest_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "quest_hook_npcs" ALTER COLUMN "hook_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "quest_hook_npcs" ALTER COLUMN "hook_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "quest_hook_npcs" ALTER COLUMN "npc_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "quest_hook_npcs" ALTER COLUMN "npc_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "quest_introductions" ALTER COLUMN "stage_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "quest_introductions" ALTER COLUMN "stage_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "quest_introductions" ALTER COLUMN "site_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "quest_introductions" ALTER COLUMN "site_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "quest_introductions" ALTER COLUMN "faction_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "quest_introductions" ALTER COLUMN "faction_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "quest_introductions" ALTER COLUMN "item_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "quest_introductions" ALTER COLUMN "item_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "region_connection_details" ALTER COLUMN "relation_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "region_connection_details" ALTER COLUMN "relation_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "region_connection_details" ALTER COLUMN "controlling_faction" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "region_connection_details" ALTER COLUMN "controlling_faction" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "conflict_participants" ALTER COLUMN "conflict_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "conflict_participants" ALTER COLUMN "conflict_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "conflict_participants" ALTER COLUMN "faction_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "conflict_participants" ALTER COLUMN "faction_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "conflict_progression" ALTER COLUMN "conflict_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "conflict_progression" ALTER COLUMN "conflict_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "conflict_progression" ALTER COLUMN "quest_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "conflict_progression" ALTER COLUMN "quest_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "major_conflicts" ALTER COLUMN "primary_region_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "major_conflicts" ALTER COLUMN "primary_region_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "faction_culture" ALTER COLUMN "faction_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "faction_culture" ALTER COLUMN "faction_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "faction_diplomacy" ALTER COLUMN "faction_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "faction_diplomacy" ALTER COLUMN "faction_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "faction_diplomacy" ALTER COLUMN "other_faction_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "faction_diplomacy" ALTER COLUMN "other_faction_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "faction_headquarters" ALTER COLUMN "faction_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "faction_headquarters" ALTER COLUMN "faction_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "faction_headquarters" ALTER COLUMN "site_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "faction_headquarters" ALTER COLUMN "site_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "faction_operations" ALTER COLUMN "faction_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "faction_operations" ALTER COLUMN "faction_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "faction_regions" ALTER COLUMN "faction_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "faction_regions" ALTER COLUMN "faction_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "faction_regions" ALTER COLUMN "region_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "faction_regions" ALTER COLUMN "region_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" ALTER COLUMN "quest_stage_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" ALTER COLUMN "quest_stage_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" ALTER COLUMN "site_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" ALTER COLUMN "site_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" ALTER COLUMN "npc_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" ALTER COLUMN "npc_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" ALTER COLUMN "faction_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" ALTER COLUMN "faction_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" ALTER COLUMN "foreshadows_quest_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" ALTER COLUMN "foreshadows_quest_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" ALTER COLUMN "foreshadows_twist_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" ALTER COLUMN "foreshadows_twist_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" ALTER COLUMN "foreshadows_npc_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" ALTER COLUMN "foreshadows_npc_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" ALTER COLUMN "foreshadows_arc_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" ALTER COLUMN "foreshadows_arc_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "arc_membership" ALTER COLUMN "arc_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "arc_membership" ALTER COLUMN "arc_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "arc_membership" ALTER COLUMN "quest_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "arc_membership" ALTER COLUMN "quest_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "character_relationships" ALTER COLUMN "npc_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "character_relationships" ALTER COLUMN "npc_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "character_relationships" ALTER COLUMN "related_npc_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "character_relationships" ALTER COLUMN "related_npc_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "npc_factions" ALTER COLUMN "npc_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "npc_factions" ALTER COLUMN "npc_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "npc_factions" ALTER COLUMN "faction_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "npc_factions" ALTER COLUMN "faction_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "npc_sites" ALTER COLUMN "npc_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "npc_sites" ALTER COLUMN "npc_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "npc_sites" ALTER COLUMN "site_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "npc_sites" ALTER COLUMN "site_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "decision_outcomes" ALTER COLUMN "decision_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "decision_outcomes" ALTER COLUMN "decision_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "decision_outcomes" ALTER COLUMN "affected_stage_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "decision_outcomes" ALTER COLUMN "affected_stage_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "quest_dependencies" ALTER COLUMN "quest_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "quest_dependencies" ALTER COLUMN "quest_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "quest_dependencies" ALTER COLUMN "related_quest_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "quest_dependencies" ALTER COLUMN "related_quest_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "quest_stages" ALTER COLUMN "quest_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "quest_stages" ALTER COLUMN "quest_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "quest_stages" ALTER COLUMN "site_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "quest_stages" ALTER COLUMN "site_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "quest_twists" ALTER COLUMN "quest_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "quest_twists" ALTER COLUMN "quest_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "quest_unlock_conditions" ALTER COLUMN "quest_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "quest_unlock_conditions" ALTER COLUMN "quest_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "quests" ALTER COLUMN "region_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "quests" ALTER COLUMN "region_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stage_decisions" ALTER COLUMN "quest_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "stage_decisions" ALTER COLUMN "quest_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stage_decisions" ALTER COLUMN "from_stage_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "stage_decisions" ALTER COLUMN "from_stage_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stage_decisions" ALTER COLUMN "to_stage_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "stage_decisions" ALTER COLUMN "to_stage_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "areas" ALTER COLUMN "region_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "areas" ALTER COLUMN "region_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "region_connections" ALTER COLUMN "region_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "region_connections" ALTER COLUMN "region_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "region_connections" ALTER COLUMN "other_region_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "region_connections" ALTER COLUMN "other_region_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "site_encounters" ALTER COLUMN "site_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "site_encounters" ALTER COLUMN "site_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "site_links" ALTER COLUMN "site_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "site_links" ALTER COLUMN "site_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "site_links" ALTER COLUMN "other_site_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "site_links" ALTER COLUMN "other_site_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "site_secrets" ALTER COLUMN "site_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "site_secrets" ALTER COLUMN "site_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "sites" ALTER COLUMN "area_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "sites" ALTER COLUMN "area_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "world_state_changes" ALTER COLUMN "quest_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "world_state_changes" ALTER COLUMN "quest_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "world_state_changes" ALTER COLUMN "decision_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "world_state_changes" ALTER COLUMN "decision_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "world_state_changes" ALTER COLUMN "conflict_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "world_state_changes" ALTER COLUMN "conflict_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "world_state_changes" ALTER COLUMN "faction_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "world_state_changes" ALTER COLUMN "faction_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "world_state_changes" ALTER COLUMN "region_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "world_state_changes" ALTER COLUMN "region_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "world_state_changes" ALTER COLUMN "area_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "world_state_changes" ALTER COLUMN "area_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "world_state_changes" ALTER COLUMN "site_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "world_state_changes" ALTER COLUMN "site_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "world_state_changes" ALTER COLUMN "npc_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "world_state_changes" ALTER COLUMN "npc_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "world_state_changes" ALTER COLUMN "arc_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "world_state_changes" ALTER COLUMN "arc_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "world_state_changes" ALTER COLUMN "future_quest_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "world_state_changes" ALTER COLUMN "future_quest_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "faction_regional_power" ADD CONSTRAINT "faction_regional_power_faction_id_quest_id_region_id_area_id_site_id_unique" UNIQUE("faction_id","quest_id","region_id","area_id","site_id");--> statement-breakpoint
ALTER TABLE "quest_introductions" ADD CONSTRAINT "quest_introductions_stage_id_site_id_faction_id_item_id_unique" UNIQUE("stage_id","site_id","faction_id","item_id");