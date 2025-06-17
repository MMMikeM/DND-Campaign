CREATE MATERIALIZED VIEW "public"."search_index" AS (((((((((((((((select "id"::text as "id", "source_table", jsonb_build_object(
        'region', "entity_main",
        'areas', "areas",
        'quests', "quests",
        'conflicts', "conflicts",
        'consequences', "consequences",
        'narrativeDestinations', "narrative_destinations",
        'factionInfluence', "faction_influence",
        'loreLinks', "lore_links",
        'connections', jsonb_build_object(
          'outgoing', "outgoing_relations", 
          'incoming', "incoming_relations"
        )
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values(jsonb_build_object(
        'areas', "areas",
        'quests', "quests",
        'conflicts', "conflicts"
      )) as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'areas', "areas",
          'quests', "quests"
        )
      ) as "content_tsv" from "region_search_data_view") union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'area', "entity_main",
        'region', "region",
        'sites', "sites",
        'consequences', "consequences",
        'factionInfluence', "faction_influence"
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("region") || ' ' ||
      jsonb_deep_text_values("sites") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'region', "region",
          'sites', "sites"
        )
      ) as "content_tsv" from "area_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'site', "entity_main",
        'area', "area",
        'encounters', "encounters",
        'secrets', "secrets",
        'npcAssociations', "npc_associations",
        'questStages', "quest_stages",
        'questHooks', "quest_hooks",
        'consequences', "consequences",
        'factionHqs', "faction_hqs",
        'factionInfluence', "faction_influence",
        'foreshadowing', jsonb_build_object(
          'outgoing', "outgoing_foreshadowing", 
          'incoming', "incoming_foreshadowing"
        ),
        'itemHistory', "item_history",
        'itemRelations', "item_relations",
        'relations', jsonb_build_object(
          'outgoing', "outgoing_relations", 
          'incoming', "incoming_relations"
        ),
        'map', "map"
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("area") || ' ' ||
      jsonb_deep_text_values("encounters") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'area', "area",
          'encounters', "encounters"
        )
      ) as "content_tsv" from "site_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'npc', "entity_main",
        'factionMemberships', "faction_memberships",
        'siteAssociations', "site_associations",
        'conflictParticipation', "conflict_participation",
        'consequences', "affected_by_consequences",
        'foreshadowing', jsonb_build_object(
          'outgoing', "outgoing_foreshadowing", 
          'incoming', "incoming_foreshadowing"
        ),
        'itemHistory', "item_history",
        'itemRelations', "item_relations",
        'narrativeDestinationInvolvement', "narrative_destination_involvement",
        'questHooks', "quest_hooks",
        'questStageDeliveries', "quest_stage_deliveries",
        'stageInvolvement', "stage_involvement",
        'loreLinks', "lore_links",
        'relations', jsonb_build_object(
          'outgoing', "outgoing_relations", 
          'incoming', "incoming_relations"
        )
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("faction_memberships") || ' ' ||
      jsonb_deep_text_values("site_associations") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'factionMemberships', "faction_memberships",
          'siteAssociations', "site_associations"
        )
      ) as "content_tsv" from "npc_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'quest', "entity_main",
        'region', "region",
        'stages', "stages",
        'hooks', "hooks",
        'participants', "participants",
        'narrativeDestinationContributions', "narrative_destination_contributions",
        'consequences', "consequences",
        'triggeredEvents', "triggered_events",
        'foreshadowing', jsonb_build_object(
          'outgoing', "outgoing_foreshadowing", 
          'incoming', "incoming_foreshadowing"
        ),
        'itemRelations', "item_relations",
        'loreLinks', "lore_links",
        'relations', jsonb_build_object(
          'outgoing', "outgoing_relations", 
          'incoming', "incoming_relations"
        )
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("region") || ' ' ||
      jsonb_deep_text_values("stages") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'region', "region",
          'stages', "stages"
        )
      ) as "content_tsv" from "quest_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'faction', "entity_main",
        'primaryHqSite', "primaryHqSite",
        'agendas', "agendas",
        'members', "members",
        'questHooks', "questHooks",
        'questParticipation', "questParticipation",
        'influence', "influence",
        'conflicts', "conflicts",
        'consequences', "consequences",
        'narrativeDestinationInvolvement', "narrativeDestinationInvolvement",
        'foreshadowing', "incomingForeshadowing",
        'itemRelations', "itemRelations",
        'loreLinks', "loreLinks",
        'relations', jsonb_build_object(
          'incoming', "incomingRelations", 
          'outgoing', "outgoingRelations"
        )
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("agendas") || ' ' ||
      jsonb_deep_text_values("members") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'agendas', "agendas",
          'members', "members"
        )
      ) as "content_tsv" from "faction_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'conflict', "entity_main",
        'region', "region",
        'participants', "participants",
        'consequences', "consequences",
        'affectedByConsequences', "affectedByConsequences",
        'narrativeDestinations', "narrativeDestinations",
        'incomingForeshadowing', "incomingForeshadowing",
        'itemRelations', "itemRelations",
        'loreLinks', "loreLinks"
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("participants") || ' ' ||
      jsonb_deep_text_values("consequences") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'participants', "participants",
          'consequences', "consequences"
        )
      ) as "content_tsv" from "conflict_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'item', "entity_main",
        'questStage', "questStage",
        'quest', "quest",
        'relations', jsonb_build_object(
          'outgoing', "relations", 
          'incoming', "incomingRelations"
        ),
        'notableHistory', "notableHistory",
        'incomingForeshadowing', "incomingForeshadowing"
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("quest") || ' ' ||
      jsonb_deep_text_values("notableHistory") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'quest', "quest",
          'notableHistory', "notableHistory"
        )
      ) as "content_tsv" from "item_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'foreshadowing', "entity_main",
        'sourceQuest', "sourceQuest",
        'sourceQuestStage', "sourceQuestStage",
        'sourceSite', "sourceSite",
        'sourceNpc', "sourceNpc",
        'sourceLore', "sourceLore",
        'targetQuest', "targetQuest",
        'targetNpc', "targetNpc",
        'targetNarrativeEvent', "targetNarrativeEvent",
        'targetConflict', "targetConflict",
        'targetItem', "targetItem",
        'targetNarrativeDestination', "targetNarrativeDestination",
        'targetLore', "targetLore",
        'targetFaction', "targetFaction",
        'targetSite', "targetSite"
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("sourceQuest") || ' ' ||
      jsonb_deep_text_values("targetQuest") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'sourceQuest', "sourceQuest",
          'targetQuest', "targetQuest"
        )
      ) as "content_tsv" from "foreshadowing_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'lore', "entity_main",
        'links', "links",
        'itemRelations', "item_relations",
        'incomingForeshadowing', "incoming_foreshadowing"
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("links") as "content", weighted_search_vector(
        "entity_main",
        "links"
      ) as "content_tsv" from "lore_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'narrativeDestination', "entity_main",
        'region', "region",
        'conflict', "conflict",
        'questRoles', "quest_roles",
        'participantInvolvement', "participant_involvement",
        'itemRelations', "item_relations",
        'relations', jsonb_build_object(
          'outgoing', "outgoing_relations", 
          'incoming', "incoming_relations"
        ),
        'loreLinks', "lore_links",
        'incomingForeshadowing', "incoming_foreshadowing"
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("region") || ' ' ||
      jsonb_deep_text_values("conflict") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'region', "region",
          'conflict', "conflict"
        )
      ) as "content_tsv" from "narrative_destination_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'narrativeEvent', "entity_main",
        'questStage', "quest_stage",
        'triggeringStageDecision', "triggering_stage_decision",
        'relatedQuest', "related_quest",
        'incomingForeshadowing', "incoming_foreshadowing"
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("quest_stage") || ' ' ||
      jsonb_deep_text_values("related_quest") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'questStage', "quest_stage",
          'relatedQuest', "related_quest"
        )
      ) as "content_tsv" from "narrative_event_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'consequence', "entity_main",
        'triggerQuest', "trigger_quest",
        'triggerConflict', "trigger_conflict",
        'affectedFaction', "affected_faction",
        'affectedRegion', "affected_region",
        'affectedArea', "affected_area",
        'affectedSite', "affected_site",
        'affectedNpc', "affected_npc",
        'affectedNarrativeDestination', "affected_narrative_destination",
        'affectedConflict', "affected_conflict",
        'affectedQuest', "affected_quest"
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("trigger_quest") || ' ' ||
      jsonb_deep_text_values("trigger_conflict") || ' ' ||
      jsonb_deep_text_values("affected_faction") || ' ' ||
      jsonb_deep_text_values("affected_region") || ' ' ||
      jsonb_deep_text_values("affected_area") || ' ' ||
      jsonb_deep_text_values("affected_site") || ' ' ||
      jsonb_deep_text_values("affected_npc") || ' ' ||
      jsonb_deep_text_values("affected_narrative_destination") || ' ' ||
      jsonb_deep_text_values("affected_conflict") || ' ' ||
      jsonb_deep_text_values("affected_quest") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'triggerQuest', "trigger_quest",
          'triggerConflict', "trigger_conflict",
          'affectedFaction', "affected_faction",
          'affectedRegion', "affected_region",
          'affectedArea', "affected_area",
          'affectedSite', "affected_site",
          'affectedNpc', "affected_npc",
          'affectedNarrativeDestination', "affected_narrative_destination",
          'affectedConflict', "affected_conflict",
          'affectedQuest', "affected_quest"
        )
      ) as "content_tsv" from "consequence_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'questStage', "entity_main",
        'quest', "quest",
        'site', "site",
        'deliveryNpc', "delivery_npc",
        'outgoingDecisions', "outgoing_decisions",
        'incomingDecisions', "incoming_decisions",
        'items', "items",
        'narrativeEvents', "narrative_events",
        'npcInvolvement', "npc_involvement",
        'outgoingForeshadowing', "outgoing_foreshadowing"
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("quest") || ' ' ||
      jsonb_deep_text_values("site") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'quest', "quest",
          'site', "site"
        )
      ) as "content_tsv" from "quest_stage_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'questStageDecision', "entity_main",
        'quest', "quest",
        'fromStage', "from_stage",
        'toStage', "to_stage",
        'triggeredEvents', "triggered_events",
        'consequences', "consequences"
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("quest") || ' ' ||
      jsonb_deep_text_values("from_stage") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'quest', "quest",
          'fromStage', "from_stage"
        )
      ) as "content_tsv" from "quest_stage_decision_search_data_view"));