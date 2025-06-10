-- Custom SQL migration file, put your code below! --
CREATE OR REPLACE VIEW region_search_data_view AS
SELECT
  r.id,
  'regions' AS source_table,
  to_jsonb(r.*) AS entity_main,
  -- Select specific columns based on entities/regions.ts
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', a.id, 'name', a.name, 'type', a.type, 'sites', area_sites.sites)) FILTER (WHERE a.id IS NOT NULL), '[]'::jsonb) AS related_areas,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', q.id, 'name', q.name)) FILTER (WHERE q.id IS NOT NULL), '[]'::jsonb) AS related_quests,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', mc.id, 'name', mc.name)) FILTER (WHERE mc.id IS NOT NULL), '[]'::jsonb) AS related_conflicts,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', c.id, 'description', c.description)) FILTER (WHERE c.id IS NOT NULL), '[]'::jsonb) AS related_consequences,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', nd.id, 'name', nd.name)) FILTER (WHERE nd.id IS NOT NULL), '[]'::jsonb) AS related_narrative_destinations,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('influence', to_jsonb(fi.*), 'faction', jsonb_build_object('id', f.id, 'name', f.name))) FILTER (WHERE fi.id IS NOT NULL), '[]'::jsonb) AS related_faction_influence,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', wcl.id, 'concept_id', wcl.concept_id)) FILTER (WHERE wcl.id IS NOT NULL), '[]'::jsonb) AS related_world_concept_links,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('connection', to_jsonb(rc.*), 'otherRegion', jsonb_build_object('id', rr.id, 'name', rr.name))) FILTER (WHERE rc.id IS NOT NULL), '[]'::jsonb) AS related_connections
FROM
  regions r
LEFT JOIN (
    -- Pre-aggregate sites for areas
    SELECT a.region_id, jsonb_agg(DISTINCT jsonb_build_object('id', s.id, 'name', s.name, 'site_type', s.site_type)) as sites
    FROM sites s
    JOIN areas a ON s.area_id = a.id
    GROUP BY a.region_id
  ) area_sites ON area_sites.region_id = r.id
LEFT JOIN
  areas a ON a.region_id = r.id
LEFT JOIN
  quests q ON q.region_id = r.id
LEFT JOIN
  major_conflicts mc ON mc.primary_region_id = r.id
LEFT JOIN
  consequences c ON c.affected_region_id = r.id
LEFT JOIN
  narrative_destinations nd ON nd.primary_region_id = r.id
LEFT JOIN
  faction_influence fi ON fi.region_id = r.id
LEFT JOIN
  factions f ON f.id = fi.faction_id
LEFT JOIN
  world_concept_links wcl ON wcl.region_id = r.id
LEFT JOIN
  region_connections rc ON rc.region_id = r.id OR rc.other_region_id = r.id
LEFT JOIN
  regions rr ON (rc.region_id = r.id AND rc.other_region_id = rr.id)
            OR (rc.other_region_id = r.id AND rc.region_id = rr.id)
GROUP BY
  r.id;



-- View for aggregating site data for the search index
CREATE OR REPLACE VIEW site_search_data_view AS
SELECT
  s.id,
  'sites' AS source_table,
  to_jsonb(s.*) AS entity_main,
  -- Select specific columns based on entities/sites.ts
  COALESCE(jsonb_build_object('id', a.id, 'name', a.name, 'region', jsonb_build_object('id', r.id, 'name', r.name)), '{}'::jsonb) AS related_area,
  COALESCE(jsonb_agg(DISTINCT to_jsonb(e.*)) FILTER (WHERE e.id IS NOT NULL), '[]'::jsonb) AS related_encounters,
  COALESCE(jsonb_agg(DISTINCT to_jsonb(sec.*)) FILTER (WHERE sec.id IS NOT NULL), '[]'::jsonb) AS related_secrets,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('association', to_jsonb(ns.*), 'npc', jsonb_build_object('id', n.id, 'name', n.name))) FILTER (WHERE ns.id IS NOT NULL), '[]'::jsonb) AS related_npcs,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', qs.id, 'name', qs.name, 'quest', jsonb_build_object('id', q.id, 'name', q.name))) FILTER (WHERE qs.id IS NOT NULL), '[]'::jsonb) AS related_quest_stages,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', qh.id, 'quest', jsonb_build_object('id', qh_q.id, 'name', qh_q.name))) FILTER (WHERE qh.id IS NOT NULL), '[]'::jsonb) AS related_quest_hooks,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', c.id, 'description', c.description)) FILTER (WHERE c.id IS NOT NULL), '[]'::jsonb) AS related_consequences,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', f_hq.id, 'name', f_hq.name)) FILTER (WHERE f_hq.id IS NOT NULL), '[]'::jsonb) AS related_faction_hqs,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('influence', to_jsonb(fi.*), 'faction', jsonb_build_object('id', f.id, 'name', f.name))) FILTER (WHERE fi.id IS NOT NULL), '[]'::jsonb) AS related_faction_influence,
  COALESCE(jsonb_agg(DISTINCT to_jsonb(fs.*)) FILTER (WHERE fs.id IS NOT NULL), '[]'::jsonb) AS related_foreshadowing_seeds,
  COALESCE(jsonb_agg(DISTINCT to_jsonb(ft.*)) FILTER (WHERE ft.id IS NOT NULL), '[]'::jsonb) AS related_foreshadowing_targets,
  COALESCE(jsonb_agg(DISTINCT to_jsonb(ih.*)) FILTER (WHERE ih.id IS NOT NULL), '[]'::jsonb) AS related_item_history,
  COALESCE(jsonb_agg(DISTINCT to_jsonb(ir.*)) FILTER (WHERE ir.id IS NOT NULL), '[]'::jsonb) AS related_item_relationships,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relation', to_jsonb(sr.*), 'otherSite', jsonb_build_object('id', ss.id, 'name', ss.name))) FILTER (WHERE sr.id IS NOT NULL AND ss.id IS NOT NULL), '[]'::jsonb) AS related_outgoing_relations,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relation', to_jsonb(tr.*), 'otherSite', jsonb_build_object('id', ts.id, 'name', ts.name))) FILTER (WHERE tr.id IS NOT NULL AND ts.id IS NOT NULL), '[]'::jsonb) AS related_incoming_relations
FROM
  sites s
LEFT JOIN
  areas a ON s.area_id = a.id
LEFT JOIN
  regions r ON a.region_id = r.id
LEFT JOIN
  site_encounters e ON e.site_id = s.id
LEFT JOIN
  site_secrets sec ON sec.site_id = s.id
LEFT JOIN
  npc_sites ns ON ns.site_id = s.id
LEFT JOIN
  npcs n ON n.id = ns.npc_id
LEFT JOIN
  quest_stages qs ON qs.site_id = s.id
LEFT JOIN
  quests q ON q.id = qs.quest_id
LEFT JOIN
  quest_hooks qh ON qh.site_id = s.id
LEFT JOIN
  quests qh_q ON qh_q.id = qh.quest_id
LEFT JOIN
  consequences c ON c.affected_site_id = s.id
LEFT JOIN
  factions f_hq ON f_hq.primary_hq_site_id = s.id
LEFT JOIN
  faction_influence fi ON fi.site_id = s.id
LEFT JOIN
  factions f ON f.id = fi.faction_id
LEFT JOIN
  foreshadowing_seeds fs ON fs.source_site_id = s.id
LEFT JOIN
  foreshadowing_seeds ft ON ft.target_site_id = s.id
LEFT JOIN
  item_notable_history ih ON ih.event_location_site_id = s.id
LEFT JOIN
  item_relationships ir ON ir.target_site_id = s.id
LEFT JOIN
  site_links sr ON sr.site_id = s.id
LEFT JOIN
  sites ss ON ss.id = sr.other_site_id
LEFT JOIN
  site_links tr ON tr.other_site_id = s.id
LEFT JOIN
  sites ts ON ts.id = tr.site_id
GROUP BY
  s.id, a.id, r.id;



-- View for aggregating area data for the search index
CREATE OR REPLACE VIEW area_search_data_view AS
SELECT
  a.id,
  'areas' AS source_table,
  to_jsonb(a.*) AS entity_main,
  -- Select specific columns based on entities/areas.ts
  COALESCE(jsonb_build_object('id', r.id, 'name', r.name), '{}'::jsonb) AS related_region,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', s.id, 'name', s.name, 'site_type', s.site_type)) FILTER (WHERE s.id IS NOT NULL), '[]'::jsonb) AS related_sites,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', c.id, 'description', c.description)) FILTER (WHERE c.id IS NOT NULL), '[]'::jsonb) AS related_consequences,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('influence', to_jsonb(fi.*), 'faction', jsonb_build_object('id', f.id, 'name', f.name))) FILTER (WHERE fi.id IS NOT NULL), '[]'::jsonb) AS related_faction_influence
FROM
  areas a
LEFT JOIN
  regions r ON a.region_id = r.id
LEFT JOIN
  sites s ON s.area_id = a.id
LEFT JOIN
  consequences c ON c.affected_area_id = a.id
LEFT JOIN
  faction_influence fi ON fi.area_id = a.id
LEFT JOIN
  factions f ON f.id = fi.faction_id
GROUP BY
  a.id, r.id;



-- View for aggregating conflict data for the search index
CREATE OR REPLACE VIEW conflict_search_data_view AS
SELECT
  mc.id,
  'conflicts' AS source_table,
  to_jsonb(mc.*) AS entity_main,
  -- Select specific columns based on entities/conflicts.ts
  COALESCE(jsonb_build_object('id', r.id, 'name', r.name), '{}'::jsonb) AS related_primary_region,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
    'participant', to_jsonb(cp.*),
    'faction', CASE WHEN cp.faction_id IS NOT NULL THEN jsonb_build_object('id', f.id, 'name', f.name) ELSE NULL END,
    'npc', CASE WHEN cp.npc_id IS NOT NULL THEN jsonb_build_object('id', n.id, 'name', n.name) ELSE NULL END
  )) FILTER (WHERE cp.id IS NOT NULL), '[]'::jsonb) AS related_participants,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', c_caused.id, 'description', c_caused.description)) FILTER (WHERE c_caused.id IS NOT NULL), '[]'::jsonb) AS related_consequences_caused,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', c_affecting.id, 'description', c_affecting.description)) FILTER (WHERE c_affecting.id IS NOT NULL), '[]'::jsonb) AS related_consequences_affecting,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', nd.id, 'name', nd.name)) FILTER (WHERE nd.id IS NOT NULL), '[]'::jsonb) AS related_narrative_destinations,
  COALESCE(jsonb_agg(DISTINCT to_jsonb(fs.*)) FILTER (WHERE fs.id IS NOT NULL), '[]'::jsonb) AS related_foreshadowing_seeds,
  COALESCE(jsonb_agg(DISTINCT to_jsonb(ir.*)) FILTER (WHERE ir.id IS NOT NULL), '[]'::jsonb) AS related_item_relationships,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', wcl.id, 'concept_id', wcl.concept_id)) FILTER (WHERE wcl.id IS NOT NULL), '[]'::jsonb) AS related_world_concept_links
FROM
  major_conflicts mc
LEFT JOIN
  regions r ON mc.primary_region_id = r.id
LEFT JOIN
  conflict_participants cp ON cp.conflict_id = mc.id
LEFT JOIN
  factions f ON cp.faction_id = f.id
LEFT JOIN
  npcs n ON cp.npc_id = n.id
LEFT JOIN
  consequences c_caused ON c_caused.trigger_conflict_id = mc.id
LEFT JOIN
  consequences c_affecting ON c_affecting.affected_conflict_id = mc.id
LEFT JOIN
  narrative_destinations nd ON nd.related_conflict_id = mc.id
LEFT JOIN
  foreshadowing_seeds fs ON fs.target_major_conflict_id = mc.id
LEFT JOIN
  item_relationships ir ON ir.target_conflict_id = mc.id
LEFT JOIN
  world_concept_links wcl ON wcl.conflict_id = mc.id
GROUP BY
  mc.id, r.id;



-- View for aggregating faction data for the search index
CREATE OR REPLACE VIEW faction_search_data_view AS
SELECT
  f.id,
  'factions' AS source_table,
  to_jsonb(f.*) AS entity_main,
  -- Select specific columns based on entities/factions.ts
  COALESCE(jsonb_build_object('id', hq_site.id, 'name', hq_site.name), '{}'::jsonb) AS related_primary_hq,
  COALESCE(jsonb_agg(DISTINCT to_jsonb(fa.*)) FILTER (WHERE fa.id IS NOT NULL), '[]'::jsonb) AS related_agendas,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('membership', to_jsonb(nf.*), 'npc', jsonb_build_object('id', n.id, 'name', n.name))) FILTER (WHERE nf.id IS NOT NULL), '[]'::jsonb) AS related_members,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', qh.id, 'source', qh.source, 'hook_content', qh.hook_content)) FILTER (WHERE qh.id IS NOT NULL), '[]'::jsonb) AS related_quest_hooks,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('participation', to_jsonb(qpi.*), 'quest', jsonb_build_object('id', q.id, 'name', q.name))) FILTER (WHERE qpi.id IS NOT NULL), '[]'::jsonb) AS related_quest_participation,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
      'influence', to_jsonb(fi.*),
      'region', CASE WHEN fi.region_id IS NOT NULL THEN jsonb_build_object('id', r.id, 'name', r.name) ELSE NULL END,
      'area', CASE WHEN fi.area_id IS NOT NULL THEN jsonb_build_object('id', a.id, 'name', a.name) ELSE NULL END,
      'site', CASE WHEN fi.site_id IS NOT NULL THEN jsonb_build_object('id', s.id, 'name', s.name) ELSE NULL END
    )) FILTER (WHERE fi.id IS NOT NULL), '[]'::jsonb) AS related_influence,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('participant', to_jsonb(cp.*), 'conflict', jsonb_build_object('id', mc.id, 'name', mc.name))) FILTER (WHERE cp.id IS NOT NULL), '[]'::jsonb) AS related_conflicts,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', c.id, 'description', c.description)) FILTER (WHERE c.id IS NOT NULL), '[]'::jsonb) AS related_consequences,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('involvement', to_jsonb(dpi.*), 'destination', jsonb_build_object('id', nd.id, 'name', nd.name))) FILTER (WHERE dpi.id IS NOT NULL), '[]'::jsonb) AS related_destination_involvement,
  COALESCE(jsonb_agg(DISTINCT to_jsonb(fs.*)) FILTER (WHERE fs.id IS NOT NULL), '[]'::jsonb) AS related_foreshadowing_seeds,
  COALESCE(jsonb_agg(DISTINCT to_jsonb(ir.*)) FILTER (WHERE ir.id IS NOT NULL), '[]'::jsonb) AS related_item_relationships,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', wcl.id, 'concept_id', wcl.concept_id)) FILTER (WHERE wcl.id IS NOT NULL), '[]'::jsonb) AS related_world_concept_links,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relation', to_jsonb(fd_in.*), 'sourceFaction', jsonb_build_object('id', sf.id, 'name', sf.name))) FILTER (WHERE fd_in.id IS NOT NULL), '[]'::jsonb) AS related_incoming_relationships,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relation', to_jsonb(fd_out.*), 'targetFaction', jsonb_build_object('id', tf.id, 'name', tf.name))) FILTER (WHERE fd_out.id IS NOT NULL), '[]'::jsonb) AS related_outgoing_relationships
FROM
  factions f
LEFT JOIN sites hq_site ON f.primary_hq_site_id = hq_site.id
LEFT JOIN faction_agendas fa ON fa.faction_id = f.id
LEFT JOIN npc_factions nf ON nf.faction_id = f.id
LEFT JOIN npcs n ON nf.npc_id = n.id
LEFT JOIN quest_hooks qh ON qh.faction_id = f.id
LEFT JOIN quest_participant_involvement qpi ON qpi.faction_id = f.id
LEFT JOIN quests q ON qpi.quest_id = q.id
LEFT JOIN faction_influence fi ON fi.faction_id = f.id
LEFT JOIN regions r ON fi.region_id = r.id
LEFT JOIN areas a ON fi.area_id = a.id
LEFT JOIN sites s ON fi.site_id = s.id
LEFT JOIN conflict_participants cp ON cp.faction_id = f.id
LEFT JOIN major_conflicts mc ON cp.conflict_id = mc.id
LEFT JOIN consequences c ON c.affected_faction_id = f.id
LEFT JOIN destination_participant_involvement dpi ON dpi.faction_id = f.id
LEFT JOIN narrative_destinations nd ON dpi.destination_id = nd.id
LEFT JOIN foreshadowing_seeds fs ON fs.target_faction_id = f.id
LEFT JOIN item_relationships ir ON ir.target_faction_id = f.id
LEFT JOIN world_concept_links wcl ON wcl.faction_id = f.id
LEFT JOIN faction_diplomacy fd_in ON fd_in.other_faction_id = f.id
LEFT JOIN factions sf ON fd_in.faction_id = sf.id
LEFT JOIN faction_diplomacy fd_out ON fd_out.faction_id = f.id
LEFT JOIN factions tf ON fd_out.other_faction_id = tf.id
GROUP BY
  f.id, hq_site.id;



-- View for aggregating foreshadowing data for the search index
CREATE OR REPLACE VIEW foreshadowing_search_data_view AS
SELECT
  fs.id,
  'foreshadowing' AS source_table,
  to_jsonb(fs.*) AS entity_main,
  -- Select specific columns based on entities/foreshadowing.ts
  COALESCE(jsonb_build_object('id', sq.id, 'name', sq.name), '{}'::jsonb) AS related_source_quest,
  COALESCE(jsonb_build_object('stage', jsonb_build_object('id', sqs.id, 'name', sqs.name), 'quest', jsonb_build_object('id', sq_stage.id, 'name', sq_stage.name)), '{}'::jsonb) AS related_source_stage,
  COALESCE(jsonb_build_object('id', ss.id, 'name', ss.name), '{}'::jsonb) AS related_source_site,
  COALESCE(jsonb_build_object('id', sn.id, 'name', sn.name), '{}'::jsonb) AS related_source_npc,
  COALESCE(jsonb_build_object('id', tq.id, 'name', tq.name), '{}'::jsonb) AS related_target_quest,
  COALESCE(jsonb_build_object('id', tn.id, 'name', tn.name), '{}'::jsonb) AS related_target_npc,
  COALESCE(jsonb_build_object('id', tne.id, 'description', tne.description), '{}'::jsonb) AS related_target_narrative_event,
  COALESCE(jsonb_build_object('id', tmc.id, 'name', tmc.name), '{}'::jsonb) AS related_target_major_conflict,
  COALESCE(jsonb_build_object('id', ti.id, 'name', ti.name), '{}'::jsonb) AS related_target_item,
  COALESCE(jsonb_build_object('id', tnd.id, 'name', tnd.name), '{}'::jsonb) AS related_target_narrative_destination,
  COALESCE(jsonb_build_object('id', twc.id, 'name', twc.name), '{}'::jsonb) AS related_target_world_concept,
  COALESCE(jsonb_build_object('id', tf.id, 'name', tf.name), '{}'::jsonb) AS related_target_faction,
  COALESCE(jsonb_build_object('id', ts.id, 'name', ts.name), '{}'::jsonb) AS related_target_site
FROM
  foreshadowing_seeds fs
LEFT JOIN quests sq ON fs.source_quest_id = sq.id
LEFT JOIN quest_stages sqs ON fs.source_quest_stage_id = sqs.id
LEFT JOIN quests sq_stage ON sqs.quest_id = sq_stage.id
LEFT JOIN sites ss ON fs.source_site_id = ss.id
LEFT JOIN npcs sn ON fs.source_npc_id = sn.id
LEFT JOIN quests tq ON fs.target_quest_id = tq.id
LEFT JOIN npcs tn ON fs.target_npc_id = tn.id
LEFT JOIN narrative_events tne ON fs.target_narrative_event_id = tne.id
LEFT JOIN major_conflicts tmc ON fs.target_major_conflict_id = tmc.id
LEFT JOIN items ti ON fs.target_item_id = ti.id
LEFT JOIN narrative_destinations tnd ON fs.target_narrative_destination_id = tnd.id
LEFT JOIN world_concepts twc ON fs.target_world_concept_id = twc.id
LEFT JOIN factions tf ON fs.target_faction_id = tf.id
LEFT JOIN sites ts ON fs.target_site_id = ts.id
GROUP BY
  fs.id, sq.id, sqs.id, sq_stage.id, ss.id, sn.id, tq.id, tn.id, tne.id, tmc.id, ti.id, tnd.id, twc.id, tf.id, ts.id;



-- View for aggregating narrative destination data for the search index
CREATE OR REPLACE VIEW narrative_destination_search_data_view AS
SELECT
  nd.id,
  'narrative_destinations' AS source_table,
  to_jsonb(nd.*) AS entity_main,
  -- Select specific columns based on entities/narrative.ts
  COALESCE(jsonb_build_object('id', r.id, 'name', r.name), '{}'::jsonb) AS related_primary_region,
  COALESCE(jsonb_build_object('id', mc.id, 'name', mc.name), '{}'::jsonb) AS related_conflict,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('role', to_jsonb(dqr.*), 'quest', jsonb_build_object('id', q.id, 'name', q.name))) FILTER (WHERE dqr.id IS NOT NULL), '[]'::jsonb) AS related_quest_roles,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
    'involvement', to_jsonb(dpi.*),
    'npc', CASE WHEN dpi.npc_id IS NOT NULL THEN jsonb_build_object('id', n.id, 'name', n.name) ELSE NULL END,
    'faction', CASE WHEN dpi.faction_id IS NOT NULL THEN jsonb_build_object('id', f.id, 'name', f.name) ELSE NULL END
  )) FILTER (WHERE dpi.id IS NOT NULL), '[]'::jsonb) AS related_participant_involvement,
  COALESCE(jsonb_agg(DISTINCT to_jsonb(ir.*)) FILTER (WHERE ir.id IS NOT NULL), '[]'::jsonb) AS related_item_relationships,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relationship', to_jsonb(dr_out.*), 'relatedDestination', jsonb_build_object('id', rd_out.id, 'name', rd_out.name))) FILTER (WHERE dr_out.id IS NOT NULL), '[]'::jsonb) AS related_outgoing_relationships,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relationship', to_jsonb(dr_in.*), 'sourceDestination', jsonb_build_object('id', sd_in.id, 'name', sd_in.name))) FILTER (WHERE dr_in.id IS NOT NULL), '[]'::jsonb) AS related_incoming_relationships
FROM
  narrative_destinations nd
LEFT JOIN regions r ON nd.primary_region_id = r.id
LEFT JOIN major_conflicts mc ON nd.related_conflict_id = mc.id
LEFT JOIN destination_quest_roles dqr ON dqr.destination_id = nd.id
LEFT JOIN quests q ON dqr.quest_id = q.id
LEFT JOIN destination_participant_involvement dpi ON dpi.destination_id = nd.id
LEFT JOIN npcs n ON dpi.npc_id = n.id
LEFT JOIN factions f ON dpi.faction_id = f.id
LEFT JOIN item_relationships ir ON ir.target_narrative_destination_id = nd.id
LEFT JOIN destination_relationships dr_out ON dr_out.source_destination_id = nd.id
LEFT JOIN narrative_destinations rd_out ON dr_out.related_destination_id = rd_out.id
LEFT JOIN destination_relationships dr_in ON dr_in.related_destination_id = nd.id
LEFT JOIN narrative_destinations sd_in ON dr_in.source_destination_id = sd_in.id
GROUP BY
  nd.id, r.id, mc.id;



-- View for aggregating NPC data for the search index
CREATE OR REPLACE VIEW npc_search_data_view AS
SELECT
  n.id,
  'npcs' AS source_table,
  to_jsonb(n.*) AS entity_main,
  -- Select specific columns based on entities/npcs.ts
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('membership', to_jsonb(nf.*), 'faction', jsonb_build_object('id', f.id, 'name', f.name))) FILTER (WHERE nf.id IS NOT NULL), '[]'::jsonb) AS related_factions,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('association', to_jsonb(ns.*), 'site', jsonb_build_object('id', s.id, 'name', s.name, 'area', jsonb_build_object('id', a.id, 'name', a.name, 'region', jsonb_build_object('id', r.id, 'name', r.name))))) FILTER (WHERE ns.id IS NOT NULL), '[]'::jsonb) AS related_site_associations,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('participant', to_jsonb(cp.*), 'conflict', jsonb_build_object('id', mc.id, 'name', mc.name))) FILTER (WHERE cp.id IS NOT NULL), '[]'::jsonb) AS related_conflict_participation,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', c.id, 'description', c.description)) FILTER (WHERE c.id IS NOT NULL), '[]'::jsonb) AS related_consequences,
  COALESCE(jsonb_agg(DISTINCT to_jsonb(fs_target.*)) FILTER (WHERE fs_target.id IS NOT NULL), '[]'::jsonb) AS related_target_foreshadowing,
  COALESCE(jsonb_agg(DISTINCT to_jsonb(fs_source.*)) FILTER (WHERE fs_source.id IS NOT NULL), '[]'::jsonb) AS related_source_foreshadowing,
  COALESCE(jsonb_agg(DISTINCT to_jsonb(ih.*)) FILTER (WHERE ih.id IS NOT NULL), '[]'::jsonb) AS related_item_history,
  COALESCE(jsonb_agg(DISTINCT to_jsonb(ir.*)) FILTER (WHERE ir.id IS NOT NULL), '[]'::jsonb) AS related_item_relationships,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('involvement', to_jsonb(dpi.*), 'destination', jsonb_build_object('id', nd.id, 'name', nd.name))) FILTER (WHERE dpi.id IS NOT NULL), '[]'::jsonb) AS related_destination_involvement,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', qh.id, 'source', qh.source, 'hook_content', qh.hook_content)) FILTER (WHERE qh.id IS NOT NULL), '[]'::jsonb) AS related_quest_hooks,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', qs.id, 'name', qs.name, 'quest', jsonb_build_object('id', q_delivery.id, 'name', q_delivery.name))) FILTER (WHERE qs.id IS NOT NULL), '[]'::jsonb) AS related_quest_stage_deliveries,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', wcl.id, 'concept_id', wcl.concept_id)) FILTER (WHERE wcl.id IS NOT NULL), '[]'::jsonb) AS related_world_concept_links,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relationship', to_jsonb(nr_out.*), 'relatedNpc', jsonb_build_object('id', rn_out.id, 'name', rn_out.name))) FILTER (WHERE nr_out.id IS NOT NULL), '[]'::jsonb) AS related_outgoing_relationships,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relationship', to_jsonb(nr_in.*), 'sourceNpc', jsonb_build_object('id', sn_in.id, 'name', sn_in.name))) FILTER (WHERE nr_in.id IS NOT NULL), '[]'::jsonb) AS related_incoming_relationships
FROM
  npcs n
LEFT JOIN npc_factions nf ON nf.npc_id = n.id
LEFT JOIN factions f ON nf.faction_id = f.id
LEFT JOIN npc_sites ns ON ns.npc_id = n.id
LEFT JOIN sites s ON ns.site_id = s.id
LEFT JOIN areas a ON s.area_id = a.id
LEFT JOIN regions r ON a.region_id = r.id
LEFT JOIN conflict_participants cp ON cp.npc_id = n.id
LEFT JOIN major_conflicts mc ON cp.conflict_id = mc.id
LEFT JOIN consequences c ON c.affected_npc_id = n.id
LEFT JOIN foreshadowing_seeds fs_target ON fs_target.target_npc_id = n.id
LEFT JOIN foreshadowing_seeds fs_source ON fs_source.source_npc_id = n.id
LEFT JOIN item_notable_history ih ON ih.key_npc_id = n.id
LEFT JOIN item_relationships ir ON ir.target_npc_id = n.id
LEFT JOIN destination_participant_involvement dpi ON dpi.npc_id = n.id
LEFT JOIN narrative_destinations nd ON dpi.destination_id = nd.id
LEFT JOIN quest_hooks qh ON qh.delivery_npc_id = n.id
LEFT JOIN quests q_delivery ON qh.quest_id = q_delivery.id
LEFT JOIN world_concept_links wcl ON wcl.npc_id = n.id
LEFT JOIN npc_relationships nr_out ON nr_out.npc_id = n.id
LEFT JOIN npcs rn_out ON nr_out.related_npc_id = rn_out.id
LEFT JOIN npc_relationships nr_in ON nr_in.related_npc_id = n.id
LEFT JOIN npcs sn_in ON nr_in.npc_id = sn_in.id
GROUP BY
  n.id;



-- View for aggregating quest data for the search index
CREATE OR REPLACE VIEW quest_search_data_view AS
SELECT
  q.id,
  'quests' AS source_table,
  to_jsonb(q.*) AS entity_main,
  -- Select specific columns based on entities/quests.ts
  COALESCE(jsonb_build_object('id', r.id, 'name', r.name), '{}'::jsonb) AS related_region,
  COALESCE(jsonb_build_object('id', pq.id, 'name', pq.name), '{}'::jsonb) AS related_parent_quest,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relationship', to_jsonb(qr_out.*), 'targetQuest', jsonb_build_object('id', tq.id, 'name', tq.name))) FILTER (WHERE qr_out.id IS NOT NULL), '[]'::jsonb) AS related_outgoing_relationships,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relationship', to_jsonb(qr_in.*), 'sourceQuest', jsonb_build_object('id', sq.id, 'name', sq.name))) FILTER (WHERE qr_in.id IS NOT NULL), '[]'::jsonb) AS related_incoming_relationships,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', qs.id, 'name', qs.name, 'stage_order', qs.stage_order, 'stage_type', qs.stage_type)) FILTER (WHERE qs.id IS NOT NULL), '[]'::jsonb) AS related_stages,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('hook', to_jsonb(qh.*), 'site', CASE WHEN qh.site_id IS NOT NULL THEN jsonb_build_object('id', h_s.id, 'name', h_s.name) ELSE NULL END, 'faction', CASE WHEN qh.faction_id IS NOT NULL THEN jsonb_build_object('id', h_f.id, 'name', h_f.name) ELSE NULL END, 'deliveryNpc', CASE WHEN qh.delivery_npc_id IS NOT NULL THEN jsonb_build_object('id', h_n.id, 'name', h_n.name) ELSE NULL END)) FILTER (WHERE qh.id IS NOT NULL), '[]'::jsonb) AS related_hooks,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
    'involvement', to_jsonb(qpi.*),
    'npc', CASE WHEN qpi.npc_id IS NOT NULL THEN jsonb_build_object('id', p_n.id, 'name', p_n.name) ELSE NULL END,
    'faction', CASE WHEN qpi.faction_id IS NOT NULL THEN jsonb_build_object('id', p_f.id, 'name', p_f.name) ELSE NULL END
  )) FILTER (WHERE qpi.id IS NOT NULL), '[]'::jsonb) AS related_participant_involvement,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('role', to_jsonb(dqr.*), 'destination', jsonb_build_object('id', nd.id, 'name', nd.name))) FILTER (WHERE dqr.id IS NOT NULL), '[]'::jsonb) AS related_destination_contributions,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', c.id, 'description', c.description)) FILTER (WHERE c.id IS NOT NULL), '[]'::jsonb) AS related_consequences,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', ne.id, 'description', ne.description)) FILTER (WHERE ne.id IS NOT NULL), '[]'::jsonb) AS related_narrative_events,
  COALESCE(jsonb_agg(DISTINCT to_jsonb(fs.*)) FILTER (WHERE fs.id IS NOT NULL), '[]'::jsonb) AS related_foreshadowing_seeds,
  COALESCE(jsonb_agg(DISTINCT to_jsonb(ir.*)) FILTER (WHERE ir.id IS NOT NULL), '[]'::jsonb) AS related_item_relationships,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', wcl.id, 'concept_id', wcl.concept_id)) FILTER (WHERE wcl.id IS NOT NULL), '[]'::jsonb) AS related_world_concept_links
FROM
  quests q
LEFT JOIN regions r ON q.region_id = r.id
LEFT JOIN quests pq ON q.parent_id = pq.id
LEFT JOIN quest_relationships qr_out ON qr_out.quest_id = q.id
LEFT JOIN quests tq ON qr_out.related_quest_id = tq.id
LEFT JOIN quest_relationships qr_in ON qr_in.related_quest_id = q.id
LEFT JOIN quests sq ON qr_in.quest_id = sq.id
LEFT JOIN quest_stages qs ON qs.quest_id = q.id
LEFT JOIN quest_hooks qh ON qh.quest_id = q.id
LEFT JOIN sites h_s ON qh.site_id = h_s.id
LEFT JOIN factions h_f ON qh.faction_id = h_f.id
LEFT JOIN npcs h_n ON qh.delivery_npc_id = h_n.id
LEFT JOIN quest_participant_involvement qpi ON qpi.quest_id = q.id
LEFT JOIN npcs p_n ON qpi.npc_id = p_n.id
LEFT JOIN factions p_f ON qpi.faction_id = p_f.id
LEFT JOIN destination_quest_roles dqr ON dqr.quest_id = q.id
LEFT JOIN narrative_destinations nd ON dqr.destination_id = nd.id
LEFT JOIN consequences c ON c.trigger_quest_id = q.id
LEFT JOIN narrative_events ne ON ne.related_quest_id = q.id
LEFT JOIN foreshadowing_seeds fs ON fs.source_quest_id = q.id OR fs.target_quest_id = q.id
LEFT JOIN item_relationships ir ON ir.target_quest_id = q.id
LEFT JOIN world_concept_links wcl ON wcl.quest_id = q.id
GROUP BY
  q.id, r.id, pq.id;



-- View for aggregating world concept data for the search index
CREATE OR REPLACE VIEW world_concept_search_data_view AS
SELECT
  wc.id,
  'world_concepts' AS source_table,
  to_jsonb(wc.*) AS entity_main,
  -- Select specific columns based on entities/worldbuilding.ts
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relationship', to_jsonb(cr_out.*), 'targetConcept', jsonb_build_object('id', tc.id, 'name', tc.name))) FILTER (WHERE cr_out.id IS NOT NULL), '[]'::jsonb) AS related_outgoing_concept_relationships,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relationship', to_jsonb(cr_in.*), 'sourceConcept', jsonb_build_object('id', sc.id, 'name', sc.name))) FILTER (WHERE cr_in.id IS NOT NULL), '[]'::jsonb) AS related_incoming_concept_relationships,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
    'link', to_jsonb(wcl.*),
    'region', CASE WHEN wcl.region_id IS NOT NULL THEN jsonb_build_object('id', lr.id, 'name', lr.name) ELSE NULL END,
    'faction', CASE WHEN wcl.faction_id IS NOT NULL THEN jsonb_build_object('id', lf.id, 'name', lf.name) ELSE NULL END,
    'npc', CASE WHEN wcl.npc_id IS NOT NULL THEN jsonb_build_object('id', ln.id, 'name', ln.name) ELSE NULL END,
    'conflict', CASE WHEN wcl.conflict_id IS NOT NULL THEN jsonb_build_object('id', lmc.id, 'name', lmc.name) ELSE NULL END,
    'quest', CASE WHEN wcl.quest_id IS NOT NULL THEN jsonb_build_object('id', lq.id, 'name', lq.name) ELSE NULL END
  )) FILTER (WHERE wcl.id IS NOT NULL), '[]'::jsonb) AS related_entity_links,
  COALESCE(jsonb_agg(DISTINCT to_jsonb(ir.*)) FILTER (WHERE ir.id IS NOT NULL), '[]'::jsonb) AS related_item_relationships
FROM
  world_concepts wc
LEFT JOIN concept_relationships cr_out ON cr_out.source_concept_id = wc.id
LEFT JOIN world_concepts tc ON cr_out.target_concept_id = tc.id
LEFT JOIN concept_relationships cr_in ON cr_in.target_concept_id = wc.id
LEFT JOIN world_concepts sc ON cr_in.source_concept_id = sc.id
LEFT JOIN world_concept_links wcl ON wcl.concept_id = wc.id
LEFT JOIN regions lr ON wcl.region_id = lr.id
LEFT JOIN factions lf ON wcl.faction_id = lf.id
LEFT JOIN npcs ln ON wcl.npc_id = ln.id
LEFT JOIN major_conflicts lmc ON wcl.conflict_id = lmc.id
LEFT JOIN quests lq ON wcl.quest_id = lq.id
LEFT JOIN item_relationships ir ON ir.target_world_concept_id = wc.id
GROUP BY
  wc.id;



-- View for aggregating item data for the search index
CREATE OR REPLACE VIEW item_search_data_view AS
SELECT
  i.id,
  'items' AS source_table,
  to_jsonb(i.*) AS entity_main,
  -- Select specific columns based on entities/items.ts
  COALESCE(jsonb_build_object('id', rq.id, 'name', rq.name), '{}'::jsonb) AS related_quest,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
    'relationship', to_jsonb(ir_out.*),
    'targetItem', CASE WHEN ir_out.target_item_id IS NOT NULL THEN jsonb_build_object('id', ti.id, 'name', ti.name) ELSE NULL END,
    'targetNpc', CASE WHEN ir_out.target_npc_id IS NOT NULL THEN jsonb_build_object('id', tn.id, 'name', tn.name) ELSE NULL END,
    'targetFaction', CASE WHEN ir_out.target_faction_id IS NOT NULL THEN jsonb_build_object('id', tf.id, 'name', tf.name) ELSE NULL END,
    'targetSite', CASE WHEN ir_out.target_site_id IS NOT NULL THEN jsonb_build_object('id', ts.id, 'name', ts.name) ELSE NULL END,
    'targetQuest', CASE WHEN ir_out.target_quest_id IS NOT NULL THEN jsonb_build_object('id', tq.id, 'name', tq.name) ELSE NULL END,
    'targetConflict', CASE WHEN ir_out.target_conflict_id IS NOT NULL THEN jsonb_build_object('id', tc.id, 'name', tc.name) ELSE NULL END,
    'targetNarrativeDestination', CASE WHEN ir_out.target_narrative_destination_id IS NOT NULL THEN jsonb_build_object('id', tnd.id, 'name', tnd.name) ELSE NULL END,
    'targetWorldConcept', CASE WHEN ir_out.target_world_concept_id IS NOT NULL THEN jsonb_build_object('id', twc.id, 'name', twc.name) ELSE NULL END
  )) FILTER (WHERE ir_out.id IS NOT NULL), '[]'::jsonb) AS related_outgoing_relationships,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
    'relationship', to_jsonb(ir_in.*),
    'sourceItem', jsonb_build_object('id', si.id, 'name', si.name)
  )) FILTER (WHERE ir_in.id IS NOT NULL), '[]'::jsonb) AS related_incoming_relationships,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
    'history', to_jsonb(ih.*),
    'keyNpc', CASE WHEN ih.key_npc_id IS NOT NULL THEN jsonb_build_object('id', hn.id, 'name', hn.name) ELSE NULL END,
    'eventLocationSite', CASE WHEN ih.event_location_site_id IS NOT NULL THEN jsonb_build_object('id', hs.id, 'name', hs.name) ELSE NULL END
  )) FILTER (WHERE ih.id IS NOT NULL), '[]'::jsonb) AS related_notable_history
FROM
  items i
LEFT JOIN quests rq ON i.related_quest_id = rq.id
LEFT JOIN item_relationships ir_out ON ir_out.source_item_id = i.id
LEFT JOIN items ti ON ir_out.target_item_id = ti.id
LEFT JOIN npcs tn ON ir_out.target_npc_id = tn.id
LEFT JOIN factions tf ON ir_out.target_faction_id = tf.id
LEFT JOIN sites ts ON ir_out.target_site_id = ts.id
LEFT JOIN quests tq ON ir_out.target_quest_id = tq.id
LEFT JOIN major_conflicts tc ON ir_out.target_conflict_id = tc.id
LEFT JOIN narrative_destinations tnd ON ir_out.target_narrative_destination_id = tnd.id
LEFT JOIN world_concepts twc ON ir_out.target_world_concept_id = twc.id
LEFT JOIN item_relationships ir_in ON ir_in.target_item_id = i.id
LEFT JOIN items si ON ir_in.source_item_id = si.id
LEFT JOIN item_notable_history ih ON ih.item_id = i.id
LEFT JOIN npcs hn ON ih.key_npc_id = hn.id
LEFT JOIN sites hs ON ih.event_location_site_id = hs.id
GROUP BY
  i.id, rq.id;



-- View for aggregating narrative event data for the search index
CREATE OR REPLACE VIEW narrative_event_search_data_view AS
SELECT
  ne.id,
  'narrative_events' AS source_table,
  to_jsonb(ne.*) AS entity_main,
  -- Select specific columns based on entities/events.ts
  COALESCE(jsonb_build_object('stage', jsonb_build_object('id', qs.id, 'name', qs.name), 'quest', jsonb_build_object('id', sq.id, 'name', sq.name)), '{}'::jsonb) AS related_quest_stage,
  COALESCE(jsonb_build_object('id', sd.id, 'name', sd.name), '{}'::jsonb) AS related_triggering_decision,
  COALESCE(jsonb_build_object('id', rq.id, 'name', rq.name), '{}'::jsonb) AS related_quest
FROM
  narrative_events ne
LEFT JOIN quest_stages qs ON ne.quest_stage_id = qs.id
LEFT JOIN quests sq ON qs.quest_id = sq.id
LEFT JOIN stage_decisions sd ON ne.triggering_decision_id = sd.id
LEFT JOIN quests rq ON ne.related_quest_id = rq.id
GROUP BY
  ne.id, qs.id, sq.id, sd.id, rq.id;



-- View for aggregating consequence data for the search index
CREATE OR REPLACE VIEW consequence_search_data_view AS
SELECT
  c.id,
  'consequences' AS source_table,
  to_jsonb(c.*) AS entity_main,
  -- Select specific columns based on entities/events.ts
  COALESCE(jsonb_build_object('id', tq.id, 'name', tq.name), '{}'::jsonb) AS related_trigger_quest,
  COALESCE(jsonb_build_object('id', td.id, 'name', td.name), '{}'::jsonb) AS related_trigger_decision,
  COALESCE(jsonb_build_object('id', tc.id, 'name', tc.name), '{}'::jsonb) AS related_trigger_conflict,
  COALESCE(jsonb_build_object('id', af.id, 'name', af.name), '{}'::jsonb) AS related_affected_faction,
  COALESCE(jsonb_build_object('id', ar.id, 'name', ar.name), '{}'::jsonb) AS related_affected_region,
  COALESCE(jsonb_build_object('id', aa.id, 'name', aa.name), '{}'::jsonb) AS related_affected_area,
  COALESCE(jsonb_build_object('id', as_site.id, 'name', as_site.name), '{}'::jsonb) AS related_affected_site,
  COALESCE(jsonb_build_object('id', an.id, 'name', an.name), '{}'::jsonb) AS related_affected_npc,
  COALESCE(jsonb_build_object('id', ad.id, 'name', ad.name), '{}'::jsonb) AS related_affected_destination,
  COALESCE(jsonb_build_object('id', ac.id, 'name', ac.name), '{}'::jsonb) AS related_affected_conflict,
  COALESCE(jsonb_build_object('id', fq.id, 'name', fq.name), '{}'::jsonb) AS related_future_quest
FROM
  consequences c
LEFT JOIN quests tq ON c.trigger_quest_id = tq.id
LEFT JOIN stage_decisions td ON c.trigger_decision_id = td.id
LEFT JOIN major_conflicts tc ON c.trigger_conflict_id = tc.id
LEFT JOIN factions af ON c.affected_faction_id = af.id
LEFT JOIN regions ar ON c.affected_region_id = ar.id
LEFT JOIN areas aa ON c.affected_area_id = aa.id
LEFT JOIN sites as_site ON c.affected_site_id = as_site.id
LEFT JOIN npcs an ON c.affected_npc_id = an.id
LEFT JOIN narrative_destinations ad ON c.affected_destination_id = ad.id
LEFT JOIN major_conflicts ac ON c.affected_conflict_id = ac.id
LEFT JOIN quests fq ON c.future_quest_id = fq.id
GROUP BY
  c.id, tq.id, td.id, tc.id, af.id, ar.id, aa.id, as_site.id, an.id, ad.id, ac.id, fq.id;