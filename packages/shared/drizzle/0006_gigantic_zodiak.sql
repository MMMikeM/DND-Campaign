CREATE TABLE "map_relations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"tags" text[] NOT NULL,
	CONSTRAINT "map_relations_name_unique" UNIQUE("name")
);
--> statement-breakpoint
DROP MATERIALIZED VIEW "public"."search_index";--> statement-breakpoint
DROP VIEW "public"."site_search_data_view";--> statement-breakpoint
ALTER TABLE "map_details" RENAME COLUMN "map_id" TO "map_group_id";--> statement-breakpoint
ALTER TABLE "sites" RENAME COLUMN "map_id" TO "map_group_id";--> statement-breakpoint
ALTER TABLE "map_details" DROP CONSTRAINT "map_details_name_unique";--> statement-breakpoint
ALTER TABLE "sites" DROP CONSTRAINT "sites_map_id_unique";--> statement-breakpoint
ALTER TABLE "map_details" DROP CONSTRAINT "map_details_map_id_maps_id_fk";
--> statement-breakpoint
ALTER TABLE "sites" DROP CONSTRAINT "sites_map_id_maps_id_fk";
--> statement-breakpoint
ALTER TABLE "map_details" ADD COLUMN "map_file_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "map_details" ADD COLUMN "is_default" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "site_encounters" ADD COLUMN "map_variant_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "map_details" ADD CONSTRAINT "map_details_map_group_id_map_relations_id_fk" FOREIGN KEY ("map_group_id") REFERENCES "public"."map_relations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "map_details" ADD CONSTRAINT "map_details_map_file_id_maps_id_fk" FOREIGN KEY ("map_file_id") REFERENCES "public"."maps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_encounters" ADD CONSTRAINT "site_encounters_map_variant_id_map_details_id_fk" FOREIGN KEY ("map_variant_id") REFERENCES "public"."map_details"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_map_group_id_map_relations_id_fk" FOREIGN KEY ("map_group_id") REFERENCES "public"."map_relations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "one_default_per_group_idx" ON "map_details" USING btree ("map_group_id") WHERE "map_details"."is_default" = true;--> statement-breakpoint
ALTER TABLE "map_details" ADD CONSTRAINT "map_details_map_file_id_unique" UNIQUE("map_file_id");--> statement-breakpoint
ALTER TABLE "map_details" ADD CONSTRAINT "map_id_variant_name_unique" UNIQUE("map_group_id","name");--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_map_group_id_unique" UNIQUE("map_group_id");--> statement-breakpoint
CREATE VIEW "public"."site_search_data_view" AS (select "sites"."id", 'sites' as "source_table", to_jsonb("sites".*) as "entity_main", COALESCE(jsonb_build_object('id', "areas"."id", 'name', "areas"."name", 'region', jsonb_build_object('id', "regions"."id", 'name', "regions"."name")), '{}'::jsonb) as "area", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('link', to_jsonb(sl_out.*), 'targetSite', jsonb_build_object('id', ts.id, 'name', ts.name))) FILTER (WHERE sl_out.id IS NOT NULL), '[]'::jsonb) as "outgoing_relations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('link', to_jsonb(sl_in.*), 'sourceSite', jsonb_build_object('id', ss.id, 'name', ss.name))) FILTER (WHERE sl_in.id IS NOT NULL), '[]'::jsonb) as "incoming_relations", COALESCE(jsonb_agg(DISTINCT to_jsonb("site_encounters".*)) FILTER (WHERE "site_encounters"."id" IS NOT NULL), '[]'::jsonb) as "encounters", COALESCE(jsonb_agg(DISTINCT to_jsonb("site_secrets".*)) FILTER (WHERE "site_secrets"."id" IS NOT NULL), '[]'::jsonb) as "secrets", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('association', to_jsonb("npc_site_associations".*), 'npc', jsonb_build_object('id', "npcs"."id", 'name', "npcs"."name"))) FILTER (WHERE "npc_site_associations"."id" IS NOT NULL), '[]'::jsonb) as "npc_associations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "quest_stages"."id", 'name', "quest_stages"."name", 'quest', jsonb_build_object('id', qs_quest.id, 'name', qs_quest.name))) FILTER (WHERE "quest_stages"."id" IS NOT NULL), '[]'::jsonb) as "quest_stages", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "quest_hooks"."id", 'source', "quest_hooks"."source", 'hook_content', "quest_hooks"."hook_content", 'quest', jsonb_build_object('id', qh_quest.id, 'name', qh_quest.name))) FILTER (WHERE "quest_hooks"."id" IS NOT NULL), '[]'::jsonb) as "quest_hooks", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', site_consequences.id, 'description', site_consequences.description)) FILTER (WHERE site_consequences.id IS NOT NULL), '[]'::jsonb) as "consequences", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "factions"."id", 'name', "factions"."name")) FILTER (WHERE "factions"."id" IS NOT NULL), '[]'::jsonb) as "faction_hqs", COALESCE(jsonb_agg(DISTINCT to_jsonb(site_faction_influence.*)) FILTER (WHERE site_faction_influence.id IS NOT NULL), '[]'::jsonb) as "faction_influence", COALESCE(jsonb_agg(DISTINCT to_jsonb(fs_out.*)) FILTER (WHERE fs_out.id IS NOT NULL), '[]'::jsonb) as "outgoing_foreshadowing", COALESCE(jsonb_agg(DISTINCT to_jsonb(fs_in.*)) FILTER (WHERE fs_in.id IS NOT NULL), '[]'::jsonb) as "incoming_foreshadowing", COALESCE(jsonb_agg(DISTINCT to_jsonb("item_notable_history".*)) FILTER (WHERE "item_notable_history"."id" IS NOT NULL), '[]'::jsonb) as "item_history", COALESCE(jsonb_agg(DISTINCT to_jsonb(site_item_relations.*)) FILTER (WHERE site_item_relations.id IS NOT NULL), '[]'::jsonb) as "item_relations", COALESCE(jsonb_build_object('id', "map_relations"."id", 'name', "map_relations"."name"), '{}'::jsonb) as "map_group" from "sites" left join "areas" on "sites"."area_id" = "areas"."id" left join "regions" on "areas"."region_id" = "regions"."id" left join "site_links" AS sl_out on sl_out.source_site_id = "sites"."id" left join "sites" AS ts on sl_out.target_site_id = ts.id left join "site_links" AS sl_in on sl_in.target_site_id = "sites"."id" left join "sites" AS ss on sl_in.source_site_id = ss.id left join "site_encounters" on "site_encounters"."site_id" = "sites"."id" left join "site_secrets" on "site_secrets"."site_id" = "sites"."id" left join "npc_site_associations" on "npc_site_associations"."site_id" = "sites"."id" left join "npcs" on "npc_site_associations"."npc_id" = "npcs"."id" left join "quest_stages" on "quest_stages"."site_id" = "sites"."id" left join "quests" AS qs_quest on "quest_stages"."quest_id" = qs_quest.id left join "quest_hooks" on "quest_hooks"."site_id" = "sites"."id" left join "quests" AS qh_quest on "quest_hooks"."quest_id" = qh_quest.id left join "consequences" AS site_consequences on site_consequences.affected_entity_type = 'site' AND site_consequences.affected_entity_id = "sites"."id" left join "factions" on "factions"."hq_site_id" = "sites"."id" left join "faction_influence" AS site_faction_influence on site_faction_influence.related_entity_type = 'site' AND site_faction_influence.related_entity_id = "sites"."id" left join "foreshadowing" AS fs_out on fs_out.source_entity_type = 'site' AND fs_out.source_entity_id = "sites"."id" left join "foreshadowing" AS fs_in on fs_in.target_entity_type = 'site' AND fs_in.target_entity_id = "sites"."id" left join "item_notable_history" on "item_notable_history"."location_site_id" = "sites"."id" left join "item_relations" AS site_item_relations on site_item_relations.target_entity_type = 'site' AND site_item_relations.target_entity_id = "sites"."id" left join "map_relations" on "sites"."map_group_id" = "map_relations"."id" group by "sites"."id", "areas"."id", "regions"."id", "map_relations"."id");--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."search_index" AS (((((((((((((((select "id"::text as "id", "source_table", jsonb_build_object(
        'region', "entity_main",
        'areas', "areas",
        'quests', "quests",
        'conflicts', "conflicts",
        'consequences', "consequences",
        'narrativeDestinations', "narrative_destinations",
        'factionInfluence', "faction_influence",
        'loreLinks', "lore_links",
        'connections', jsonb_build_object(
          'outgoing', "outgoing_relations", 
          'incoming', "incoming_relations"
        )
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values(jsonb_build_object(
        'areas', "areas",
        'quests', "quests",
        'conflicts', "conflicts"
      )) as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'areas', "areas",
          'quests', "quests"
        )
      ) as "content_tsv" from "region_search_data_view") union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'area', "entity_main",
        'region', "region",
        'sites', "sites",
        'consequences', "consequences",
        'factionInfluence', "faction_influence"
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("region") || ' ' ||
      jsonb_deep_text_values("sites") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'region', "region",
          'sites', "sites"
        )
      ) as "content_tsv" from "area_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'site', "entity_main",
        'area', "area",
        'encounters', "encounters",
        'secrets', "secrets",
        'npcAssociations', "npc_associations",
        'questStages', "quest_stages",
        'questHooks', "quest_hooks",
        'consequences', "consequences",
        'factionHqs', "faction_hqs",
        'factionInfluence', "faction_influence",
        'foreshadowing', jsonb_build_object(
          'outgoing', "outgoing_foreshadowing", 
          'incoming', "incoming_foreshadowing"
        ),
        'itemHistory', "item_history",
        'itemRelations', "item_relations",
        'relations', jsonb_build_object(
          'outgoing', "outgoing_relations", 
          'incoming', "incoming_relations"
        ),
        'mapGroup', "map_group"
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("area") || ' ' ||
      jsonb_deep_text_values("encounters") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'area', "area",
          'encounters', "encounters"
        )
      ) as "content_tsv" from "site_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'npc', "entity_main",
        'factionMemberships', "faction_memberships",
        'siteAssociations', "site_associations",
        'conflictParticipation', "conflict_participation",
        'consequences', "affected_by_consequences",
        'foreshadowing', jsonb_build_object(
          'outgoing', "outgoing_foreshadowing", 
          'incoming', "incoming_foreshadowing"
        ),
        'itemHistory', "item_history",
        'itemRelations', "item_relations",
        'narrativeDestinationInvolvement', "narrative_destination_involvement",
        'questHooks', "quest_hooks",
        'questStageDeliveries', "quest_stage_deliveries",
        'stageInvolvement', "stage_involvement",
        'loreLinks', "lore_links",
        'relations', jsonb_build_object(
          'outgoing', "outgoing_relations", 
          'incoming', "incoming_relations"
        )
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("faction_memberships") || ' ' ||
      jsonb_deep_text_values("site_associations") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'factionMemberships', "faction_memberships",
          'siteAssociations', "site_associations"
        )
      ) as "content_tsv" from "npc_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'quest', "entity_main",
        'region', "region",
        'stages', "stages",
        'hooks', "hooks",
        'participants', "participants",
        'narrativeDestinationContributions', "narrative_destination_contributions",
        'affectingConsequences', "affecting_consequences",
        'triggeredConsequences', "triggered_consequences",
        'triggeredEvents', "triggered_events",
        'foreshadowing', jsonb_build_object(
          'outgoing', "outgoing_foreshadowing", 
          'incoming', "incoming_foreshadowing"
        ),
        'itemRelations', "item_relations",
        'loreLinks', "lore_links",
        'relations', jsonb_build_object(
          'outgoing', "outgoing_relations", 
          'incoming', "incoming_relations"
        )
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("region") || ' ' ||
      jsonb_deep_text_values("stages") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'region', "region",
          'stages', "stages"
        )
      ) as "content_tsv" from "quest_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'faction', "entity_main",
        'primaryHqSite', "primaryHqSite",
        'agendas', "agendas",
        'members', "members",
        'questHooks', "questHooks",
        'questParticipation', "questParticipation",
        'influence', "influence",
        'conflicts', "conflicts",
        'consequences', "consequences",
        'narrativeDestinationInvolvement', "narrativeDestinationInvolvement",
        'foreshadowing', "incomingForeshadowing",
        'itemRelations', "itemRelations",
        'loreLinks', "loreLinks",
        'relations', jsonb_build_object(
          'incoming', "incomingRelations", 
          'outgoing', "outgoingRelations"
        )
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("agendas") || ' ' ||
      jsonb_deep_text_values("members") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'agendas', "agendas",
          'members', "members"
        )
      ) as "content_tsv" from "faction_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'conflict', "entity_main",
        'region', "region",
        'participants', "participants",
        'consequences', "consequences",
        'affectedByConsequences', "affectedByConsequences",
        'narrativeDestinations', "narrativeDestinations",
        'incomingForeshadowing', "incomingForeshadowing",
        'itemRelations', "itemRelations",
        'loreLinks', "loreLinks"
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("participants") || ' ' ||
      jsonb_deep_text_values("consequences") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'participants', "participants",
          'consequences', "consequences"
        )
      ) as "content_tsv" from "conflict_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'item', "entity_main",
        'questStage', "questStage",
        'quest', "quest",
        'relations', jsonb_build_object(
          'outgoing', "relations", 
          'incoming', "incomingRelations"
        ),
        'notableHistory', "notableHistory",
        'incomingForeshadowing', "incomingForeshadowing"
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("quest") || ' ' ||
      jsonb_deep_text_values("notableHistory") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'quest', "quest",
          'notableHistory', "notableHistory"
        )
      ) as "content_tsv" from "item_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'foreshadowing', "entity_main",
        'sourceQuest', "sourceQuest",
        'sourceQuestStage', "sourceQuestStage",
        'sourceSite', "sourceSite",
        'sourceNpc', "sourceNpc",
        'sourceLore', "sourceLore",
        'targetQuest', "targetQuest",
        'targetNpc', "targetNpc",
        'targetNarrativeEvent', "targetNarrativeEvent",
        'targetConflict', "targetConflict",
        'targetItem', "targetItem",
        'targetNarrativeDestination', "targetNarrativeDestination",
        'targetLore', "targetLore",
        'targetFaction', "targetFaction",
        'targetSite', "targetSite"
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("sourceQuest") || ' ' ||
      jsonb_deep_text_values("targetQuest") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'sourceQuest', "sourceQuest",
          'targetQuest', "targetQuest"
        )
      ) as "content_tsv" from "foreshadowing_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'lore', "entity_main",
        'links', "links",
        'itemRelations', "item_relations",
        'incomingForeshadowing', "incoming_foreshadowing"
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("links") as "content", weighted_search_vector(
        "entity_main",
        "links"
      ) as "content_tsv" from "lore_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'narrativeDestination', "entity_main",
        'region', "region",
        'conflict', "conflict",
        'questRoles', "quest_roles",
        'participantInvolvement', "participant_involvement",
        'itemRelations', "item_relations",
        'relations', jsonb_build_object(
          'outgoing', "outgoing_relations", 
          'incoming', "incoming_relations"
        ),
        'loreLinks', "lore_links",
        'incomingForeshadowing', "incoming_foreshadowing"
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("region") || ' ' ||
      jsonb_deep_text_values("conflict") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'region', "region",
          'conflict', "conflict"
        )
      ) as "content_tsv" from "narrative_destination_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'narrativeEvent', "entity_main",
        'questStage', "quest_stage",
        'triggeringStageDecision', "triggering_stage_decision",
        'relatedQuest', "related_quest",
        'incomingForeshadowing', "incoming_foreshadowing"
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("quest_stage") || ' ' ||
      jsonb_deep_text_values("related_quest") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'questStage', "quest_stage",
          'relatedQuest', "related_quest"
        )
      ) as "content_tsv" from "narrative_event_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'consequence', "entity_main",
        'triggerQuest', "trigger_quest",
        'triggerConflict', "trigger_conflict",
        'affectedFaction', "affected_faction",
        'affectedRegion', "affected_region",
        'affectedArea', "affected_area",
        'affectedSite', "affected_site",
        'affectedNpc', "affected_npc",
        'affectedNarrativeDestination', "affected_narrative_destination",
        'affectedConflict', "affected_conflict",
        'affectedQuest', "affected_quest"
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("trigger_quest") || ' ' ||
      jsonb_deep_text_values("trigger_conflict") || ' ' ||
      jsonb_deep_text_values("affected_faction") || ' ' ||
      jsonb_deep_text_values("affected_region") || ' ' ||
      jsonb_deep_text_values("affected_area") || ' ' ||
      jsonb_deep_text_values("affected_site") || ' ' ||
      jsonb_deep_text_values("affected_npc") || ' ' ||
      jsonb_deep_text_values("affected_narrative_destination") || ' ' ||
      jsonb_deep_text_values("affected_conflict") || ' ' ||
      jsonb_deep_text_values("affected_quest") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'triggerQuest', "trigger_quest",
          'triggerConflict', "trigger_conflict",
          'affectedFaction', "affected_faction",
          'affectedRegion', "affected_region",
          'affectedArea', "affected_area",
          'affectedSite', "affected_site",
          'affectedNpc', "affected_npc",
          'affectedNarrativeDestination', "affected_narrative_destination",
          'affectedConflict', "affected_conflict",
          'affectedQuest', "affected_quest"
        )
      ) as "content_tsv" from "consequence_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'questStage', "entity_main",
        'quest', "quest",
        'site', "site",
        'deliveryNpc', "delivery_npc",
        'outgoingDecisions', "outgoing_decisions",
        'incomingDecisions', "incoming_decisions",
        'items', "items",
        'narrativeEvents', "narrative_events",
        'npcInvolvement', "npc_involvement",
        'outgoingForeshadowing', "outgoing_foreshadowing"
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("quest") || ' ' ||
      jsonb_deep_text_values("site") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'quest', "quest",
          'site', "site"
        )
      ) as "content_tsv" from "quest_stage_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'questStageDecision', "entity_main",
        'quest', "quest",
        'fromStage', "from_stage",
        'toStage', "to_stage",
        'triggeredEvents', "triggered_events",
        'consequences', "consequences"
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("quest") || ' ' ||
      jsonb_deep_text_values("from_stage") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'quest', "quest",
          'fromStage', "from_stage"
        )
      ) as "content_tsv" from "quest_stage_decision_search_data_view"));