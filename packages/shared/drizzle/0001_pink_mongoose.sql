ALTER TABLE "item_relations" RENAME COLUMN "source_item_id" TO "item_id";--> statement-breakpoint
ALTER TABLE "item_relations" RENAME COLUMN "target_entity_type" TO "entity_type";--> statement-breakpoint
ALTER TABLE "item_relations" RENAME COLUMN "target_item_id" TO "related_item_id";--> statement-breakpoint
ALTER TABLE "item_relations" RENAME COLUMN "target_npc_id" TO "npc_id";--> statement-breakpoint
ALTER TABLE "item_relations" RENAME COLUMN "target_faction_id" TO "faction_id";--> statement-breakpoint
ALTER TABLE "item_relations" RENAME COLUMN "target_site_id" TO "site_id";--> statement-breakpoint
ALTER TABLE "item_relations" RENAME COLUMN "target_quest_id" TO "quest_id";--> statement-breakpoint
ALTER TABLE "item_relations" RENAME COLUMN "target_conflict_id" TO "conflict_id";--> statement-breakpoint
ALTER TABLE "item_relations" RENAME COLUMN "target_narrative_destination_id" TO "narrative_destination_id";--> statement-breakpoint
ALTER TABLE "item_relations" RENAME COLUMN "target_world_concept_id" TO "world_concept_id";--> statement-breakpoint
ALTER TABLE "item_relations" DROP CONSTRAINT "item_relations_source_item_id_target_entity_type_target_item_id_target_npc_id_target_faction_id_target_site_id_target_quest_id_target_conflict_id_target_narrative_destination_id_target_world_concept_id_relationship_type_unique";--> statement-breakpoint
ALTER TABLE "item_relations" DROP CONSTRAINT "single_related_entity_exclusive_and_correct";--> statement-breakpoint
ALTER TABLE "item_relations" DROP CONSTRAINT "item_relations_source_item_id_items_id_fk";
--> statement-breakpoint
ALTER TABLE "item_relations" DROP CONSTRAINT "item_relations_target_item_id_items_id_fk";
--> statement-breakpoint
ALTER TABLE "item_relations" DROP CONSTRAINT "item_relations_target_npc_id_npcs_id_fk";
--> statement-breakpoint
ALTER TABLE "item_relations" DROP CONSTRAINT "item_relations_target_faction_id_factions_id_fk";
--> statement-breakpoint
ALTER TABLE "item_relations" DROP CONSTRAINT "item_relations_target_site_id_sites_id_fk";
--> statement-breakpoint
ALTER TABLE "item_relations" DROP CONSTRAINT "item_relations_target_quest_id_quests_id_fk";
--> statement-breakpoint
ALTER TABLE "item_relations" DROP CONSTRAINT "item_relations_target_conflict_id_conflicts_id_fk";
--> statement-breakpoint
ALTER TABLE "item_relations" DROP CONSTRAINT "item_relations_target_narrative_destination_id_narrative_destinations_id_fk";
--> statement-breakpoint
ALTER TABLE "item_relations" DROP CONSTRAINT "item_relations_target_world_concept_id_world_concepts_id_fk";
--> statement-breakpoint
ALTER TABLE "item_relations" ADD CONSTRAINT "item_relations_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_relations" ADD CONSTRAINT "item_relations_related_item_id_items_id_fk" FOREIGN KEY ("related_item_id") REFERENCES "public"."items"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_relations" ADD CONSTRAINT "item_relations_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_relations" ADD CONSTRAINT "item_relations_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_relations" ADD CONSTRAINT "item_relations_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_relations" ADD CONSTRAINT "item_relations_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_relations" ADD CONSTRAINT "item_relations_conflict_id_conflicts_id_fk" FOREIGN KEY ("conflict_id") REFERENCES "public"."conflicts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_relations" ADD CONSTRAINT "item_relations_narrative_destination_id_narrative_destinations_id_fk" FOREIGN KEY ("narrative_destination_id") REFERENCES "public"."narrative_destinations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_relations" ADD CONSTRAINT "item_relations_world_concept_id_world_concepts_id_fk" FOREIGN KEY ("world_concept_id") REFERENCES "public"."world_concepts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_relations" ADD CONSTRAINT "item_relations_item_id_entity_type_related_item_id_npc_id_faction_id_site_id_quest_id_conflict_id_narrative_destination_id_world_concept_id_relationship_type_unique" UNIQUE("item_id","entity_type","related_item_id","npc_id","faction_id","site_id","quest_id","conflict_id","narrative_destination_id","world_concept_id","relationship_type");--> statement-breakpoint
ALTER TABLE "item_relations" ADD CONSTRAINT "single_related_entity_exclusive_and_correct" CHECK (
			CASE "item_relations"."entity_type"
				WHEN 'item' THEN ("item_relations"."related_item_id" IS NOT NULL AND "item_relations"."npc_id" IS NULL AND "item_relations"."faction_id" IS NULL AND "item_relations"."site_id" IS NULL AND "item_relations"."quest_id" IS NULL AND "item_relations"."conflict_id" IS NULL AND "item_relations"."narrative_destination_id" IS NULL AND "item_relations"."world_concept_id" IS NULL)
				WHEN 'npc' THEN ("item_relations"."related_item_id" IS NULL AND "item_relations"."npc_id" IS NOT NULL AND "item_relations"."faction_id" IS NULL AND "item_relations"."site_id" IS NULL AND "item_relations"."quest_id" IS NULL AND "item_relations"."conflict_id" IS NULL AND "item_relations"."narrative_destination_id" IS NULL AND "item_relations"."world_concept_id" IS NULL)
				WHEN 'faction' THEN ("item_relations"."related_item_id" IS NULL AND "item_relations"."npc_id" IS NULL AND "item_relations"."faction_id" IS NOT NULL AND "item_relations"."site_id" IS NULL AND "item_relations"."quest_id" IS NULL AND "item_relations"."conflict_id" IS NULL AND "item_relations"."narrative_destination_id" IS NULL AND "item_relations"."world_concept_id" IS NULL)
				WHEN 'site' THEN ("item_relations"."related_item_id" IS NULL AND "item_relations"."npc_id" IS NULL AND "item_relations"."faction_id" IS NULL AND "item_relations"."site_id" IS NOT NULL AND "item_relations"."quest_id" IS NULL AND "item_relations"."conflict_id" IS NULL AND "item_relations"."narrative_destination_id" IS NULL AND "item_relations"."world_concept_id" IS NULL)
				WHEN 'quest' THEN ("item_relations"."related_item_id" IS NULL AND "item_relations"."npc_id" IS NULL AND "item_relations"."faction_id" IS NULL AND "item_relations"."site_id" IS NULL AND "item_relations"."quest_id" IS NOT NULL AND "item_relations"."conflict_id" IS NULL AND "item_relations"."narrative_destination_id" IS NULL AND "item_relations"."world_concept_id" IS NULL)
				WHEN 'conflict' THEN ("item_relations"."related_item_id" IS NULL AND "item_relations"."npc_id" IS NULL AND "item_relations"."faction_id" IS NULL AND "item_relations"."site_id" IS NULL AND "item_relations"."quest_id" IS NULL AND "item_relations"."conflict_id" IS NOT NULL AND "item_relations"."narrative_destination_id" IS NULL AND "item_relations"."world_concept_id" IS NULL)
				WHEN 'narrative_destination' THEN ("item_relations"."related_item_id" IS NULL AND "item_relations"."npc_id" IS NULL AND "item_relations"."faction_id" IS NULL AND "item_relations"."site_id" IS NULL AND "item_relations"."quest_id" IS NULL AND "item_relations"."conflict_id" IS NULL AND "item_relations"."narrative_destination_id" IS NOT NULL AND "item_relations"."world_concept_id" IS NULL)
				WHEN 'world_concept' THEN ("item_relations"."related_item_id" IS NULL AND "item_relations"."npc_id" IS NULL AND "item_relations"."faction_id" IS NULL AND "item_relations"."site_id" IS NULL AND "item_relations"."quest_id" IS NULL AND "item_relations"."conflict_id" IS NULL AND "item_relations"."narrative_destination_id" IS NULL AND "item_relations"."world_concept_id" IS NOT NULL)
				ELSE FALSE
			END
			);