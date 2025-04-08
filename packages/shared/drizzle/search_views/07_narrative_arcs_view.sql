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
