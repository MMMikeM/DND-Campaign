-- Custom SQL migration file, put your code below! ---- Ensure required extensions are enabled
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;


DROP VIEW IF EXISTS region_search_data_view CASCADE;
DROP VIEW IF EXISTS site_search_data_view CASCADE;
DROP VIEW IF EXISTS area_search_data_view CASCADE;
DROP VIEW IF EXISTS conflict_search_data_view CASCADE;
DROP VIEW IF EXISTS faction_search_data_view CASCADE;
DROP VIEW IF EXISTS foreshadowing_search_data_view CASCADE;
DROP VIEW IF EXISTS narrative_arc_search_data_view CASCADE;
DROP VIEW IF EXISTS npc_search_data_view CASCADE;
DROP VIEW IF EXISTS quest_search_data_view CASCADE;
DROP VIEW IF EXISTS world_change_search_data_view CASCADE;


CREATE OR REPLACE VIEW region_search_data_view AS
SELECT
  r.id,
  r.name,
  'regions' AS source_table,
  to_jsonb(r.*) AS entity_main,
  -- Select specific columns based on entities/regions.ts
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', a.id, 'name', a.name, 'type', a.type, 'sites', area_sites.sites)) FILTER (WHERE a.id IS NOT NULL), '[]'::jsonb) AS related_areas,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', q.id, 'name', q.name)) FILTER (WHERE q.id IS NOT NULL), '[]'::jsonb) AS related_quests,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('control', to_jsonb(ftc.*), 'faction', jsonb_build_object('id', f.id, 'name', f.name))) FILTER (WHERE ftc.id IS NOT NULL), '[]'::jsonb) AS related_territorial_control,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('connection', to_jsonb(rc.*), 'details', to_jsonb(rcd.*), 'otherRegion', jsonb_build_object('id', rr.id, 'name', rr.name))) FILTER (WHERE rc.id IS NOT NULL), '[]'::jsonb) AS related_connections
FROM
  regions r
LEFT JOIN (
    -- Pre-aggregate sites for areas
    SELECT area_id, jsonb_agg(DISTINCT jsonb_build_object('id', s.id, 'name', s.name, 'siteType', s.site_type)) as sites
    FROM sites s
    GROUP BY area_id
  ) area_sites ON area_sites.area_id = r.id -- Join pre-aggregated sites (Note: This join condition might be incorrect if area_sites.area_id refers to areas.id, not regions.id. Correcting based on typical structure)
LEFT JOIN
  areas a ON a.region_id = r.id
LEFT JOIN
  quests q ON q.region_id = r.id
LEFT JOIN
  faction_territorial_control ftc ON ftc.region_id = r.id
LEFT JOIN
  factions f ON f.id = ftc.faction_id
LEFT JOIN
  region_connections rc ON rc.region_id = r.id OR rc.other_region_id = r.id
LEFT JOIN
  region_connection_details rcd ON rcd.relation_id = rc.id
LEFT JOIN
  regions rr ON (rc.region_id = r.id AND rc.other_region_id = rr.id)
            OR (rc.other_region_id = r.id AND rc.region_id = rr.id)
GROUP BY
  r.id;

-- View for aggregating site data for the search index
CREATE OR REPLACE VIEW site_search_data_view AS
SELECT
  s.id,
  s.name,
  'sites' AS source_table,
  to_jsonb(s.*) AS entity_main,
  -- Select specific columns based on entities/sites.ts
  COALESCE(jsonb_build_object('id', a.id, 'name', a.name, 'region', jsonb_build_object('id', r.id, 'name', r.name)), '{}'::jsonb) AS related_area,
  COALESCE(jsonb_agg(DISTINCT to_jsonb(e.*)) FILTER (WHERE e.id IS NOT NULL), '[]'::jsonb) AS related_encounters,
  COALESCE(jsonb_agg(DISTINCT to_jsonb(sec.*)) FILTER (WHERE sec.id IS NOT NULL), '[]'::jsonb) AS related_secrets,
  COALESCE(jsonb_agg(DISTINCT to_jsonb(i.*)) FILTER (WHERE i.id IS NOT NULL), '[]'::jsonb) AS related_items,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('npc', jsonb_build_object('id', n.id, 'name', n.name))) FILTER (WHERE n.id IS NOT NULL), '[]'::jsonb) AS related_npcs,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relation', to_jsonb(sr.*), 'sourceSite', jsonb_build_object('id', ss.id, 'name', ss.name))) FILTER (WHERE sr.id IS NOT NULL AND ss.id IS NOT NULL), '[]'::jsonb) AS related_incoming_relations,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relation', to_jsonb(tr.*), 'targetSite', jsonb_build_object('id', ts.id, 'name', ts.name))) FILTER (WHERE tr.id IS NOT NULL AND ts.id IS NOT NULL), '[]'::jsonb) AS related_outgoing_relations,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('control', to_jsonb(ftc.*), 'faction', jsonb_build_object('id', f.id, 'name', f.name))) FILTER (WHERE ftc.id IS NOT NULL), '[]'::jsonb) AS related_territorial_control
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
  items i ON i.site_id = s.id
LEFT JOIN
  npc_sites ns ON ns.site_id = s.id
LEFT JOIN
  npcs n ON n.id = ns.npc_id
LEFT JOIN
  site_links sr ON sr.site_id = s.id
LEFT JOIN
  sites ss ON ss.id = sr.other_site_id
LEFT JOIN
  site_links tr ON tr.other_site_id = s.id
LEFT JOIN
  sites ts ON ts.id = tr.site_id
LEFT JOIN
  faction_territorial_control ftc ON ftc.site_id = s.id
LEFT JOIN
  factions f ON ftc.faction_id = f.id
GROUP BY
  s.id, a.id, r.id;

-- View for aggregating area data for the search index
CREATE OR REPLACE VIEW area_search_data_view AS
SELECT
  a.id,
  a.name,
  'areas' AS source_table,
  to_jsonb(a.*) AS entity_main,
  -- Select specific columns based on entities/areas.ts
  COALESCE(jsonb_build_object('id', r.id, 'name', r.name), '{}'::jsonb) AS related_region,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', s.id, 'name', s.name, 'siteType', s.site_type)) FILTER (WHERE s.id IS NOT NULL), '[]'::jsonb) AS related_sites,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('control', to_jsonb(ftc.*), 'faction', jsonb_build_object('id', f.id, 'name', f.name))) FILTER (WHERE ftc.id IS NOT NULL), '[]'::jsonb) AS related_territorial_control,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', wc.id, 'name', wc.name)) FILTER (WHERE wc.id IS NOT NULL), '[]'::jsonb) AS related_world_changes
FROM
  areas a
LEFT JOIN
  regions r ON a.region_id = r.id
LEFT JOIN
  sites s ON s.area_id = a.id
LEFT JOIN
  faction_territorial_control ftc ON ftc.area_id = a.id
LEFT JOIN
  factions f ON ftc.faction_id = f.id
LEFT JOIN
  world_state_changes wc ON wc.area_id = a.id
GROUP BY
  a.id, r.id;

-- View for aggregating conflict data for the search index
CREATE OR REPLACE VIEW conflict_search_data_view AS
SELECT
  mc.id,
  mc.name,
  'conflicts' AS source_table,
  to_jsonb(mc.*) AS entity_main,
  -- Select specific columns based on entities/conflicts.ts
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', wc.id, 'name', wc.name)) FILTER (WHERE wc.id IS NOT NULL), '[]'::jsonb) AS related_world_changes,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('participant', to_jsonb(mcp.*), 'faction', jsonb_build_object('id', f.id, 'name', f.name))) FILTER (WHERE mcp.id IS NOT NULL), '[]'::jsonb) AS related_participants,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('progression', to_jsonb(mcpn.*), 'quest', jsonb_build_object('id', q.id, 'name', q.name))) FILTER (WHERE mcpn.id IS NOT NULL), '[]'::jsonb) AS related_progression,
  COALESCE(jsonb_build_object('id', r.id, 'name', r.name), '{}'::jsonb) AS related_primary_region
FROM
  major_conflicts mc
LEFT JOIN
  world_state_changes wc ON wc.conflict_id = mc.id
LEFT JOIN
  conflict_participants mcp ON mcp.conflict_id = mc.id
LEFT JOIN
  factions f ON mcp.faction_id = f.id
LEFT JOIN
  conflict_progression mcpn ON mcpn.conflict_id = mc.id
LEFT JOIN
  quests q ON mcpn.quest_id = q.id
LEFT JOIN
  regions r ON mc.primary_region_id = r.id
GROUP BY
  mc.id, r.id;


-- View for aggregating faction data for the search index
CREATE OR REPLACE VIEW faction_search_data_view AS
SELECT
  f.id,
  f.name,
  'factions' AS source_table,
  to_jsonb(f.*) AS entity_main,
  -- Select specific columns based on entities/factions.ts
  COALESCE(to_jsonb(fc.*), '{}'::jsonb) AS related_culture,
  COALESCE(jsonb_agg(DISTINCT to_jsonb(fa.*)) FILTER (WHERE fa.id IS NOT NULL), '[]'::jsonb) AS related_agendas,
  COALESCE(jsonb_agg(DISTINCT to_jsonb(fcl.*)) FILTER (WHERE fcl.id IS NOT NULL), '[]'::jsonb) AS related_clues,
  COALESCE(jsonb_agg(DISTINCT to_jsonb(mcp.*)) FILTER (WHERE mcp.id IS NOT NULL), '[]'::jsonb) AS related_conflicts,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', wc.id, 'name', wc.name)) FILTER (WHERE wc.id IS NOT NULL), '[]'::jsonb) AS related_world_changes,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('membership', to_jsonb(fm.*), 'npc', jsonb_build_object('id', n.id, 'name', n.name))) FILTER (WHERE fm.id IS NOT NULL), '[]'::jsonb) AS related_members,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('hq', to_jsonb(fh.*), 'site', jsonb_build_object('id', s.id, 'name', s.name))) FILTER (WHERE fh.id IS NOT NULL), '[]'::jsonb) AS related_headquarters,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('quest_relation', to_jsonb(fq.*), 'quest', jsonb_build_object('id', q.id, 'name', q.name))) FILTER (WHERE fq.id IS NOT NULL), '[]'::jsonb) AS related_quests,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relation', to_jsonb(fr_in.*), 'sourceFaction', jsonb_build_object('id', sf.id, 'name', sf.name))) FILTER (WHERE fr_in.id IS NOT NULL), '[]'::jsonb) AS related_incoming_relationships,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relation', to_jsonb(fr_out.*), 'targetFaction', jsonb_build_object('id', tf.id, 'name', tf.name))) FILTER (WHERE fr_out.id IS NOT NULL), '[]'::jsonb) AS related_outgoing_relationships,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
      'control', to_jsonb(ftc.*),
      'region', jsonb_build_object('id', r.id, 'name', r.name),
      'area', jsonb_build_object('id', a.id, 'name', a.name),
      'site', jsonb_build_object('id', site_tc.id, 'name', site_tc.name)
    )) FILTER (WHERE ftc.id IS NOT NULL), '[]'::jsonb) AS related_territorial_control
FROM
  factions f
LEFT JOIN faction_culture fc ON f.id = fc.faction_id
LEFT JOIN faction_agendas fa ON fa.faction_id = f.id
LEFT JOIN clues fcl ON fcl.faction_id = f.id
LEFT JOIN conflict_participants mcp ON mcp.faction_id = f.id
LEFT JOIN world_state_changes wc ON wc.faction_id = f.id
LEFT JOIN npc_factions fm ON fm.faction_id = f.id
LEFT JOIN npcs n ON fm.npc_id = n.id
LEFT JOIN faction_headquarters fh ON fh.faction_id = f.id
LEFT JOIN sites s ON fh.site_id = s.id
LEFT JOIN faction_quest_involvement fq ON fq.faction_id = f.id
LEFT JOIN quests q ON fq.quest_id = q.id
LEFT JOIN faction_diplomacy fr_in ON fr_in.other_faction_id = f.id
LEFT JOIN factions sf ON fr_in.faction_id = sf.id
LEFT JOIN faction_diplomacy fr_out ON fr_out.faction_id = f.id
LEFT JOIN factions tf ON fr_out.other_faction_id = tf.id
LEFT JOIN faction_territorial_control ftc ON ftc.faction_id = f.id
LEFT JOIN regions r ON ftc.region_id = r.id
LEFT JOIN areas a ON ftc.area_id = a.id
LEFT JOIN sites site_tc ON ftc.site_id = site_tc.id
GROUP BY
  f.id, fc.id;

-- View for aggregating foreshadowing data for the search index
CREATE OR REPLACE VIEW foreshadowing_search_data_view AS
SELECT
  nf.id,
  nf.name,
  'foreshadowing' AS source_table,
  to_jsonb(nf.*) AS entity_main,
  -- Select specific columns based on entities/foreshadowing.ts
  COALESCE(jsonb_build_object('stage', jsonb_build_object('id', qs.id, 'name', qs.name), 'quest', jsonb_build_object('id', q_source.id, 'name', q_source.name)), '{}'::jsonb) AS related_source_stage,
  COALESCE(jsonb_build_object('id', s_source.id, 'name', s_source.name), '{}'::jsonb) AS related_source_site,
  COALESCE(jsonb_build_object('id', n_source.id, 'name', n_source.name), '{}'::jsonb) AS related_source_npc,
  COALESCE(jsonb_build_object('id', f_source.id, 'name', f_source.name), '{}'::jsonb) AS related_source_faction,
  COALESCE(jsonb_build_object('id', q_target.id, 'name', q_target.name), '{}'::jsonb) AS related_target_quest,
  COALESCE(jsonb_build_object('id', qt.id, 'twistType', qt.twist_type), '{}'::jsonb) AS related_target_twist,
  COALESCE(jsonb_build_object('id', n_target.id, 'name', n_target.name), '{}'::jsonb) AS related_target_npc,
  COALESCE(jsonb_build_object('id', na.id, 'name', na.name), '{}'::jsonb) AS related_target_arc
FROM
  narrative_foreshadowing nf
LEFT JOIN quest_stages qs ON nf.quest_stage_id = qs.id
LEFT JOIN quests q_source ON qs.quest_id = q_source.id
LEFT JOIN sites s_source ON nf.site_id = s_source.id
LEFT JOIN npcs n_source ON nf.npc_id = n_source.id
LEFT JOIN factions f_source ON nf.faction_id = f_source.id
LEFT JOIN quests q_target ON nf.foreshadows_quest_id = q_target.id
LEFT JOIN quest_twists qt ON nf.foreshadows_twist_id = qt.id
LEFT JOIN npcs n_target ON nf.npc_id = n_target.id
LEFT JOIN narrative_arcs na ON nf.foreshadows_arc_id = na.id
GROUP BY
  nf.id, qs.id, q_source.id, s_source.id, n_source.id, f_source.id, q_target.id, qt.id, n_target.id, na.id;

-- View for aggregating narrative arc data for the search index
CREATE OR REPLACE VIEW narrative_arc_search_data_view AS
SELECT
  na.id,
  'narrative_arcs' AS source_table,
  to_jsonb(na.*) AS entity_main,
  -- Select specific columns based on entities/narrative.ts
  COALESCE(jsonb_agg(DISTINCT to_jsonb(nf.*)) FILTER (WHERE nf.id IS NOT NULL), '[]'::jsonb) AS related_foreshadowing,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', wc.id, 'name', wc.name)) FILTER (WHERE wc.id IS NOT NULL), '[]'::jsonb) AS related_world_changes,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('membership', to_jsonb(nam.*), 'quest', jsonb_build_object('id', q.id, 'name', q.name))) FILTER (WHERE nam.id IS NOT NULL), '[]'::jsonb) AS related_members
FROM
  narrative_arcs na
LEFT JOIN narrative_foreshadowing nf ON nf.foreshadows_arc_id = na.id
LEFT JOIN world_state_changes wc ON wc.arc_id = na.id
LEFT JOIN arc_membership nam ON nam.arc_id = na.id -- Assuming table name
LEFT JOIN quests q ON nam.quest_id = q.id -- Assuming relation
GROUP BY
  na.id;

-- View for aggregating NPC data for the search index
CREATE OR REPLACE VIEW npc_search_data_view AS
SELECT
  n.id,
  n.name,
  'npcs' AS source_table,
  to_jsonb(n.*) AS entity_main,
  -- Select specific columns based on entities/npcs.ts
  COALESCE(jsonb_agg(DISTINCT to_jsonb(i.*)) FILTER (WHERE i.id IS NOT NULL), '[]'::jsonb) AS related_items,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('membership', to_jsonb(fm.*), 'faction', jsonb_build_object('id', f.id, 'name', f.name))) FILTER (WHERE fm.id IS NOT NULL), '[]'::jsonb) AS related_factions,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('quest_relation', to_jsonb(nqr.*), 'quest', jsonb_build_object('id', q.id, 'name', q.name))) FILTER (WHERE nqr.id IS NOT NULL), '[]'::jsonb) AS related_quests,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relation', to_jsonb(nr_in.*), 'sourceNpc', jsonb_build_object('id', sn.id, 'name', sn.name))) FILTER (WHERE nr_in.id IS NOT NULL), '[]'::jsonb) AS related_incoming_relationships,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relation', to_jsonb(nr_out.*), 'targetNpc', jsonb_build_object('id', tn.id, 'name', tn.name))) FILTER (WHERE nr_out.id IS NOT NULL), '[]'::jsonb) AS related_outgoing_relationships,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('clue', to_jsonb(nc.*), 'stage', jsonb_build_object('id', qs.id, 'name', qs.name, 'quest', jsonb_build_object('id', q_clue.id, 'name', q_clue.name)))) FILTER (WHERE nc.id IS NOT NULL), '[]'::jsonb) AS related_clues,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('site_relation', to_jsonb(ns.*), 'site', jsonb_build_object('id', s.id, 'name', s.name, 'area', jsonb_build_object('id', a.id, 'name', a.name, 'region', jsonb_build_object('id', r.id, 'name', r.name))))) FILTER (WHERE ns.id IS NOT NULL), '[]'::jsonb) AS related_sites,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('hook_relation', to_jsonb(nqh.*), 'hook', jsonb_build_object('hook', to_jsonb(qh.*), 'quest', jsonb_build_object('id', q_hook.id, 'name', q_hook.name), 'stage', jsonb_build_object('id', qs_hook.id, 'name', qs_hook.name)))) FILTER (WHERE nqh.id IS NOT NULL), '[]'::jsonb) AS related_quest_hooks
FROM
  npcs n
LEFT JOIN items i ON i.npc_id = n.id
LEFT JOIN npc_factions fm ON fm.npc_id = n.id
LEFT JOIN factions f ON fm.faction_id = f.id
LEFT JOIN npc_quest_roles nqr ON nqr.npc_id = n.id
LEFT JOIN quests q ON nqr.quest_id = q.id
LEFT JOIN character_relationships nr_in ON nr_in.related_npc_id = n.id
LEFT JOIN npcs sn ON nr_in.id = sn.id
LEFT JOIN character_relationships nr_out ON nr_out.id = n.id
LEFT JOIN npcs tn ON nr_out.related_npc_id = tn.id
LEFT JOIN clues nc ON nc.npc_id = n.id
LEFT JOIN quest_stages qs ON nc.quest_stage_id = qs.id
LEFT JOIN quests q_clue ON qs.quest_id = q_clue.id
LEFT JOIN npc_sites ns ON ns.npc_id = n.id
LEFT JOIN sites s ON ns.site_id = s.id
LEFT JOIN areas a ON s.area_id = a.id
LEFT JOIN regions r ON a.region_id = r.id
LEFT JOIN quest_hook_npcs nqh ON nqh.npc_id = n.id
LEFT JOIN quest_introductions qh ON nqh.hook_id = qh.id
LEFT JOIN quest_stages qs_hook ON qh.stage_id = qs_hook.id
LEFT JOIN quests q_hook ON qs_hook.quest_id = q_hook.id
GROUP BY
  n.id;

-- View for aggregating quest data for the search index
CREATE OR REPLACE VIEW quest_search_data_view AS
SELECT
  q.id,
  q.name,
  'quests' AS source_table,
  to_jsonb(q.*) AS entity_main,
  -- Select specific columns based on entities/quests.ts
  COALESCE(jsonb_agg(DISTINCT to_jsonb(i.*)) FILTER (WHERE i.id IS NOT NULL), '[]'::jsonb) AS related_items,
  COALESCE(jsonb_agg(DISTINCT to_jsonb(quc.*)) FILTER (WHERE quc.id IS NOT NULL), '[]'::jsonb) AS related_unlock_conditions,
  COALESCE(jsonb_agg(DISTINCT to_jsonb(qt.*)) FILTER (WHERE qt.id IS NOT NULL), '[]'::jsonb) AS related_twists,
  COALESCE(jsonb_agg(DISTINCT to_jsonb(qft.*)) FILTER (WHERE qft.id IS NOT NULL), '[]'::jsonb) AS related_future_triggers,
  COALESCE(jsonb_build_object('id', r.id, 'name', r.name), '{}'::jsonb) AS related_region,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', qs.id, 'name', qs.name)) FILTER (WHERE qs.id IS NOT NULL), '[]'::jsonb) AS related_stages,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', wc.id, 'name', wc.name)) FILTER (WHERE wc.id IS NOT NULL), '[]'::jsonb) AS related_world_changes,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relation', to_jsonb(qr_in.*), 'sourceQuest', jsonb_build_object('id', sq.id, 'name', sq.name))) FILTER (WHERE qr_in.id IS NOT NULL), '[]'::jsonb) AS related_incoming_relations,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relation', to_jsonb(qr_out.*), 'targetQuest', jsonb_build_object('id', tq.id, 'name', tq.name))) FILTER (WHERE qr_out.id IS NOT NULL), '[]'::jsonb) AS related_outgoing_relations,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('faction_relation', to_jsonb(fq.*), 'faction', jsonb_build_object('id', f.id, 'name', f.name))) FILTER (WHERE fq.id IS NOT NULL), '[]'::jsonb) AS related_factions,
  COALESCE(jsonb_agg(DISTINCT jsonb_build_object('npc_relation', to_jsonb(nqr.*), 'npc', jsonb_build_object('id', n.id, 'name', n.name))) FILTER (WHERE nqr.id IS NOT NULL), '[]'::jsonb) AS related_npcs
FROM
  quests q
LEFT JOIN items i ON i.quest_id = q.id
LEFT JOIN quest_unlock_conditions quc ON quc.quest_id = q.id
LEFT JOIN quest_twists qt ON qt.quest_id = q.id
LEFT JOIN quest_unlock_conditions qft ON qft.quest_id = q.id
LEFT JOIN regions r ON q.region_id = r.id
LEFT JOIN quest_stages qs ON qs.quest_id = q.id
LEFT JOIN world_state_changes wc ON wc.id = q.id OR wc.future_quest_id = q.id
LEFT JOIN quest_dependencies qr_in ON qr_in.related_quest_id = q.id
LEFT JOIN quests sq ON qr_in.id = sq.id
LEFT JOIN quest_dependencies qr_out ON qr_out.id = q.id
LEFT JOIN quests tq ON qr_out.related_quest_id = tq.id
LEFT JOIN faction_quest_involvement fq ON fq.quest_id = q.id
LEFT JOIN factions f ON fq.faction_id = f.id
LEFT JOIN npc_quest_roles nqr ON nqr.quest_id = q.id
LEFT JOIN npcs n ON nqr.npc_id = n.id
GROUP BY
  q.id, r.id;

-- View for aggregating world change data for the search index
CREATE OR REPLACE VIEW world_change_search_data_view AS
SELECT
  wc.id,
  wc.name,
  'world_changes' AS source_table,
  to_jsonb(wc.*) AS entity_main,
  -- Select specific columns based on entities/world.ts
  COALESCE(jsonb_build_object('id', q_source.id, 'name', q_source.name), '{}'::jsonb) AS related_source_quest,
  COALESCE(jsonb_build_object('id', qd.id, 'name', qd.name), '{}'::jsonb) AS related_source_decision,
  COALESCE(jsonb_build_object('id', mc.id, 'name', mc.name), '{}'::jsonb) AS related_source_conflict,
  COALESCE(jsonb_build_object('id', na.id, 'name', na.name), '{}'::jsonb) AS related_arc,
  COALESCE(jsonb_build_object('id', f.id, 'name', f.name), '{}'::jsonb) AS related_affected_faction,
  COALESCE(jsonb_build_object('id', r.id, 'name', r.name), '{}'::jsonb) AS related_affected_region,
  COALESCE(jsonb_build_object('id', a.id, 'name', a.name), '{}'::jsonb) AS related_affected_area,
  COALESCE(jsonb_build_object('id', s.id, 'name', s.name), '{}'::jsonb) AS related_affected_site,
  COALESCE(jsonb_build_object('id', n.id, 'name', n.name), '{}'::jsonb) AS related_affected_npc,
  COALESCE(jsonb_build_object('id', q_leads.id, 'name', q_leads.name), '{}'::jsonb) AS related_leads_to_quest
FROM
  world_state_changes wc
LEFT JOIN quests q_source ON wc.quest_id = q_source.id
LEFT JOIN stage_decisions qd ON wc.decision_id = qd.id
LEFT JOIN major_conflicts mc ON wc.conflict_id = mc.id
LEFT JOIN narrative_arcs na ON wc.arc_id = na.id
LEFT JOIN factions f ON wc.faction_id = f.id
LEFT JOIN regions r ON wc.region_id = r.id
LEFT JOIN areas a ON wc.area_id = a.id
LEFT JOIN sites s ON wc.site_id = s.id
LEFT JOIN npcs n ON wc.npc_id = n.id
LEFT JOIN quests q_leads ON wc.quest_id = q_leads.id
GROUP BY
  wc.id, q_source.id, qd.id, mc.id, na.id, f.id, r.id, a.id, s.id, n.id, q_leads.id;
-- Step 4: Create the Materialized View using the individual entity views

CREATE OR REPLACE FUNCTION fuzzy_word_match_score(
  content TEXT,
  search_term TEXT,
  similarity_threshold DOUBLE PRECISION DEFAULT 0.3,
  max_levenshtein_distance INTEGER DEFAULT 2,
  phonetic_strength INTEGER DEFAULT 4
)
RETURNS TABLE (
  match_methods TEXT[],
  fuzzy_score DOUBLE PRECISION
) AS $$
DECLARE
  word TEXT;
  word_list TEXT[];
  normalized_term TEXT;
  matchers TEXT[] := '{}';
  score DOUBLE PRECISION := 0;
  best_similarity DOUBLE PRECISION := 0;
BEGIN
  IF length(search_term) < 3 THEN
    IF content ILIKE '%' || search_term || '%' THEN
      RETURN QUERY SELECT ARRAY['short_literal'], 1.0;
    ELSE
      RETURN QUERY SELECT ARRAY[]::TEXT[], 0.0;
    END IF;
  END IF;

  normalized_term := lower(trim(search_term));
  word_list := regexp_split_to_array(lower(content), E'[\\s\\.,;:!?\\-\\(\\)\\[\\]\\{\\}]+');

  FOREACH word IN ARRAY word_list LOOP
    IF length(word) >= 3 THEN
      IF word = normalized_term THEN
        matchers := array_append(matchers, 'exact');
        score := score + 2.0;
      END IF;
      IF word LIKE normalized_term || '%' THEN
        matchers := array_append(matchers, 'prefix');
        score := score + 0.5;
      END IF;
      IF word LIKE '%' || normalized_term THEN
        matchers := array_append(matchers, 'suffix');
        score := score + 0.5;
      END IF;
      IF similarity(word, normalized_term) > similarity_threshold THEN
        matchers := array_append(matchers, 'similarity');
        best_similarity := GREATEST(best_similarity, similarity(word, normalized_term));
      END IF;
      IF levenshtein(word, normalized_term) <= max_levenshtein_distance THEN
        matchers := array_append(matchers, 'levenshtein');
        score := score + 1.0;
      END IF;
      IF metaphone(word, phonetic_strength) = metaphone(normalized_term, phonetic_strength) THEN
        matchers := array_append(matchers, 'metaphone');
        score := score + 0.5;
      END IF;
      IF word % normalized_term THEN
        matchers := array_append(matchers, 'trigram');
        score := score + 0.5;
      END IF;
    END IF;
  END LOOP;

  -- Combine weighted match score with best similarity
  score := score + best_similarity;

  RETURN QUERY SELECT (SELECT ARRAY(SELECT DISTINCT unnest(matchers))), score;
END;
$$ LANGUAGE plpgsql IMMUTABLE STRICT;

CREATE OR REPLACE FUNCTION search_fuzzy_combined(
  search_term TEXT,
  fuzzy_weight DOUBLE PRECISION DEFAULT 0.01,
  threshold DOUBLE PRECISION DEFAULT 0.25,
  max_levenshtein INT DEFAULT 2,
  metaphone_strength INT DEFAULT 4
)
RETURNS TABLE (
  id INTEGER,
  name TEXT,
  source_table TEXT,
  raw_data JSONB,
  fts_score DOUBLE PRECISION,
  fuzzy_score DOUBLE PRECISION,
  match_methods TEXT[],
  final_score DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  WITH
  fts AS (
    SELECT
      s.id,
      s.name,
      s.source_table,
      s.raw_data,
      CAST(ts_rank_cd(s.content_tsv, plainto_tsquery('english', search_term)) AS DOUBLE PRECISION) AS fts_score
    FROM search_index s
    WHERE s.content_tsv @@ plainto_tsquery('english', search_term)
  ),
  fuzzy_raw AS (
    SELECT
      s.id,
      s.name,
      s.source_table,
      s.raw_data,
      f.match_methods,
      f.fuzzy_score
    FROM search_index s,
         LATERAL fuzzy_word_match_score(
           s.content,
           search_term,
           threshold,
           max_levenshtein,
           metaphone_strength
         ) AS f(match_methods, fuzzy_score)
  )
  SELECT
    COALESCE(fts.id, fuzzy_raw.id)::INTEGER AS id,
    COALESCE(fts.name, fuzzy_raw.name)::TEXT AS name,
    COALESCE(fts.source_table, fuzzy_raw.source_table)::TEXT AS source_table,
    COALESCE(fts.raw_data, fuzzy_raw.raw_data)::JSONB AS raw_data,
    fts.fts_score,
    CASE WHEN cardinality(fuzzy_raw.match_methods) > 0 THEN fuzzy_raw.fuzzy_score ELSE NULL END AS fuzzy_score,
    CASE WHEN cardinality(fuzzy_raw.match_methods) > 0 THEN fuzzy_raw.match_methods ELSE NULL END AS match_methods,
    (COALESCE(fts.fts_score, 0) + COALESCE(fuzzy_raw.fuzzy_score, 0) * fuzzy_weight) AS final_score
  FROM fts
  FULL OUTER JOIN fuzzy_raw
    ON fts.id = fuzzy_raw.id AND fts.source_table = fuzzy_raw.source_table
  WHERE fuzzy_raw.match_methods IS NOT NULL OR fts.fts_score IS NOT NULL
  ORDER BY final_score DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql STABLE;