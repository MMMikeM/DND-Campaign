import { sql } from "drizzle-orm"
import { pgMaterializedView } from "drizzle-orm/pg-core"
import { conflictSearchDataView } from "./conflicts/views"
import { factionSearchDataView } from "./factions/views"
import { foreshadowingSearchDataView } from "./foreshadowing/views"
import { itemSearchDataView } from "./items/views"
import { loreSearchDataView } from "./lore/views"
import { narrativeDestinationSearchDataView } from "./narrative-destinations/views"
import { consequenceSearchDataView, narrativeEventSearchDataView } from "./narrative-events/views"
import { npcSearchDataView } from "./npcs/views"
import { questSearchDataView } from "./quests/views"
import { areaSearchDataView, regionSearchDataView, siteSearchDataView } from "./regions/views"
import { questStageDecisionSearchDataView, questStageSearchDataView } from "./stages/views"

export const searchIndex = pgMaterializedView("search_index").as((qb) => {
	// Start with regions
	const regionsQuery = qb
		.select({
			id: sql<string>`${regionSearchDataView.id}::text`.as("id"),
			sourceTable: regionSearchDataView.sourceTable,
			rawData: sql`jsonb_build_object(
        'region', ${regionSearchDataView.entityMain},
        'areas', ${regionSearchDataView.areas},
        'quests', ${regionSearchDataView.quests},
        'conflicts', ${regionSearchDataView.conflicts},
        'consequences', ${regionSearchDataView.consequences},
        'narrativeDestinations', ${regionSearchDataView.narrativeDestinations},
        'factionInfluence', ${regionSearchDataView.factionInfluence},
        'loreLinks', ${regionSearchDataView.loreLinks},
        'connections', jsonb_build_object(
          'outgoing', ${regionSearchDataView.outgoingRelations}, 
          'incoming', ${regionSearchDataView.incomingRelations}
        )
      )`.as("raw_data"),
			content: sql<string>`jsonb_deep_text_values(${regionSearchDataView.entityMain}) || ' ' ||
      jsonb_deep_text_values(jsonb_build_object(
        'areas', ${regionSearchDataView.areas},
        'quests', ${regionSearchDataView.quests},
        'conflicts', ${regionSearchDataView.conflicts}
      ))`.as("content"),
			contentTsv: sql`weighted_search_vector(
        ${regionSearchDataView.entityMain},
        jsonb_build_object(
          'areas', ${regionSearchDataView.areas},
          'quests', ${regionSearchDataView.quests}
        )
      )`.as("content_tsv"),
		})
		.from(regionSearchDataView)

	// Union with sites
	const sitesQuery = qb
		.select({
			id: sql<string>`${siteSearchDataView.id}::text`.as("id"),
			sourceTable: siteSearchDataView.sourceTable,
			rawData: sql`jsonb_build_object(
        'site', ${siteSearchDataView.entityMain},
        'area', ${siteSearchDataView.area},
        'encounters', ${siteSearchDataView.encounters},
        'secrets', ${siteSearchDataView.secrets},
        'npcAssociations', ${siteSearchDataView.npcAssociations},
        'questStages', ${siteSearchDataView.questStages},
        'questHooks', ${siteSearchDataView.questHooks},
        'consequences', ${siteSearchDataView.consequences},
        'factionHqs', ${siteSearchDataView.factionHqs},
        'factionInfluence', ${siteSearchDataView.factionInfluence},
        'foreshadowing', jsonb_build_object(
          'outgoing', ${siteSearchDataView.outgoingForeshadowing}, 
          'incoming', ${siteSearchDataView.incomingForeshadowing}
        ),
        'itemHistory', ${siteSearchDataView.itemHistory},
        'itemRelations', ${siteSearchDataView.itemRelations},
        'relations', jsonb_build_object(
          'outgoing', ${siteSearchDataView.outgoingRelations}, 
          'incoming', ${siteSearchDataView.incomingRelations}
        ),
        'mapGroup', ${siteSearchDataView.mapGroup}
      )`.as("raw_data"),
			content: sql<string>`jsonb_deep_text_values(${siteSearchDataView.entityMain}) || ' ' ||
      jsonb_deep_text_values(${siteSearchDataView.area}) || ' ' ||
      jsonb_deep_text_values(${siteSearchDataView.encounters})`.as("content"),
			contentTsv: sql`weighted_search_vector(
        ${siteSearchDataView.entityMain},
        jsonb_build_object(
          'area', ${siteSearchDataView.area},
          'encounters', ${siteSearchDataView.encounters}
        )
      )`.as("content_tsv"),
		})
		.from(siteSearchDataView)

	// Union with NPCs
	const npcsQuery = qb
		.select({
			id: sql<string>`${npcSearchDataView.id}::text`.as("id"),
			sourceTable: npcSearchDataView.sourceTable,
			rawData: sql`jsonb_build_object(
        'npc', ${npcSearchDataView.entityMain},
        'factionMemberships', ${npcSearchDataView.factionMemberships},
        'siteAssociations', ${npcSearchDataView.siteAssociations},
        'conflictParticipation', ${npcSearchDataView.conflictParticipation},
        'consequences', ${npcSearchDataView.affectedByConsequences},
        'foreshadowing', jsonb_build_object(
          'outgoing', ${npcSearchDataView.outgoingForeshadowing}, 
          'incoming', ${npcSearchDataView.incomingForeshadowing}
        ),
        'itemHistory', ${npcSearchDataView.itemHistory},
        'itemRelations', ${npcSearchDataView.itemRelations},
        'narrativeDestinationInvolvement', ${npcSearchDataView.narrativeDestinationInvolvement},
        'questHooks', ${npcSearchDataView.questHooks},
        'questStageDeliveries', ${npcSearchDataView.questStageDeliveries},
        'stageInvolvement', ${npcSearchDataView.stageInvolvement},
        'loreLinks', ${npcSearchDataView.loreLinks},
        'relations', jsonb_build_object(
          'outgoing', ${npcSearchDataView.outgoingRelations}, 
          'incoming', ${npcSearchDataView.incomingRelations}
        )
      )`.as("raw_data"),
			content: sql<string>`jsonb_deep_text_values(${npcSearchDataView.entityMain}) || ' ' ||
      jsonb_deep_text_values(${npcSearchDataView.factionMemberships}) || ' ' ||
      jsonb_deep_text_values(${npcSearchDataView.siteAssociations})`.as("content"),
			contentTsv: sql`weighted_search_vector(
        ${npcSearchDataView.entityMain},
        jsonb_build_object(
          'factionMemberships', ${npcSearchDataView.factionMemberships},
          'siteAssociations', ${npcSearchDataView.siteAssociations}
        )
      )`.as("content_tsv"),
		})
		.from(npcSearchDataView)

	// Union with quests
	const questsQuery = qb
		.select({
			id: sql<string>`${questSearchDataView.id}::text`.as("id"),
			sourceTable: questSearchDataView.sourceTable,
			rawData: sql`jsonb_build_object(
        'quest', ${questSearchDataView.entityMain},
        'region', ${questSearchDataView.region},
        'stages', ${questSearchDataView.stages},
        'hooks', ${questSearchDataView.hooks},
        'participants', ${questSearchDataView.participants},
        'narrativeDestinationContributions', ${questSearchDataView.narrativeDestinationContributions},
        'affectingConsequences', ${questSearchDataView.affectingConsequences},
        'triggeredConsequences', ${questSearchDataView.triggeredConsequences},
        'triggeredEvents', ${questSearchDataView.triggeredEvents},
        'foreshadowing', jsonb_build_object(
          'outgoing', ${questSearchDataView.outgoingForeshadowing}, 
          'incoming', ${questSearchDataView.incomingForeshadowing}
        ),
        'itemRelations', ${questSearchDataView.itemRelations},
        'loreLinks', ${questSearchDataView.loreLinks},
        'relations', jsonb_build_object(
          'outgoing', ${questSearchDataView.outgoingRelations}, 
          'incoming', ${questSearchDataView.incomingRelations}
        )
      )`.as("raw_data"),
			content: sql<string>`jsonb_deep_text_values(${questSearchDataView.entityMain}) || ' ' ||
      jsonb_deep_text_values(${questSearchDataView.region}) || ' ' ||
      jsonb_deep_text_values(${questSearchDataView.stages})`.as("content"),
			contentTsv: sql`weighted_search_vector(
        ${questSearchDataView.entityMain},
        jsonb_build_object(
          'region', ${questSearchDataView.region},
          'stages', ${questSearchDataView.stages}
        )
      )`.as("content_tsv"),
		})
		.from(questSearchDataView)

	// Union with factions
	const factionsQuery = qb
		.select({
			id: sql<string>`${factionSearchDataView.id}::text`.as("id"),
			sourceTable: factionSearchDataView.sourceTable,
			rawData: sql`jsonb_build_object(
        'faction', ${factionSearchDataView.entityMain},
        'primaryHqSite', ${factionSearchDataView.primaryHqSite},
        'agendas', ${factionSearchDataView.agendas},
        'members', ${factionSearchDataView.members},
        'questHooks', ${factionSearchDataView.questHooks},
        'questParticipation', ${factionSearchDataView.questParticipation},
        'influence', ${factionSearchDataView.influence},
        'conflicts', ${factionSearchDataView.conflicts},
        'consequences', ${factionSearchDataView.consequences},
        'narrativeDestinationInvolvement', ${factionSearchDataView.narrativeDestinationInvolvement},
        'foreshadowing', ${factionSearchDataView.incomingForeshadowing},
        'itemRelations', ${factionSearchDataView.itemRelations},
        'loreLinks', ${factionSearchDataView.loreLinks},
        'relations', jsonb_build_object(
          'incoming', ${factionSearchDataView.incomingRelations}, 
          'outgoing', ${factionSearchDataView.outgoingRelations}
        )
      )`.as("raw_data"),
			content: sql<string>`jsonb_deep_text_values(${factionSearchDataView.entityMain}) || ' ' ||
      jsonb_deep_text_values(${factionSearchDataView.agendas}) || ' ' ||
      jsonb_deep_text_values(${factionSearchDataView.members})`.as("content"),
			contentTsv: sql`weighted_search_vector(
        ${factionSearchDataView.entityMain},
        jsonb_build_object(
          'agendas', ${factionSearchDataView.agendas},
          'members', ${factionSearchDataView.members}
        )
      )`.as("content_tsv"),
		})
		.from(factionSearchDataView)

	// Union with conflicts
	const conflictsQuery = qb
		.select({
			id: sql<string>`${conflictSearchDataView.id}::text`.as("id"),
			sourceTable: conflictSearchDataView.sourceTable,
			rawData: sql`jsonb_build_object(
        'conflict', ${conflictSearchDataView.entityMain},
        'region', ${conflictSearchDataView.region},
        'participants', ${conflictSearchDataView.participants},
        'consequences', ${conflictSearchDataView.consequences},
        'affectedByConsequences', ${conflictSearchDataView.affectedByConsequences},
        'narrativeDestinations', ${conflictSearchDataView.narrativeDestinations},
        'incomingForeshadowing', ${conflictSearchDataView.incomingForeshadowing},
        'itemRelations', ${conflictSearchDataView.itemRelations},
        'loreLinks', ${conflictSearchDataView.loreLinks}
      )`.as("raw_data"),
			content: sql<string>`jsonb_deep_text_values(${conflictSearchDataView.entityMain}) || ' ' ||
      jsonb_deep_text_values(${conflictSearchDataView.participants}) || ' ' ||
      jsonb_deep_text_values(${conflictSearchDataView.consequences})`.as("content"),
			contentTsv: sql`weighted_search_vector(
        ${conflictSearchDataView.entityMain},
        jsonb_build_object(
          'participants', ${conflictSearchDataView.participants},
          'consequences', ${conflictSearchDataView.consequences}
        )
      )`.as("content_tsv"),
		})
		.from(conflictSearchDataView)

	// Union with items
	const itemsQuery = qb
		.select({
			id: sql<string>`${itemSearchDataView.id}::text`.as("id"),
			sourceTable: itemSearchDataView.sourceTable,
			rawData: sql`jsonb_build_object(
        'item', ${itemSearchDataView.entityMain},
        'questStage', ${itemSearchDataView.questStage},
        'quest', ${itemSearchDataView.quest},
        'relations', jsonb_build_object(
          'outgoing', ${itemSearchDataView.relations}, 
          'incoming', ${itemSearchDataView.incomingRelations}
        ),
        'notableHistory', ${itemSearchDataView.notableHistory},
        'incomingForeshadowing', ${itemSearchDataView.incomingForeshadowing}
      )`.as("raw_data"),
			content: sql<string>`jsonb_deep_text_values(${itemSearchDataView.entityMain}) || ' ' ||
      jsonb_deep_text_values(${itemSearchDataView.quest}) || ' ' ||
      jsonb_deep_text_values(${itemSearchDataView.notableHistory})`.as("content"),
			contentTsv: sql`weighted_search_vector(
        ${itemSearchDataView.entityMain},
        jsonb_build_object(
          'quest', ${itemSearchDataView.quest},
          'notableHistory', ${itemSearchDataView.notableHistory}
        )
      )`.as("content_tsv"),
		})
		.from(itemSearchDataView)

	// Union with foreshadowing
	const foreshadowingQuery = qb
		.select({
			id: sql<string>`${foreshadowingSearchDataView.id}::text`.as("id"),
			sourceTable: foreshadowingSearchDataView.sourceTable,
			rawData: sql`jsonb_build_object(
        'foreshadowing', ${foreshadowingSearchDataView.entityMain},
        'sourceQuest', ${foreshadowingSearchDataView.sourceQuest},
        'sourceQuestStage', ${foreshadowingSearchDataView.sourceQuestStage},
        'sourceSite', ${foreshadowingSearchDataView.sourceSite},
        'sourceNpc', ${foreshadowingSearchDataView.sourceNpc},
        'sourceLore', ${foreshadowingSearchDataView.sourceLore},
        'targetQuest', ${foreshadowingSearchDataView.targetQuest},
        'targetNpc', ${foreshadowingSearchDataView.targetNpc},
        'targetNarrativeEvent', ${foreshadowingSearchDataView.targetNarrativeEvent},
        'targetConflict', ${foreshadowingSearchDataView.targetConflict},
        'targetItem', ${foreshadowingSearchDataView.targetItem},
        'targetNarrativeDestination', ${foreshadowingSearchDataView.targetNarrativeDestination},
        'targetLore', ${foreshadowingSearchDataView.targetLore},
        'targetFaction', ${foreshadowingSearchDataView.targetFaction},
        'targetSite', ${foreshadowingSearchDataView.targetSite}
      )`.as("raw_data"),
			content: sql<string>`jsonb_deep_text_values(${foreshadowingSearchDataView.entityMain}) || ' ' ||
      jsonb_deep_text_values(${foreshadowingSearchDataView.sourceQuest}) || ' ' ||
      jsonb_deep_text_values(${foreshadowingSearchDataView.targetQuest})`.as("content"),
			contentTsv: sql`weighted_search_vector(
        ${foreshadowingSearchDataView.entityMain},
        jsonb_build_object(
          'sourceQuest', ${foreshadowingSearchDataView.sourceQuest},
          'targetQuest', ${foreshadowingSearchDataView.targetQuest}
        )
      )`.as("content_tsv"),
		})
		.from(foreshadowingSearchDataView)

	// Union with lore
	const loreQuery = qb
		.select({
			id: sql<string>`${loreSearchDataView.id}::text`.as("id"),
			sourceTable: loreSearchDataView.sourceTable,
			rawData: sql`jsonb_build_object(
        'lore', ${loreSearchDataView.entityMain},
        'links', ${loreSearchDataView.links},
        'itemRelations', ${loreSearchDataView.itemRelations},
        'incomingForeshadowing', ${loreSearchDataView.incomingForeshadowing}
      )`.as("raw_data"),
			content: sql<string>`jsonb_deep_text_values(${loreSearchDataView.entityMain}) || ' ' ||
      jsonb_deep_text_values(${loreSearchDataView.links})`.as("content"),
			contentTsv: sql`weighted_search_vector(
        ${loreSearchDataView.entityMain},
        ${loreSearchDataView.links}
      )`.as("content_tsv"),
		})
		.from(loreSearchDataView)

	// Union with narrative destinations
	const narrativeDestinationsQuery = qb
		.select({
			id: sql<string>`${narrativeDestinationSearchDataView.id}::text`.as("id"),
			sourceTable: narrativeDestinationSearchDataView.sourceTable,
			rawData: sql`jsonb_build_object(
        'narrativeDestination', ${narrativeDestinationSearchDataView.entityMain},
        'region', ${narrativeDestinationSearchDataView.region},
        'conflict', ${narrativeDestinationSearchDataView.conflict},
        'questRoles', ${narrativeDestinationSearchDataView.questRoles},
        'participantInvolvement', ${narrativeDestinationSearchDataView.participantInvolvement},
        'itemRelations', ${narrativeDestinationSearchDataView.itemRelations},
        'relations', jsonb_build_object(
          'outgoing', ${narrativeDestinationSearchDataView.outgoingRelations}, 
          'incoming', ${narrativeDestinationSearchDataView.incomingRelations}
        ),
        'loreLinks', ${narrativeDestinationSearchDataView.loreLinks},
        'incomingForeshadowing', ${narrativeDestinationSearchDataView.incomingForeshadowing}
      )`.as("raw_data"),
			content: sql<string>`jsonb_deep_text_values(${narrativeDestinationSearchDataView.entityMain}) || ' ' ||
      jsonb_deep_text_values(${narrativeDestinationSearchDataView.region}) || ' ' ||
      jsonb_deep_text_values(${narrativeDestinationSearchDataView.conflict})`.as("content"),
			contentTsv: sql`weighted_search_vector(
        ${narrativeDestinationSearchDataView.entityMain},
        jsonb_build_object(
          'region', ${narrativeDestinationSearchDataView.region},
          'conflict', ${narrativeDestinationSearchDataView.conflict}
        )
      )`.as("content_tsv"),
		})
		.from(narrativeDestinationSearchDataView)

	// Union with narrative events
	const narrativeEventsQuery = qb
		.select({
			id: sql<string>`${narrativeEventSearchDataView.id}::text`.as("id"),
			sourceTable: narrativeEventSearchDataView.sourceTable,
			rawData: sql`jsonb_build_object(
        'narrativeEvent', ${narrativeEventSearchDataView.entityMain},
        'questStage', ${narrativeEventSearchDataView.questStage},
        'triggeringStageDecision', ${narrativeEventSearchDataView.triggeringStageDecision},
        'relatedQuest', ${narrativeEventSearchDataView.relatedQuest},
        'incomingForeshadowing', ${narrativeEventSearchDataView.incomingForeshadowing}
      )`.as("raw_data"),
			content: sql<string>`jsonb_deep_text_values(${narrativeEventSearchDataView.entityMain}) || ' ' ||
      jsonb_deep_text_values(${narrativeEventSearchDataView.questStage}) || ' ' ||
      jsonb_deep_text_values(${narrativeEventSearchDataView.relatedQuest})`.as("content"),
			contentTsv: sql`weighted_search_vector(
        ${narrativeEventSearchDataView.entityMain},
        jsonb_build_object(
          'questStage', ${narrativeEventSearchDataView.questStage},
          'relatedQuest', ${narrativeEventSearchDataView.relatedQuest}
        )
      )`.as("content_tsv"),
		})
		.from(narrativeEventSearchDataView)

	// Union with quest stages
	const questStagesQuery = qb
		.select({
			id: sql<string>`${questStageSearchDataView.id}::text`.as("id"),
			sourceTable: questStageSearchDataView.sourceTable,
			rawData: sql`jsonb_build_object(
        'questStage', ${questStageSearchDataView.entityMain},
        'quest', ${questStageSearchDataView.quest},
        'site', ${questStageSearchDataView.site},
        'deliveryNpc', ${questStageSearchDataView.deliveryNpc},
        'outgoingDecisions', ${questStageSearchDataView.outgoingDecisions},
        'incomingDecisions', ${questStageSearchDataView.incomingDecisions},
        'items', ${questStageSearchDataView.items},
        'narrativeEvents', ${questStageSearchDataView.narrativeEvents},
        'npcInvolvement', ${questStageSearchDataView.npcInvolvement},
        'outgoingForeshadowing', ${questStageSearchDataView.outgoingForeshadowing}
      )`.as("raw_data"),
			content: sql<string>`jsonb_deep_text_values(${questStageSearchDataView.entityMain}) || ' ' ||
      jsonb_deep_text_values(${questStageSearchDataView.quest}) || ' ' ||
      jsonb_deep_text_values(${questStageSearchDataView.site})`.as("content"),
			contentTsv: sql`weighted_search_vector(
        ${questStageSearchDataView.entityMain},
        jsonb_build_object(
          'quest', ${questStageSearchDataView.quest},
          'site', ${questStageSearchDataView.site}
        )
      )`.as("content_tsv"),
		})
		.from(questStageSearchDataView)

	// Union with quest stage decisions
	const questStageDecisionsQuery = qb
		.select({
			id: sql<string>`${questStageDecisionSearchDataView.id}::text`.as("id"),
			sourceTable: questStageDecisionSearchDataView.sourceTable,
			rawData: sql`jsonb_build_object(
        'questStageDecision', ${questStageDecisionSearchDataView.entityMain},
        'quest', ${questStageDecisionSearchDataView.quest},
        'fromStage', ${questStageDecisionSearchDataView.fromStage},
        'toStage', ${questStageDecisionSearchDataView.toStage},
        'triggeredEvents', ${questStageDecisionSearchDataView.triggeredEvents},
        'consequences', ${questStageDecisionSearchDataView.consequences}
      )`.as("raw_data"),
			content: sql<string>`jsonb_deep_text_values(${questStageDecisionSearchDataView.entityMain}) || ' ' ||
      jsonb_deep_text_values(${questStageDecisionSearchDataView.quest}) || ' ' ||
      jsonb_deep_text_values(${questStageDecisionSearchDataView.fromStage})`.as("content"),
			contentTsv: sql`weighted_search_vector(
        ${questStageDecisionSearchDataView.entityMain},
        jsonb_build_object(
          'quest', ${questStageDecisionSearchDataView.quest},
          'fromStage', ${questStageDecisionSearchDataView.fromStage}
        )
      )`.as("content_tsv"),
		})
		.from(questStageDecisionSearchDataView)

	// Union with areas
	const areasQuery = qb
		.select({
			id: sql<string>`${areaSearchDataView.id}::text`.as("id"),
			sourceTable: areaSearchDataView.sourceTable,
			rawData: sql`jsonb_build_object(
        'area', ${areaSearchDataView.entityMain},
        'region', ${areaSearchDataView.region},
        'sites', ${areaSearchDataView.sites},
        'consequences', ${areaSearchDataView.consequences},
        'factionInfluence', ${areaSearchDataView.factionInfluence}
      )`.as("raw_data"),
			content: sql<string>`jsonb_deep_text_values(${areaSearchDataView.entityMain}) || ' ' ||
      jsonb_deep_text_values(${areaSearchDataView.region}) || ' ' ||
      jsonb_deep_text_values(${areaSearchDataView.sites})`.as("content"),
			contentTsv: sql`weighted_search_vector(
        ${areaSearchDataView.entityMain},
        jsonb_build_object(
          'region', ${areaSearchDataView.region},
          'sites', ${areaSearchDataView.sites}
        )
      )`.as("content_tsv"),
		})
		.from(areaSearchDataView)

	// Union with consequences
	const consequencesQuery = qb
		.select({
			id: sql<string>`${consequenceSearchDataView.id}::text`.as("id"),
			sourceTable: consequenceSearchDataView.sourceTable,
			rawData: sql`jsonb_build_object(
        'consequence', ${consequenceSearchDataView.entityMain},
        'triggerQuest', ${consequenceSearchDataView.triggerQuest},
        'triggerConflict', ${consequenceSearchDataView.triggerConflict},
        'affectedFaction', ${consequenceSearchDataView.affectedFaction},
        'affectedRegion', ${consequenceSearchDataView.affectedRegion},
        'affectedArea', ${consequenceSearchDataView.affectedArea},
        'affectedSite', ${consequenceSearchDataView.affectedSite},
        'affectedNpc', ${consequenceSearchDataView.affectedNpc},
        'affectedNarrativeDestination', ${consequenceSearchDataView.affectedNarrativeDestination},
        'affectedConflict', ${consequenceSearchDataView.affectedConflict},
        'affectedQuest', ${consequenceSearchDataView.affectedQuest}
      )`.as("raw_data"),
			content: sql<string>`jsonb_deep_text_values(${consequenceSearchDataView.entityMain}) || ' ' ||
      jsonb_deep_text_values(${consequenceSearchDataView.triggerQuest}) || ' ' ||
      jsonb_deep_text_values(${consequenceSearchDataView.triggerConflict}) || ' ' ||
      jsonb_deep_text_values(${consequenceSearchDataView.affectedFaction}) || ' ' ||
      jsonb_deep_text_values(${consequenceSearchDataView.affectedRegion}) || ' ' ||
      jsonb_deep_text_values(${consequenceSearchDataView.affectedArea}) || ' ' ||
      jsonb_deep_text_values(${consequenceSearchDataView.affectedSite}) || ' ' ||
      jsonb_deep_text_values(${consequenceSearchDataView.affectedNpc}) || ' ' ||
      jsonb_deep_text_values(${consequenceSearchDataView.affectedNarrativeDestination}) || ' ' ||
      jsonb_deep_text_values(${consequenceSearchDataView.affectedConflict}) || ' ' ||
      jsonb_deep_text_values(${consequenceSearchDataView.affectedQuest})`.as("content"),
			contentTsv: sql`weighted_search_vector(
        ${consequenceSearchDataView.entityMain},
        jsonb_build_object(
          'triggerQuest', ${consequenceSearchDataView.triggerQuest},
          'triggerConflict', ${consequenceSearchDataView.triggerConflict},
          'affectedFaction', ${consequenceSearchDataView.affectedFaction},
          'affectedRegion', ${consequenceSearchDataView.affectedRegion},
          'affectedArea', ${consequenceSearchDataView.affectedArea},
          'affectedSite', ${consequenceSearchDataView.affectedSite},
          'affectedNpc', ${consequenceSearchDataView.affectedNpc},
          'affectedNarrativeDestination', ${consequenceSearchDataView.affectedNarrativeDestination},
          'affectedConflict', ${consequenceSearchDataView.affectedConflict},
          'affectedQuest', ${consequenceSearchDataView.affectedQuest}
        )
      )`.as("content_tsv"),
		})
		.from(consequenceSearchDataView)

	return regionsQuery
		.unionAll(areasQuery)
		.unionAll(sitesQuery)
		.unionAll(npcsQuery)
		.unionAll(questsQuery)
		.unionAll(factionsQuery)
		.unionAll(conflictsQuery)
		.unionAll(itemsQuery)
		.unionAll(foreshadowingQuery)
		.unionAll(loreQuery)
		.unionAll(narrativeDestinationsQuery)
		.unionAll(narrativeEventsQuery)
		.unionAll(consequencesQuery)
		.unionAll(questStagesQuery)
		.unionAll(questStageDecisionsQuery)
})
