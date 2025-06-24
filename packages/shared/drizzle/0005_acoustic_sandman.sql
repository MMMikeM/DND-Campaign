CREATE VIEW "public"."conflict_search_data_view" AS (select "conflicts"."id", 'conflicts' as "source_table", to_jsonb("conflicts") as "entity_main", COALESCE(jsonb_build_object('id', "regions"."id", 'name', "regions"."name"), '{}'::jsonb) as "region", COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
    'participant', to_jsonb("conflict_participants".*),
    'faction', CASE WHEN "conflict_participants"."faction_id" IS NOT NULL THEN jsonb_build_object('id', "factions"."id", 'name', "factions"."name") END,
    'npc', CASE WHEN "conflict_participants"."npc_id" IS NOT NULL THEN jsonb_build_object('id', "npcs"."id", 'name', "npcs"."name") END
  )) FILTER (WHERE "conflict_participants"."id" IS NOT NULL), '[]'::jsonb) as "participants", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', c_caused.id, 'description', c_caused.description)) FILTER (WHERE c_caused.id IS NOT NULL), '[]'::jsonb) as "consequences", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', c_affecting.id, 'description', c_affecting.description)) FILTER (WHERE c_affecting.id IS NOT NULL), '[]'::jsonb) as "affectedByConsequences", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "narrative_destinations"."id", 'name', "narrative_destinations"."name")) FILTER (WHERE "narrative_destinations"."id" IS NOT NULL), '[]'::jsonb) as "narrativeDestinations", COALESCE(jsonb_agg(DISTINCT to_jsonb("foreshadowing".*)) FILTER (WHERE "foreshadowing"."id" IS NOT NULL), '[]'::jsonb) as "incomingForeshadowing", COALESCE(jsonb_agg(DISTINCT to_jsonb("item_relations".*)) FILTER (WHERE "item_relations"."id" IS NOT NULL), '[]'::jsonb) as "itemRelations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "lore_links"."id", 'lore_id', "lore_links"."lore_id")) FILTER (WHERE "lore_links"."id" IS NOT NULL), '[]'::jsonb) as "loreLinks" from "conflicts" left join "regions" on "conflicts"."region_id" = "regions"."id" left join "conflict_participants" on "conflict_participants"."conflict_id" = "conflicts"."id" left join "factions" on "conflict_participants"."faction_id" = "factions"."id" left join "npcs" on "conflict_participants"."npc_id" = "npcs"."id" left join "consequences" AS c_caused on c_caused.trigger_conflict_id = "conflicts"."id" left join "consequences" AS c_affecting on c_affecting.affected_conflict_id = "conflicts"."id" left join "narrative_destinations" on "narrative_destinations"."conflict_id" = "conflicts"."id" left join "foreshadowing" on "foreshadowing"."target_conflict_id" = "conflicts"."id" left join "item_relations" on "item_relations"."conflict_id" = "conflicts"."id" left join "lore_links" on "lore_links"."conflict_id" = "conflicts"."id" group by "conflicts"."id", "regions"."id");--> statement-breakpoint
CREATE VIEW "public"."faction_search_data_view" AS (select "factions"."id", 'factions' as "source_table", to_jsonb("factions") as "entity_main", COALESCE(jsonb_build_object('id', "sites"."id", 'name', "sites"."name"), '{}'::jsonb) as "primaryHqSite", COALESCE(jsonb_agg(DISTINCT to_jsonb("faction_agendas".*)) FILTER (WHERE "faction_agendas"."id" IS NOT NULL), '[]'::jsonb) as "agendas", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('membership', to_jsonb("npc_faction_memberships".*), 'npc', jsonb_build_object('id', "npcs"."id", 'name', "npcs"."name"))) FILTER (WHERE "npc_faction_memberships"."id" IS NOT NULL), '[]'::jsonb) as "members", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "quest_hooks"."id", 'source', "quest_hooks"."source", 'hook_content', "quest_hooks"."hook_content")) FILTER (WHERE "quest_hooks"."id" IS NOT NULL), '[]'::jsonb) as "questHooks", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('participation', to_jsonb(qp.*), 'quest', jsonb_build_object('id', q.id, 'name', q.name))) FILTER (WHERE qp.id IS NOT NULL), '[]'::jsonb) as "questParticipation", COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
      'influence', to_jsonb("faction_influence".*),
      'region', CASE WHEN "faction_influence"."region_id" IS NOT NULL THEN jsonb_build_object('id', r.id, 'name', r.name) END,
      'area', CASE WHEN "faction_influence"."area_id" IS NOT NULL THEN jsonb_build_object('id', a.id, 'name', a.name) END,
      'site', CASE WHEN "faction_influence"."site_id" IS NOT NULL THEN jsonb_build_object('id', s.id, 'name', s.name) END
    )) FILTER (WHERE "faction_influence"."id" IS NOT NULL), '[]'::jsonb) as "influence", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('participant', to_jsonb("conflict_participants".*), 'conflict', jsonb_build_object('id', "conflicts"."id", 'name', "conflicts"."name"))) FILTER (WHERE "conflict_participants"."id" IS NOT NULL), '[]'::jsonb) as "conflicts", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "consequences"."id", 'description', "consequences"."description")) FILTER (WHERE "consequences"."id" IS NOT NULL), '[]'::jsonb) as "consequences", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('involvement', to_jsonb("narrative_destination_participants".*), 'destination', jsonb_build_object('id', "narrative_destinations"."id", 'name', "narrative_destinations"."name"))) FILTER (WHERE "narrative_destination_participants"."id" IS NOT NULL), '[]'::jsonb) as "narrativeDestinationInvolvement", COALESCE(jsonb_agg(DISTINCT to_jsonb("foreshadowing".*)) FILTER (WHERE "foreshadowing"."id" IS NOT NULL), '[]'::jsonb) as "incomingForeshadowing", COALESCE(jsonb_agg(DISTINCT to_jsonb("item_relations".*)) FILTER (WHERE "item_relations"."id" IS NOT NULL), '[]'::jsonb) as "itemRelations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "lore_links"."id", 'lore_id', "lore_links"."lore_id")) FILTER (WHERE "lore_links"."id" IS NOT NULL), '[]'::jsonb) as "loreLinks", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relation', to_jsonb(fd_in.*), 'sourceFaction', jsonb_build_object('id', sf.id, 'name', sf.name))) FILTER (WHERE fd_in.id IS NOT NULL), '[]'::jsonb) as "incomingRelations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relation', to_jsonb(fd_out.*), 'targetFaction', jsonb_build_object('id', tf.id, 'name', tf.name))) FILTER (WHERE fd_out.id IS NOT NULL), '[]'::jsonb) as "outgoingRelations" from "factions" left join "sites" on "factions"."hq_site_id" = "sites"."id" left join "faction_agendas" on "faction_agendas"."faction_id" = "factions"."id" left join "npc_faction_memberships" on "npc_faction_memberships"."faction_id" = "factions"."id" left join "npcs" on "npc_faction_memberships"."npc_id" = "npcs"."id" left join "quest_hooks" on "quest_hooks"."faction_id" = "factions"."id" left join "quest_participants" AS qp on qp.faction_id = "factions"."id" left join "quests" AS q on qp.quest_id = q.id left join "faction_influence" on "faction_influence"."faction_id" = "factions"."id" left join "regions" AS r on "faction_influence"."region_id" = r.id left join "areas" AS a on "faction_influence"."area_id" = a.id left join "sites" AS s on "faction_influence"."site_id" = s.id left join "conflict_participants" on "conflict_participants"."faction_id" = "factions"."id" left join "conflicts" on "conflict_participants"."conflict_id" = "conflicts"."id" left join "consequences" on "consequences"."affected_faction_id" = "factions"."id" left join "narrative_destination_participants" on "narrative_destination_participants"."faction_id" = "factions"."id" left join "narrative_destinations" on "narrative_destination_participants"."narrative_destination_id" = "narrative_destinations"."id" left join "foreshadowing" on "foreshadowing"."target_faction_id" = "factions"."id" left join "item_relations" on "item_relations"."faction_id" = "factions"."id" left join "lore_links" on "lore_links"."faction_id" = "factions"."id" left join "faction_diplomacy" AS fd_in on fd_in.target_faction_id = "factions"."id" left join "factions" AS sf on fd_in.source_faction_id = sf.id left join "faction_diplomacy" AS fd_out on fd_out.source_faction_id = "factions"."id" left join "factions" AS tf on fd_out.target_faction_id = tf.id group by "factions"."id", "sites"."id");--> statement-breakpoint
CREATE VIEW "public"."foreshadowing_search_data_view" AS (select "foreshadowing"."id", 'foreshadowing' as "source_table", to_jsonb("foreshadowing") as "entity_main", COALESCE(jsonb_build_object('id', sq.id, 'name', sq.name), '{}'::jsonb) as "sourceQuest", COALESCE(jsonb_build_object('stage', jsonb_build_object('id', sqs.id, 'name', sqs.name), 'quest', jsonb_build_object('id', sq_stage.id, 'name', sq_stage.name)), '{}'::jsonb) as "sourceQuestStage", COALESCE(jsonb_build_object('id', ss.id, 'name', ss.name), '{}'::jsonb) as "sourceSite", COALESCE(jsonb_build_object('id', sn.id, 'name', sn.name), '{}'::jsonb) as "sourceNpc", COALESCE(jsonb_build_object('id', sl.id, 'name', sl.name), '{}'::jsonb) as "sourceLore", COALESCE(jsonb_build_object('id', tq.id, 'name', tq.name), '{}'::jsonb) as "targetQuest", COALESCE(jsonb_build_object('id', tn.id, 'name', tn.name), '{}'::jsonb) as "targetNpc", COALESCE(jsonb_build_object('id', tne.id, 'name', tne.name), '{}'::jsonb) as "targetNarrativeEvent", COALESCE(jsonb_build_object('id', tmc.id, 'name', tmc.name), '{}'::jsonb) as "targetConflict", COALESCE(jsonb_build_object('id', ti.id, 'name', ti.name), '{}'::jsonb) as "targetItem", COALESCE(jsonb_build_object('id', tnd.id, 'name', tnd.name), '{}'::jsonb) as "targetNarrativeDestination", COALESCE(jsonb_build_object('id', tl.id, 'name', tl.name), '{}'::jsonb) as "targetLore", COALESCE(jsonb_build_object('id', tf.id, 'name', tf.name), '{}'::jsonb) as "targetFaction", COALESCE(jsonb_build_object('id', ts.id, 'name', ts.name), '{}'::jsonb) as "targetSite" from "foreshadowing" left join "quests" AS sq on "foreshadowing"."source_quest_id" = sq.id left join "quest_stages" AS sqs on "foreshadowing"."source_quest_stage_id" = sqs.id left join "quests" AS sq_stage on sqs.quest_id = sq_stage.id left join "sites" AS ss on "foreshadowing"."source_site_id" = ss.id left join "npcs" AS sn on "foreshadowing"."source_npc_id" = sn.id left join "lore" AS sl on "foreshadowing"."source_lore_id" = sl.id left join "quests" AS tq on "foreshadowing"."target_quest_id" = tq.id left join "npcs" AS tn on "foreshadowing"."target_npc_id" = tn.id left join "narrative_events" AS tne on "foreshadowing"."target_narrative_event_id" = tne.id left join "conflicts" AS tmc on "foreshadowing"."target_conflict_id" = tmc.id left join "items" AS ti on "foreshadowing"."target_item_id" = ti.id left join "narrative_destinations" AS tnd on "foreshadowing"."target_narrative_destination_id" = tnd.id left join "lore" AS tl on "foreshadowing"."target_lore_id" = tl.id left join "factions" AS tf on "foreshadowing"."target_faction_id" = tf.id left join "sites" AS ts on "foreshadowing"."target_site_id" = ts.id group by "foreshadowing"."id", sq.id, sqs.id, sq_stage.id, ss.id, sn.id, sl.id, tq.id, tn.id, tne.id, tmc.id, ti.id, tnd.id, tl.id, tf.id, ts.id);--> statement-breakpoint
CREATE VIEW "public"."item_search_data_view" AS (select "items"."id", 'items' as "source_table", to_jsonb("items") as "entity_main", COALESCE(jsonb_build_object('stage', jsonb_build_object('id', "quest_stages"."id", 'name', "quest_stages"."name"), 'quest', jsonb_build_object('id', sq.id, 'name', sq.name)), '{}'::jsonb) as "questStage", COALESCE(jsonb_build_object('id', rq.id, 'name', rq.name), '{}'::jsonb) as "quest", COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
    'relationship', to_jsonb("item_relations".*),
    'item', CASE WHEN "item_relations"."item_id" IS NOT NULL THEN jsonb_build_object('id', ti.id, 'name', ti.name) END,
    'npc', CASE WHEN "item_relations"."npc_id" IS NOT NULL THEN jsonb_build_object('id', tn.id, 'name', tn.name) END,
    'faction', CASE WHEN "item_relations"."faction_id" IS NOT NULL THEN jsonb_build_object('id', tf.id, 'name', tf.name) END,
    'site', CASE WHEN "item_relations"."site_id" IS NOT NULL THEN jsonb_build_object('id', ts.id, 'name', ts.name) END,
    'quest', CASE WHEN "item_relations"."quest_id" IS NOT NULL THEN jsonb_build_object('id', tq.id, 'name', tq.name) END,
    'conflict', CASE WHEN "item_relations"."conflict_id" IS NOT NULL THEN jsonb_build_object('id', tc.id, 'name', tc.name) END,
    'narrativeDestination', CASE WHEN "item_relations"."narrative_destination_id" IS NOT NULL THEN jsonb_build_object('id', tnd.id, 'name', tnd.name) END,
    'lore', CASE WHEN "item_relations"."lore_id" IS NOT NULL THEN jsonb_build_object('id', tl.id, 'name', tl.name) END
  )) FILTER (WHERE "item_relations"."id" IS NOT NULL), '[]'::jsonb) as "relations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
    'relationship', to_jsonb(ir_in.*),
    'sourceItem', jsonb_build_object('id', si.id, 'name', si.name)
  )) FILTER (WHERE ir_in.id IS NOT NULL), '[]'::jsonb) as "incomingRelations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
    'history', to_jsonb("item_notable_history".*),
    'keyNpc', CASE WHEN "item_notable_history"."key_npc_id" IS NOT NULL THEN jsonb_build_object('id', hn.id, 'name', hn.name) END,
    'locationSite', CASE WHEN "item_notable_history"."location_site_id" IS NOT NULL THEN jsonb_build_object('id', hs.id, 'name', hs.name) END
  )) FILTER (WHERE "item_notable_history"."id" IS NOT NULL), '[]'::jsonb) as "notableHistory", COALESCE(jsonb_agg(DISTINCT to_jsonb("foreshadowing".*)) FILTER (WHERE "foreshadowing"."id" IS NOT NULL), '[]'::jsonb) as "incomingForeshadowing" from "items" left join "quest_stages" on "items"."quest_stage_id" = "quest_stages"."id" left join "quests" AS sq on "quest_stages"."quest_id" = sq.id left join "quests" AS rq on "items"."quest_id" = rq.id left join "item_relations" on "item_relations"."source_item_id" = "items"."id" left join "items" AS ti on "item_relations"."item_id" = ti.id left join "npcs" AS tn on "item_relations"."npc_id" = tn.id left join "factions" AS tf on "item_relations"."faction_id" = tf.id left join "sites" AS ts on "item_relations"."site_id" = ts.id left join "quests" AS tq on "item_relations"."quest_id" = tq.id left join "conflicts" AS tc on "item_relations"."conflict_id" = tc.id left join "narrative_destinations" AS tnd on "item_relations"."narrative_destination_id" = tnd.id left join "lore" AS tl on "item_relations"."lore_id" = tl.id left join "item_relations" AS ir_in on ir_in.item_id = "items"."id" left join "items" AS si on ir_in.source_item_id = si.id left join "item_notable_history" on "item_notable_history"."item_id" = "items"."id" left join "npcs" AS hn on "item_notable_history"."key_npc_id" = hn.id left join "sites" AS hs on "item_notable_history"."location_site_id" = hs.id left join "foreshadowing" on "foreshadowing"."target_item_id" = "items"."id" group by "items"."id", "quest_stages"."id", sq.id, rq.id);--> statement-breakpoint
CREATE VIEW "public"."lore_search_data_view" AS (select "lore"."id", 'lore' as "source_table", to_jsonb("lore".*) as "entity_main", COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
					'link', to_jsonb("lore_links".*),
					'region', CASE WHEN "lore_links"."region_id" IS NOT NULL THEN jsonb_build_object('id', lr.id, 'name', lr.name) END,
					'faction', CASE WHEN "lore_links"."faction_id" IS NOT NULL THEN jsonb_build_object('id', lf.id, 'name', lf.name) END,
					'npc', CASE WHEN "lore_links"."npc_id" IS NOT NULL THEN jsonb_build_object('id', ln.id, 'name', ln.name) END,
					'conflict', CASE WHEN "lore_links"."conflict_id" IS NOT NULL THEN jsonb_build_object('id', lc.id, 'name', lc.name) END,
					'quest', CASE WHEN "lore_links"."quest_id" IS NOT NULL THEN jsonb_build_object('id', lq.id, 'name', lq.name) END,
					'foreshadowing', CASE WHEN "lore_links"."foreshadowing_id" IS NOT NULL THEN jsonb_build_object('id', lfs.id, 'name', lfs.name) END,
					'narrativeDestination', CASE WHEN "lore_links"."narrative_destination_id" IS NOT NULL THEN jsonb_build_object('id', lnd.id, 'name', lnd.name) END,
					'relatedLore', CASE WHEN "lore_links"."related_lore_id" IS NOT NULL THEN jsonb_build_object('id', ll.id, 'name', ll.name) END
				)) FILTER (WHERE "lore_links"."id" IS NOT NULL), '[]'::jsonb) as "links", COALESCE(jsonb_agg(DISTINCT to_jsonb("item_relations".*)) FILTER (WHERE "item_relations"."id" IS NOT NULL), '[]'::jsonb) as "item_relations", COALESCE(jsonb_agg(DISTINCT to_jsonb("foreshadowing".*)) FILTER (WHERE "foreshadowing"."id" IS NOT NULL), '[]'::jsonb) as "incoming_foreshadowing" from "lore" left join "lore_links" on "lore_links"."lore_id" = "lore"."id" left join "regions" AS lr on "lore_links"."region_id" = lr.id left join "factions" AS lf on "lore_links"."faction_id" = lf.id left join "npcs" AS ln on "lore_links"."npc_id" = ln.id left join "conflicts" AS lc on "lore_links"."conflict_id" = lc.id left join "quests" AS lq on "lore_links"."quest_id" = lq.id left join "lore" AS ll on "lore_links"."related_lore_id" = ll.id left join "foreshadowing" AS lfs on "lore_links"."foreshadowing_id" = lfs.id left join "narrative_destinations" AS lnd on "lore_links"."narrative_destination_id" = lnd.id left join "item_relations" on "item_relations"."lore_id" = "lore"."id" left join "foreshadowing" on "foreshadowing"."target_lore_id" = "lore"."id" group by "lore"."id");--> statement-breakpoint
CREATE VIEW "public"."narrative_destination_search_data_view" AS (select "narrative_destinations"."id", 'narrative_destinations' as "source_table", to_jsonb("narrative_destinations".*) as "entity_main", COALESCE(jsonb_build_object('id', "regions"."id", 'name', "regions"."name"), '{}'::jsonb) as "region", COALESCE(jsonb_build_object('id', "conflicts"."id", 'name', "conflicts"."name"), '{}'::jsonb) as "conflict", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('role', to_jsonb("narrative_destination_quest_roles".*), 'quest', jsonb_build_object('id', q.id, 'name', q.name))) FILTER (WHERE "narrative_destination_quest_roles"."id" IS NOT NULL), '[]'::jsonb) as "quest_roles", COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
				'involvement', to_jsonb("narrative_destination_participants".*),
				'npc', CASE WHEN "narrative_destination_participants"."npc_id" IS NOT NULL THEN jsonb_build_object('id', n.id, 'name', n.name) END,
				'faction', CASE WHEN "narrative_destination_participants"."faction_id" IS NOT NULL THEN jsonb_build_object('id', f.id, 'name', f.name) END
			)) FILTER (WHERE "narrative_destination_participants"."id" IS NOT NULL), '[]'::jsonb) as "participant_involvement", COALESCE(jsonb_agg(DISTINCT to_jsonb("item_relations".*)) FILTER (WHERE "item_relations"."id" IS NOT NULL), '[]'::jsonb) as "item_relations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "lore_links"."id", 'lore_id', "lore_links"."lore_id")) FILTER (WHERE "lore_links"."id" IS NOT NULL), '[]'::jsonb) as "lore_links", COALESCE(jsonb_agg(DISTINCT to_jsonb("foreshadowing".*)) FILTER (WHERE "foreshadowing"."id" IS NOT NULL), '[]'::jsonb) as "incoming_foreshadowing", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relationship', to_jsonb(dr_out.*), 'relatedDestination', jsonb_build_object('id', rd_out.id, 'name', rd_out.name))) FILTER (WHERE dr_out.id IS NOT NULL), '[]'::jsonb) as "outgoing_relations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relationship', to_jsonb(dr_in.*), 'sourceDestination', jsonb_build_object('id', sd_in.id, 'name', sd_in.name))) FILTER (WHERE dr_in.id IS NOT NULL), '[]'::jsonb) as "incoming_relations" from "narrative_destinations" left join "regions" on "narrative_destinations"."region_id" = "regions"."id" left join "conflicts" on "narrative_destinations"."conflict_id" = "conflicts"."id" left join "narrative_destination_quest_roles" on "narrative_destination_quest_roles"."narrative_destination_id" = "narrative_destinations"."id" left join "quests" AS q on "narrative_destination_quest_roles"."quest_id" = q.id left join "narrative_destination_participants" on "narrative_destination_participants"."narrative_destination_id" = "narrative_destinations"."id" left join "npcs" AS n on "narrative_destination_participants"."npc_id" = n.id left join "factions" AS f on "narrative_destination_participants"."faction_id" = f.id left join "item_relations" on "item_relations"."narrative_destination_id" = "narrative_destinations"."id" left join "lore_links" on "lore_links"."narrative_destination_id" = "narrative_destinations"."id" left join "foreshadowing" on "foreshadowing"."target_narrative_destination_id" = "narrative_destinations"."id" left join "narrative_destination_relations" AS dr_out on dr_out.source_destination_id = "narrative_destinations"."id" left join "narrative_destinations" AS rd_out on dr_out.target_destination_id = rd_out.id left join "narrative_destination_relations" AS dr_in on dr_in.target_destination_id = "narrative_destinations"."id" left join "narrative_destinations" AS sd_in on dr_in.source_destination_id = sd_in.id group by "narrative_destinations"."id", "regions"."id", "conflicts"."id");--> statement-breakpoint
CREATE VIEW "public"."consequence_search_data_view" AS (select "consequences"."id", 'consequences' as "source_table", to_jsonb("consequences".*) as "entity_main", COALESCE(jsonb_build_object('id', tq.id, 'name', tq.name), '{}'::jsonb) as "trigger_quest", COALESCE(jsonb_build_object('id', tc.id, 'name', tc.name), '{}'::jsonb) as "trigger_conflict", COALESCE(jsonb_build_object('id', af.id, 'name', af.name), '{}'::jsonb) as "affected_faction", COALESCE(jsonb_build_object('id', ar.id, 'name', ar.name), '{}'::jsonb) as "affected_region", COALESCE(jsonb_build_object('id', aa.id, 'name', aa.name), '{}'::jsonb) as "affected_area", COALESCE(jsonb_build_object('id', as_.id, 'name', as_.name), '{}'::jsonb) as "affected_site", COALESCE(jsonb_build_object('id', an.id, 'name', an.name), '{}'::jsonb) as "affected_npc", COALESCE(jsonb_build_object('id', and_.id, 'name', and_.name), '{}'::jsonb) as "affected_narrative_destination", COALESCE(jsonb_build_object('id', ac.id, 'name', ac.name), '{}'::jsonb) as "affected_conflict", COALESCE(jsonb_build_object('id', aq.id, 'name', aq.name), '{}'::jsonb) as "affected_quest" from "consequences" left join "quests" AS tq on "consequences"."trigger_quest_id" = tq.id left join "conflicts" AS tc on "consequences"."trigger_conflict_id" = tc.id left join "factions" AS af on "consequences"."affected_faction_id" = af.id left join "regions" AS ar on "consequences"."affected_region_id" = ar.id left join "areas" AS aa on "consequences"."affected_area_id" = aa.id left join "sites" AS as_ on "consequences"."affected_site_id" = as_.id left join "npcs" AS an on "consequences"."affected_npc_id" = an.id left join "narrative_destinations" AS and_ on "consequences"."affected_narrative_destination_id" = and_.id left join "conflicts" AS ac on "consequences"."affected_conflict_id" = ac.id left join "quests" AS aq on "consequences"."affected_quest_id" = aq.id group by "consequences"."id", tq.id, tc.id, af.id, ar.id, aa.id, as_.id, an.id, and_.id, ac.id, aq.id);--> statement-breakpoint
CREATE VIEW "public"."narrative_event_search_data_view" AS (select "narrative_events"."id", 'narrative_events' as "source_table", to_jsonb("narrative_events".*) as "entity_main", COALESCE(jsonb_build_object('stage', jsonb_build_object('id', "quest_stages"."id", 'name', "quest_stages"."name"), 'quest', jsonb_build_object('id', sq.id, 'name', sq.name)), '{}'::jsonb) as "quest_stage", COALESCE(jsonb_build_object('id', "quest_stage_decisions"."id", 'name', "quest_stage_decisions"."name"), '{}'::jsonb) as "triggering_stage_decision", COALESCE(jsonb_build_object('id', rq.id, 'name', rq.name), '{}'::jsonb) as "related_quest", COALESCE(jsonb_agg(DISTINCT to_jsonb("foreshadowing".*)) FILTER (WHERE "foreshadowing"."id" IS NOT NULL), '[]'::jsonb) as "incoming_foreshadowing" from "narrative_events" left join "quest_stages" on "narrative_events"."quest_stage_id" = "quest_stages"."id" left join "quests" AS sq on "quest_stages"."quest_id" = sq.id left join "quest_stage_decisions" on "narrative_events"."triggering_stage_decision_id" = "quest_stage_decisions"."id" left join "quests" AS rq on "narrative_events"."related_quest_id" = rq.id left join "foreshadowing" on "foreshadowing"."target_narrative_event_id" = "narrative_events"."id" group by "narrative_events"."id", "quest_stages"."id", sq.id, "quest_stage_decisions"."id", rq.id);--> statement-breakpoint
CREATE VIEW "public"."npc_search_data_view" AS (select "npcs"."id", 'npcs' as "source_table", to_jsonb("npcs".*) as "entity_main", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('membership', to_jsonb("npc_faction_memberships".*), 'faction', jsonb_build_object('id', "factions"."id", 'name', "factions"."name"))) FILTER (WHERE "npc_faction_memberships"."id" IS NOT NULL), '[]'::jsonb) as "faction_memberships", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('association', to_jsonb("npc_site_associations".*), 'site', jsonb_build_object('id', "sites"."id", 'name', "sites"."name", 'area', jsonb_build_object('id', "areas"."id", 'name', "areas"."name", 'region', jsonb_build_object('id', "regions"."id", 'name', "regions"."name"))))) FILTER (WHERE "npc_site_associations"."id" IS NOT NULL), '[]'::jsonb) as "site_associations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('participant', to_jsonb("conflict_participants".*), 'conflict', jsonb_build_object('id', "conflicts"."id", 'name', "conflicts"."name"))) FILTER (WHERE "conflict_participants"."id" IS NOT NULL), '[]'::jsonb) as "conflict_participation", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "consequences"."id", 'description', "consequences"."description")) FILTER (WHERE "consequences"."id" IS NOT NULL), '[]'::jsonb) as "affected_by_consequences", COALESCE(jsonb_agg(DISTINCT to_jsonb(fs_out.*)) FILTER (WHERE fs_out.id IS NOT NULL), '[]'::jsonb) as "outgoing_foreshadowing", COALESCE(jsonb_agg(DISTINCT to_jsonb(fs_in.*)) FILTER (WHERE fs_in.id IS NOT NULL), '[]'::jsonb) as "incoming_foreshadowing", COALESCE(jsonb_agg(DISTINCT to_jsonb("item_notable_history".*)) FILTER (WHERE "item_notable_history"."id" IS NOT NULL), '[]'::jsonb) as "item_history", COALESCE(jsonb_agg(DISTINCT to_jsonb("item_relations".*)) FILTER (WHERE "item_relations"."id" IS NOT NULL), '[]'::jsonb) as "item_relations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('involvement', to_jsonb("narrative_destination_participants".*), 'destination', jsonb_build_object('id', "narrative_destinations"."id", 'name', "narrative_destinations"."name"))) FILTER (WHERE "narrative_destination_participants"."id" IS NOT NULL), '[]'::jsonb) as "narrative_destination_involvement", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "quest_hooks"."id", 'source', "quest_hooks"."source", 'hook_content', "quest_hooks"."hook_content", 'quest', jsonb_build_object('id', qh_quest.id, 'name', qh_quest.name))) FILTER (WHERE "quest_hooks"."id" IS NOT NULL), '[]'::jsonb) as "quest_hooks", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', qs_delivery.id, 'name', qs_delivery.name, 'quest', jsonb_build_object('id', q_stage_delivery.id, 'name', q_stage_delivery.name))) FILTER (WHERE qs_delivery.id IS NOT NULL), '[]'::jsonb) as "quest_stage_deliveries", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('involvement', to_jsonb("npc_quest_stage_involvement".*), 'stage', jsonb_build_object('id', si.id, 'name', si.name), 'quest', jsonb_build_object('id', q_involvement.id, 'name', q_involvement.name))) FILTER (WHERE "npc_quest_stage_involvement"."id" IS NOT NULL), '[]'::jsonb) as "stage_involvement", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "lore_links"."id", 'lore_id', "lore_links"."lore_id")) FILTER (WHERE "lore_links"."id" IS NOT NULL), '[]'::jsonb) as "lore_links", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relationship', to_jsonb(nr_out.*), 'relatedNpc', jsonb_build_object('id', rn_out.id, 'name', rn_out.name))) FILTER (WHERE nr_out.id IS NOT NULL), '[]'::jsonb) as "outgoing_relations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relationship', to_jsonb(nr_in.*), 'sourceNpc', jsonb_build_object('id', sn_in.id, 'name', sn_in.name))) FILTER (WHERE nr_in.id IS NOT NULL), '[]'::jsonb) as "incoming_relations" from "npcs" left join "npc_faction_memberships" on "npc_faction_memberships"."npc_id" = "npcs"."id" left join "factions" on "npc_faction_memberships"."faction_id" = "factions"."id" left join "npc_site_associations" on "npc_site_associations"."npc_id" = "npcs"."id" left join "sites" on "npc_site_associations"."site_id" = "sites"."id" left join "areas" on "sites"."area_id" = "areas"."id" left join "regions" on "areas"."region_id" = "regions"."id" left join "conflict_participants" on "conflict_participants"."npc_id" = "npcs"."id" left join "conflicts" on "conflict_participants"."conflict_id" = "conflicts"."id" left join "consequences" on "consequences"."affected_npc_id" = "npcs"."id" left join "foreshadowing" AS fs_out on fs_out.source_npc_id = "npcs"."id" left join "foreshadowing" AS fs_in on fs_in.target_npc_id = "npcs"."id" left join "item_notable_history" on "item_notable_history"."key_npc_id" = "npcs"."id" left join "item_relations" on "item_relations"."npc_id" = "npcs"."id" left join "narrative_destination_participants" on "narrative_destination_participants"."npc_id" = "npcs"."id" left join "narrative_destinations" on "narrative_destination_participants"."narrative_destination_id" = "narrative_destinations"."id" left join "quest_hooks" on "quest_hooks"."delivery_npc_id" = "npcs"."id" left join "quests" AS qh_quest on "quest_hooks"."quest_id" = qh_quest.id left join "quest_stages" AS qs_delivery on qs_delivery.delivery_npc_id = "npcs"."id" left join "quests" AS q_stage_delivery on qs_delivery.quest_id = q_stage_delivery.id left join "npc_quest_stage_involvement" on "npc_quest_stage_involvement"."npc_id" = "npcs"."id" left join "quest_stages" AS si on "npc_quest_stage_involvement"."quest_stage_id" = si.id left join "quests" AS q_involvement on si.quest_id = q_involvement.id left join "lore_links" on "lore_links"."npc_id" = "npcs"."id" left join "npc_relations" AS nr_out on nr_out.source_npc_id = "npcs"."id" left join "npcs" AS rn_out on nr_out.target_npc_id = rn_out.id left join "npc_relations" AS nr_in on nr_in.target_npc_id = "npcs"."id" left join "npcs" AS sn_in on nr_in.source_npc_id = sn_in.id group by "npcs"."id");--> statement-breakpoint
CREATE VIEW "public"."quest_search_data_view" AS (select "quests"."id", 'quests' as "source_table", to_jsonb("quests".*) as "entity_main", COALESCE(jsonb_build_object('id', "regions"."id", 'name', "regions"."name"), '{}'::jsonb) as "region", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relationship', to_jsonb(qr_out.*), 'targetQuest', jsonb_build_object('id', tq.id, 'name', tq.name))) FILTER (WHERE qr_out.id IS NOT NULL), '[]'::jsonb) as "outgoing_relations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relationship', to_jsonb(qr_in.*), 'sourceQuest', jsonb_build_object('id', sq.id, 'name', sq.name))) FILTER (WHERE qr_in.id IS NOT NULL), '[]'::jsonb) as "incoming_relations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "quest_stages"."id", 'name', "quest_stages"."name", 'stage_order', "quest_stages"."stage_order", 'stage_type', "quest_stages"."stage_type", 'deliveryNpc', CASE WHEN "quest_stages"."delivery_npc_id" IS NOT NULL THEN jsonb_build_object('id', dn.id, 'name', dn.name) END)) FILTER (WHERE "quest_stages"."id" IS NOT NULL), '[]'::jsonb) as "stages", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('hook', to_jsonb("quest_hooks".*), 'site', CASE WHEN "quest_hooks"."site_id" IS NOT NULL THEN jsonb_build_object('id', h_s.id, 'name', h_s.name) END, 'faction', CASE WHEN "quest_hooks"."faction_id" IS NOT NULL THEN jsonb_build_object('id', h_f.id, 'name', h_f.name) END, 'deliveryNpc', CASE WHEN "quest_hooks"."delivery_npc_id" IS NOT NULL THEN jsonb_build_object('id', h_n.id, 'name', h_n.name) END)) FILTER (WHERE "quest_hooks"."id" IS NOT NULL), '[]'::jsonb) as "hooks", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('involvement', to_jsonb("quest_participants".*), 'npc', CASE WHEN "quest_participants"."npc_id" IS NOT NULL THEN jsonb_build_object('id', p_n.id, 'name', p_n.name) END, 'faction', CASE WHEN "quest_participants"."faction_id" IS NOT NULL THEN jsonb_build_object('id', p_f.id, 'name', p_f.name) END)) FILTER (WHERE "quest_participants"."id" IS NOT NULL), '[]'::jsonb) as "participants", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('role', to_jsonb("narrative_destination_quest_roles".*), 'destination', jsonb_build_object('id', "narrative_destinations"."id", 'name', "narrative_destinations"."name"))) FILTER (WHERE "narrative_destination_quest_roles"."id" IS NOT NULL), '[]'::jsonb) as "narrative_destination_contributions", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "c_trig"."id", 'description', "c_trig"."description")) FILTER (WHERE "c_trig"."id" IS NOT NULL), '[]'::jsonb) as "triggered_consequences", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "c_aff"."id", 'description', "c_aff"."description")) FILTER (WHERE "c_aff"."id" IS NOT NULL), '[]'::jsonb) as "affecting_consequences", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "narrative_events"."id", 'description', "narrative_events"."description")) FILTER (WHERE "narrative_events"."id" IS NOT NULL), '[]'::jsonb) as "triggered_events", COALESCE(jsonb_agg(DISTINCT to_jsonb(fs_out.*)) FILTER (WHERE fs_out.id IS NOT NULL), '[]'::jsonb) as "outgoing_foreshadowing", COALESCE(jsonb_agg(DISTINCT to_jsonb(fs_in.*)) FILTER (WHERE fs_in.id IS NOT NULL), '[]'::jsonb) as "incoming_foreshadowing", COALESCE(jsonb_agg(DISTINCT to_jsonb("item_relations".*)) FILTER (WHERE "item_relations"."id" IS NOT NULL), '[]'::jsonb) as "item_relations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "lore_links"."id", 'lore_id', "lore_links"."lore_id")) FILTER (WHERE "lore_links"."id" IS NOT NULL), '[]'::jsonb) as "lore_links" from "quests" left join "regions" on "quests"."region_id" = "regions"."id" left join "quest_relations" AS qr_out on qr_out.source_quest_id = "quests"."id" left join "quests" AS tq on qr_out.target_quest_id = tq.id left join "quest_relations" AS qr_in on qr_in.target_quest_id = "quests"."id" left join "quests" AS sq on qr_in.source_quest_id = sq.id left join "quest_stages" on "quest_stages"."quest_id" = "quests"."id" left join "npcs" AS dn on "quest_stages"."delivery_npc_id" = dn.id left join "quest_hooks" on "quest_hooks"."quest_id" = "quests"."id" left join "sites" AS h_s on "quest_hooks"."site_id" = h_s.id left join "factions" AS h_f on "quest_hooks"."faction_id" = h_f.id left join "npcs" AS h_n on "quest_hooks"."delivery_npc_id" = h_n.id left join "quest_participants" on "quest_participants"."quest_id" = "quests"."id" left join "npcs" AS p_n on "quest_participants"."npc_id" = p_n.id left join "factions" AS p_f on "quest_participants"."faction_id" = p_f.id left join "narrative_destination_quest_roles" on "narrative_destination_quest_roles"."quest_id" = "quests"."id" left join "narrative_destinations" on "narrative_destination_quest_roles"."narrative_destination_id" = "narrative_destinations"."id" left join "consequences" "c_trig" on "c_trig"."trigger_quest_id" = "quests"."id" left join "consequences" "c_aff" on "c_aff"."affected_quest_id" = "quests"."id" left join "narrative_events" on "narrative_events"."related_quest_id" = "quests"."id" left join "foreshadowing" AS fs_out on fs_out.source_quest_id = "quests"."id" left join "foreshadowing" AS fs_in on fs_in.target_quest_id = "quests"."id" left join "item_relations" on "item_relations"."quest_id" = "quests"."id" left join "lore_links" on "lore_links"."quest_id" = "quests"."id" group by "quests"."id", "regions"."id");--> statement-breakpoint
CREATE VIEW "public"."area_search_data_view" AS (select "areas"."id", 'areas' as "source_table", to_jsonb("areas".*) as "entity_main", COALESCE(jsonb_build_object('id', "regions"."id", 'name', "regions"."name"), '{}'::jsonb) as "region", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "sites"."id", 'name', "sites"."name", 'description', "sites"."description")) FILTER (WHERE "sites"."id" IS NOT NULL), '[]'::jsonb) as "sites", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "consequences"."id", 'description', "consequences"."description")) FILTER (WHERE "consequences"."id" IS NOT NULL), '[]'::jsonb) as "consequences", COALESCE(jsonb_agg(DISTINCT to_jsonb("faction_influence".*)) FILTER (WHERE "faction_influence"."id" IS NOT NULL), '[]'::jsonb) as "faction_influence" from "areas" left join "regions" on "areas"."region_id" = "regions"."id" left join "sites" on "sites"."area_id" = "areas"."id" left join "consequences" on "consequences"."affected_area_id" = "areas"."id" left join "faction_influence" on "faction_influence"."area_id" = "areas"."id" group by "areas"."id", "regions"."id");--> statement-breakpoint
CREATE VIEW "public"."region_search_data_view" AS (select "regions"."id", 'regions' as "source_table", to_jsonb("regions".*) as "entity_main", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('connection', to_jsonb(rc_out.*), 'targetRegion', jsonb_build_object('id', tr.id, 'name', tr.name))) FILTER (WHERE rc_out.id IS NOT NULL), '[]'::jsonb) as "outgoing_relations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('connection', to_jsonb(rc_in.*), 'sourceRegion', jsonb_build_object('id', sr.id, 'name', sr.name))) FILTER (WHERE rc_in.id IS NOT NULL), '[]'::jsonb) as "incoming_relations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "areas"."id", 'name', "areas"."name", 'description', "areas"."description")) FILTER (WHERE "areas"."id" IS NOT NULL), '[]'::jsonb) as "areas", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "quests"."id", 'name', "quests"."name")) FILTER (WHERE "quests"."id" IS NOT NULL), '[]'::jsonb) as "quests", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "conflicts"."id", 'name', "conflicts"."name")) FILTER (WHERE "conflicts"."id" IS NOT NULL), '[]'::jsonb) as "conflicts", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "consequences"."id", 'description', "consequences"."description")) FILTER (WHERE "consequences"."id" IS NOT NULL), '[]'::jsonb) as "consequences", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "narrative_destinations"."id", 'name', "narrative_destinations"."name")) FILTER (WHERE "narrative_destinations"."id" IS NOT NULL), '[]'::jsonb) as "narrative_destinations", COALESCE(jsonb_agg(DISTINCT to_jsonb("faction_influence".*)) FILTER (WHERE "faction_influence"."id" IS NOT NULL), '[]'::jsonb) as "faction_influence", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "lore_links"."id", 'lore_id', "lore_links"."lore_id")) FILTER (WHERE "lore_links"."id" IS NOT NULL), '[]'::jsonb) as "lore_links" from "regions" left join "region_connections" AS rc_out on rc_out.source_region_id = "regions"."id" left join "regions" AS tr on rc_out.target_region_id = tr.id left join "region_connections" AS rc_in on rc_in.target_region_id = "regions"."id" left join "regions" AS sr on rc_in.source_region_id = sr.id left join "areas" on "areas"."region_id" = "regions"."id" left join "quests" on "quests"."region_id" = "regions"."id" left join "conflicts" on "conflicts"."region_id" = "regions"."id" left join "consequences" on "consequences"."affected_region_id" = "regions"."id" left join "narrative_destinations" on "narrative_destinations"."region_id" = "regions"."id" left join "faction_influence" on "faction_influence"."region_id" = "regions"."id" left join "lore_links" on "lore_links"."region_id" = "regions"."id" group by "regions"."id");--> statement-breakpoint
CREATE VIEW "public"."site_search_data_view" AS (select "sites"."id", 'sites' as "source_table", to_jsonb("sites".*) as "entity_main", COALESCE(jsonb_build_object('id', "areas"."id", 'name', "areas"."name", 'region', jsonb_build_object('id', "regions"."id", 'name', "regions"."name")), '{}'::jsonb) as "area", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('link', to_jsonb(sl_out.*), 'targetSite', jsonb_build_object('id', ts.id, 'name', ts.name))) FILTER (WHERE sl_out.id IS NOT NULL), '[]'::jsonb) as "outgoing_relations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('link', to_jsonb(sl_in.*), 'sourceSite', jsonb_build_object('id', ss.id, 'name', ss.name))) FILTER (WHERE sl_in.id IS NOT NULL), '[]'::jsonb) as "incoming_relations", COALESCE(jsonb_agg(DISTINCT to_jsonb("site_encounters".*)) FILTER (WHERE "site_encounters"."id" IS NOT NULL), '[]'::jsonb) as "encounters", COALESCE(jsonb_agg(DISTINCT to_jsonb("site_secrets".*)) FILTER (WHERE "site_secrets"."id" IS NOT NULL), '[]'::jsonb) as "secrets", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('association', to_jsonb("npc_site_associations".*), 'npc', jsonb_build_object('id', "npcs"."id", 'name', "npcs"."name"))) FILTER (WHERE "npc_site_associations"."id" IS NOT NULL), '[]'::jsonb) as "npc_associations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "quest_stages"."id", 'name', "quest_stages"."name", 'quest', jsonb_build_object('id', qs_quest.id, 'name', qs_quest.name))) FILTER (WHERE "quest_stages"."id" IS NOT NULL), '[]'::jsonb) as "quest_stages", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "quest_hooks"."id", 'source', "quest_hooks"."source", 'hook_content', "quest_hooks"."hook_content", 'quest', jsonb_build_object('id', qh_quest.id, 'name', qh_quest.name))) FILTER (WHERE "quest_hooks"."id" IS NOT NULL), '[]'::jsonb) as "quest_hooks", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', site_consequences.id, 'description', site_consequences.description)) FILTER (WHERE site_consequences.id IS NOT NULL), '[]'::jsonb) as "consequences", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "factions"."id", 'name', "factions"."name")) FILTER (WHERE "factions"."id" IS NOT NULL), '[]'::jsonb) as "faction_hqs", COALESCE(jsonb_agg(DISTINCT to_jsonb(site_faction_influence.*)) FILTER (WHERE site_faction_influence.id IS NOT NULL), '[]'::jsonb) as "faction_influence", COALESCE(jsonb_agg(DISTINCT to_jsonb(fs_out.*)) FILTER (WHERE fs_out.id IS NOT NULL), '[]'::jsonb) as "outgoing_foreshadowing", COALESCE(jsonb_agg(DISTINCT to_jsonb(fs_in.*)) FILTER (WHERE fs_in.id IS NOT NULL), '[]'::jsonb) as "incoming_foreshadowing", COALESCE(jsonb_agg(DISTINCT to_jsonb("item_notable_history".*)) FILTER (WHERE "item_notable_history"."id" IS NOT NULL), '[]'::jsonb) as "item_history", COALESCE(jsonb_agg(DISTINCT to_jsonb(site_item_relations.*)) FILTER (WHERE site_item_relations.id IS NOT NULL), '[]'::jsonb) as "item_relations", COALESCE(jsonb_build_object('id', "map_groups"."id", 'name', "map_groups"."name"), '{}'::jsonb) as "map_group" from "sites" left join "areas" on "sites"."area_id" = "areas"."id" left join "regions" on "areas"."region_id" = "regions"."id" left join "site_links" AS sl_out on sl_out.source_site_id = "sites"."id" left join "site_links" AS sl_in on sl_in.target_site_id = "sites"."id" left join "sites" AS ts on sl_out.target_site_id = ts.id left join "sites" AS ss on sl_in.source_site_id = ss.id left join "site_encounters" on "site_encounters"."site_id" = "sites"."id" left join "site_secrets" on "site_secrets"."site_id" = "sites"."id" left join "npc_site_associations" on "npc_site_associations"."site_id" = "sites"."id" left join "npcs" on "npc_site_associations"."npc_id" = "npcs"."id" left join "quest_stages" on "quest_stages"."site_id" = "sites"."id" left join "quests" AS qs_quest on "quest_stages"."quest_id" = qs_quest.id left join "quest_hooks" on "quest_hooks"."site_id" = "sites"."id" left join "quests" AS qh_quest on "quest_hooks"."quest_id" = qh_quest.id left join "consequences" AS site_consequences on site_consequences.affected_site_id = "sites"."id" left join "factions" on "factions"."hq_site_id" = "sites"."id" left join "faction_influence" AS site_faction_influence on site_faction_influence.site_id = "sites"."id" left join "foreshadowing" AS fs_out on fs_out.source_site_id = "sites"."id" left join "foreshadowing" AS fs_in on fs_in.target_site_id = "sites"."id" left join "item_notable_history" on "item_notable_history"."location_site_id" = "sites"."id" left join "item_relations" AS site_item_relations on site_item_relations.site_id = "sites"."id" left join "map_groups" on "sites"."map_group_id" = "map_groups"."id" group by "sites"."id", "areas"."id", "regions"."id", "map_groups"."id");--> statement-breakpoint
CREATE VIEW "public"."quest_stage_decision_search_data_view" AS (select "quest_stage_decisions"."id", 'quest_stage_decisions' as "source_table", to_jsonb("quest_stage_decisions".*) as "entity_main", COALESCE(jsonb_build_object('id', "quests"."id", 'name', "quests"."name"), '{}'::jsonb) as "quest", COALESCE(jsonb_build_object('id', fs.id, 'name', fs.name), '{}'::jsonb) as "from_stage", COALESCE(jsonb_build_object('id', ts.id, 'name', ts.name), '{}'::jsonb) as "to_stage", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "narrative_events"."id", 'description', "narrative_events"."description")) FILTER (WHERE "narrative_events"."id" IS NOT NULL), '[]'::jsonb) as "triggered_events", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "consequences"."id", 'description', "consequences"."description")) FILTER (WHERE "consequences"."id" IS NOT NULL), '[]'::jsonb) as "consequences" from "quest_stage_decisions" left join "quests" on "quest_stage_decisions"."quest_id" = "quests"."id" left join "quest_stages" AS fs on "quest_stage_decisions"."from_quest_stage_id" = fs.id left join "quest_stages" AS ts on "quest_stage_decisions"."to_quest_stage_id" = ts.id left join "narrative_events" on "narrative_events"."triggering_stage_decision_id" = "quest_stage_decisions"."id" left join "consequences" on "consequences"."trigger_quest_stage_decision_id" = "quest_stage_decisions"."id" group by "quest_stage_decisions"."id", "quests"."id", fs.id, ts.id);--> statement-breakpoint
CREATE VIEW "public"."quest_stage_search_data_view" AS (select "quest_stages"."id", 'quest_stages' as "source_table", to_jsonb("quest_stages".*) as "entity_main", COALESCE(jsonb_build_object('id', "quests"."id", 'name', "quests"."name"), '{}'::jsonb) as "quest", COALESCE(jsonb_build_object('id', "sites"."id", 'name', "sites"."name"), '{}'::jsonb) as "site", COALESCE(jsonb_build_object('id', "npcs"."id", 'name', "npcs"."name"), '{}'::jsonb) as "delivery_npc", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('decision', to_jsonb(qsd_out.*), 'toStage', jsonb_build_object('id', ts_out.id, 'name', ts_out.name))) FILTER (WHERE qsd_out.id IS NOT NULL), '[]'::jsonb) as "outgoing_decisions", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('decision', to_jsonb(qsd_in.*), 'fromStage', jsonb_build_object('id', ts_in.id, 'name', ts_in.name))) FILTER (WHERE qsd_in.id IS NOT NULL), '[]'::jsonb) as "incoming_decisions", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "items"."id", 'name', "items"."name")) FILTER (WHERE "items"."id" IS NOT NULL), '[]'::jsonb) as "items", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "narrative_events"."id", 'description', "narrative_events"."description")) FILTER (WHERE "narrative_events"."id" IS NOT NULL), '[]'::jsonb) as "narrative_events", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('involvement', to_jsonb("npc_quest_stage_involvement".*), 'npc', jsonb_build_object('id', inv_npc.id, 'name', inv_npc.name))) FILTER (WHERE "npc_quest_stage_involvement"."id" IS NOT NULL), '[]'::jsonb) as "npc_involvement", COALESCE(jsonb_agg(DISTINCT to_jsonb("foreshadowing".*)) FILTER (WHERE "foreshadowing"."id" IS NOT NULL), '[]'::jsonb) as "outgoing_foreshadowing" from "quest_stages" left join "quests" on "quest_stages"."quest_id" = "quests"."id" left join "sites" on "quest_stages"."site_id" = "sites"."id" left join "npcs" on "quest_stages"."delivery_npc_id" = "npcs"."id" left join "quest_stage_decisions" AS qsd_out on qsd_out.from_quest_stage_id = "quest_stages"."id" left join "quest_stages" AS ts_out on qsd_out.to_quest_stage_id = ts_out.id left join "quest_stage_decisions" AS qsd_in on qsd_in.to_quest_stage_id = "quest_stages"."id" left join "quest_stages" AS ts_in on qsd_in.from_quest_stage_id = ts_in.id left join "items" on "items"."quest_stage_id" = "quest_stages"."id" left join "narrative_events" on "narrative_events"."quest_stage_id" = "quest_stages"."id" left join "npc_quest_stage_involvement" on "npc_quest_stage_involvement"."quest_stage_id" = "quest_stages"."id" left join "npcs" AS inv_npc on "npc_quest_stage_involvement"."npc_id" = inv_npc.id left join "foreshadowing" on "foreshadowing"."source_quest_stage_id" = "quest_stages"."id" group by "quest_stages"."id", "quests"."id", "sites"."id", "npcs"."id");--> statement-breakpoint
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