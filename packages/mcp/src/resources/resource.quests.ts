import { db } from "../index"
import { createResourceUri, createRelationUri, logResourceError } from "./resource.utils"
import type { Resource } from "@modelcontextprotocol/sdk/types.js"

// Resource fetcher for quests
export async function fetchQuest(id: number) {
	return await db.query.quests.findFirst({
		where: (quests, { eq }) => eq(quests.id, id),
	})
}

// Relation fetchers for quest-related data
export const questRelationFetchers = {
	quest_npcs: async (questId: number) => {
		return await db.query.questNpcs.findMany({
			where: (questNpcs, { eq }) => eq(questNpcs.questId, questId),
			with: { npc: true },
		})
	},

	quest_locations: async (questId: number) => {
		return await db.query.questLocations.findMany({
			where: (questLocations, { eq }) => eq(questLocations.questId, questId),
			with: { location: true },
		})
	},

	quest_factions: async (questId: number) => {
		return await db.query.questFactions.findMany({
			where: (questFactions, { eq }) => eq(questFactions.questId, questId),
			with: { faction: true },
		})
	},

	quest_stages: async (questId: number) => {
		return await db.query.questStages.findMany({
			where: (questStages, { eq }) => eq(questStages.questId, questId),
		})
	},

	quest_decisions: async (questId: number) => {
		const data = await db.query.quests.findFirst({
			where: (quests, { eq }) => eq(quests.id, questId),
			with: {
				stages: {
					with: {
						decisions: true,
					},
				},
			},
		})
		return data || { stages: [] }
	},

	quest_clues: async (questId: number) => {
		return await db.query.questClues.findMany({
			where: (questClues, { eq }) => eq(questClues.questId, questId),
			with: {
				location: true,
				npc: true,
			},
		})
	},

	quest_relations: async (questId: number) => {
		const result = await db.query.quests.findFirst({
			where: (quests, { eq }) => eq(quests.id, questId),
			with: {
				relatedQuests: true,
			},
		})
		return result || { relatedQuests: [] }
	},
}

// List all quest resources
export async function listQuestResources(): Promise<Resource[]> {
	const resources: Resource[] = []

	try {
		const quests = await db.query.quests.findMany({
			columns: { id: true, name: true, type: true },
		})

		quests.forEach((quest) => {
			resources.push({
				uri: createResourceUri("quests", quest.id),
				name: `Quest: ${quest.name}`,
				description: `${quest.type} quest "${quest.name}"`,
				mimeType: "application/json",
			})

			// Add related resources
			resources.push({
				uri: createRelationUri("quest_npcs", quest.id),
				name: `NPCs for "${quest.name}"`,
				description: `All NPCs involved in the quest "${quest.name}"`,
				mimeType: "application/json",
			})

			resources.push({
				uri: createRelationUri("quest_locations", quest.id),
				name: `Locations for "${quest.name}"`,
				description: `All locations involved in the quest "${quest.name}"`,
				mimeType: "application/json",
			})

			// Add other relation resources as needed
		})
	} catch (error) {
		logResourceError("listing quest resources", "quests", error)
	}

	return resources
}

// Get quest resource templates
export function getQuestResourceTemplates() {
	return [
		{
			uriTemplate: "tomekeeper://entity/quests/{id}",
			name: "Quest Details",
			description: "Details of a specific quest",
			mimeType: "application/json",
		},
		{
			uriTemplate: "tomekeeper://relation/quest_npcs/{questId}",
			name: "Quest NPCs",
			description: "NPCs involved in a specific quest",
			mimeType: "application/json",
		},
		{
			uriTemplate: "tomekeeper://relation/quest_locations/{questId}",
			name: "Quest Locations",
			description: "Locations involved in a specific quest",
			mimeType: "application/json",
		},
		// Add other templates
	]
}
