ALTER TABLE "narrative_destination_outcomes" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "narrative_destination_participants" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "narrative_destination_quest_roles" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "narrative_destination_relations" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "narrative_destinations" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "narrative_events" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP MATERIALIZED VIEW "public"."search_index";--> statement-breakpoint
DROP VIEW "public"."conflict_search_data_view";--> statement-breakpoint
DROP VIEW "public"."faction_search_data_view";--> statement-breakpoint
DROP VIEW "public"."foreshadowing_search_data_view";--> statement-breakpoint
DROP VIEW "public"."item_search_data_view";--> statement-breakpoint
DROP VIEW "public"."lore_search_data_view";--> statement-breakpoint
DROP VIEW "public"."narrative_destination_search_data_view";--> statement-breakpoint
DROP VIEW "public"."consequence_search_data_view";--> statement-breakpoint
DROP VIEW "public"."narrative_event_search_data_view";--> statement-breakpoint
DROP VIEW "public"."npc_search_data_view";--> statement-breakpoint
DROP VIEW "public"."quest_search_data_view";--> statement-breakpoint
DROP VIEW "public"."area_search_data_view";--> statement-breakpoint
DROP VIEW "public"."region_search_data_view";--> statement-breakpoint
DROP VIEW "public"."site_search_data_view";--> statement-breakpoint
DROP VIEW "public"."quest_stage_decision_search_data_view";--> statement-breakpoint
DROP VIEW "public"."quest_stage_search_data_view";--> statement-breakpoint
DROP TABLE "narrative_destination_outcomes" CASCADE;--> statement-breakpoint
DROP TABLE "narrative_destination_participants" CASCADE;--> statement-breakpoint
DROP TABLE "narrative_destination_quest_roles" CASCADE;--> statement-breakpoint
DROP TABLE "narrative_destination_relations" CASCADE;--> statement-breakpoint
DROP TABLE "narrative_destinations" CASCADE;--> statement-breakpoint
DROP TABLE "narrative_events" CASCADE;--> statement-breakpoint
ALTER TABLE "item_relations" DROP CONSTRAINT "chk_single_fk_check";--> statement-breakpoint
ALTER TABLE "lore_links" DROP CONSTRAINT "single_fk_check";--> statement-breakpoint
ALTER TABLE "consequences" DROP CONSTRAINT "chk_single_trigger";--> statement-breakpoint
ALTER TABLE "consequences" DROP CONSTRAINT "chk_single_affected_entity";--> statement-breakpoint
-- ALTER TABLE "item_relations" DROP CONSTRAINT "item_relations_narrative_destination_id_narrative_destinations_id_fk";
--> statement-breakpoint
-- ALTER TABLE "lore_links" DROP CONSTRAINT "lore_links_narrative_destination_id_narrative_destinations_id_fk";
--> statement-breakpoint
ALTER TABLE "consequences" DROP CONSTRAINT "consequences_trigger_conflict_id_conflicts_id_fk";
--> statement-breakpoint
-- ALTER TABLE "consequences" DROP CONSTRAINT "consequences_affected_narrative_destination_id_narrative_destinations_id_fk";
--> statement-breakpoint
ALTER TABLE "consequences" ADD COLUMN "complication_details" text;--> statement-breakpoint
ALTER TABLE "consequences" ADD COLUMN "escalation_details" text;--> statement-breakpoint
ALTER TABLE "consequences" ADD COLUMN "twist_reveal_details" text;--> statement-breakpoint
ALTER TABLE "consequences" ADD COLUMN "affected_consequence_id" integer;--> statement-breakpoint
ALTER TABLE "consequences" ADD CONSTRAINT "consequences_affected_consequence_id_consequences_id_fk" FOREIGN KEY ("affected_consequence_id") REFERENCES "public"."consequences"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_relations" DROP COLUMN "narrative_destination_id";--> statement-breakpoint
ALTER TABLE "lore_links" DROP COLUMN "narrative_destination_id";--> statement-breakpoint
ALTER TABLE "consequences" DROP COLUMN "gm_notes";--> statement-breakpoint
ALTER TABLE "consequences" DROP COLUMN "trigger_conflict_id";--> statement-breakpoint
ALTER TABLE "consequences" DROP COLUMN "affected_narrative_destination_id";--> statement-breakpoint
ALTER TABLE "item_relations" ADD CONSTRAINT "chk_single_fk_check" CHECK ((
			(case when "item_relations"."item_id" is not null then 1 else 0 end) +
			(case when "item_relations"."npc_id" is not null then 1 else 0 end) +
			(case when "item_relations"."faction_id" is not null then 1 else 0 end) +
			(case when "item_relations"."site_id" is not null then 1 else 0 end) +
			(case when "item_relations"."quest_id" is not null then 1 else 0 end) +
			(case when "item_relations"."conflict_id" is not null then 1 else 0 end)
		) = 1);--> statement-breakpoint
ALTER TABLE "lore_links" ADD CONSTRAINT "single_fk_check" CHECK ((
        (case when "lore_links"."region_id" is not null then 1 else 0 end) +
        (case when "lore_links"."faction_id" is not null then 1 else 0 end) +
        (case when "lore_links"."npc_id" is not null then 1 else 0 end) +
        (case when "lore_links"."conflict_id" is not null then 1 else 0 end) +
        (case when "lore_links"."quest_id" is not null then 1 else 0 end) +
        (case when "lore_links"."foreshadowing_id" is not null then 1 else 0 end) +
        (case when "lore_links"."related_lore_id" is not null then 1 else 0 end)
      ) = 1);--> statement-breakpoint
ALTER TABLE "consequences" ADD CONSTRAINT "chk_single_trigger" CHECK ((
        (CASE WHEN "consequences"."trigger_quest_id" IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN "consequences"."trigger_quest_stage_decision_id" IS NOT NULL THEN 1 ELSE 0 END)
      ) <= 1);--> statement-breakpoint
ALTER TABLE "consequences" ADD CONSTRAINT "chk_single_affected_entity" CHECK ((
        (CASE WHEN "consequences"."affected_faction_id" IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN "consequences"."affected_region_id" IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN "consequences"."affected_area_id" IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN "consequences"."affected_site_id" IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN "consequences"."affected_npc_id" IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN "consequences"."affected_consequence_id" IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN "consequences"."affected_conflict_id" IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN "consequences"."affected_quest_id" IS NOT NULL THEN 1 ELSE 0 END)
      ) = 1);