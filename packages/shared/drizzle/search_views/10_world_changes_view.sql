-- View for aggregating world change data for the search index
CREATE OR REPLACE VIEW world_change_search_data_view AS
SELECT
  wc.id,
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
