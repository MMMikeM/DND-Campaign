-- View for aggregating NPC data for the search index
CREATE OR REPLACE VIEW npc_search_data_view AS
SELECT
  n.id,
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
