-- View for aggregating conflict data for the search index
CREATE OR REPLACE VIEW conflict_search_data_view AS
SELECT
  mc.id,
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
