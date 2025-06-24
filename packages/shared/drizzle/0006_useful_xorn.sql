DROP MATERIALIZED VIEW "public"."search_index";--> statement-breakpoint
DROP VIEW "public"."item_search_data_view";--> statement-breakpoint
DROP VIEW "public"."lore_search_data_view";--> statement-breakpoint
ALTER TABLE "item_relations" DROP CONSTRAINT "chk_single_fk_check";--> statement-breakpoint
ALTER TABLE "item_relations" DROP CONSTRAINT "item_relations_lore_id_lore_id_fk";
--> statement-breakpoint
ALTER TABLE "lore_links" ADD COLUMN "item_id" integer;--> statement-breakpoint
ALTER TABLE "lore_links" ADD CONSTRAINT "lore_links_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_relations" DROP COLUMN "lore_id";--> statement-breakpoint
ALTER TABLE "item_relations" ADD CONSTRAINT "chk_single_fk_check" CHECK ((
			(case when "item_relations"."item_id" is not null then 1 else 0 end) +
			(case when "item_relations"."npc_id" is not null then 1 else 0 end) +
			(case when "item_relations"."faction_id" is not null then 1 else 0 end) +
			(case when "item_relations"."site_id" is not null then 1 else 0 end) +
			(case when "item_relations"."quest_id" is not null then 1 else 0 end) +
			(case when "item_relations"."conflict_id" is not null then 1 else 0 end) +
			(case when "item_relations"."narrative_destination_id" is not null then 1 else 0 end)
		) = 1);--> statement-breakpoint
CREATE VIEW "public"."item_search_data_view" AS (select "items"."id", 'items' as "source_table", to_jsonb("items") as "entity_main", COALESCE(jsonb_build_object('stage', jsonb_build_object('id', "quest_stages"."id", 'name', "quest_stages"."name"), 'quest', jsonb_build_object('id', sq.id, 'name', sq.name)), '{}'::jsonb) as "questStage", COALESCE(jsonb_build_object('id', rq.id, 'name', rq.name), '{}'::jsonb) as "quest", COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
    'relationship', to_jsonb("item_relations".*),
    'item', CASE WHEN "item_relations"."item_id" IS NOT NULL THEN jsonb_build_object('id', ti.id, 'name', ti.name) END,
    'npc', CASE WHEN "item_relations"."npc_id" IS NOT NULL THEN jsonb_build_object('id', tn.id, 'name', tn.name) END,
    'faction', CASE WHEN "item_relations"."faction_id" IS NOT NULL THEN jsonb_build_object('id', tf.id, 'name', tf.name) END,
    'site', CASE WHEN "item_relations"."site_id" IS NOT NULL THEN jsonb_build_object('id', ts.id, 'name', ts.name) END,
    'quest', CASE WHEN "item_relations"."quest_id" IS NOT NULL THEN jsonb_build_object('id', tq.id, 'name', tq.name) END,
    'conflict', CASE WHEN "item_relations"."conflict_id" IS NOT NULL THEN jsonb_build_object('id', tc.id, 'name', tc.name) END,
    'narrativeDestination', CASE WHEN "item_relations"."narrative_destination_id" IS NOT NULL THEN jsonb_build_object('id', tnd.id, 'name', tnd.name) END
  )) FILTER (WHERE "item_relations"."id" IS NOT NULL), '[]'::jsonb) as "relations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
    'relationship', to_jsonb(ir_in.*),
    'sourceItem', jsonb_build_object('id', si.id, 'name', si.name)
  )) FILTER (WHERE ir_in.id IS NOT NULL), '[]'::jsonb) as "incomingRelations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
    'history', to_jsonb("item_notable_history".*),
    'keyNpc', CASE WHEN "item_notable_history"."key_npc_id" IS NOT NULL THEN jsonb_build_object('id', hn.id, 'name', hn.name) END,
    'locationSite', CASE WHEN "item_notable_history"."location_site_id" IS NOT NULL THEN jsonb_build_object('id', hs.id, 'name', hs.name) END
  )) FILTER (WHERE "item_notable_history"."id" IS NOT NULL), '[]'::jsonb) as "notableHistory", COALESCE(jsonb_agg(DISTINCT to_jsonb("foreshadowing".*)) FILTER (WHERE "foreshadowing"."id" IS NOT NULL), '[]'::jsonb) as "incomingForeshadowing" from "items" left join "quest_stages" on "items"."quest_stage_id" = "quest_stages"."id" left join "quests" AS sq on "quest_stages"."quest_id" = sq.id left join "quests" AS rq on "items"."quest_id" = rq.id left join "item_relations" on "item_relations"."source_item_id" = "items"."id" left join "items" AS ti on "item_relations"."item_id" = ti.id left join "npcs" AS tn on "item_relations"."npc_id" = tn.id left join "factions" AS tf on "item_relations"."faction_id" = tf.id left join "sites" AS ts on "item_relations"."site_id" = ts.id left join "quests" AS tq on "item_relations"."quest_id" = tq.id left join "conflicts" AS tc on "item_relations"."conflict_id" = tc.id left join "narrative_destinations" AS tnd on "item_relations"."narrative_destination_id" = tnd.id left join "item_relations" AS ir_in on ir_in.item_id = "items"."id" left join "items" AS si on ir_in.source_item_id = si.id left join "item_notable_history" on "item_notable_history"."item_id" = "items"."id" left join "npcs" AS hn on "item_notable_history"."key_npc_id" = hn.id left join "sites" AS hs on "item_notable_history"."location_site_id" = hs.id left join "foreshadowing" on "foreshadowing"."target_item_id" = "items"."id" group by "items"."id", "quest_stages"."id", sq.id, rq.id);--> statement-breakpoint
CREATE VIEW "public"."lore_search_data_view" AS (select "lore"."id", 'lore' as "source_table", to_jsonb("lore".*) as "entity_main", COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
					'link', to_jsonb("lore_links".*),
					'region', CASE WHEN "lore_links"."region_id" IS NOT NULL THEN jsonb_build_object('id', lr.id, 'name', lr.name) END,
					'faction', CASE WHEN "lore_links"."faction_id" IS NOT NULL THEN jsonb_build_object('id', lf.id, 'name', lf.name) END,
					'npc', CASE WHEN "lore_links"."npc_id" IS NOT NULL THEN jsonb_build_object('id', ln.id, 'name', ln.name) END,
					'conflict', CASE WHEN "lore_links"."conflict_id" IS NOT NULL THEN jsonb_build_object('id', lc.id, 'name', lc.name) END,
					'quest', CASE WHEN "lore_links"."quest_id" IS NOT NULL THEN jsonb_build_object('id', lq.id, 'name', lq.name) END,
					'foreshadowing', CASE WHEN "lore_links"."foreshadowing_id" IS NOT NULL THEN jsonb_build_object('id', lfs.id, 'name', lfs.name) END,
					'narrativeDestination', CASE WHEN "lore_links"."narrative_destination_id" IS NOT NULL THEN jsonb_build_object('id', lnd.id, 'name', lnd.name) END,
					'relatedLore', CASE WHEN "lore_links"."related_lore_id" IS NOT NULL THEN jsonb_build_object('id', ll.id, 'name', ll.name) END,
					'item', CASE WHEN "lore_links"."item_id" IS NOT NULL THEN jsonb_build_object('id', li.id, 'name', li.name) END
				)) FILTER (WHERE "lore_links"."id" IS NOT NULL), '[]'::jsonb) as "links", COALESCE(jsonb_agg(DISTINCT to_jsonb("foreshadowing".*)) FILTER (WHERE "foreshadowing"."id" IS NOT NULL), '[]'::jsonb) as "incoming_foreshadowing", COALESCE(jsonb_agg(DISTINCT to_jsonb(fs_out.*)) FILTER (WHERE fs_out.id IS NOT NULL), '[]'::jsonb) as "outgoing_foreshadowing" from "lore" left join "lore_links" on "lore_links"."lore_id" = "lore"."id" left join "regions" AS lr on "lore_links"."region_id" = lr.id left join "factions" AS lf on "lore_links"."faction_id" = lf.id left join "npcs" AS ln on "lore_links"."npc_id" = ln.id left join "conflicts" AS lc on "lore_links"."conflict_id" = lc.id left join "quests" AS lq on "lore_links"."quest_id" = lq.id left join "lore" AS ll on "lore_links"."related_lore_id" = ll.id left join "foreshadowing" AS lfs on "lore_links"."foreshadowing_id" = lfs.id left join "narrative_destinations" AS lnd on "lore_links"."narrative_destination_id" = lnd.id left join "items" as li on "lore_links"."item_id" = li.id left join "foreshadowing" on "foreshadowing"."target_lore_id" = "lore"."id" left join "foreshadowing" as fs_out on fs_out.source_lore_id = "lore"."id" group by "lore"."id");--> statement-breakpoint
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
        'foreshadowing', jsonb_build_object(
          'incoming', "incoming_foreshadowing",
          'outgoing', "outgoing_foreshadowing"
        )
      ) as "raw_data", jsonb_deep_text_values("entity_main") as "content", weighted_search_vector(
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