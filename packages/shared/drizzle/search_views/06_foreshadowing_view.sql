-- View for aggregating foreshadowing data for the search index
CREATE OR REPLACE VIEW foreshadowing_search_data_view AS
SELECT
  nf.id,
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
