-- View for aggregating faction data for the search index
CREATE OR REPLACE VIEW faction_search_data_view AS
SELECT
  f.id,
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
