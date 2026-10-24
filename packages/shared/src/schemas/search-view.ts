import { sql } from "drizzle-orm"
import { pgMaterializedView } from "drizzle-orm/pg-core"
import { conflictSearchDataView } from "./conflicts/views"
import { consequenceSearchDataView } from "./consequences/views"
import { factionSearchDataView } from "./factions/views"
import { foreshadowingSearchDataView } from "./foreshadowing/views"
import { itemSearchDataView } from "./items/views"
import { loreSearchDataView } from "./lore/views"
import { npcSearchDataView } from "./npcs/views"
import { questSearchDataView } from "./quests/views"
import { areaSearchDataView, regionSearchDataView, siteSearchDataView } from "./regions/views"
import { questStageDecisionSearchDataView, questStageSearchDataView } from "./stages/views"
import { deepText, weightedSearchVector } from "./view-utils"

export const searchIndex = pgMaterializedView("search_index").as((qb) => {
	// Start with regions
	const regionsQuery = qb
		.select({
			id: sql<string>`${regionSearchDataView.id}::text`.as("id"),
			sourceTable: regionSearchDataView.sourceTable,
			name: sql<string>`${regionSearchDataView.entityMain}->>'name'`.as("name"),
			slug: sql<string>`${regionSearchDataView.entityMain}->>'slug'`.as("slug"),
			rawData: sql`jsonb_build_object(
        'region', ${regionSearchDataView.entityMain},
        'areas', ${regionSearchDataView.areas},
        'conflicts', ${regionSearchDataView.conflicts},
        'consequences', ${regionSearchDataView.consequences},
        'factionInfluence', ${regionSearchDataView.factionInfluence},
        'loreLinks', ${regionSearchDataView.loreLinks},
        'connections', jsonb_build_object(
          'outgoing', ${regionSearchDataView.outgoingRelations}, 
          'incoming', ${regionSearchDataView.incomingRelations}
        )
      )`.as("raw_data"),
			content: sql<string>`${deepText(regionSearchDataView.entityMain)} || ' ' ||
      ${deepText(sql`jsonb_build_object(
        'areas', ${regionSearchDataView.areas},
        'conflicts', ${regionSearchDataView.conflicts}
      )`)}`.as("content"),
			contentTsv: weightedSearchVector(regionSearchDataView.entityMain, sql`jsonb_build_object(
          'areas', ${regionSearchDataView.areas},
          'conflicts', ${regionSearchDataView.conflicts}
        )`).as("content_tsv"),
		})
		.from(regionSearchDataView)

	// Union with sites
	const sitesQuery = qb
		.select({
			id: sql<string>`${siteSearchDataView.id}::text`.as("id"),
			sourceTable: siteSearchDataView.sourceTable,
			name: sql<string>`${siteSearchDataView.entityMain}->>'name'`.as("name"),
			slug: sql<string>`${siteSearchDataView.entityMain}->>'slug'`.as("slug"),
			rawData: sql`jsonb_build_object(
        'site', ${siteSearchDataView.entityMain},
        'area', ${siteSearchDataView.area},
        'encounters', ${siteSearchDataView.encounters},
        'secrets', ${siteSearchDataView.secrets},
        'questStages', ${siteSearchDataView.questStages},
        'questHooks', ${siteSearchDataView.questHooks},
        'consequences', ${siteSearchDataView.consequences},
        'factionHqs', ${siteSearchDataView.factionHqs},
        'factionInfluence', ${siteSearchDataView.factionInfluence},
        'foreshadowing', jsonb_build_object(
          'outgoing', ${siteSearchDataView.outgoingForeshadowing}, 
          'incoming', ${siteSearchDataView.incomingForeshadowing}
        ),
        'itemRelations', ${siteSearchDataView.itemRelations},
        'relations', jsonb_build_object(
          'outgoing', ${siteSearchDataView.outgoingRelations}, 
          'incoming', ${siteSearchDataView.incomingRelations}
        ),
        'mapGroup', ${siteSearchDataView.mapGroup}
      )`.as("raw_data"),
			content: sql<string>`${deepText(siteSearchDataView.entityMain)} || ' ' ||
      ${deepText(siteSearchDataView.area)} || ' ' ||
      ${deepText(siteSearchDataView.encounters)}`.as("content"),
			contentTsv: weightedSearchVector(siteSearchDataView.entityMain, sql`jsonb_build_object(
          'area', ${siteSearchDataView.area},
          'encounters', ${siteSearchDataView.encounters}
        )`).as("content_tsv"),
		})
		.from(siteSearchDataView)

	// Union with NPCs
	const npcsQuery = qb
		.select({
			id: sql<string>`${npcSearchDataView.id}::text`.as("id"),
			sourceTable: npcSearchDataView.sourceTable,
			name: sql<string>`${npcSearchDataView.entityMain}->>'name'`.as("name"),
			slug: sql<string>`${npcSearchDataView.entityMain}->>'slug'`.as("slug"),
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
        'itemConnections', ${npcSearchDataView.itemConnections},
        'questHooks', ${npcSearchDataView.questHooks},
        'questStageDeliveries', ${npcSearchDataView.questStageDeliveries},
        'stageInvolvement', ${npcSearchDataView.stageInvolvement},
        'loreLinks', ${npcSearchDataView.loreLinks},
        'relations', jsonb_build_object(
          'outgoing', ${npcSearchDataView.outgoingRelations}, 
          'incoming', ${npcSearchDataView.incomingRelations}
        )
      )`.as("raw_data"),
			content: sql<string>`${deepText(npcSearchDataView.entityMain)} || ' ' ||
      ${deepText(npcSearchDataView.factionMemberships)} || ' ' ||
      ${deepText(npcSearchDataView.siteAssociations)}`.as("content"),
			contentTsv: weightedSearchVector(npcSearchDataView.entityMain, sql`jsonb_build_object(
          'factionMemberships', ${npcSearchDataView.factionMemberships},
          'siteAssociations', ${npcSearchDataView.siteAssociations}
        )`).as("content_tsv"),
		})
		.from(npcSearchDataView)

	// Union with quests
	const questsQuery = qb
		.select({
			id: sql<string>`${questSearchDataView.id}::text`.as("id"),
			sourceTable: questSearchDataView.sourceTable,
			name: sql<string>`${questSearchDataView.entityMain}->>'name'`.as("name"),
			slug: sql<string>`${questSearchDataView.entityMain}->>'slug'`.as("slug"),
			rawData: sql`jsonb_build_object(
        'quest', ${questSearchDataView.entityMain},
        'stages', ${questSearchDataView.stages},
        'hooks', ${questSearchDataView.hooks},
        'participants', ${questSearchDataView.participants},
        'affectingConsequences', ${questSearchDataView.affectingConsequences},
        'triggeredConsequences', ${questSearchDataView.triggeredConsequences},
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
			content: sql<string>`${deepText(questSearchDataView.entityMain)} || ' ' ||
      ${deepText(questSearchDataView.stages)}`.as("content"),
			contentTsv: weightedSearchVector(questSearchDataView.entityMain, questSearchDataView.stages).as("content_tsv"),
		})
		.from(questSearchDataView)

	// Union with factions
	const factionsQuery = qb
		.select({
			id: sql<string>`${factionSearchDataView.id}::text`.as("id"),
			sourceTable: factionSearchDataView.sourceTable,
			name: sql<string>`${factionSearchDataView.entityMain}->>'name'`.as("name"),
			slug: sql<string>`${factionSearchDataView.entityMain}->>'slug'`.as("slug"),
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
        'foreshadowing', ${factionSearchDataView.incomingForeshadowing},
        'itemConnections', ${factionSearchDataView.itemConnections},
        'loreLinks', ${factionSearchDataView.loreLinks},
        'relations', jsonb_build_object(
          'incoming', ${factionSearchDataView.incomingRelations}, 
          'outgoing', ${factionSearchDataView.outgoingRelations}
        )
      )`.as("raw_data"),
			content: sql<string>`${deepText(factionSearchDataView.entityMain)} || ' ' ||
      ${deepText(factionSearchDataView.agendas)} || ' ' ||
      ${deepText(factionSearchDataView.members)}`.as("content"),
			contentTsv: weightedSearchVector(factionSearchDataView.entityMain, sql`jsonb_build_object(
          'agendas', ${factionSearchDataView.agendas},
          'members', ${factionSearchDataView.members}
        )`).as("content_tsv"),
		})
		.from(factionSearchDataView)

	// Union with conflicts
	const conflictsQuery = qb
		.select({
			id: sql<string>`${conflictSearchDataView.id}::text`.as("id"),
			sourceTable: conflictSearchDataView.sourceTable,
			name: sql<string>`${conflictSearchDataView.entityMain}->>'name'`.as("name"),
			slug: sql<string>`${conflictSearchDataView.entityMain}->>'slug'`.as("slug"),
			rawData: sql`jsonb_build_object(
        'conflict', ${conflictSearchDataView.entityMain},
        'region', ${conflictSearchDataView.region},
        'participants', ${conflictSearchDataView.participants},
        'affectedByConsequences', ${conflictSearchDataView.affectedByConsequences},
        'incomingForeshadowing', ${conflictSearchDataView.incomingForeshadowing},
        'itemConnections', ${conflictSearchDataView.itemConnections},
        'loreLinks', ${conflictSearchDataView.loreLinks}
      )`.as("raw_data"),
			content: sql<string>`${deepText(conflictSearchDataView.entityMain)} || ' ' ||
      ${deepText(conflictSearchDataView.participants)} || ' ' ||
      ${deepText(conflictSearchDataView.affectedByConsequences)}`.as("content"),
			contentTsv: weightedSearchVector(conflictSearchDataView.entityMain, sql`jsonb_build_object(
          'participants', ${conflictSearchDataView.participants},
          'affectedByConsequences', ${conflictSearchDataView.affectedByConsequences}
        )`).as("content_tsv"),
		})
		.from(conflictSearchDataView)

	// Union with items
	const itemsQuery = qb
		.select({
			id: sql<string>`${itemSearchDataView.id}::text`.as("id"),
			sourceTable: itemSearchDataView.sourceTable,
			name: sql<string>`${itemSearchDataView.entityMain}->>'name'`.as("name"),
			slug: sql<string>`${itemSearchDataView.entityMain}->>'slug'`.as("slug"),
			rawData: sql`jsonb_build_object(
        'item', ${itemSearchDataView.entityMain},
        'relations', jsonb_build_object(
          'outgoing', ${itemSearchDataView.relations},
          'incoming', ${itemSearchDataView.incomingRelations}
        ),
        'incomingForeshadowing', ${itemSearchDataView.incomingForeshadowing}
      )`.as("raw_data"),
			content: sql<string>`${deepText(itemSearchDataView.entityMain)} || ' ' ||
      ${deepText(itemSearchDataView.relations)}`.as("content"),
			contentTsv: weightedSearchVector(itemSearchDataView.entityMain, itemSearchDataView.relations).as("content_tsv"),
		})
		.from(itemSearchDataView)

	// Union with foreshadowing
	const foreshadowingQuery = qb
		.select({
			id: sql<string>`${foreshadowingSearchDataView.id}::text`.as("id"),
			sourceTable: foreshadowingSearchDataView.sourceTable,
			name: sql<string>`${foreshadowingSearchDataView.entityMain}->>'name'`.as("name"),
			slug: sql<string>`${foreshadowingSearchDataView.entityMain}->>'slug'`.as("slug"),
			rawData: sql`jsonb_build_object(
        'foreshadowing', ${foreshadowingSearchDataView.entityMain},
        'sourceQuest', ${foreshadowingSearchDataView.sourceQuest},
        'sourceQuestStage', ${foreshadowingSearchDataView.sourceQuestStage},
        'sourceSite', ${foreshadowingSearchDataView.sourceSite},
        'sourceNpc', ${foreshadowingSearchDataView.sourceNpc},
        'sourceLore', ${foreshadowingSearchDataView.sourceLore},
        'targetQuest', ${foreshadowingSearchDataView.targetQuest},
        'targetNpc', ${foreshadowingSearchDataView.targetNpc},
        'targetConflict', ${foreshadowingSearchDataView.targetConflict},
        'targetItem', ${foreshadowingSearchDataView.targetItem},
        'targetLore', ${foreshadowingSearchDataView.targetLore},
        'targetFaction', ${foreshadowingSearchDataView.targetFaction},
        'targetSite', ${foreshadowingSearchDataView.targetSite}
      )`.as("raw_data"),
			content: sql<string>`${deepText(foreshadowingSearchDataView.entityMain)} || ' ' ||
      ${deepText(foreshadowingSearchDataView.sourceQuest)} || ' ' ||
      ${deepText(foreshadowingSearchDataView.targetQuest)}`.as("content"),
			contentTsv: weightedSearchVector(foreshadowingSearchDataView.entityMain, sql`jsonb_build_object(
          'sourceQuest', ${foreshadowingSearchDataView.sourceQuest},
          'targetQuest', ${foreshadowingSearchDataView.targetQuest}
        )`).as("content_tsv"),
		})
		.from(foreshadowingSearchDataView)

	// Union with lore
	const loreQuery = qb
		.select({
			id: sql<string>`${loreSearchDataView.id}::text`.as("id"),
			sourceTable: loreSearchDataView.sourceTable,
			name: sql<string>`${loreSearchDataView.entityMain}->>'name'`.as("name"),
			slug: sql<string>`${loreSearchDataView.entityMain}->>'slug'`.as("slug"),
			rawData: sql`jsonb_build_object(
        'lore', ${loreSearchDataView.entityMain},
        'links', ${loreSearchDataView.links},
        'foreshadowing', jsonb_build_object(
          'incoming', ${loreSearchDataView.incomingForeshadowing},
          'outgoing', ${loreSearchDataView.outgoingForeshadowing}
        )
      )`.as("raw_data"),
			content: sql<string>`${deepText(loreSearchDataView.entityMain)}`.as("content"),
			contentTsv: weightedSearchVector(loreSearchDataView.entityMain, loreSearchDataView.links).as("content_tsv"),
		})
		.from(loreSearchDataView)

	// Union with quest stages
	const questStagesQuery = qb
		.select({
			id: sql<string>`${questStageSearchDataView.id}::text`.as("id"),
			sourceTable: questStageSearchDataView.sourceTable,
			name: sql<string>`${questStageSearchDataView.entityMain}->>'name'`.as("name"),
			slug: sql<string>`${questStageSearchDataView.entityMain}->>'slug'`.as("slug"),
			rawData: sql`jsonb_build_object(
        'questStage', ${questStageSearchDataView.entityMain},
        'quest', ${questStageSearchDataView.quest},
        'site', ${questStageSearchDataView.site},
        'deliveryNpc', ${questStageSearchDataView.deliveryNpc},
        'outgoingDecisions', ${questStageSearchDataView.outgoingDecisions},
        'incomingDecisions', ${questStageSearchDataView.incomingDecisions},
        'items', ${questStageSearchDataView.items},
        'npcInvolvement', ${questStageSearchDataView.npcInvolvement},
        'outgoingForeshadowing', ${questStageSearchDataView.outgoingForeshadowing}
      )`.as("raw_data"),
			content: sql<string>`${deepText(questStageSearchDataView.entityMain)} || ' ' ||
      ${deepText(questStageSearchDataView.quest)} || ' ' ||
      ${deepText(questStageSearchDataView.site)}`.as("content"),
			contentTsv: weightedSearchVector(questStageSearchDataView.entityMain, sql`jsonb_build_object(
          'quest', ${questStageSearchDataView.quest},
          'site', ${questStageSearchDataView.site}
        )`).as("content_tsv"),
		})
		.from(questStageSearchDataView)

	// Union with quest stage decisions
	const questStageDecisionsQuery = qb
		.select({
			id: sql<string>`${questStageDecisionSearchDataView.id}::text`.as("id"),
			sourceTable: questStageDecisionSearchDataView.sourceTable,
			name: sql<string>`${questStageDecisionSearchDataView.entityMain}->>'name'`.as("name"),
			slug: sql<string>`${questStageDecisionSearchDataView.entityMain}->>'slug'`.as("slug"),
			rawData: sql`jsonb_build_object(
        'questStageDecision', ${questStageDecisionSearchDataView.entityMain},
        'quest', ${questStageDecisionSearchDataView.quest},
        'fromStage', ${questStageDecisionSearchDataView.fromStage},
        'toStage', ${questStageDecisionSearchDataView.toStage},
        'consequences', ${questStageDecisionSearchDataView.consequences}
      )`.as("raw_data"),
			content: sql<string>`${deepText(questStageDecisionSearchDataView.entityMain)} || ' ' ||
      ${deepText(questStageDecisionSearchDataView.quest)} || ' ' ||
      ${deepText(questStageDecisionSearchDataView.fromStage)}`.as("content"),
			contentTsv: weightedSearchVector(questStageDecisionSearchDataView.entityMain, sql`jsonb_build_object(
          'quest', ${questStageDecisionSearchDataView.quest},
          'fromStage', ${questStageDecisionSearchDataView.fromStage}
        )`).as("content_tsv"),
		})
		.from(questStageDecisionSearchDataView)

	// Union with areas
	const areasQuery = qb
		.select({
			id: sql<string>`${areaSearchDataView.id}::text`.as("id"),
			sourceTable: areaSearchDataView.sourceTable,
			name: sql<string>`${areaSearchDataView.entityMain}->>'name'`.as("name"),
			slug: sql<string>`${areaSearchDataView.entityMain}->>'slug'`.as("slug"),
			rawData: sql`jsonb_build_object(
        'area', ${areaSearchDataView.entityMain},
        'region', ${areaSearchDataView.region},
        'sites', ${areaSearchDataView.sites},
        'consequences', ${areaSearchDataView.consequences},
        'factionInfluence', ${areaSearchDataView.factionInfluence}
      )`.as("raw_data"),
			content: sql<string>`${deepText(areaSearchDataView.entityMain)} || ' ' ||
      ${deepText(areaSearchDataView.region)} || ' ' ||
      ${deepText(areaSearchDataView.sites)}`.as("content"),
			contentTsv: weightedSearchVector(areaSearchDataView.entityMain, sql`jsonb_build_object(
          'region', ${areaSearchDataView.region},
          'sites', ${areaSearchDataView.sites}
        )`).as("content_tsv"),
		})
		.from(areaSearchDataView)

	// Union with consequences
	const consequencesQuery = qb
		.select({
			id: sql<string>`${consequenceSearchDataView.id}::text`.as("id"),
			sourceTable: consequenceSearchDataView.sourceTable,
			name: sql<string>`${consequenceSearchDataView.entityMain}->>'name'`.as("name"),
			slug: sql<string>`${consequenceSearchDataView.entityMain}->>'slug'`.as("slug"),
			rawData: sql`jsonb_build_object(
        'consequence', ${consequenceSearchDataView.entityMain},
        'triggerQuest', ${consequenceSearchDataView.triggerQuest},
        'affectedFaction', ${consequenceSearchDataView.affectedFaction},
        'affectedRegion', ${consequenceSearchDataView.affectedRegion},
        'affectedArea', ${consequenceSearchDataView.affectedArea},
        'affectedSite', ${consequenceSearchDataView.affectedSite},
        'affectedNpc', ${consequenceSearchDataView.affectedNpc},
        'affectedConflict', ${consequenceSearchDataView.affectedConflict},
        'affectedQuest', ${consequenceSearchDataView.affectedQuest}
      )`.as("raw_data"),
			content: sql<string>`${deepText(consequenceSearchDataView.entityMain)} || ' ' ||
      ${deepText(consequenceSearchDataView.triggerQuest)} || ' ' ||
      ${deepText(consequenceSearchDataView.affectedFaction)} || ' ' ||
      ${deepText(consequenceSearchDataView.affectedRegion)} || ' ' ||
      ${deepText(consequenceSearchDataView.affectedArea)} || ' ' ||
      ${deepText(consequenceSearchDataView.affectedSite)} || ' ' ||
      ${deepText(consequenceSearchDataView.affectedNpc)} || ' ' ||
      ${deepText(consequenceSearchDataView.affectedConflict)} || ' ' ||
      ${deepText(consequenceSearchDataView.affectedQuest)}`.as("content"),
			contentTsv: weightedSearchVector(consequenceSearchDataView.entityMain, sql`jsonb_build_object(
          'triggerQuest', ${consequenceSearchDataView.triggerQuest},
          'affectedFaction', ${consequenceSearchDataView.affectedFaction},
          'affectedRegion', ${consequenceSearchDataView.affectedRegion},
          'affectedArea', ${consequenceSearchDataView.affectedArea},
          'affectedSite', ${consequenceSearchDataView.affectedSite},
          'affectedNpc', ${consequenceSearchDataView.affectedNpc},
          'affectedConflict', ${consequenceSearchDataView.affectedConflict},
          'affectedQuest', ${consequenceSearchDataView.affectedQuest}
        )`).as("content_tsv"),
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
		.unionAll(consequencesQuery)
		.unionAll(questStagesQuery)
		.unionAll(questStageDecisionsQuery)
})
