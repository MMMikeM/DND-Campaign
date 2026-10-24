import { eq, sql } from "drizzle-orm"
import { alias, type PgColumn, pgView } from "drizzle-orm/pg-core"
import { consequences } from "../consequences/tables"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemConnections } from "../items/tables"
import { loreLinks } from "../lore/tables"
import { npcs } from "../npcs/tables"
import { sites } from "../regions/tables"
import { questStages } from "../stages/tables"
import { entityJson, jsonAgg, jsonObject, optionalEntityJson } from "../view-utils"
import { questHooks, questParticipants, questRelations, quests } from "./tables"

const triggeredConsequences = alias(consequences, "triggered_consequences")
const affectingConsequences = alias(consequences, "affecting_consequences")
const outgoingRelations = alias(questRelations, "outgoing_relations")
const targetQuest = alias(quests, "target_quest")
const incomingRelations = alias(questRelations, "incoming_relations")
const sourceQuest = alias(quests, "source_quest")
const stageDeliveryNpc = alias(npcs, "stage_delivery_npc")
const hookSite = alias(sites, "hook_site")
const hookFaction = alias(factions, "hook_faction")
const hookNpc = alias(npcs, "hook_npc")
const participantNpc = alias(npcs, "participant_npc")
const participantFaction = alias(factions, "participant_faction")
const outgoingForeshadowing = alias(foreshadowing, "outgoing_foreshadowing")
const incomingForeshadowing = alias(foreshadowing, "incoming_foreshadowing")

const consequenceJson = (consequence: { id: PgColumn; name: PgColumn; description: PgColumn }) =>
	sql`jsonb_build_object('id', ${consequence.id}, 'name', ${consequence.name}, 'description', ${consequence.description})`

export const questSearchDataView = pgView("quest_search_data_view").as((qb) =>
	qb
		.select({
			id: quests.id,
			sourceTable: sql<string>`'quests'`.as("source_table"),
			entityMain: sql`to_jsonb(${quests}.*)`.as("entity_main"),
			outgoingRelations: jsonAgg(
				jsonObject([
					sql`'relationship', to_jsonb(${outgoingRelations}.*)`,
					sql`'targetQuest', ${entityJson(targetQuest)}`,
				]),
				outgoingRelations.id,
			).as("outgoing_relations"),
			incomingRelations: jsonAgg(
				jsonObject([
					sql`'relationship', to_jsonb(${incomingRelations}.*)`,
					sql`'sourceQuest', ${entityJson(sourceQuest)}`,
				]),
				incomingRelations.id,
			).as("incoming_relations"),
			stages: jsonAgg(
				jsonObject([
					sql`'id', ${questStages.id}`,
					sql`'name', ${questStages.name}`,
					sql`'stage_order', ${questStages.stageOrder}`,
					sql`'stage_type', ${questStages.stageType}`,
					optionalEntityJson("deliveryNpc", questStages.deliveryNpcId, stageDeliveryNpc),
				]),
				questStages.id,
			).as("stages"),
			hooks: jsonAgg(
				jsonObject([
					sql`'hook', to_jsonb(${questHooks}.*)`,
					optionalEntityJson("site", questHooks.siteId, hookSite),
					optionalEntityJson("faction", questHooks.factionId, hookFaction),
					optionalEntityJson("deliveryNpc", questHooks.deliveryNpcId, hookNpc),
				]),
				questHooks.id,
			).as("hooks"),
			participants: jsonAgg(
				jsonObject([
					sql`'involvement', to_jsonb(${questParticipants}.*)`,
					optionalEntityJson("npc", questParticipants.npcId, participantNpc),
					optionalEntityJson("faction", questParticipants.factionId, participantFaction),
				]),
				questParticipants.id,
			).as("participants"),
			triggeredConsequences: jsonAgg(consequenceJson(triggeredConsequences), triggeredConsequences.id).as(
				"triggered_consequences",
			),
			affectingConsequences: jsonAgg(consequenceJson(affectingConsequences), affectingConsequences.id).as(
				"affecting_consequences",
			),
			outgoingForeshadowing: jsonAgg(sql`to_jsonb(${outgoingForeshadowing}.*)`, outgoingForeshadowing.id).as(
				"outgoing_foreshadowing",
			),
			incomingForeshadowing: jsonAgg(sql`to_jsonb(${incomingForeshadowing}.*)`, incomingForeshadowing.id).as(
				"incoming_foreshadowing",
			),
			itemRelations: jsonAgg(sql`to_jsonb(${itemConnections}.*)`, itemConnections.id).as("item_relations"),
			loreLinks: jsonAgg(
				sql`jsonb_build_object('id', ${loreLinks.id}, 'lore_id', ${loreLinks.loreId})`,
				loreLinks.id,
			).as("lore_links"),
		})
		.from(quests)
		.leftJoin(outgoingRelations, eq(outgoingRelations.sourceQuestId, quests.id))
		.leftJoin(targetQuest, eq(outgoingRelations.targetQuestId, targetQuest.id))
		.leftJoin(incomingRelations, eq(incomingRelations.targetQuestId, quests.id))
		.leftJoin(sourceQuest, eq(incomingRelations.sourceQuestId, sourceQuest.id))
		.leftJoin(questStages, eq(questStages.questId, quests.id))
		.leftJoin(stageDeliveryNpc, eq(questStages.deliveryNpcId, stageDeliveryNpc.id))
		.leftJoin(questHooks, eq(questHooks.questId, quests.id))
		.leftJoin(hookSite, eq(questHooks.siteId, hookSite.id))
		.leftJoin(hookFaction, eq(questHooks.factionId, hookFaction.id))
		.leftJoin(hookNpc, eq(questHooks.deliveryNpcId, hookNpc.id))
		.leftJoin(questParticipants, eq(questParticipants.questId, quests.id))
		.leftJoin(participantNpc, eq(questParticipants.npcId, participantNpc.id))
		.leftJoin(participantFaction, eq(questParticipants.factionId, participantFaction.id))
		.leftJoin(triggeredConsequences, eq(triggeredConsequences.triggerQuestId, quests.id))
		.leftJoin(affectingConsequences, eq(affectingConsequences.affectedQuestId, quests.id))
		.leftJoin(outgoingForeshadowing, eq(outgoingForeshadowing.sourceQuestId, quests.id))
		.leftJoin(incomingForeshadowing, eq(incomingForeshadowing.targetQuestId, quests.id))
		.leftJoin(itemConnections, eq(itemConnections.connectedQuestId, quests.id))
		.leftJoin(loreLinks, eq(loreLinks.questId, quests.id))
		.groupBy(quests.id),
)
