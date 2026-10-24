import { eq, sql } from "drizzle-orm"
import { alias, pgView } from "drizzle-orm/pg-core"
import { consequences } from "../consequences/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemConnections, items } from "../items/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { sites } from "../regions/tables"
import { entityJson, entityJsonWhen, jsonAgg, jsonObject } from "../view-utils"
import { npcStageInvolvement, questStageDecisions, questStages } from "./tables"

const outgoingDecisions = alias(questStageDecisions, "outgoing_decisions")
const toStage = alias(questStages, "to_stage")
const incomingDecisions = alias(questStageDecisions, "incoming_decisions")
const fromStage = alias(questStages, "from_stage")
const involvedNpc = alias(npcs, "involved_npc")

export const questStageSearchDataView = pgView("quest_stage_search_data_view").as((qb) =>
	qb
		.select({
			id: questStages.id,
			sourceTable: sql<string>`'quest_stages'`.as("source_table"),
			entityMain: sql`to_jsonb(${questStages}.*)`.as("entity_main"),
			quest: entityJson(quests).as("quest"),
			site: entityJsonWhen(questStages.siteId, sites).as("site"),
			deliveryNpc: entityJsonWhen(questStages.deliveryNpcId, npcs).as("delivery_npc"),
			outgoingDecisions: jsonAgg(
				jsonObject([sql`'decision', to_jsonb(${outgoingDecisions}.*)`, sql`'toStage', ${entityJson(toStage)}`]),
				outgoingDecisions.id,
			).as("outgoing_decisions"),
			incomingDecisions: jsonAgg(
				jsonObject([sql`'decision', to_jsonb(${incomingDecisions}.*)`, sql`'fromStage', ${entityJson(fromStage)}`]),
				incomingDecisions.id,
			).as("incoming_decisions"),
			items: jsonAgg(entityJson(items), items.id).as("items"),
			npcInvolvement: jsonAgg(
				jsonObject([
					sql`'involvement', to_jsonb(${npcStageInvolvement}.*)`,
					sql`'npc', ${entityJson(involvedNpc)}`,
				]),
				npcStageInvolvement.id,
			).as("npc_involvement"),
			outgoingForeshadowing: jsonAgg(sql`to_jsonb(${foreshadowing}.*)`, foreshadowing.id).as("outgoing_foreshadowing"),
		})
		.from(questStages)
		.innerJoin(quests, eq(questStages.questId, quests.id))
		.leftJoin(sites, eq(questStages.siteId, sites.id))
		.leftJoin(npcs, eq(questStages.deliveryNpcId, npcs.id))
		.leftJoin(outgoingDecisions, eq(outgoingDecisions.fromQuestStageId, questStages.id))
		.leftJoin(toStage, eq(outgoingDecisions.toQuestStageId, toStage.id))
		.leftJoin(incomingDecisions, eq(incomingDecisions.toQuestStageId, questStages.id))
		.leftJoin(fromStage, eq(incomingDecisions.fromQuestStageId, fromStage.id))
		.leftJoin(itemConnections, eq(itemConnections.connectedQuestStageId, questStages.id))
		.leftJoin(items, eq(itemConnections.itemId, items.id))
		.leftJoin(npcStageInvolvement, eq(npcStageInvolvement.questStageId, questStages.id))
		.leftJoin(involvedNpc, eq(npcStageInvolvement.npcId, involvedNpc.id))
		.leftJoin(foreshadowing, eq(foreshadowing.sourceQuestStageId, questStages.id))
		.groupBy(questStages.id, quests.id, sites.id, npcs.id),
)

const decisionFromStage = alias(questStages, "decision_from_stage")
const decisionToStage = alias(questStages, "decision_to_stage")

export const questStageDecisionSearchDataView = pgView("quest_stage_decision_search_data_view").as((qb) =>
	qb
		.select({
			id: questStageDecisions.id,
			sourceTable: sql<string>`'quest_stage_decisions'`.as("source_table"),
			entityMain: sql`to_jsonb(${questStageDecisions}.*)`.as("entity_main"),
			quest: entityJson(quests).as("quest"),
			fromStage: entityJson(decisionFromStage).as("from_stage"),
			toStage: entityJsonWhen(questStageDecisions.toQuestStageId, decisionToStage).as("to_stage"),
			consequences: jsonAgg(
				sql`jsonb_build_object('id', ${consequences.id}, 'name', ${consequences.name}, 'description', ${consequences.description})`,
				consequences.id,
			).as("consequences"),
		})
		.from(questStageDecisions)
		.innerJoin(decisionFromStage, eq(questStageDecisions.fromQuestStageId, decisionFromStage.id))
		.innerJoin(quests, eq(decisionFromStage.questId, quests.id))
		.leftJoin(decisionToStage, eq(questStageDecisions.toQuestStageId, decisionToStage.id))
		.leftJoin(consequences, eq(consequences.triggerQuestStageDecisionId, questStageDecisions.id))
		.groupBy(questStageDecisions.id, quests.id, decisionFromStage.id, decisionToStage.id),
)
