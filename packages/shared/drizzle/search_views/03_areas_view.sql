-- View for aggregating area data for the search index
CREATE OR REPLACE VIEW area_search_data_view AS
SELECT
  a.id,
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
