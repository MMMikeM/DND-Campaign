import { tables } from "@tome-master/shared"
import { eq } from "drizzle-orm"
import { db } from "../index"
import { schemas, tableEnum } from "./association-tools-schema"
import { createManageEntityHandler, createManageSchema } from "./tool.utils"
import type { CreateEntityGetters, ToolDefinition } from "./utils/types"

const {
	associationTables: {
		clues,
		items,
		factionQuestInvolvement,
		npcQuestRoles,
		factionTerritorialControl,
		questHookNpcs,
		questIntroductions,
		regionConnectionDetails,
	},
} = tables

type AssociationGetters = CreateEntityGetters<typeof tables.associationTables>

export const entityGetters: AssociationGetters = {
	all_clues: () => db.query.clues.findMany({}),
	all_items: () => db.query.items.findMany({}),
	all_faction_quest_involvement: () => db.query.factionQuestInvolvement.findMany({}),
	all_npc_quest_roles: () => db.query.npcQuestRoles.findMany({}),
	all_faction_territorial_control: () => db.query.factionTerritorialControl.findMany({}),
	all_quest_hook_npcs: () => db.query.questHookNpcs.findMany({}),
	all_quest_introductions: () => db.query.questIntroductions.findMany({}),
	all_region_connection_details: () => db.query.regionConnectionDetails.findMany({}),

	clue_by_id: (id: number) =>
		db.query.clues.findFirst({
			where: eq(clues.id, id),
			with: {
				stage: true,
				npc: { columns: { name: true, id: true } },
				site: { columns: { name: true, id: true } },
				faction: { columns: { name: true, id: true } },
			},
		}),
	item_by_id: (id: number) =>
		db.query.items.findFirst({
			where: eq(items.id, id),
			with: {
				npc: { columns: { name: true, id: true } },
				site: { columns: { name: true, id: true } },
				quest: { columns: { name: true, id: true } },
				stage: { columns: { name: true, id: true } },
				faction: { columns: { name: true, id: true } },
			},
		}),
	faction_quest_involvement_by_id: (id: number) =>
		db.query.factionQuestInvolvement.findFirst({
			where: eq(factionQuestInvolvement.id, id),
			with: { faction: true, quest: true },
		}),
	npc_quest_role_by_id: (id: number) =>
		db.query.npcQuestRoles.findFirst({
			where: eq(npcQuestRoles.id, id),
			with: { npc: true, quest: true },
		}),
	faction_territorial_control_by_id: (id: number) =>
		db.query.factionTerritorialControl.findFirst({
			where: eq(factionTerritorialControl.id, id),
			with: {
				faction: true,
				region: true,
				area: true,
				site: true,
			},
		}),
	quest_hook_npc_by_id: (id: number) =>
		db.query.questHookNpcs.findFirst({
			where: eq(questHookNpcs.id, id),
			with: {
				npc: true,
				hook: true,
			},
		}),
	quest_introduction_by_id: (id: number) =>
		db.query.questIntroductions.findFirst({
			where: eq(questIntroductions.id, id),
			with: {
				quest: true,
				faction: true,
				npcs: true,
				site: true,
				stage: true,
			},
		}),
	region_connection_detail_by_id: (id: number) =>
		db.query.regionConnectionDetails.findFirst({
			where: eq(regionConnectionDetails.id, id),
			with: {
				connection: { with: { details: true, sourceRegion: true, targetRegion: true } },
				controllingFaction: true,
			},
		}),
}

export const associationToolDefinitions: Record<"manage_association", ToolDefinition> = {
	manage_association: {
		description: "Manage association-related entities.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_association", tables.associationTables, tableEnum, schemas),
	},
}
