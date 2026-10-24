import { eq, sql } from "drizzle-orm"
import { alias, pgView } from "drizzle-orm/pg-core"
import { conflictParticipants, conflicts } from "../conflicts/tables"
import { consequences } from "../consequences/tables"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemConnections } from "../items/tables"
import { loreLinks } from "../lore/tables"
import { questHooks, quests } from "../quests/tables"
import { sites } from "../regions/tables"
import { npcStageInvolvement, questStages } from "../stages/tables"
import { entityJson, jsonAgg, jsonObject } from "../view-utils"
import { npcFactionMemberships, npcRelations, npcs } from "./tables"

const outgoingForeshadowing = alias(foreshadowing, "outgoing_foreshadowing")
const incomingForeshadowing = alias(foreshadowing, "incoming_foreshadowing")
const hookQuest = alias(quests, "hook_quest")
const deliveryStage = alias(questStages, "delivery_stage")
const deliveryStageQuest = alias(quests, "delivery_stage_quest")
const involvementStage = alias(questStages, "involvement_stage")
const involvementQuest = alias(quests, "involvement_quest")
const outgoingRelations = alias(npcRelations, "outgoing_relations")
const relatedNpc = alias(npcs, "related_npc")
const incomingRelations = alias(npcRelations, "incoming_relations")
const sourceNpc = alias(npcs, "source_npc")

export const npcSearchDataView = pgView("npc_search_data_view").as((qb) =>
	qb
		.select({
			id: npcs.id,
			sourceTable: sql<string>`'npcs'`.as("source_table"),
			entityMain: sql`to_jsonb(${npcs}.*)`.as("entity_main"),
			factionMemberships: jsonAgg(
				jsonObject([
					sql`'membership', to_jsonb(${npcFactionMemberships}.*)`,
					sql`'faction', ${entityJson(factions)}`,
				]),
				npcFactionMemberships.id,
			).as("faction_memberships"),
			conflictParticipation: jsonAgg(
				jsonObject([
					sql`'participant', to_jsonb(${conflictParticipants}.*)`,
					sql`'conflict', ${entityJson(conflicts)}`,
				]),
				conflictParticipants.id,
			).as("conflict_participation"),
			affectedByConsequences: jsonAgg(
				sql`jsonb_build_object('id', ${consequences.id}, 'name', ${consequences.name}, 'description', ${consequences.description})`,
				consequences.id,
			).as("affected_by_consequences"),
			outgoingForeshadowing: jsonAgg(sql`to_jsonb(${outgoingForeshadowing}.*)`, outgoingForeshadowing.id).as(
				"outgoing_foreshadowing",
			),
			incomingForeshadowing: jsonAgg(sql`to_jsonb(${incomingForeshadowing}.*)`, incomingForeshadowing.id).as(
				"incoming_foreshadowing",
			),
			itemConnections: jsonAgg(sql`to_jsonb(${itemConnections}.*)`, itemConnections.id).as("item_connections"),
			questHooks: jsonAgg(
				sql`jsonb_build_object('id', ${questHooks.id}, 'source', ${questHooks.source}, 'hook_content', ${questHooks.hookContent}, 'quest', ${entityJson(hookQuest)})`,
				questHooks.id,
			).as("quest_hooks"),
			questStageDeliveries: jsonAgg(
				jsonObject([sql`'stage', ${entityJson(deliveryStage)}`, sql`'quest', ${entityJson(deliveryStageQuest)}`]),
				deliveryStage.id,
			).as("quest_stage_deliveries"),
			stageInvolvement: jsonAgg(
				jsonObject([
					sql`'involvement', to_jsonb(${npcStageInvolvement}.*)`,
					sql`'stage', ${entityJson(involvementStage)}`,
					sql`'quest', ${entityJson(involvementQuest)}`,
				]),
				npcStageInvolvement.id,
			).as("stage_involvement"),
			loreLinks: jsonAgg(
				sql`jsonb_build_object('id', ${loreLinks.id}, 'lore_id', ${loreLinks.loreId})`,
				loreLinks.id,
			).as("lore_links"),
			outgoingRelations: jsonAgg(
				jsonObject([
					sql`'relationship', to_jsonb(${outgoingRelations}.*)`,
					sql`'relatedNpc', ${entityJson(relatedNpc)}`,
				]),
				outgoingRelations.id,
			).as("outgoing_relations"),
			incomingRelations: jsonAgg(
				jsonObject([
					sql`'relationship', to_jsonb(${incomingRelations}.*)`,
					sql`'sourceNpc', ${entityJson(sourceNpc)}`,
				]),
				incomingRelations.id,
			).as("incoming_relations"),
			siteAssociations: jsonAgg(sql`to_jsonb(${sites}.*)`, sites.id).as("site_associations"),
		})
		.from(npcs)
		.leftJoin(npcFactionMemberships, eq(npcFactionMemberships.npcId, npcs.id))
		.leftJoin(factions, eq(npcFactionMemberships.factionId, factions.id))
		.leftJoin(sites, eq(npcs.siteId, sites.id))
		.leftJoin(conflictParticipants, eq(conflictParticipants.npcId, npcs.id))
		.leftJoin(conflicts, eq(conflictParticipants.conflictId, conflicts.id))
		.leftJoin(consequences, eq(consequences.affectedNpcId, npcs.id))
		.leftJoin(outgoingForeshadowing, eq(outgoingForeshadowing.sourceNpcId, npcs.id))
		.leftJoin(incomingForeshadowing, eq(incomingForeshadowing.targetNpcId, npcs.id))
		.leftJoin(itemConnections, eq(itemConnections.connectedNpcId, npcs.id))
		.leftJoin(questHooks, eq(questHooks.deliveryNpcId, npcs.id))
		.leftJoin(hookQuest, eq(questHooks.questId, hookQuest.id))
		.leftJoin(deliveryStage, eq(deliveryStage.deliveryNpcId, npcs.id))
		.leftJoin(deliveryStageQuest, eq(deliveryStage.questId, deliveryStageQuest.id))
		.leftJoin(npcStageInvolvement, eq(npcStageInvolvement.npcId, npcs.id))
		.leftJoin(involvementStage, eq(npcStageInvolvement.questStageId, involvementStage.id))
		.leftJoin(involvementQuest, eq(involvementStage.questId, involvementQuest.id))
		.leftJoin(loreLinks, eq(loreLinks.npcId, npcs.id))
		.leftJoin(outgoingRelations, eq(outgoingRelations.sourceNpcId, npcs.id))
		.leftJoin(relatedNpc, eq(outgoingRelations.targetNpcId, relatedNpc.id))
		.leftJoin(incomingRelations, eq(incomingRelations.targetNpcId, npcs.id))
		.leftJoin(sourceNpc, eq(incomingRelations.sourceNpcId, sourceNpc.id))
		.groupBy(npcs.id),
)
