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
ALTER TABLE "item_relations" DROP CONSTRAINT "item_relations_source_item_id_target_entity_type_target_entity_id_relationship_type_unique";--> statement-breakpoint
ALTER TABLE "lore_links" DROP CONSTRAINT "unique_lore_link";--> statement-breakpoint
ALTER TABLE "foreshadowing" DROP CONSTRAINT "chk_abstract_target_has_text";--> statement-breakpoint
ALTER TABLE "foreshadowing" DROP CONSTRAINT "chk_source_duo_validity";--> statement-breakpoint
ALTER TABLE "consequences" DROP CONSTRAINT "chk_trigger_duo_validity";--> statement-breakpoint
ALTER TABLE "consequences" DROP CONSTRAINT "chk_conflict_impact_description_required";--> statement-breakpoint
ALTER TABLE "faction_influence" ADD COLUMN "region_id" integer;--> statement-breakpoint
ALTER TABLE "faction_influence" ADD COLUMN "area_id" integer;--> statement-breakpoint
ALTER TABLE "faction_influence" ADD COLUMN "site_id" integer;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD COLUMN "target_quest_id" integer;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD COLUMN "target_npc_id" integer;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD COLUMN "target_narrative_event_id" integer;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD COLUMN "target_conflict_id" integer;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD COLUMN "target_item_id" integer;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD COLUMN "target_narrative_destination_id" integer;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD COLUMN "target_lore_id" integer;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD COLUMN "target_faction_id" integer;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD COLUMN "target_site_id" integer;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD COLUMN "source_quest_id" integer;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD COLUMN "source_quest_stage_id" integer;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD COLUMN "source_site_id" integer;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD COLUMN "source_npc_id" integer;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD COLUMN "source_item_description_id" integer;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD COLUMN "source_lore_id" integer;--> statement-breakpoint
ALTER TABLE "item_relations" ADD COLUMN "item_id" integer;--> statement-breakpoint
ALTER TABLE "item_relations" ADD COLUMN "npc_id" integer;--> statement-breakpoint
ALTER TABLE "item_relations" ADD COLUMN "faction_id" integer;--> statement-breakpoint
ALTER TABLE "item_relations" ADD COLUMN "site_id" integer;--> statement-breakpoint
ALTER TABLE "item_relations" ADD COLUMN "quest_id" integer;--> statement-breakpoint
ALTER TABLE "item_relations" ADD COLUMN "conflict_id" integer;--> statement-breakpoint
ALTER TABLE "item_relations" ADD COLUMN "narrative_destination_id" integer;--> statement-breakpoint
ALTER TABLE "item_relations" ADD COLUMN "lore_id" integer;--> statement-breakpoint
ALTER TABLE "lore_links" ADD COLUMN "region_id" integer;--> statement-breakpoint
ALTER TABLE "lore_links" ADD COLUMN "faction_id" integer;--> statement-breakpoint
ALTER TABLE "lore_links" ADD COLUMN "npc_id" integer;--> statement-breakpoint
ALTER TABLE "lore_links" ADD COLUMN "conflict_id" integer;--> statement-breakpoint
ALTER TABLE "lore_links" ADD COLUMN "quest_id" integer;--> statement-breakpoint
ALTER TABLE "lore_links" ADD COLUMN "foreshadowing_id" integer;--> statement-breakpoint
ALTER TABLE "lore_links" ADD COLUMN "related_lore_id" integer;--> statement-breakpoint
ALTER TABLE "lore_links" ADD COLUMN "narrative_destination_id" integer;--> statement-breakpoint
ALTER TABLE "consequences" ADD COLUMN "trigger_quest_id" integer;--> statement-breakpoint
ALTER TABLE "consequences" ADD COLUMN "trigger_conflict_id" integer;--> statement-breakpoint
ALTER TABLE "consequences" ADD COLUMN "trigger_quest_stage_decision_id" integer;--> statement-breakpoint
ALTER TABLE "consequences" ADD COLUMN "affected_faction_id" integer;--> statement-breakpoint
ALTER TABLE "consequences" ADD COLUMN "affected_region_id" integer;--> statement-breakpoint
ALTER TABLE "consequences" ADD COLUMN "affected_area_id" integer;--> statement-breakpoint
ALTER TABLE "consequences" ADD COLUMN "affected_site_id" integer;--> statement-breakpoint
ALTER TABLE "consequences" ADD COLUMN "affected_npc_id" integer;--> statement-breakpoint
ALTER TABLE "consequences" ADD COLUMN "affected_narrative_destination_id" integer;--> statement-breakpoint
ALTER TABLE "consequences" ADD COLUMN "affected_conflict_id" integer;--> statement-breakpoint
ALTER TABLE "consequences" ADD COLUMN "affected_quest_id" integer;--> statement-breakpoint
ALTER TABLE "faction_influence" ADD CONSTRAINT "faction_influence_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_influence" ADD CONSTRAINT "faction_influence_area_id_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_influence" ADD CONSTRAINT "faction_influence_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_relations" ADD CONSTRAINT "item_relations_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_relations" ADD CONSTRAINT "item_relations_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_relations" ADD CONSTRAINT "item_relations_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_relations" ADD CONSTRAINT "item_relations_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_relations" ADD CONSTRAINT "item_relations_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_relations" ADD CONSTRAINT "item_relations_conflict_id_conflicts_id_fk" FOREIGN KEY ("conflict_id") REFERENCES "public"."conflicts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_relations" ADD CONSTRAINT "item_relations_narrative_destination_id_narrative_destinations_id_fk" FOREIGN KEY ("narrative_destination_id") REFERENCES "public"."narrative_destinations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_relations" ADD CONSTRAINT "item_relations_lore_id_lore_id_fk" FOREIGN KEY ("lore_id") REFERENCES "public"."lore"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lore_links" ADD CONSTRAINT "lore_links_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lore_links" ADD CONSTRAINT "lore_links_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lore_links" ADD CONSTRAINT "lore_links_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lore_links" ADD CONSTRAINT "lore_links_conflict_id_conflicts_id_fk" FOREIGN KEY ("conflict_id") REFERENCES "public"."conflicts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lore_links" ADD CONSTRAINT "lore_links_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lore_links" ADD CONSTRAINT "lore_links_foreshadowing_id_foreshadowing_id_fk" FOREIGN KEY ("foreshadowing_id") REFERENCES "public"."foreshadowing"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lore_links" ADD CONSTRAINT "lore_links_related_lore_id_lore_id_fk" FOREIGN KEY ("related_lore_id") REFERENCES "public"."lore"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lore_links" ADD CONSTRAINT "lore_links_narrative_destination_id_narrative_destinations_id_fk" FOREIGN KEY ("narrative_destination_id") REFERENCES "public"."narrative_destinations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consequences" ADD CONSTRAINT "consequences_trigger_quest_id_quests_id_fk" FOREIGN KEY ("trigger_quest_id") REFERENCES "public"."quests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consequences" ADD CONSTRAINT "consequences_trigger_conflict_id_conflicts_id_fk" FOREIGN KEY ("trigger_conflict_id") REFERENCES "public"."conflicts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consequences" ADD CONSTRAINT "consequences_trigger_quest_stage_decision_id_quest_stage_decisions_id_fk" FOREIGN KEY ("trigger_quest_stage_decision_id") REFERENCES "public"."quest_stage_decisions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consequences" ADD CONSTRAINT "consequences_affected_faction_id_factions_id_fk" FOREIGN KEY ("affected_faction_id") REFERENCES "public"."factions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consequences" ADD CONSTRAINT "consequences_affected_region_id_regions_id_fk" FOREIGN KEY ("affected_region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consequences" ADD CONSTRAINT "consequences_affected_area_id_areas_id_fk" FOREIGN KEY ("affected_area_id") REFERENCES "public"."areas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consequences" ADD CONSTRAINT "consequences_affected_site_id_sites_id_fk" FOREIGN KEY ("affected_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consequences" ADD CONSTRAINT "consequences_affected_npc_id_npcs_id_fk" FOREIGN KEY ("affected_npc_id") REFERENCES "public"."npcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consequences" ADD CONSTRAINT "consequences_affected_narrative_destination_id_narrative_destinations_id_fk" FOREIGN KEY ("affected_narrative_destination_id") REFERENCES "public"."narrative_destinations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consequences" ADD CONSTRAINT "consequences_affected_conflict_id_conflicts_id_fk" FOREIGN KEY ("affected_conflict_id") REFERENCES "public"."conflicts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consequences" ADD CONSTRAINT "consequences_affected_quest_id_quests_id_fk" FOREIGN KEY ("affected_quest_id") REFERENCES "public"."quests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint

UPDATE "faction_influence" SET "region_id" = "related_entity_id" WHERE "related_entity_type" = 'region';--> statement-breakpoint
UPDATE "faction_influence" SET "area_id" = "related_entity_id" WHERE "related_entity_type" = 'area';--> statement-breakpoint
UPDATE "faction_influence" SET "site_id" = "related_entity_id" WHERE "related_entity_type" = 'site';--> statement-breakpoint

UPDATE "foreshadowing" SET "target_quest_id" = "target_entity_id" WHERE "target_entity_type" = 'quest';--> statement-breakpoint
UPDATE "foreshadowing" SET "target_npc_id" = "target_entity_id" WHERE "target_entity_type" = 'npc';--> statement-breakpoint
UPDATE "foreshadowing" SET "target_narrative_event_id" = "target_entity_id" WHERE "target_entity_type" = 'narrative_event';--> statement-breakpoint
UPDATE "foreshadowing" SET "target_conflict_id" = "target_entity_id" WHERE "target_entity_type" = 'conflict';--> statement-breakpoint
UPDATE "foreshadowing" SET "target_item_id" = "target_entity_id" WHERE "target_entity_type" = 'item';--> statement-breakpoint
UPDATE "foreshadowing" SET "target_narrative_destination_id" = "target_entity_id" WHERE "target_entity_type" = 'narrative_destination';--> statement-breakpoint
UPDATE "foreshadowing" SET "target_lore_id" = "target_entity_id" WHERE "target_entity_type" = 'lore';--> statement-breakpoint
UPDATE "foreshadowing" SET "target_faction_id" = "target_entity_id" WHERE "target_entity_type" = 'faction';--> statement-breakpoint
UPDATE "foreshadowing" SET "target_site_id" = "target_entity_id" WHERE "target_entity_type" = 'site';--> statement-breakpoint
UPDATE "foreshadowing" SET "source_quest_id" = "source_entity_id" WHERE "source_entity_type" = 'quest';--> statement-breakpoint
UPDATE "foreshadowing" SET "source_quest_stage_id" = "source_entity_id" WHERE "source_entity_type" = 'quest_stage';--> statement-breakpoint
UPDATE "foreshadowing" SET "source_site_id" = "source_entity_id" WHERE "source_entity_type" = 'site';--> statement-breakpoint
UPDATE "foreshadowing" SET "source_npc_id" = "source_entity_id" WHERE "source_entity_type" = 'npc';--> statement-breakpoint
UPDATE "foreshadowing" SET "source_item_description_id" = "source_entity_id" WHERE "source_entity_type" = 'item_description';--> statement-breakpoint
UPDATE "foreshadowing" SET "source_lore_id" = "source_entity_id" WHERE "source_entity_type" = 'lore';--> statement-breakpoint

UPDATE "item_relations" SET "item_id" = "target_entity_id" WHERE "target_entity_type" = 'item';--> statement-breakpoint
UPDATE "item_relations" SET "npc_id" = "target_entity_id" WHERE "target_entity_type" = 'npc';--> statement-breakpoint
UPDATE "item_relations" SET "faction_id" = "target_entity_id" WHERE "target_entity_type" = 'faction';--> statement-breakpoint
UPDATE "item_relations" SET "site_id" = "target_entity_id" WHERE "target_entity_type" = 'site';--> statement-breakpoint
UPDATE "item_relations" SET "quest_id" = "target_entity_id" WHERE "target_entity_type" = 'quest';--> statement-breakpoint
UPDATE "item_relations" SET "conflict_id" = "target_entity_id" WHERE "target_entity_type" = 'conflict';--> statement-breakpoint
UPDATE "item_relations" SET "narrative_destination_id" = "target_entity_id" WHERE "target_entity_type" = 'narrative_destination';--> statement-breakpoint
UPDATE "item_relations" SET "lore_id" = "target_entity_id" WHERE "target_entity_type" = 'lore';--> statement-breakpoint




UPDATE "lore_links" SET "region_id" = "target_entity_id" WHERE "target_entity_type" = 'region';--> statement-breakpoint
UPDATE "lore_links" SET "faction_id" = "target_entity_id" WHERE "target_entity_type" = 'faction';--> statement-breakpoint
UPDATE "lore_links" SET "npc_id" = "target_entity_id" WHERE "target_entity_type" = 'npc';--> statement-breakpoint
UPDATE "lore_links" SET "conflict_id" = "target_entity_id" WHERE "target_entity_type" = 'conflict';--> statement-breakpoint
UPDATE "lore_links" SET "quest_id" = "target_entity_id" WHERE "target_entity_type" = 'quest';--> statement-breakpoint
UPDATE "lore_links" SET "foreshadowing_id" = "target_entity_id" WHERE "target_entity_type" = 'foreshadowing';--> statement-breakpoint
UPDATE "lore_links" SET "related_lore_id" = "target_entity_id" WHERE "target_entity_type" = 'lore';--> statement-breakpoint

  
UPDATE "consequences" SET "trigger_quest_id" = "trigger_entity_id" WHERE "trigger_entity_type" = 'quest';--> statement-breakpoint
UPDATE "consequences" SET "trigger_conflict_id" = "trigger_entity_id" WHERE "trigger_entity_type" = 'conflict';--> statement-breakpoint
UPDATE "consequences" SET "trigger_quest_stage_decision_id" = "trigger_entity_id" WHERE "trigger_entity_type" = 'decision';--> statement-breakpoint
UPDATE "consequences" SET "affected_faction_id" = "affected_entity_id" WHERE "affected_entity_type" = 'faction';--> statement-breakpoint
UPDATE "consequences" SET "affected_region_id" = "affected_entity_id" WHERE "affected_entity_type" = 'region';--> statement-breakpoint
UPDATE "consequences" SET "affected_area_id" = "affected_entity_id" WHERE "affected_entity_type" = 'area';--> statement-breakpoint
UPDATE "consequences" SET "affected_site_id" = "affected_entity_id" WHERE "affected_entity_type" = 'site';--> statement-breakpoint
UPDATE "consequences" SET "affected_npc_id" = "affected_entity_id" WHERE "affected_entity_type" = 'npc';--> statement-breakpoint
UPDATE "consequences" SET "affected_narrative_destination_id" = "affected_entity_id" WHERE "affected_entity_type" = 'narrative_destination';--> statement-breakpoint
UPDATE "consequences" SET "affected_conflict_id" = "affected_entity_id" WHERE "affected_entity_type" = 'conflict';--> statement-breakpoint
UPDATE "consequences" SET "affected_quest_id" = "affected_entity_id" WHERE "affected_entity_type" = 'quest';--> statement-breakpoint



ALTER TABLE "faction_influence" DROP COLUMN "related_entity_type";--> statement-breakpoint
ALTER TABLE "faction_influence" DROP COLUMN "related_entity_id";--> statement-breakpoint
ALTER TABLE "foreshadowing" DROP COLUMN "target_entity_type";--> statement-breakpoint
ALTER TABLE "foreshadowing" DROP COLUMN "target_entity_id";--> statement-breakpoint
ALTER TABLE "foreshadowing" DROP COLUMN "source_entity_type";--> statement-breakpoint
ALTER TABLE "foreshadowing" DROP COLUMN "source_entity_id";--> statement-breakpoint
ALTER TABLE "item_relations" DROP COLUMN "target_entity_type";--> statement-breakpoint
ALTER TABLE "item_relations" DROP COLUMN "target_entity_id";--> statement-breakpoint
ALTER TABLE "lore_links" DROP COLUMN "target_entity_type";--> statement-breakpoint
ALTER TABLE "lore_links" DROP COLUMN "target_entity_id";--> statement-breakpoint
ALTER TABLE "consequences" DROP COLUMN "trigger_entity_type";--> statement-breakpoint
ALTER TABLE "consequences" DROP COLUMN "trigger_entity_id";--> statement-breakpoint
ALTER TABLE "consequences" DROP COLUMN "affected_entity_type";--> statement-breakpoint
ALTER TABLE "consequences" DROP COLUMN "affected_entity_id";--> statement-breakpoint
ALTER TABLE "item_relations" ADD CONSTRAINT "item_relations_source_item_id_relationship_type_unique" UNIQUE("source_item_id","relationship_type");--> statement-breakpoint
ALTER TABLE "lore_links" ADD CONSTRAINT "unique_lore_link" UNIQUE("lore_id","region_id","faction_id","npc_id","conflict_id","quest_id","foreshadowing_id","related_lore_id");--> statement-breakpoint
ALTER TABLE "faction_influence" ADD CONSTRAINT "single_fk_check" CHECK (((CASE WHEN "faction_influence"."region_id" IS NOT NULL THEN 1 ELSE 0 END) + (CASE WHEN "faction_influence"."area_id" IS NOT NULL THEN 1 ELSE 0 END) + (CASE WHEN "faction_influence"."site_id" IS NOT NULL THEN 1 ELSE 0 END)) = 1);--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD CONSTRAINT "single_target_fk_check" CHECK ((
        (case when "foreshadowing"."target_quest_id" is not null then 1 else 0 end) +
        (case when "foreshadowing"."target_npc_id" is not null then 1 else 0 end) +
        (case when "foreshadowing"."target_narrative_event_id" is not null then 1 else 0 end) +
        (case when "foreshadowing"."target_conflict_id" is not null then 1 else 0 end) +
        (case when "foreshadowing"."target_item_id" is not null then 1 else 0 end) +
        (case when "foreshadowing"."target_narrative_destination_id" is not null then 1 else 0 end) +
        (case when "foreshadowing"."target_lore_id" is not null then 1 else 0 end) +
        (case when "foreshadowing"."target_faction_id" is not null then 1 else 0 end) +
        (case when "foreshadowing"."target_site_id" is not null then 1 else 0 end)
      ) = 1);--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD CONSTRAINT "single_source_fk_check" CHECK ((
        (case when "foreshadowing"."source_quest_id" is not null then 1 else 0 end) +
        (case when "foreshadowing"."source_quest_stage_id" is not null then 1 else 0 end) +
        (case when "foreshadowing"."source_site_id" is not null then 1 else 0 end) +
        (case when "foreshadowing"."source_npc_id" is not null then 1 else 0 end) +
        (case when "foreshadowing"."source_item_description_id" is not null then 1 else 0 end) +
        (case when "foreshadowing"."source_lore_id" is not null then 1 else 0 end)
      ) = 1);--> statement-breakpoint
ALTER TABLE "item_relations" ADD CONSTRAINT "chk_single_fk_check" CHECK ((
			(case when "item_relations"."item_id" is not null then 1 else 0 end) +
			(case when "item_relations"."npc_id" is not null then 1 else 0 end) +
			(case when "item_relations"."faction_id" is not null then 1 else 0 end) +
			(case when "item_relations"."site_id" is not null then 1 else 0 end) +
			(case when "item_relations"."quest_id" is not null then 1 else 0 end) +
			(case when "item_relations"."conflict_id" is not null then 1 else 0 end) +
			(case when "item_relations"."narrative_destination_id" is not null then 1 else 0 end) +
			(case when "item_relations"."lore_id" is not null then 1 else 0 end)
		) = 1);--> statement-breakpoint
ALTER TABLE "lore_links" ADD CONSTRAINT "single_fk_check" CHECK ((
        (case when "lore_links"."region_id" is not null then 1 else 0 end) +
        (case when "lore_links"."faction_id" is not null then 1 else 0 end) +
        (case when "lore_links"."npc_id" is not null then 1 else 0 end) +
        (case when "lore_links"."conflict_id" is not null then 1 else 0 end) +
        (case when "lore_links"."quest_id" is not null then 1 else 0 end) +
        (case when "lore_links"."foreshadowing_id" is not null then 1 else 0 end) +
        (case when "lore_links"."related_lore_id" is not null then 1 else 0 end) +
        (case when "lore_links"."narrative_destination_id" is not null then 1 else 0 end)
      ) = 1);--> statement-breakpoint
ALTER TABLE "consequences" ADD CONSTRAINT "chk_single_trigger" CHECK ((
        (CASE WHEN "consequences"."trigger_quest_id" IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN "consequences"."trigger_conflict_id" IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN "consequences"."trigger_quest_stage_decision_id" IS NOT NULL THEN 1 ELSE 0 END)
      ) <= 1);--> statement-breakpoint
ALTER TABLE "consequences" ADD CONSTRAINT "chk_single_affected_entity" CHECK ((
        (CASE WHEN "consequences"."affected_faction_id" IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN "consequences"."affected_region_id" IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN "consequences"."affected_area_id" IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN "consequences"."affected_site_id" IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN "consequences"."affected_npc_id" IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN "consequences"."affected_narrative_destination_id" IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN "consequences"."affected_conflict_id" IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN "consequences"."affected_quest_id" IS NOT NULL THEN 1 ELSE 0 END)
      ) = 1);--> statement-breakpoint
ALTER TABLE "consequences" ADD CONSTRAINT "chk_conflict_impact_description_required" CHECK (("consequences"."affected_conflict_id" IS NULL) OR ("consequences"."conflict_impact_description" IS NOT NULL));