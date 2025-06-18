DROP MATERIALIZED VIEW "public"."search_index";--> statement-breakpoint
DROP VIEW "public"."conflict_search_data_view";--> statement-breakpoint
DROP VIEW "public"."lore_search_data_view";--> statement-breakpoint
DROP VIEW "public"."narrative_destination_search_data_view";--> statement-breakpoint
DROP VIEW "public"."quest_search_data_view";--> statement-breakpoint
ALTER TABLE "narrative_destination_participants" RENAME COLUMN "npc_or_faction" TO "participant_type";--> statement-breakpoint
ALTER TABLE "narrative_destination_participants" RENAME COLUMN "role_in_arc" TO "narrative_role";--> statement-breakpoint
ALTER TABLE "narrative_destination_participants" RENAME COLUMN "arc_importance" TO "importance";--> statement-breakpoint
ALTER TABLE "narrative_destination_quest_roles" RENAME COLUMN "role" TO "narrative_role";--> statement-breakpoint
ALTER TABLE "narrative_destination_quest_roles" RENAME COLUMN "sequence_in_arc" TO "sequence";--> statement-breakpoint
ALTER TABLE "narrative_destinations" RENAME COLUMN "related_conflict_id" TO "conflict_id";--> statement-breakpoint
ALTER TABLE "narrative_destinations" RENAME COLUMN "intended_emotional_arc_shape" TO "emotional_shape";--> statement-breakpoint
ALTER TABLE "narrative_destination_participants" DROP CONSTRAINT "npc_or_faction_exclusive_participant";--> statement-breakpoint
ALTER TABLE "narrative_destinations" DROP CONSTRAINT "narrative_destinations_related_conflict_id_conflicts_id_fk";
--> statement-breakpoint
ALTER TABLE "narrative_destinations" ADD CONSTRAINT "narrative_destinations_conflict_id_conflicts_id_fk" FOREIGN KEY ("conflict_id") REFERENCES "public"."conflicts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_destinations" DROP COLUMN "foreshadowing_elements";--> statement-breakpoint
ALTER TABLE "narrative_destination_participants" ADD CONSTRAINT "npc_or_faction_exclusive_participant" CHECK ( ("narrative_destination_participants"."participant_type" = 'npc' AND "narrative_destination_participants"."npc_id" IS NOT NULL AND "narrative_destination_participants"."faction_id" IS NULL)
        OR ("narrative_destination_participants"."participant_type" = 'faction' AND "narrative_destination_participants"."npc_id" IS NULL AND "narrative_destination_participants"."faction_id" IS NOT NULL)
            );--> statement-breakpoint
CREATE VIEW "public"."conflict_search_data_view" AS (select "conflicts"."id", 'conflicts' as "source_table", to_jsonb("conflicts") as "entity_main", COALESCE(jsonb_build_object('id', "regions"."id", 'name', "regions"."name"), '{}'::jsonb) as "region", COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
    'participant', to_jsonb("conflict_participants".*),
    'faction', CASE WHEN "conflict_participants"."faction_id" IS NOT NULL THEN jsonb_build_object('id', "factions"."id", 'name', "factions"."name") END,
    'npc', CASE WHEN "conflict_participants"."npc_id" IS NOT NULL THEN jsonb_build_object('id', "npcs"."id", 'name', "npcs"."name") END
  )) FILTER (WHERE "conflict_participants"."id" IS NOT NULL), '[]'::jsonb) as "participants", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', c_caused.id, 'description', c_caused.description)) FILTER (WHERE c_caused.id IS NOT NULL), '[]'::jsonb) as "consequences", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', c_affecting.id, 'description', c_affecting.description)) FILTER (WHERE c_affecting.id IS NOT NULL), '[]'::jsonb) as "affectedByConsequences", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "narrative_destinations"."id", 'name', "narrative_destinations"."name")) FILTER (WHERE "narrative_destinations"."id" IS NOT NULL), '[]'::jsonb) as "narrativeDestinations", COALESCE(jsonb_agg(DISTINCT to_jsonb("foreshadowing".*)) FILTER (WHERE "foreshadowing"."id" IS NOT NULL), '[]'::jsonb) as "incomingForeshadowing", COALESCE(jsonb_agg(DISTINCT to_jsonb("item_relations".*)) FILTER (WHERE "item_relations"."id" IS NOT NULL), '[]'::jsonb) as "itemRelations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "lore_links"."id", 'lore_id', "lore_links"."lore_id")) FILTER (WHERE "lore_links"."id" IS NOT NULL), '[]'::jsonb) as "loreLinks" from "conflicts" left join "regions" on "conflicts"."region_id" = "regions"."id" left join "conflict_participants" on "conflict_participants"."conflict_id" = "conflicts"."id" left join "factions" on "conflict_participants"."faction_id" = "factions"."id" left join "npcs" on "conflict_participants"."npc_id" = "npcs"."id" left join "consequences" AS c_caused on c_caused.trigger_entity_type = 'conflict' AND c_caused.trigger_entity_id = "conflicts"."id" left join "consequences" AS c_affecting on c_affecting.affected_entity_type = 'conflict' AND c_affecting.affected_entity_id = "conflicts"."id" left join "narrative_destinations" on "narrative_destinations"."conflict_id" = "conflicts"."id" left join "foreshadowing" on "foreshadowing"."target_entity_type" = 'conflict' AND "foreshadowing"."target_entity_id" = "conflicts"."id" left join "item_relations" on "item_relations"."target_entity_type" = 'conflict' AND "item_relations"."target_entity_id" = "conflicts"."id" left join "lore_links" on "lore_links"."target_entity_type" = 'conflict' AND "lore_links"."target_entity_id" = "conflicts"."id" group by "conflicts"."id", "regions"."id");--> statement-breakpoint
CREATE VIEW "public"."lore_search_data_view" AS (select "lore"."id", 'lore' as "source_table", to_jsonb("lore".*) as "entity_main", COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
					'link', to_jsonb("lore_links".*),
					'region', CASE WHEN "lore_links"."target_entity_type" = 'region' THEN jsonb_build_object('id', lr.id, 'name', lr.name) END,
					'faction', CASE WHEN "lore_links"."target_entity_type" = 'faction' THEN jsonb_build_object('id', lf.id, 'name', lf.name) END,
					'npc', CASE WHEN "lore_links"."target_entity_type" = 'npc' THEN jsonb_build_object('id', ln.id, 'name', ln.name) END,
					'conflict', CASE WHEN "lore_links"."target_entity_type" = 'conflict' THEN jsonb_build_object('id', lc.id, 'name', lc.name) END,
					'quest', CASE WHEN "lore_links"."target_entity_type" = 'quest' THEN jsonb_build_object('id', lq.id, 'name', lq.name) END,
					'lore', CASE WHEN "lore_links"."target_entity_type" = 'lore' THEN jsonb_build_object('id', ll.id, 'name', ll.name) END
				)) FILTER (WHERE "lore_links"."id" IS NOT NULL), '[]'::jsonb) as "links", COALESCE(jsonb_agg(DISTINCT to_jsonb("item_relations".*)) FILTER (WHERE "item_relations"."id" IS NOT NULL), '[]'::jsonb) as "item_relations", COALESCE(jsonb_agg(DISTINCT to_jsonb("foreshadowing".*)) FILTER (WHERE "foreshadowing"."id" IS NOT NULL), '[]'::jsonb) as "incoming_foreshadowing" from "lore" left join "lore_links" on "lore_links"."lore_id" = "lore"."id" left join "regions" AS lr on "lore_links"."target_entity_type" = 'region' AND "lore_links"."target_entity_id" = lr.id left join "factions" AS lf on "lore_links"."target_entity_type" = 'faction' AND "lore_links"."target_entity_id" = lf.id left join "npcs" AS ln on "lore_links"."target_entity_type" = 'npc' AND "lore_links"."target_entity_id" = ln.id left join "conflicts" AS lc on "lore_links"."target_entity_type" = 'conflict' AND "lore_links"."target_entity_id" = lc.id left join "quests" AS lq on "lore_links"."target_entity_type" = 'quest' AND "lore_links"."target_entity_id" = lq.id left join "lore" AS ll on "lore_links"."target_entity_type" = 'lore' AND "lore_links"."target_entity_id" = ll.id left join "item_relations" on "item_relations"."target_entity_type" = 'lore' AND "item_relations"."target_entity_id" = "lore"."id" left join "foreshadowing" on "foreshadowing"."target_entity_type" = 'lore' AND "foreshadowing"."target_entity_id" = "lore"."id" group by "lore"."id");--> statement-breakpoint
CREATE VIEW "public"."narrative_destination_search_data_view" AS (select "narrative_destinations"."id", 'narrative_destinations' as "source_table", to_jsonb("narrative_destinations".*) as "entity_main", COALESCE(jsonb_build_object('id', "regions"."id", 'name', "regions"."name"), '{}'::jsonb) as "region", COALESCE(jsonb_build_object('id', "conflicts"."id", 'name', "conflicts"."name"), '{}'::jsonb) as "conflict", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('role', to_jsonb("narrative_destination_quest_roles".*), 'quest', jsonb_build_object('id', q.id, 'name', q.name))) FILTER (WHERE "narrative_destination_quest_roles"."id" IS NOT NULL), '[]'::jsonb) as "quest_roles", COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
				'involvement', to_jsonb("narrative_destination_participants".*),
				'npc', CASE WHEN "narrative_destination_participants"."npc_id" IS NOT NULL THEN jsonb_build_object('id', n.id, 'name', n.name) END,
				'faction', CASE WHEN "narrative_destination_participants"."faction_id" IS NOT NULL THEN jsonb_build_object('id', f.id, 'name', f.name) END
			)) FILTER (WHERE "narrative_destination_participants"."id" IS NOT NULL), '[]'::jsonb) as "participant_involvement", COALESCE(jsonb_agg(DISTINCT to_jsonb("item_relations".*)) FILTER (WHERE "item_relations"."id" IS NOT NULL), '[]'::jsonb) as "item_relations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "lore_links"."id", 'lore_id', "lore_links"."lore_id")) FILTER (WHERE "lore_links"."id" IS NOT NULL), '[]'::jsonb) as "lore_links", COALESCE(jsonb_agg(DISTINCT to_jsonb("foreshadowing".*)) FILTER (WHERE "foreshadowing"."id" IS NOT NULL), '[]'::jsonb) as "incoming_foreshadowing", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relationship', to_jsonb(dr_out.*), 'relatedDestination', jsonb_build_object('id', rd_out.id, 'name', rd_out.name))) FILTER (WHERE dr_out.id IS NOT NULL), '[]'::jsonb) as "outgoing_relations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relationship', to_jsonb(dr_in.*), 'sourceDestination', jsonb_build_object('id', sd_in.id, 'name', sd_in.name))) FILTER (WHERE dr_in.id IS NOT NULL), '[]'::jsonb) as "incoming_relations" from "narrative_destinations" left join "regions" on "narrative_destinations"."region_id" = "regions"."id" left join "conflicts" on "narrative_destinations"."conflict_id" = "conflicts"."id" left join "narrative_destination_quest_roles" on "narrative_destination_quest_roles"."narrative_destination_id" = "narrative_destinations"."id" left join "quests" AS q on "narrative_destination_quest_roles"."quest_id" = q.id left join "narrative_destination_participants" on "narrative_destination_participants"."narrative_destination_id" = "narrative_destinations"."id" left join "npcs" AS n on "narrative_destination_participants"."npc_id" = n.id left join "factions" AS f on "narrative_destination_participants"."faction_id" = f.id left join "item_relations" on "item_relations"."target_entity_type" = 'narrative_destination' AND "item_relations"."target_entity_id" = "narrative_destinations"."id" left join "lore_links" on "lore_links"."target_entity_type" = 'narrative_destination' AND "lore_links"."target_entity_id" = "narrative_destinations"."id" left join "foreshadowing" on "foreshadowing"."target_entity_type" = 'narrative_destination' AND "foreshadowing"."target_entity_id" = "narrative_destinations"."id" left join "narrative_destination_relations" AS dr_out on dr_out.source_destination_id = "narrative_destinations"."id" left join "narrative_destinations" AS rd_out on dr_out.target_destination_id = rd_out.id left join "narrative_destination_relations" AS dr_in on dr_in.target_destination_id = "narrative_destinations"."id" left join "narrative_destinations" AS sd_in on dr_in.source_destination_id = sd_in.id group by "narrative_destinations"."id", "regions"."id", "conflicts"."id");--> statement-breakpoint
CREATE VIEW "public"."quest_search_data_view" AS (select "quests"."id", 'quests' as "source_table", to_jsonb("quests".*) as "entity_main", COALESCE(jsonb_build_object('id', "regions"."id", 'name', "regions"."name"), '{}'::jsonb) as "region", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relationship', to_jsonb(qr_out.*), 'targetQuest', jsonb_build_object('id', tq.id, 'name', tq.name))) FILTER (WHERE qr_out.id IS NOT NULL), '[]'::jsonb) as "outgoing_relations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relationship', to_jsonb(qr_in.*), 'sourceQuest', jsonb_build_object('id', sq.id, 'name', sq.name))) FILTER (WHERE qr_in.id IS NOT NULL), '[]'::jsonb) as "incoming_relations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "quest_stages"."id", 'name', "quest_stages"."name", 'stage_order', "quest_stages"."stage_order", 'stage_type', "quest_stages"."stage_type", 'deliveryNpc', CASE WHEN "quest_stages"."delivery_npc_id" IS NOT NULL THEN jsonb_build_object('id', dn.id, 'name', dn.name) END)) FILTER (WHERE "quest_stages"."id" IS NOT NULL), '[]'::jsonb) as "stages", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('hook', to_jsonb("quest_hooks".*), 'site', CASE WHEN "quest_hooks"."site_id" IS NOT NULL THEN jsonb_build_object('id', h_s.id, 'name', h_s.name) END, 'faction', CASE WHEN "quest_hooks"."faction_id" IS NOT NULL THEN jsonb_build_object('id', h_f.id, 'name', h_f.name) END, 'deliveryNpc', CASE WHEN "quest_hooks"."delivery_npc_id" IS NOT NULL THEN jsonb_build_object('id', h_n.id, 'name', h_n.name) END)) FILTER (WHERE "quest_hooks"."id" IS NOT NULL), '[]'::jsonb) as "hooks", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('involvement', to_jsonb("quest_participants".*), 'npc', CASE WHEN "quest_participants"."npc_id" IS NOT NULL THEN jsonb_build_object('id', p_n.id, 'name', p_n.name) END, 'faction', CASE WHEN "quest_participants"."faction_id" IS NOT NULL THEN jsonb_build_object('id', p_f.id, 'name', p_f.name) END)) FILTER (WHERE "quest_participants"."id" IS NOT NULL), '[]'::jsonb) as "participants", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('role', to_jsonb("narrative_destination_quest_roles".*), 'destination', jsonb_build_object('id', "narrative_destinations"."id", 'name', "narrative_destinations"."name"))) FILTER (WHERE "narrative_destination_quest_roles"."id" IS NOT NULL), '[]'::jsonb) as "narrative_destination_contributions", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "c_trig"."id", 'description', "c_trig"."description")) FILTER (WHERE "c_trig"."id" IS NOT NULL), '[]'::jsonb) as "triggered_consequences", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "c_aff"."id", 'description', "c_aff"."description")) FILTER (WHERE "c_aff"."id" IS NOT NULL), '[]'::jsonb) as "affecting_consequences", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "narrative_events"."id", 'description', "narrative_events"."description")) FILTER (WHERE "narrative_events"."id" IS NOT NULL), '[]'::jsonb) as "triggered_events", COALESCE(jsonb_agg(DISTINCT to_jsonb(fs_out.*)) FILTER (WHERE fs_out.id IS NOT NULL), '[]'::jsonb) as "outgoing_foreshadowing", COALESCE(jsonb_agg(DISTINCT to_jsonb(fs_in.*)) FILTER (WHERE fs_in.id IS NOT NULL), '[]'::jsonb) as "incoming_foreshadowing", COALESCE(jsonb_agg(DISTINCT to_jsonb("item_relations".*)) FILTER (WHERE "item_relations"."id" IS NOT NULL), '[]'::jsonb) as "item_relations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "lore_links"."id", 'lore_id', "lore_links"."lore_id")) FILTER (WHERE "lore_links"."id" IS NOT NULL), '[]'::jsonb) as "lore_links" from "quests" left join "regions" on "quests"."region_id" = "regions"."id" left join "quest_relations" AS qr_out on qr_out.source_quest_id = "quests"."id" left join "quests" AS tq on qr_out.target_quest_id = tq.id left join "quest_relations" AS qr_in on qr_in.target_quest_id = "quests"."id" left join "quests" AS sq on qr_in.source_quest_id = sq.id left join "quest_stages" on "quest_stages"."quest_id" = "quests"."id" left join "npcs" AS dn on "quest_stages"."delivery_npc_id" = dn.id left join "quest_hooks" on "quest_hooks"."quest_id" = "quests"."id" left join "sites" AS h_s on "quest_hooks"."site_id" = h_s.id left join "factions" AS h_f on "quest_hooks"."faction_id" = h_f.id left join "npcs" AS h_n on "quest_hooks"."delivery_npc_id" = h_n.id left join "quest_participants" on "quest_participants"."quest_id" = "quests"."id" left join "npcs" AS p_n on "quest_participants"."npc_id" = p_n.id left join "factions" AS p_f on "quest_participants"."faction_id" = p_f.id left join "narrative_destination_quest_roles" on "narrative_destination_quest_roles"."quest_id" = "quests"."id" left join "narrative_destinations" on "narrative_destination_quest_roles"."narrative_destination_id" = "narrative_destinations"."id" left join "consequences" "c_trig" on "c_trig"."trigger_entity_type" = 'quest' AND "c_trig"."trigger_entity_id" = "quests"."id" left join "consequences" "c_aff" on "c_aff"."affected_entity_type" = 'quest' AND "c_aff"."affected_entity_id" = "quests"."id" left join "narrative_events" on "narrative_events"."related_quest_id" = "quests"."id" left join "foreshadowing" AS fs_out on fs_out.source_entity_type = 'quest' AND fs_out.source_entity_id = "quests"."id" left join "foreshadowing" AS fs_in on fs_in.target_entity_type = 'quest' AND fs_in.target_entity_id = "quests"."id" left join "item_relations" on "item_relations"."target_entity_type" = 'quest' AND "item_relations"."target_entity_id" = "quests"."id" left join "lore_links" on "lore_links"."target_entity_type" = 'quest' AND "lore_links"."target_entity_id" = "quests"."id" group by "quests"."id", "regions"."id");--> statement-breakpoint
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
        'map', "map"
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