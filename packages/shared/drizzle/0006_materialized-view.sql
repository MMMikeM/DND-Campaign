CREATE MATERIALIZED VIEW search_index AS

-- Select and process data from region_search_data_view
SELECT
  id::text,
  source_table,
  jsonb_build_object(
    'region', entity_main,
    'areas', related_areas,
    'quests', related_quests,
    'conflicts', related_conflicts,
    'consequences', related_consequences,
    'narrativeDestinations', related_narrative_destinations,
    'factionInfluence', related_faction_influence,
    'worldConceptLinks', related_world_concept_links,
    'connections', related_connections
  ) AS raw_data,
  jsonb_deep_text_values(entity_main) || ' ' ||
  jsonb_deep_text_values(jsonb_build_object(
    'areas', related_areas,
    'quests', related_quests,
    'conflicts', related_conflicts,
    'consequences', related_consequences,
    'narrativeDestinations', related_narrative_destinations,
    'factionInfluence', related_faction_influence,
    'worldConceptLinks', related_world_concept_links,
    'connections', related_connections
  )) AS content,
  weighted_search_vector(
    entity_main,
    jsonb_build_object(
      'areas', related_areas,
      'quests', related_quests,
      'conflicts', related_conflicts,
      'consequences', related_consequences,
      'narrativeDestinations', related_narrative_destinations,
      'factionInfluence', related_faction_influence,
      'worldConceptLinks', related_world_concept_links,
      'connections', related_connections
    )
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
    'npcs', related_npcs,
    'questStages', related_quest_stages,
    'questHooks', related_quest_hooks,
    'consequences', related_consequences,
    'factionHqs', related_faction_hqs,
    'factionInfluence', related_faction_influence,
    'foreshadowingSeeds', related_foreshadowing_seeds,
    'foreshadowingTargets', related_foreshadowing_targets,
    'itemHistory', related_item_history,
    'itemRelationships', related_item_relationships,
    'outgoingRelations', related_outgoing_relations,
    'incomingRelations', related_incoming_relations
  ) AS raw_data,
  jsonb_deep_text_values(entity_main) || ' ' ||
  jsonb_deep_text_values(jsonb_build_object(
    'area', related_area,
    'encounters', related_encounters,
    'secrets', related_secrets,
    'npcs', related_npcs,
    'questStages', related_quest_stages,
    'questHooks', related_quest_hooks,
    'consequences', related_consequences,
    'factionHqs', related_faction_hqs,
    'factionInfluence', related_faction_influence,
    'foreshadowingSeeds', related_foreshadowing_seeds,
    'foreshadowingTargets', related_foreshadowing_targets,
    'itemHistory', related_item_history,
    'itemRelationships', related_item_relationships,
    'outgoingRelations', related_outgoing_relations,
    'incomingRelations', related_incoming_relations
  )) AS content,
  weighted_search_vector(
    entity_main,
    jsonb_build_object(
      'area', related_area,
      'encounters', related_encounters,
      'secrets', related_secrets,
      'npcs', related_npcs,
      'questStages', related_quest_stages,
      'questHooks', related_quest_hooks,
      'consequences', related_consequences,
      'factionHqs', related_faction_hqs,
      'factionInfluence', related_faction_influence,
      'foreshadowingSeeds', related_foreshadowing_seeds,
      'foreshadowingTargets', related_foreshadowing_targets,
      'itemHistory', related_item_history,
      'itemRelationships', related_item_relationships,
      'outgoingRelations', related_outgoing_relations,
      'incomingRelations', related_incoming_relations
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
    'consequences', related_consequences,
    'factionInfluence', related_faction_influence
  ) AS raw_data,
  jsonb_deep_text_values(entity_main) || ' ' ||
  jsonb_deep_text_values(jsonb_build_object(
    'region', related_region,
    'sites', related_sites,
    'consequences', related_consequences,
    'factionInfluence', related_faction_influence
  )) AS content,
  weighted_search_vector(
    entity_main,
    jsonb_build_object(
      'region', related_region,
      'sites', related_sites,
      'consequences', related_consequences,
      'factionInfluence', related_faction_influence
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
    'primaryRegion', related_primary_region,
    'participants', related_participants,
    'consequencesCaused', related_consequences_caused,
    'consequencesAffecting', related_consequences_affecting,
    'narrativeDestinations', related_narrative_destinations,
    'foreshadowingSeeds', related_foreshadowing_seeds,
    'itemRelationships', related_item_relationships,
    'worldConceptLinks', related_world_concept_links
  ) AS raw_data,
  jsonb_deep_text_values(entity_main) || ' ' ||
  jsonb_deep_text_values(jsonb_build_object(
    'primaryRegion', related_primary_region,
    'participants', related_participants,
    'consequencesCaused', related_consequences_caused,
    'consequencesAffecting', related_consequences_affecting,
    'narrativeDestinations', related_narrative_destinations,
    'foreshadowingSeeds', related_foreshadowing_seeds,
    'itemRelationships', related_item_relationships,
    'worldConceptLinks', related_world_concept_links
  )) AS content,
  weighted_search_vector(
    entity_main,
    jsonb_build_object(
      'primaryRegion', related_primary_region,
      'participants', related_participants,
      'consequencesCaused', related_consequences_caused,
      'consequencesAffecting', related_consequences_affecting,
      'narrativeDestinations', related_narrative_destinations,
      'foreshadowingSeeds', related_foreshadowing_seeds,
      'itemRelationships', related_item_relationships,
      'worldConceptLinks', related_world_concept_links
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
    'primaryHq', related_primary_hq,
    'agendas', related_agendas,
    'members', related_members,
    'questHooks', related_quest_hooks,
    'questParticipation', related_quest_participation,
    'influence', related_influence,
    'conflicts', related_conflicts,
    'consequences', related_consequences,
    'destinationInvolvement', related_destination_involvement,
    'foreshadowingSeeds', related_foreshadowing_seeds,
    'itemRelationships', related_item_relationships,
    'worldConceptLinks', related_world_concept_links,
    'incomingRelationships', related_incoming_relationships,
    'outgoingRelationships', related_outgoing_relationships
  ) AS raw_data,
  jsonb_deep_text_values(entity_main) || ' ' ||
  jsonb_deep_text_values(jsonb_build_object(
    'primaryHq', related_primary_hq,
    'agendas', related_agendas,
    'members', related_members,
    'questHooks', related_quest_hooks,
    'questParticipation', related_quest_participation,
    'influence', related_influence,
    'conflicts', related_conflicts,
    'consequences', related_consequences,
    'destinationInvolvement', related_destination_involvement,
    'foreshadowingSeeds', related_foreshadowing_seeds,
    'itemRelationships', related_item_relationships,
    'worldConceptLinks', related_world_concept_links,
    'incomingRelationships', related_incoming_relationships,
    'outgoingRelationships', related_outgoing_relationships
  )) AS content,
  weighted_search_vector(
    entity_main,
    jsonb_build_object(
      'primaryHq', related_primary_hq,
      'agendas', related_agendas,
      'members', related_members,
      'questHooks', related_quest_hooks,
      'questParticipation', related_quest_participation,
      'influence', related_influence,
      'conflicts', related_conflicts,
      'consequences', related_consequences,
      'destinationInvolvement', related_destination_involvement,
      'foreshadowingSeeds', related_foreshadowing_seeds,
      'itemRelationships', related_item_relationships,
      'worldConceptLinks', related_world_concept_links,
      'incomingRelationships', related_incoming_relationships,
      'outgoingRelationships', related_outgoing_relationships
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
    'sourceQuest', related_source_quest,
    'sourceStage', related_source_stage,
    'sourceSite', related_source_site,
    'sourceNpc', related_source_npc,
    'targetQuest', related_target_quest,
    'targetNpc', related_target_npc,
    'targetNarrativeEvent', related_target_narrative_event,
    'targetMajorConflict', related_target_major_conflict,
    'targetItem', related_target_item,
    'targetNarrativeDestination', related_target_narrative_destination,
    'targetWorldConcept', related_target_world_concept,
    'targetFaction', related_target_faction,
    'targetSite', related_target_site
  ) AS raw_data,
  jsonb_deep_text_values(entity_main) || ' ' ||
  jsonb_deep_text_values(jsonb_build_object(
    'sourceQuest', related_source_quest,
    'sourceStage', related_source_stage,
    'sourceSite', related_source_site,
    'sourceNpc', related_source_npc,
    'targetQuest', related_target_quest,
    'targetNpc', related_target_npc,
    'targetNarrativeEvent', related_target_narrative_event,
    'targetMajorConflict', related_target_major_conflict,
    'targetItem', related_target_item,
    'targetNarrativeDestination', related_target_narrative_destination,
    'targetWorldConcept', related_target_world_concept,
    'targetFaction', related_target_faction,
    'targetSite', related_target_site
  )) AS content,
  weighted_search_vector(
    entity_main,
    jsonb_build_object(
      'sourceQuest', related_source_quest,
      'sourceStage', related_source_stage,
      'sourceSite', related_source_site,
      'sourceNpc', related_source_npc,
      'targetQuest', related_target_quest,
      'targetNpc', related_target_npc,
      'targetNarrativeEvent', related_target_narrative_event,
      'targetMajorConflict', related_target_major_conflict,
      'targetItem', related_target_item,
      'targetNarrativeDestination', related_target_narrative_destination,
      'targetWorldConcept', related_target_world_concept,
      'targetFaction', related_target_faction,
      'targetSite', related_target_site
    )
  ) AS content_tsv
FROM foreshadowing_search_data_view

UNION ALL

-- Select and process data from narrative_destination_search_data_view
SELECT
  id::text,
  source_table,
  jsonb_build_object(
    'narrativeDestination', entity_main,
    'primaryRegion', related_primary_region,
    'conflict', related_conflict,
    'questRoles', related_quest_roles,
    'participantInvolvement', related_participant_involvement,
    'itemRelationships', related_item_relationships,
    'outgoingRelationships', related_outgoing_relationships,
    'incomingRelationships', related_incoming_relationships
  ) AS raw_data,
  jsonb_deep_text_values(entity_main) || ' ' ||
  jsonb_deep_text_values(jsonb_build_object(
    'primaryRegion', related_primary_region,
    'conflict', related_conflict,
    'questRoles', related_quest_roles,
    'participantInvolvement', related_participant_involvement,
    'itemRelationships', related_item_relationships,
    'outgoingRelationships', related_outgoing_relationships,
    'incomingRelationships', related_incoming_relationships
  )) AS content,
  weighted_search_vector(
    entity_main,
    jsonb_build_object(
      'primaryRegion', related_primary_region,
      'conflict', related_conflict,
      'questRoles', related_quest_roles,
      'participantInvolvement', related_participant_involvement,
      'itemRelationships', related_item_relationships,
      'outgoingRelationships', related_outgoing_relationships,
      'incomingRelationships', related_incoming_relationships
    )
  ) AS content_tsv
FROM narrative_destination_search_data_view

UNION ALL

-- Select and process data from npc_search_data_view
SELECT
  id::text,
  source_table,
  jsonb_build_object(
    'npc', entity_main,
    'factions', related_factions,
    'siteAssociations', related_site_associations,
    'conflictParticipation', related_conflict_participation,
    'consequences', related_consequences,
    'targetForeshadowing', related_target_foreshadowing,
    'sourceForeshadowing', related_source_foreshadowing,
    'itemHistory', related_item_history,
    'itemRelationships', related_item_relationships,
    'destinationInvolvement', related_destination_involvement,
    'questHooks', related_quest_hooks,
    'questStageDeliveries', related_quest_stage_deliveries,
    'worldConceptLinks', related_world_concept_links,
    'outgoingRelationships', related_outgoing_relationships,
    'incomingRelationships', related_incoming_relationships
  ) AS raw_data,
  jsonb_deep_text_values(entity_main) || ' ' ||
  jsonb_deep_text_values(jsonb_build_object(
    'factions', related_factions,
    'siteAssociations', related_site_associations,
    'conflictParticipation', related_conflict_participation,
    'consequences', related_consequences,
    'targetForeshadowing', related_target_foreshadowing,
    'sourceForeshadowing', related_source_foreshadowing,
    'itemHistory', related_item_history,
    'itemRelationships', related_item_relationships,
    'destinationInvolvement', related_destination_involvement,
    'questHooks', related_quest_hooks,
    'questStageDeliveries', related_quest_stage_deliveries,
    'worldConceptLinks', related_world_concept_links,
    'outgoingRelationships', related_outgoing_relationships,
    'incomingRelationships', related_incoming_relationships
  )) AS content,
  weighted_search_vector(
    entity_main,
    jsonb_build_object(
      'factions', related_factions,
      'siteAssociations', related_site_associations,
      'conflictParticipation', related_conflict_participation,
      'consequences', related_consequences,
      'targetForeshadowing', related_target_foreshadowing,
      'sourceForeshadowing', related_source_foreshadowing,
      'itemHistory', related_item_history,
      'itemRelationships', related_item_relationships,
      'destinationInvolvement', related_destination_involvement,
      'questHooks', related_quest_hooks,
      'questStageDeliveries', related_quest_stage_deliveries,
      'worldConceptLinks', related_world_concept_links,
      'outgoingRelationships', related_outgoing_relationships,
      'incomingRelationships', related_incoming_relationships
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
    'region', related_region,
    'parentQuest', related_parent_quest,
    'outgoingRelationships', related_outgoing_relationships,
    'incomingRelationships', related_incoming_relationships,
    'stages', related_stages,
    'hooks', related_hooks,
    'participantInvolvement', related_participant_involvement,
    'destinationContributions', related_destination_contributions,
    'consequences', related_consequences,
    'narrativeEvents', related_narrative_events,
    'foreshadowingSeeds', related_foreshadowing_seeds,
    'itemRelationships', related_item_relationships,
    'worldConceptLinks', related_world_concept_links
  ) AS raw_data,
  jsonb_deep_text_values(entity_main) || ' ' ||
  jsonb_deep_text_values(jsonb_build_object(
    'region', related_region,
    'parentQuest', related_parent_quest,
    'outgoingRelationships', related_outgoing_relationships,
    'incomingRelationships', related_incoming_relationships,
    'stages', related_stages,
    'hooks', related_hooks,
    'participantInvolvement', related_participant_involvement,
    'destinationContributions', related_destination_contributions,
    'consequences', related_consequences,
    'narrativeEvents', related_narrative_events,
    'foreshadowingSeeds', related_foreshadowing_seeds,
    'itemRelationships', related_item_relationships,
    'worldConceptLinks', related_world_concept_links
  )) AS content,
  weighted_search_vector(
    entity_main,
    jsonb_build_object(
      'region', related_region,
      'parentQuest', related_parent_quest,
      'outgoingRelationships', related_outgoing_relationships,
      'incomingRelationships', related_incoming_relationships,
      'stages', related_stages,
      'hooks', related_hooks,
      'participantInvolvement', related_participant_involvement,
      'destinationContributions', related_destination_contributions,
      'consequences', related_consequences,
      'narrativeEvents', related_narrative_events,
      'foreshadowingSeeds', related_foreshadowing_seeds,
      'itemRelationships', related_item_relationships,
      'worldConceptLinks', related_world_concept_links
    )
  ) AS content_tsv
FROM quest_search_data_view

UNION ALL

-- Select and process data from world_concept_search_data_view
SELECT
  id::text,
  source_table,
  jsonb_build_object(
    'worldConcept', entity_main,
    'outgoingConceptRelationships', related_outgoing_concept_relationships,
    'incomingConceptRelationships', related_incoming_concept_relationships,
    'entityLinks', related_entity_links,
    'itemRelationships', related_item_relationships
  ) AS raw_data,
  jsonb_deep_text_values(entity_main) || ' ' ||
  jsonb_deep_text_values(jsonb_build_object(
    'outgoingConceptRelationships', related_outgoing_concept_relationships,
    'incomingConceptRelationships', related_incoming_concept_relationships,
    'entityLinks', related_entity_links,
    'itemRelationships', related_item_relationships
  )) AS content,
  weighted_search_vector(
    entity_main,
    jsonb_build_object(
      'outgoingConceptRelationships', related_outgoing_concept_relationships,
      'incomingConceptRelationships', related_incoming_concept_relationships,
      'entityLinks', related_entity_links,
      'itemRelationships', related_item_relationships
    )
  ) AS content_tsv
FROM world_concept_search_data_view

UNION ALL

-- Select and process data from item_search_data_view
SELECT
  id::text,
  source_table,
  jsonb_build_object(
    'item', entity_main,
    'relatedQuest', related_quest,
    'outgoingRelationships', related_outgoing_relationships,
    'incomingRelationships', related_incoming_relationships,
    'notableHistory', related_notable_history
  ) AS raw_data,
  jsonb_deep_text_values(entity_main) || ' ' ||
  jsonb_deep_text_values(jsonb_build_object(
    'relatedQuest', related_quest,
    'outgoingRelationships', related_outgoing_relationships,
    'incomingRelationships', related_incoming_relationships,
    'notableHistory', related_notable_history
  )) AS content,
  weighted_search_vector(
    entity_main,
    jsonb_build_object(
      'relatedQuest', related_quest,
      'outgoingRelationships', related_outgoing_relationships,
      'incomingRelationships', related_incoming_relationships,
      'notableHistory', related_notable_history
    )
  ) AS content_tsv
FROM item_search_data_view

UNION ALL

-- Select and process data from narrative_event_search_data_view
SELECT
  id::text,
  source_table,
  jsonb_build_object(
    'narrativeEvent', entity_main,
    'questStage', related_quest_stage,
    'triggeringDecision', related_triggering_decision,
    'relatedQuest', related_quest
  ) AS raw_data,
  jsonb_deep_text_values(entity_main) || ' ' ||
  jsonb_deep_text_values(jsonb_build_object(
    'questStage', related_quest_stage,
    'triggeringDecision', related_triggering_decision,
    'relatedQuest', related_quest
  )) AS content,
  weighted_search_vector(
    entity_main,
    jsonb_build_object(
      'questStage', related_quest_stage,
      'triggeringDecision', related_triggering_decision,
      'relatedQuest', related_quest
    )
  ) AS content_tsv
FROM narrative_event_search_data_view

UNION ALL

-- Select and process data from consequence_search_data_view
SELECT
  id::text,
  source_table,
  jsonb_build_object(
    'consequence', entity_main,
    'triggerQuest', related_trigger_quest,
    'triggerDecision', related_trigger_decision,
    'triggerConflict', related_trigger_conflict,
    'affectedFaction', related_affected_faction,
    'affectedRegion', related_affected_region,
    'affectedArea', related_affected_area,
    'affectedSite', related_affected_site,
    'affectedNpc', related_affected_npc,
    'affectedDestination', related_affected_destination,
    'affectedConflict', related_affected_conflict,
    'futureQuest', related_future_quest
  ) AS raw_data,
  jsonb_deep_text_values(entity_main) || ' ' ||
  jsonb_deep_text_values(jsonb_build_object(
    'triggerQuest', related_trigger_quest,
    'triggerDecision', related_trigger_decision,
    'triggerConflict', related_trigger_conflict,
    'affectedFaction', related_affected_faction,
    'affectedRegion', related_affected_region,
    'affectedArea', related_affected_area,
    'affectedSite', related_affected_site,
    'affectedNpc', related_affected_npc,
    'affectedDestination', related_affected_destination,
    'affectedConflict', related_affected_conflict,
    'futureQuest', related_future_quest
  )) AS content,
  weighted_search_vector(
    entity_main,
    jsonb_build_object(
      'triggerQuest', related_trigger_quest,
      'triggerDecision', related_trigger_decision,
      'triggerConflict', related_trigger_conflict,
      'affectedFaction', related_affected_faction,
      'affectedRegion', related_affected_region,
      'affectedArea', related_affected_area,
      'affectedSite', related_affected_site,
      'affectedNpc', related_affected_npc,
      'affectedDestination', related_affected_destination,
      'affectedConflict', related_affected_conflict,
      'futureQuest', related_future_quest
    )
  ) AS content_tsv
FROM consequence_search_data_view
;

-- Step 5: Create Indexes for the search_index Materialized View

-- Unique index (Required for CONCURRENTLY refresh)
-- Ensure this is created *before* attempting concurrent refreshes.
CREATE UNIQUE INDEX IF NOT EXISTS idx_search_index_unique ON search_index (id, source_table);

-- GIN index for trigram fuzzy search on the 'content' column
CREATE INDEX IF NOT EXISTS idx_search_index_content_trgm ON search_index USING GIN (content gin_trgm_ops);

-- GIN index for full-text search on the 'content_tsv' column
CREATE INDEX IF NOT EXISTS idx_search_index_tsv ON search_index USING GIN (content_tsv);
