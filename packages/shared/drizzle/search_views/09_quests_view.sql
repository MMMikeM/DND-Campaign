-- View for aggregating quest data for the search index
CREATE OR REPLACE VIEW quest_search_data_view AS
SELECT
  q.id,
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
