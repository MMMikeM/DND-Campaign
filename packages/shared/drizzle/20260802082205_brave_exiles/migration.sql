DROP INDEX "one_default_per_group_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "one_default_per_group_idx" ON "map_variants" ("map_group_id") WHERE "is_default" = true;--> statement-breakpoint
ALTER TABLE "conflict_participants" DROP CONSTRAINT "npc_or_faction_participant_exclusive", ADD CONSTRAINT "npc_or_faction_participant_exclusive" CHECK (("npc_id" IS NOT NULL AND "faction_id" IS NULL) OR ("npc_id" IS NULL AND "faction_id" IS NOT NULL));--> statement-breakpoint
ALTER TABLE "consequences" DROP CONSTRAINT "chk_single_trigger", ADD CONSTRAINT "chk_single_trigger" CHECK ((
        (CASE WHEN "trigger_quest_id" IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN "trigger_quest_stage_decision_id" IS NOT NULL THEN 1 ELSE 0 END)
      ) <= 1);--> statement-breakpoint
ALTER TABLE "consequences" DROP CONSTRAINT "chk_single_affected_entity", ADD CONSTRAINT "chk_single_affected_entity" CHECK ((
        (CASE WHEN "affected_faction_id" IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN "affected_region_id" IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN "affected_area_id" IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN "affected_site_id" IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN "affected_npc_id" IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN "affected_consequence_id" IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN "affected_conflict_id" IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN "affected_quest_id" IS NOT NULL THEN 1 ELSE 0 END)
      ) = 1);--> statement-breakpoint
ALTER TABLE "consequences" DROP CONSTRAINT "chk_conflict_impact_description_required", ADD CONSTRAINT "chk_conflict_impact_description_required" CHECK (("affected_conflict_id" IS NULL) OR ("conflict_impact_description" IS NOT NULL));--> statement-breakpoint
ALTER TABLE "faction_influence" DROP CONSTRAINT "single_fk_check", ADD CONSTRAINT "single_fk_check" CHECK (((CASE WHEN "region_id" IS NOT NULL THEN 1 ELSE 0 END) + (CASE WHEN "area_id" IS NOT NULL THEN 1 ELSE 0 END) + (CASE WHEN "site_id" IS NOT NULL THEN 1 ELSE 0 END)) = 1);--> statement-breakpoint
ALTER TABLE "factions" DROP CONSTRAINT "chk_faction_transparency_rules", ADD CONSTRAINT "chk_faction_transparency_rules" CHECK (NOT (("transparency_level" = 'transparent') AND ("secret_alignment" IS NOT NULL OR "secret_goal" IS NOT NULL)));--> statement-breakpoint
ALTER TABLE "foreshadowing" DROP CONSTRAINT "single_target_fk_check", ADD CONSTRAINT "single_target_fk_check" CHECK ((
        (case when "target_quest_id" is not null then 1 else 0 end) +
        (case when "target_consequence_id" is not null then 1 else 0 end) +
        (case when "target_npc_id" is not null then 1 else 0 end) +
        (case when "target_conflict_id" is not null then 1 else 0 end) +
        (case when "target_item_id" is not null then 1 else 0 end) +
        (case when "target_lore_id" is not null then 1 else 0 end) +
        (case when "target_faction_id" is not null then 1 else 0 end) +
        (case when "target_site_id" is not null then 1 else 0 end)
      ) = 1);--> statement-breakpoint
ALTER TABLE "foreshadowing" DROP CONSTRAINT "single_source_fk_check", ADD CONSTRAINT "single_source_fk_check" CHECK ((
        (case when "source_quest_id" is not null then 1 else 0 end) +
        (case when "source_quest_stage_id" is not null then 1 else 0 end) +
        (case when "source_site_id" is not null then 1 else 0 end) +
        (case when "source_npc_id" is not null then 1 else 0 end) +
        (case when "source_lore_id" is not null then 1 else 0 end) +
        (case when "source_item_id" is not null then 1 else 0 end)
      ) = 1);--> statement-breakpoint
ALTER TABLE "item_connections" DROP CONSTRAINT "chk_single_connected_fk", ADD CONSTRAINT "chk_single_connected_fk" CHECK ((
					(CASE WHEN "connected_npc_id" IS NOT NULL THEN 1 ELSE 0 END) +
					(CASE WHEN "connected_faction_id" IS NOT NULL THEN 1 ELSE 0 END) +
					(CASE WHEN "connected_site_id" IS NOT NULL THEN 1 ELSE 0 END) +
					(CASE WHEN "connected_quest_id" IS NOT NULL THEN 1 ELSE 0 END) +
					(CASE WHEN "connected_conflict_id" IS NOT NULL THEN 1 ELSE 0 END) +
					(CASE WHEN "connected_lore_id" IS NOT NULL THEN 1 ELSE 0 END) +
					(CASE WHEN "connected_item_id" IS NOT NULL THEN 1 ELSE 0 END) +
					(CASE WHEN "connected_quest_stage_id" IS NOT NULL THEN 1 ELSE 0 END)
			) = 1);--> statement-breakpoint
ALTER TABLE "lore_links" DROP CONSTRAINT "single_fk_check", ADD CONSTRAINT "single_fk_check" CHECK ((
        (case when "region_id" is not null then 1 else 0 end) +
        (case when "faction_id" is not null then 1 else 0 end) +
        (case when "npc_id" is not null then 1 else 0 end) +
        (case when "conflict_id" is not null then 1 else 0 end) +
        (case when "quest_id" is not null then 1 else 0 end) +
        (case when "foreshadowing_id" is not null then 1 else 0 end) +
        (case when "related_lore_id" is not null then 1 else 0 end) +
        (case when "item_id" is not null then 1 else 0 end)
      ) = 1);--> statement-breakpoint
ALTER TABLE "npc_relations" DROP CONSTRAINT "no_self_relationship", ADD CONSTRAINT "no_self_relationship" CHECK ("source_npc_id" != "target_npc_id");--> statement-breakpoint
ALTER TABLE "quest_hooks" DROP CONSTRAINT "chk_quest_hook_source_exclusive", ADD CONSTRAINT "chk_quest_hook_source_exclusive" CHECK (
			CASE "hook_source_type"
				WHEN 'site' THEN ("site_id" IS NOT NULL AND "faction_id" IS NULL AND "delivery_npc_id" IS NULL)
				WHEN 'faction' THEN ("site_id" IS NULL AND "faction_id" IS NOT NULL AND "delivery_npc_id" IS NULL)
				WHEN 'npc' THEN ("site_id" IS NULL AND "faction_id" IS NULL AND "delivery_npc_id" IS NOT NULL)
				ELSE FALSE
			END
			);--> statement-breakpoint
ALTER TABLE "quest_participants" DROP CONSTRAINT "chk_quest_participant_exclusive", ADD CONSTRAINT "chk_quest_participant_exclusive" CHECK (
		("npc_id" IS NOT NULL AND "faction_id" IS NULL) OR
		("npc_id" IS NULL AND "faction_id" IS NOT NULL)
		);--> statement-breakpoint
ALTER TABLE "quest_relations" DROP CONSTRAINT "no_self_relationship", ADD CONSTRAINT "no_self_relationship" CHECK ("source_quest_id" != "target_quest_id");--> statement-breakpoint
ALTER TABLE "region_connections" DROP CONSTRAINT "chk_no_self_region_connection", ADD CONSTRAINT "chk_no_self_region_connection" CHECK ("source_region_id" != "target_region_id");--> statement-breakpoint
ALTER TABLE "site_links" DROP CONSTRAINT "chk_no_self_site_link", ADD CONSTRAINT "chk_no_self_site_link" CHECK ("source_site_id" != "target_site_id");--> statement-breakpoint
ALTER TABLE "quest_stage_decisions" DROP CONSTRAINT "chk_stage_decision_no_self_loop", ADD CONSTRAINT "chk_stage_decision_no_self_loop" CHECK (COALESCE("from_quest_stage_id" != "to_quest_stage_id", TRUE));--> statement-breakpoint
ALTER TABLE "quest_stage_decisions" DROP CONSTRAINT "chk_failure_retry_lesson", ADD CONSTRAINT "chk_failure_retry_lesson" CHECK (("failure_leads_to_retry" = FALSE) OR ("failure_lesson_learned" IS NOT NULL));