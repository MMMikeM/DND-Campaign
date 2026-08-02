ALTER TABLE "item_notable_history" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "item_notable_history" CASCADE;--> statement-breakpoint
ALTER TABLE "item_relations" RENAME TO "item_connections";--> statement-breakpoint
ALTER TABLE "conflicts" RENAME COLUMN "natures" TO "nature";--> statement-breakpoint
ALTER TABLE "item_connections" RENAME COLUMN "relationship_details" TO "relationship";--> statement-breakpoint
ALTER TABLE "item_connections" DROP CONSTRAINT "item_relations_source_item_id_relationship_type_unique";--> statement-breakpoint
ALTER TABLE "foreshadowing" DROP CONSTRAINT "single_target_fk_check";--> statement-breakpoint
ALTER TABLE "foreshadowing" DROP CONSTRAINT "single_source_fk_check";--> statement-breakpoint
ALTER TABLE "item_connections" DROP CONSTRAINT "chk_single_fk_check";--> statement-breakpoint
ALTER TABLE "item_connections" DROP CONSTRAINT "item_relations_source_item_id_items_id_fk";
--> statement-breakpoint
ALTER TABLE "item_connections" DROP CONSTRAINT "item_relations_item_id_items_id_fk";
--> statement-breakpoint
ALTER TABLE "item_connections" DROP CONSTRAINT "item_relations_npc_id_npcs_id_fk";
--> statement-breakpoint
ALTER TABLE "item_connections" DROP CONSTRAINT "item_relations_faction_id_factions_id_fk";
--> statement-breakpoint
ALTER TABLE "item_connections" DROP CONSTRAINT "item_relations_site_id_sites_id_fk";
--> statement-breakpoint
ALTER TABLE "item_connections" DROP CONSTRAINT "item_relations_quest_id_quests_id_fk";
--> statement-breakpoint
ALTER TABLE "item_connections" DROP CONSTRAINT "item_relations_conflict_id_conflicts_id_fk";
--> statement-breakpoint
ALTER TABLE "items" DROP CONSTRAINT "items_quest_id_quests_id_fk";
--> statement-breakpoint
ALTER TABLE "items" DROP CONSTRAINT "items_quest_stage_id_quest_stages_id_fk";
--> statement-breakpoint
ALTER TABLE "foreshadowing" ALTER COLUMN "target_quest_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ALTER COLUMN "target_npc_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ALTER COLUMN "target_conflict_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ALTER COLUMN "target_item_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ALTER COLUMN "target_lore_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ALTER COLUMN "target_faction_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ALTER COLUMN "target_site_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ALTER COLUMN "source_quest_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ALTER COLUMN "source_quest_stage_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ALTER COLUMN "source_site_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ALTER COLUMN "source_npc_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ALTER COLUMN "source_lore_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD COLUMN "target_consequence_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "item_connections" ADD COLUMN "details" text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "item_connections" ADD COLUMN "connected_npc_id" integer;--> statement-breakpoint
ALTER TABLE "item_connections" ADD COLUMN "connected_faction_id" integer;--> statement-breakpoint
ALTER TABLE "item_connections" ADD COLUMN "connected_site_id" integer;--> statement-breakpoint
ALTER TABLE "item_connections" ADD COLUMN "connected_quest_id" integer;--> statement-breakpoint
ALTER TABLE "item_connections" ADD COLUMN "connected_conflict_id" integer;--> statement-breakpoint
ALTER TABLE "item_connections" ADD COLUMN "connected_lore_id" integer;--> statement-breakpoint
ALTER TABLE "item_connections" ADD COLUMN "connected_item_id" integer;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "narrative_significance" text NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "provenance_and_history" text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD CONSTRAINT "foreshadowing_source_quest_id_quests_id_fk" FOREIGN KEY ("source_quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD CONSTRAINT "foreshadowing_source_quest_stage_id_quest_stages_id_fk" FOREIGN KEY ("source_quest_stage_id") REFERENCES "public"."quest_stages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD CONSTRAINT "foreshadowing_source_site_id_sites_id_fk" FOREIGN KEY ("source_site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD CONSTRAINT "foreshadowing_source_npc_id_npcs_id_fk" FOREIGN KEY ("source_npc_id") REFERENCES "public"."npcs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD CONSTRAINT "foreshadowing_source_lore_id_lore_id_fk" FOREIGN KEY ("source_lore_id") REFERENCES "public"."lore"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD CONSTRAINT "foreshadowing_target_quest_id_quests_id_fk" FOREIGN KEY ("target_quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD CONSTRAINT "foreshadowing_target_npc_id_npcs_id_fk" FOREIGN KEY ("target_npc_id") REFERENCES "public"."npcs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD CONSTRAINT "foreshadowing_target_conflict_id_conflicts_id_fk" FOREIGN KEY ("target_conflict_id") REFERENCES "public"."conflicts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD CONSTRAINT "foreshadowing_target_item_id_items_id_fk" FOREIGN KEY ("target_item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD CONSTRAINT "foreshadowing_target_lore_id_lore_id_fk" FOREIGN KEY ("target_lore_id") REFERENCES "public"."lore"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD CONSTRAINT "foreshadowing_target_faction_id_factions_id_fk" FOREIGN KEY ("target_faction_id") REFERENCES "public"."factions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD CONSTRAINT "foreshadowing_target_consequence_id_consequences_id_fk" FOREIGN KEY ("target_consequence_id") REFERENCES "public"."consequences"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD CONSTRAINT "foreshadowing_target_site_id_sites_id_fk" FOREIGN KEY ("target_site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_connections" ADD CONSTRAINT "item_connections_source_item_id_items_id_fk" FOREIGN KEY ("source_item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_connections" ADD CONSTRAINT "item_connections_connected_npc_id_npcs_id_fk" FOREIGN KEY ("connected_npc_id") REFERENCES "public"."npcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_connections" ADD CONSTRAINT "item_connections_connected_faction_id_factions_id_fk" FOREIGN KEY ("connected_faction_id") REFERENCES "public"."factions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_connections" ADD CONSTRAINT "item_connections_connected_site_id_sites_id_fk" FOREIGN KEY ("connected_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_connections" ADD CONSTRAINT "item_connections_connected_quest_id_quests_id_fk" FOREIGN KEY ("connected_quest_id") REFERENCES "public"."quests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_connections" ADD CONSTRAINT "item_connections_connected_conflict_id_conflicts_id_fk" FOREIGN KEY ("connected_conflict_id") REFERENCES "public"."conflicts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_connections" ADD CONSTRAINT "item_connections_connected_lore_id_lore_id_fk" FOREIGN KEY ("connected_lore_id") REFERENCES "public"."lore"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_connections" ADD CONSTRAINT "item_connections_connected_item_id_items_id_fk" FOREIGN KEY ("connected_item_id") REFERENCES "public"."items"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conflict_participants" DROP COLUMN "gm_notes";--> statement-breakpoint
ALTER TABLE "conflicts" DROP COLUMN "gm_notes";--> statement-breakpoint
ALTER TABLE "conflicts" DROP COLUMN "quest_impacts";--> statement-breakpoint
ALTER TABLE "faction_agendas" DROP COLUMN "gm_notes";--> statement-breakpoint
ALTER TABLE "faction_diplomacy" DROP COLUMN "gm_notes";--> statement-breakpoint
ALTER TABLE "faction_influence" DROP COLUMN "gm_notes";--> statement-breakpoint
ALTER TABLE "factions" DROP COLUMN "gm_notes";--> statement-breakpoint
ALTER TABLE "foreshadowing" DROP COLUMN "gm_notes";--> statement-breakpoint
ALTER TABLE "foreshadowing" DROP COLUMN "target_narrative_event_id";--> statement-breakpoint
ALTER TABLE "foreshadowing" DROP COLUMN "target_narrative_destination_id";--> statement-breakpoint
ALTER TABLE "foreshadowing" DROP COLUMN "source_item_description_id";--> statement-breakpoint
ALTER TABLE "item_connections" DROP COLUMN "creative_prompts";--> statement-breakpoint
ALTER TABLE "item_connections" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "item_connections" DROP COLUMN "gm_notes";--> statement-breakpoint
ALTER TABLE "item_connections" DROP COLUMN "tags";--> statement-breakpoint
ALTER TABLE "item_connections" DROP COLUMN "relationship_type";--> statement-breakpoint
ALTER TABLE "item_connections" DROP COLUMN "item_id";--> statement-breakpoint
ALTER TABLE "item_connections" DROP COLUMN "npc_id";--> statement-breakpoint
ALTER TABLE "item_connections" DROP COLUMN "faction_id";--> statement-breakpoint
ALTER TABLE "item_connections" DROP COLUMN "site_id";--> statement-breakpoint
ALTER TABLE "item_connections" DROP COLUMN "quest_id";--> statement-breakpoint
ALTER TABLE "item_connections" DROP COLUMN "conflict_id";--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN "gm_notes";--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN "quest_id";--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN "quest_stage_id";--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN "perceived_simplicity";--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN "significance";--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN "lore_significance";--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN "creation_period";--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN "place_of_origin";--> statement-breakpoint
ALTER TABLE "lore" DROP COLUMN "gm_notes";--> statement-breakpoint
ALTER TABLE "lore_links" DROP COLUMN "gm_notes";--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD CONSTRAINT "single_target_fk_check" CHECK ((
        (case when "foreshadowing"."target_quest_id" is not null then 1 else 0 end) +
        (case when "foreshadowing"."target_consequence_id" is not null then 1 else 0 end) +
        (case when "foreshadowing"."target_npc_id" is not null then 1 else 0 end) +
        (case when "foreshadowing"."target_conflict_id" is not null then 1 else 0 end) +
        (case when "foreshadowing"."target_item_id" is not null then 1 else 0 end) +
        (case when "foreshadowing"."target_lore_id" is not null then 1 else 0 end) +
        (case when "foreshadowing"."target_faction_id" is not null then 1 else 0 end) +
        (case when "foreshadowing"."target_site_id" is not null then 1 else 0 end)
      ) = 1);--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD CONSTRAINT "single_source_fk_check" CHECK ((
        (case when "foreshadowing"."source_quest_id" is not null then 1 else 0 end) +
        (case when "foreshadowing"."source_quest_stage_id" is not null then 1 else 0 end) +
        (case when "foreshadowing"."source_site_id" is not null then 1 else 0 end) +
        (case when "foreshadowing"."source_npc_id" is not null then 1 else 0 end) +
        (case when "foreshadowing"."source_lore_id" is not null then 1 else 0 end)
      ) = 1);--> statement-breakpoint
ALTER TABLE "item_connections" ADD CONSTRAINT "chk_single_connected_fk" CHECK ((
					(CASE WHEN "item_connections"."connected_npc_id" IS NOT NULL THEN 1 ELSE 0 END) +
					(CASE WHEN "item_connections"."connected_faction_id" IS NOT NULL THEN 1 ELSE 0 END) +
					(CASE WHEN "item_connections"."connected_site_id" IS NOT NULL THEN 1 ELSE 0 END) +
					(CASE WHEN "item_connections"."connected_quest_id" IS NOT NULL THEN 1 ELSE 0 END) +
					(CASE WHEN "item_connections"."connected_conflict_id" IS NOT NULL THEN 1 ELSE 0 END) +
					(CASE WHEN "item_connections"."connected_lore_id" IS NOT NULL THEN 1 ELSE 0 END) +
					(CASE WHEN "item_connections"."connected_item_id" IS NOT NULL THEN 1 ELSE 0 END)
			) = 1);