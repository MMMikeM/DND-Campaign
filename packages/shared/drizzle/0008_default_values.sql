ALTER TABLE "clues" ALTER COLUMN "quest_stage_id" DROP DEFAULT;
ALTER TABLE "clues" ALTER COLUMN "faction_id" DROP DEFAULT;
ALTER TABLE "clues" ALTER COLUMN "site_id" DROP DEFAULT;
ALTER TABLE "clues" ALTER COLUMN "npc_id" DROP DEFAULT;

ALTER TABLE "faction_quest_involvement" ALTER COLUMN "quest_id" DROP DEFAULT;
ALTER TABLE "faction_quest_involvement" ALTER COLUMN "faction_id" DROP DEFAULT;

ALTER TABLE "faction_regional_power" ALTER COLUMN "faction_id" DROP DEFAULT;
ALTER TABLE "faction_regional_power" ALTER COLUMN "quest_id" DROP DEFAULT;
ALTER TABLE "faction_regional_power" ALTER COLUMN "region_id" DROP DEFAULT;
ALTER TABLE "faction_regional_power" ALTER COLUMN "area_id" DROP DEFAULT;
ALTER TABLE "faction_regional_power" ALTER COLUMN "site_id" DROP DEFAULT;

ALTER TABLE "items" ALTER COLUMN "npc_id" DROP DEFAULT;
ALTER TABLE "items" ALTER COLUMN "faction_id" DROP DEFAULT;
ALTER TABLE "items" ALTER COLUMN "site_id" DROP DEFAULT;
ALTER TABLE "items" ALTER COLUMN "quest_id" DROP DEFAULT;
ALTER TABLE "items" ALTER COLUMN "stage_id" DROP DEFAULT;

ALTER TABLE "npc_quest_roles" ALTER COLUMN "npc_id" DROP DEFAULT;
ALTER TABLE "npc_quest_roles" ALTER COLUMN "quest_id" DROP DEFAULT;

ALTER TABLE "quest_hook_npcs" ALTER COLUMN "hook_id" DROP DEFAULT;
ALTER TABLE "quest_hook_npcs" ALTER COLUMN "npc_id" DROP DEFAULT;

ALTER TABLE "quest_introductions" ALTER COLUMN "stage_id" DROP DEFAULT;
ALTER TABLE "quest_introductions" ALTER COLUMN "site_id" DROP DEFAULT;
ALTER TABLE "quest_introductions" ALTER COLUMN "faction_id" DROP DEFAULT;
ALTER TABLE "quest_introductions" ALTER COLUMN "item_id" DROP DEFAULT;

ALTER TABLE "region_connection_details" ALTER COLUMN "relation_id" DROP DEFAULT;
ALTER TABLE "region_connection_details" ALTER COLUMN "controlling_faction" DROP DEFAULT;

ALTER TABLE "conflict_participants" ALTER COLUMN "conflict_id" DROP DEFAULT;
ALTER TABLE "conflict_participants" ALTER COLUMN "faction_id" DROP DEFAULT;

ALTER TABLE "conflict_progression" ALTER COLUMN "conflict_id" DROP DEFAULT;
ALTER TABLE "conflict_progression" ALTER COLUMN "quest_id" DROP DEFAULT;

ALTER TABLE "major_conflicts" ALTER COLUMN "primary_region_id" DROP DEFAULT;

ALTER TABLE "faction_culture" ALTER COLUMN "faction_id" DROP DEFAULT;

ALTER TABLE "faction_diplomacy" ALTER COLUMN "faction_id" DROP DEFAULT;
ALTER TABLE "faction_diplomacy" ALTER COLUMN "other_faction_id" DROP DEFAULT;

ALTER TABLE "faction_headquarters" ALTER COLUMN "faction_id" DROP DEFAULT;
ALTER TABLE "faction_headquarters" ALTER COLUMN "site_id" DROP DEFAULT;

ALTER TABLE "faction_operations" ALTER COLUMN "faction_id" DROP DEFAULT;

ALTER TABLE "faction_regions" ALTER COLUMN "faction_id" DROP DEFAULT;
ALTER TABLE "faction_regions" ALTER COLUMN "region_id" DROP DEFAULT;

ALTER TABLE "narrative_foreshadowing" ALTER COLUMN "quest_stage_id" DROP DEFAULT;
ALTER TABLE "narrative_foreshadowing" ALTER COLUMN "site_id" DROP DEFAULT;
ALTER TABLE "narrative_foreshadowing" ALTER COLUMN "npc_id" DROP DEFAULT;
ALTER TABLE "narrative_foreshadowing" ALTER COLUMN "faction_id" DROP DEFAULT;
ALTER TABLE "narrative_foreshadowing" ALTER COLUMN "foreshadows_quest_id" DROP DEFAULT;
ALTER TABLE "narrative_foreshadowing" ALTER COLUMN "foreshadows_twist_id" DROP DEFAULT;
ALTER TABLE "narrative_foreshadowing" ALTER COLUMN "foreshadows_npc_id" DROP DEFAULT;
ALTER TABLE "narrative_foreshadowing" ALTER COLUMN "foreshadows_arc_id" DROP DEFAULT;

ALTER TABLE "arc_membership" ALTER COLUMN "arc_id" DROP DEFAULT;
ALTER TABLE "arc_membership" ALTER COLUMN "quest_id" DROP DEFAULT;

ALTER TABLE "character_relationships" ALTER COLUMN "npc_id" DROP DEFAULT;
ALTER TABLE "character_relationships" ALTER COLUMN "related_npc_id" DROP DEFAULT;

ALTER TABLE "npc_factions" ALTER COLUMN "npc_id" DROP DEFAULT;
ALTER TABLE "npc_factions" ALTER COLUMN "faction_id" DROP DEFAULT;

ALTER TABLE "npc_sites" ALTER COLUMN "npc_id" DROP DEFAULT;
ALTER TABLE "npc_sites" ALTER COLUMN "site_id" DROP DEFAULT;

ALTER TABLE "decision_outcomes" ALTER COLUMN "decision_id" DROP DEFAULT;
ALTER TABLE "decision_outcomes" ALTER COLUMN "affected_stage_id" DROP DEFAULT;

ALTER TABLE "quest_dependencies" ALTER COLUMN "quest_id" DROP DEFAULT;
ALTER TABLE "quest_dependencies" ALTER COLUMN "related_quest_id" DROP DEFAULT;

ALTER TABLE "quest_stages" ALTER COLUMN "quest_id" DROP DEFAULT;
ALTER TABLE "quest_stages" ALTER COLUMN "site_id" DROP DEFAULT;

ALTER TABLE "quest_twists" ALTER COLUMN "quest_id" DROP DEFAULT;

ALTER TABLE "quest_unlock_conditions" ALTER COLUMN "quest_id" DROP DEFAULT;

ALTER TABLE "quests" ALTER COLUMN "region_id" DROP DEFAULT;

ALTER TABLE "stage_decisions" ALTER COLUMN "quest_id" DROP DEFAULT;
ALTER TABLE "stage_decisions" ALTER COLUMN "from_stage_id" DROP DEFAULT;
ALTER TABLE "stage_decisions" ALTER COLUMN "to_stage_id" DROP DEFAULT;

ALTER TABLE "areas" ALTER COLUMN "region_id" DROP DEFAULT;

ALTER TABLE "region_connections" ALTER COLUMN "region_id" DROP DEFAULT;
ALTER TABLE "region_connections" ALTER COLUMN "other_region_id" DROP DEFAULT;

ALTER TABLE "site_encounters" ALTER COLUMN "site_id" DROP DEFAULT;

ALTER TABLE "site_links" ALTER COLUMN "site_id" DROP DEFAULT;
ALTER TABLE "site_links" ALTER COLUMN "other_site_id" DROP DEFAULT;

ALTER TABLE "site_secrets" ALTER COLUMN "site_id" DROP DEFAULT;

ALTER TABLE "sites" ALTER COLUMN "area_id" DROP DEFAULT;

ALTER TABLE "world_state_changes" ALTER COLUMN "quest_id" DROP DEFAULT;
ALTER TABLE "world_state_changes" ALTER COLUMN "decision_id" DROP DEFAULT;
ALTER TABLE "world_state_changes" ALTER COLUMN "conflict_id" DROP DEFAULT;
ALTER TABLE "world_state_changes" ALTER COLUMN "faction_id" DROP DEFAULT;
ALTER TABLE "world_state_changes" ALTER COLUMN "region_id" DROP DEFAULT;
ALTER TABLE "world_state_changes" ALTER COLUMN "area_id" DROP DEFAULT;
ALTER TABLE "world_state_changes" ALTER COLUMN "site_id" DROP DEFAULT;
ALTER TABLE "world_state_changes" ALTER COLUMN "npc_id" DROP DEFAULT;
ALTER TABLE "world_state_changes" ALTER COLUMN "arc_id" DROP DEFAULT;
ALTER TABLE "world_state_changes" ALTER COLUMN "future_quest_id" DROP DEFAULT;
