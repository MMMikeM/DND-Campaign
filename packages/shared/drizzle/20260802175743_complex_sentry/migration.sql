ALTER TABLE "foreshadowing" DROP CONSTRAINT "foreshadowing_source_quest_id_quests_id_fk";--> statement-breakpoint
ALTER TABLE "foreshadowing" DROP CONSTRAINT "foreshadowing_source_quest_stage_id_quest_stages_id_fk";--> statement-breakpoint
ALTER TABLE "foreshadowing" DROP CONSTRAINT "foreshadowing_source_site_id_sites_id_fk";--> statement-breakpoint
ALTER TABLE "foreshadowing" DROP CONSTRAINT "foreshadowing_source_npc_id_npcs_id_fk";--> statement-breakpoint
ALTER TABLE "foreshadowing" DROP CONSTRAINT "foreshadowing_source_lore_id_lore_id_fk";--> statement-breakpoint
ALTER TABLE "foreshadowing" DROP CONSTRAINT "foreshadowing_source_item_id_items_id_fk";--> statement-breakpoint
ALTER TABLE "foreshadowing" DROP CONSTRAINT "foreshadowing_target_quest_id_quests_id_fk";--> statement-breakpoint
ALTER TABLE "foreshadowing" DROP CONSTRAINT "foreshadowing_target_npc_id_npcs_id_fk";--> statement-breakpoint
ALTER TABLE "foreshadowing" DROP CONSTRAINT "foreshadowing_target_conflict_id_conflicts_id_fk";--> statement-breakpoint
ALTER TABLE "foreshadowing" DROP CONSTRAINT "foreshadowing_target_item_id_items_id_fk";--> statement-breakpoint
ALTER TABLE "foreshadowing" DROP CONSTRAINT "foreshadowing_target_lore_id_lore_id_fk";--> statement-breakpoint
ALTER TABLE "foreshadowing" DROP CONSTRAINT "foreshadowing_target_faction_id_factions_id_fk";--> statement-breakpoint
ALTER TABLE "foreshadowing" DROP CONSTRAINT "foreshadowing_target_consequence_id_consequences_id_fk";--> statement-breakpoint
ALTER TABLE "foreshadowing" DROP CONSTRAINT "foreshadowing_target_site_id_sites_id_fk";--> statement-breakpoint
ALTER TABLE "sites" DROP CONSTRAINT "sites_map_group_id_map_groups_id_fk";--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD COLUMN "target_region_id" integer;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD COLUMN "target_area_id" integer;--> statement-breakpoint
ALTER TABLE "foreshadowing" ALTER COLUMN "source_quest_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ALTER COLUMN "source_quest_stage_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ALTER COLUMN "source_site_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ALTER COLUMN "source_npc_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ALTER COLUMN "source_lore_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ALTER COLUMN "source_item_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ALTER COLUMN "target_quest_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ALTER COLUMN "target_npc_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ALTER COLUMN "target_conflict_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ALTER COLUMN "target_item_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ALTER COLUMN "target_lore_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ALTER COLUMN "target_faction_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ALTER COLUMN "target_consequence_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ALTER COLUMN "target_site_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "sites" ALTER COLUMN "map_group_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "npc_details" ADD CONSTRAINT "npc_details_npc_id_unique" UNIQUE("npc_id");--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD CONSTRAINT "foreshadowing_source_quest_id_quests_id_fkey" FOREIGN KEY ("source_quest_id") REFERENCES "quests"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD CONSTRAINT "foreshadowing_source_quest_stage_id_quest_stages_id_fkey" FOREIGN KEY ("source_quest_stage_id") REFERENCES "quest_stages"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD CONSTRAINT "foreshadowing_source_site_id_sites_id_fkey" FOREIGN KEY ("source_site_id") REFERENCES "sites"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD CONSTRAINT "foreshadowing_source_npc_id_npcs_id_fkey" FOREIGN KEY ("source_npc_id") REFERENCES "npcs"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD CONSTRAINT "foreshadowing_source_lore_id_lore_id_fkey" FOREIGN KEY ("source_lore_id") REFERENCES "lore"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD CONSTRAINT "foreshadowing_source_item_id_items_id_fkey" FOREIGN KEY ("source_item_id") REFERENCES "items"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD CONSTRAINT "foreshadowing_target_quest_id_quests_id_fkey" FOREIGN KEY ("target_quest_id") REFERENCES "quests"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD CONSTRAINT "foreshadowing_target_npc_id_npcs_id_fkey" FOREIGN KEY ("target_npc_id") REFERENCES "npcs"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD CONSTRAINT "foreshadowing_target_conflict_id_conflicts_id_fkey" FOREIGN KEY ("target_conflict_id") REFERENCES "conflicts"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD CONSTRAINT "foreshadowing_target_item_id_items_id_fkey" FOREIGN KEY ("target_item_id") REFERENCES "items"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD CONSTRAINT "foreshadowing_target_lore_id_lore_id_fkey" FOREIGN KEY ("target_lore_id") REFERENCES "lore"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD CONSTRAINT "foreshadowing_target_faction_id_factions_id_fkey" FOREIGN KEY ("target_faction_id") REFERENCES "factions"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD CONSTRAINT "foreshadowing_target_consequence_id_consequences_id_fkey" FOREIGN KEY ("target_consequence_id") REFERENCES "consequences"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD CONSTRAINT "foreshadowing_target_site_id_sites_id_fkey" FOREIGN KEY ("target_site_id") REFERENCES "sites"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD CONSTRAINT "foreshadowing_target_region_id_regions_id_fkey" FOREIGN KEY ("target_region_id") REFERENCES "regions"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD CONSTRAINT "foreshadowing_target_area_id_areas_id_fkey" FOREIGN KEY ("target_area_id") REFERENCES "areas"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_map_group_id_map_groups_id_fkey" FOREIGN KEY ("map_group_id") REFERENCES "map_groups"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" DROP CONSTRAINT "single_target_fk_check", ADD CONSTRAINT "single_target_fk_check" CHECK ((
        (case when "target_quest_id" is not null then 1 else 0 end) +
        (case when "target_consequence_id" is not null then 1 else 0 end) +
        (case when "target_npc_id" is not null then 1 else 0 end) +
        (case when "target_conflict_id" is not null then 1 else 0 end) +
        (case when "target_item_id" is not null then 1 else 0 end) +
        (case when "target_lore_id" is not null then 1 else 0 end) +
        (case when "target_faction_id" is not null then 1 else 0 end) +
        (case when "target_site_id" is not null then 1 else 0 end) +
        (case when "target_region_id" is not null then 1 else 0 end) +
        (case when "target_area_id" is not null then 1 else 0 end)
      ) = 1);