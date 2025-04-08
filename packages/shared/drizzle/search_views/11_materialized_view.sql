-- Step 4: Create the Materialized View using the individual entity views

CREATE MATERIALIZED VIEW search_index AS

-- Select and process data from region_search_data_view
SELECT
  id::text,
  source_table,
  jsonb_build_object(
    'region', entity_main,
    'areas', related_areas,
    'quests', related_quests,
    'territorialControl', related_territorial_control,
    'connections', related_connections
  ) AS raw_data,
  jsonb_deep_text_values(entity_main) || ' ' ||
  jsonb_deep_text_values(jsonb_build_object(
    'areas', related_areas,
    'quests', related_quests,
    'territorialControl', related_territorial_control,
    'connections', related_connections
  )) AS content,
  weighted_search_vector(
    entity_main,
    jsonb_build_object(
      'areas', related_areas,
      'quests', related_quests,
      'territorialControl', related_territorial_control,
      'connections', related_connections
    )
    -- Add text search config argument if needed: , 'public.english_unaccent'
  ) AS content_tsv
FROM region_search_data_view

UNION ALL

-- Select and process data from site_search_data_view
SELECT
  id::text,
  source_table,
  jsonb_build_object(
    'site', entity_main,
    'area', related_area,
    'encounters', related_encounters,
    'secrets', related_secrets,
    'items', related_items,
    'npcs', related_npcs,
    'incomingRelations', related_incoming_relations,
    'outgoingRelations', related_outgoing_relations,
    'territorialControl', related_territorial_control
  ) AS raw_data,
  jsonb_deep_text_values(entity_main) || ' ' ||
  jsonb_deep_text_values(jsonb_build_object(
    'area', related_area,
    'encounters', related_encounters,
    'secrets', related_secrets,
    'items', related_items,
    'npcs', related_npcs,
    'incomingRelations', related_incoming_relations,
    'outgoingRelations', related_outgoing_relations,
    'territorialControl', related_territorial_control
  )) AS content,
  weighted_search_vector(
    entity_main,
    jsonb_build_object(
      'area', related_area,
      'encounters', related_encounters,
      'secrets', related_secrets,
      'items', related_items,
      'npcs', related_npcs,
      'incomingRelations', related_incoming_relations,
      'outgoingRelations', related_outgoing_relations,
      'territorialControl', related_territorial_control
    )
  ) AS content_tsv
FROM site_search_data_view

UNION ALL

-- Select and process data from area_search_data_view
SELECT
  id::text,
  source_table,
  jsonb_build_object(
    'area', entity_main,
    'region', related_region,
    'sites', related_sites,
    'territorialControl', related_territorial_control,
    'worldChanges', related_world_changes
  ) AS raw_data,
  jsonb_deep_text_values(entity_main) || ' ' ||
  jsonb_deep_text_values(jsonb_build_object(
    'region', related_region,
    'sites', related_sites,
    'territorialControl', related_territorial_control,
    'worldChanges', related_world_changes
  )) AS content,
  weighted_search_vector(
    entity_main,
    jsonb_build_object(
      'region', related_region,
      'sites', related_sites,
      'territorialControl', related_territorial_control,
      'worldChanges', related_world_changes
    )
  ) AS content_tsv
FROM area_search_data_view

UNION ALL

-- Select and process data from conflict_search_data_view
SELECT
  id::text,
  source_table,
  jsonb_build_object(
    'conflict', entity_main,
    'worldChanges', related_world_changes,
    'participants', related_participants,
    'progression', related_progression,
    'primaryRegion', related_primary_region
  ) AS raw_data,
  jsonb_deep_text_values(entity_main) || ' ' ||
  jsonb_deep_text_values(jsonb_build_object(
    'worldChanges', related_world_changes,
    'participants', related_participants,
    'progression', related_progression,
    'primaryRegion', related_primary_region
  )) AS content,
  weighted_search_vector(
    entity_main,
    jsonb_build_object(
      'worldChanges', related_world_changes,
      'participants', related_participants,
      'progression', related_progression,
      'primaryRegion', related_primary_region
    )
  ) AS content_tsv
FROM conflict_search_data_view

UNION ALL

-- Select and process data from faction_search_data_view
SELECT
  id::text,
  source_table,
  jsonb_build_object(
    'faction', entity_main,
    'culture', related_culture,
    'agendas', related_agendas,
    'clues', related_clues,
    'conflicts', related_conflicts,
    'worldChanges', related_world_changes,
    'members', related_members,
    'headquarters', related_headquarters,
    'relatedQuests', related_quests,
    'incomingRelationships', related_incoming_relationships,
    'outgoingRelationships', related_outgoing_relationships,
    'territorialControl', related_territorial_control
  ) AS raw_data,
  jsonb_deep_text_values(entity_main) || ' ' ||
  jsonb_deep_text_values(jsonb_build_object(
    'culture', related_culture,
    'agendas', related_agendas,
    'clues', related_clues,
    'conflicts', related_conflicts,
    'worldChanges', related_world_changes,
    'members', related_members,
    'headquarters', related_headquarters,
    'relatedQuests', related_quests,
    'incomingRelationships', related_incoming_relationships,
    'outgoingRelationships', related_outgoing_relationships,
    'territorialControl', related_territorial_control
  )) AS content,
  weighted_search_vector(
    entity_main,
    jsonb_build_object(
      'culture', related_culture,
      'agendas', related_agendas,
      'clues', related_clues,
      'conflicts', related_conflicts,
      'worldChanges', related_world_changes,
      'members', related_members,
      'headquarters', related_headquarters,
      'relatedQuests', related_quests,
      'incomingRelationships', related_incoming_relationships,
      'outgoingRelationships', related_outgoing_relationships,
      'territorialControl', related_territorial_control
    )
  ) AS content_tsv
FROM faction_search_data_view

UNION ALL

-- Select and process data from foreshadowing_search_data_view
SELECT
  id::text,
  source_table,
  jsonb_build_object(
    'foreshadowing', entity_main,
    'sourceStage', related_source_stage,
    'sourceSite', related_source_site,
    'sourceNpc', related_source_npc,
    'sourceFaction', related_source_faction,
    'targetQuest', related_target_quest,
    'targetTwist', related_target_twist,
    'targetNpc', related_target_npc,
    'targetArc', related_target_arc
  ) AS raw_data,
  jsonb_deep_text_values(entity_main) || ' ' ||
  jsonb_deep_text_values(jsonb_build_object(
    'sourceStage', related_source_stage,
    'sourceSite', related_source_site,
    'sourceNpc', related_source_npc,
    'sourceFaction', related_source_faction,
    'targetQuest', related_target_quest,
    'targetTwist', related_target_twist,
    'targetNpc', related_target_npc,
    'targetArc', related_target_arc
  )) AS content,
  weighted_search_vector(
    entity_main,
    jsonb_build_object(
      'sourceStage', related_source_stage,
      'sourceSite', related_source_site,
      'sourceNpc', related_source_npc,
      'sourceFaction', related_source_faction,
      'targetQuest', related_target_quest,
      'targetTwist', related_target_twist,
      'targetNpc', related_target_npc,
      'targetArc', related_target_arc
    )
  ) AS content_tsv
FROM foreshadowing_search_data_view

UNION ALL

-- Select and process data from narrative_arc_search_data_view
SELECT
  id::text,
  source_table,
  jsonb_build_object(
    'narrativeArc', entity_main,
    'foreshadowing', related_foreshadowing,
    'worldChanges', related_world_changes,
    'members', related_members
  ) AS raw_data,
  jsonb_deep_text_values(entity_main) || ' ' ||
  jsonb_deep_text_values(jsonb_build_object(
    'foreshadowing', related_foreshadowing,
    'worldChanges', related_world_changes,
    'members', related_members
  )) AS content,
  weighted_search_vector(
    entity_main,
    jsonb_build_object(
      'foreshadowing', related_foreshadowing,
      'worldChanges', related_world_changes,
      'members', related_members
    )
  ) AS content_tsv
FROM narrative_arc_search_data_view

UNION ALL

-- Select and process data from npc_search_data_view
SELECT
  id::text,
  source_table,
  jsonb_build_object(
    'npc', entity_main,
    'relatedItems', related_items,
    'relatedFactions', related_factions,
    'relatedQuests', related_quests,
    'incomingRelationships', related_incoming_relationships,
    'outgoingRelationships', related_outgoing_relationships,
    'relatedClues', related_clues,
    'relatedSites', related_sites,
    'relatedQuestHooks', related_quest_hooks
  ) AS raw_data,
  jsonb_deep_text_values(entity_main) || ' ' ||
  jsonb_deep_text_values(jsonb_build_object(
    'relatedItems', related_items,
    'relatedFactions', related_factions,
    'relatedQuests', related_quests,
    'incomingRelationships', related_incoming_relationships,
    'outgoingRelationships', related_outgoing_relationships,
    'relatedClues', related_clues,
    'relatedSites', related_sites,
    'relatedQuestHooks', related_quest_hooks
  )) AS content,
  weighted_search_vector(
    entity_main,
    jsonb_build_object(
      'relatedItems', related_items,
      'relatedFactions', related_factions,
      'relatedQuests', related_quests,
      'incomingRelationships', related_incoming_relationships,
      'outgoingRelationships', related_outgoing_relationships,
      'relatedClues', related_clues,
      'relatedSites', related_sites,
      'relatedQuestHooks', related_quest_hooks
    )
  ) AS content_tsv
FROM npc_search_data_view

UNION ALL

-- Select and process data from quest_search_data_view
SELECT
  id::text,
  source_table,
  jsonb_build_object(
    'quest', entity_main,
    'items', related_items,
    'unlockConditions', related_unlock_conditions,
    'twists', related_twists,
    'futureTriggers', related_future_triggers,
    'region', related_region,
    'stages', related_stages,
    'worldChanges', related_world_changes,
    'incomingRelations', related_incoming_relations,
    'outgoingRelations', related_outgoing_relations,
    'factions', related_factions,
    'npcs', related_npcs
  ) AS raw_data,
  jsonb_deep_text_values(entity_main) || ' ' ||
  jsonb_deep_text_values(jsonb_build_object(
    'items', related_items,
    'unlockConditions', related_unlock_conditions,
    'twists', related_twists,
    'futureTriggers', related_future_triggers,
    'region', related_region,
    'stages', related_stages,
    'worldChanges', related_world_changes,
    'incomingRelations', related_incoming_relations,
    'outgoingRelations', related_outgoing_relations,
    'factions', related_factions,
    'npcs', related_npcs
  )) AS content,
  weighted_search_vector(
    entity_main,
    jsonb_build_object(
      'items', related_items,
      'unlockConditions', related_unlock_conditions,
      'twists', related_twists,
      'futureTriggers', related_future_triggers,
      'region', related_region,
      'stages', related_stages,
      'worldChanges', related_world_changes,
      'incomingRelations', related_incoming_relations,
      'outgoingRelations', related_outgoing_relations,
      'factions', related_factions,
      'npcs', related_npcs
    )
  ) AS content_tsv
FROM quest_search_data_view

UNION ALL

-- Select and process data from world_change_search_data_view
SELECT
  id::text,
  source_table,
  jsonb_build_object(
    'worldChange', entity_main,
    'sourceQuest', related_source_quest,
    'sourceDecision', related_source_decision,
    'sourceConflict', related_source_conflict,
    'relatedArc', related_arc,
    'affectedFaction', related_affected_faction,
    'affectedRegion', related_affected_region,
    'affectedArea', related_affected_area,
    'affectedSite', related_affected_site,
    'affectedNpc', related_affected_npc,
    'leadsToQuest', related_leads_to_quest
  ) AS raw_data,
  jsonb_deep_text_values(entity_main) || ' ' ||
  jsonb_deep_text_values(jsonb_build_object(
    'sourceQuest', related_source_quest,
    'sourceDecision', related_source_decision,
    'sourceConflict', related_source_conflict,
    'relatedArc', related_arc,
    'affectedFaction', related_affected_faction,
    'affectedRegion', related_affected_region,
    'affectedArea', related_affected_area,
    'affectedSite', related_affected_site,
    'affectedNpc', related_affected_npc,
    'leadsToQuest', related_leads_to_quest
  )) AS content,
  weighted_search_vector(
    entity_main,
    jsonb_build_object(
      'sourceQuest', related_source_quest,
      'sourceDecision', related_source_decision,
      'sourceConflict', related_source_conflict,
      'relatedArc', related_arc,
      'affectedFaction', related_affected_faction,
      'affectedRegion', related_affected_region,
      'affectedArea', related_affected_area,
      'affectedSite', related_affected_site,
      'affectedNpc', related_affected_npc,
      'leadsToQuest', related_leads_to_quest
    )
  ) AS content_tsv
FROM world_change_search_data_view
;
