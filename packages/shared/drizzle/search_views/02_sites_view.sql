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
