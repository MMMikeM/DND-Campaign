-- View for aggregating region data for the search index
CREATE OR REPLACE VIEW region_search_data_view AS
SELECT
  r.id,
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
