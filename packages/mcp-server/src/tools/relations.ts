import type { Tool } from "@modelcontextprotocol/sdk/types"
import { npcQuests } from "@tome-keeper/shared"
import { db, type ToolHandlers } from "../index"
import logger from "../logger"
import { z } from "zod"
import { eq } from "drizzle-orm"

export type RelationToolNames =
	| "associate_npc_quest"
	| "associate_npc_location"
	| "associate_npc_faction"
	| "associate_location_faction"
	| "associate_location_quest"
	| "associate_faction_quest"
	| "associate_faction_npc"
	| "associate_faction_location"
	| "get_quest_npcs"
	| "get_quest_locations"
	| "get_quest_factions"
	| "get_location_npcs"
	| "get_location_factions"
	| "get_faction_npcs"
	| "get_faction_locations"
	| "get_faction_quests"
	| "get_npc_quests"
	| "get_npc_locations"
	| "get_npc_factions"

export const relationTools: Array<Tool & { name: RelationToolNames }> = [
	{
		name: "associate_npc_quest",
		description: "Associate an NPC with a quest",
		inputSchema: {
			type: "object",
			properties: {
				npcId: { type: "number" },
				questId: { type: "number" },
			},
			required: ["npcId", "questId"],
		},
	},
	{
		name: "associate_npc_location",
		description: "Associate an NPC with a location",
		inputSchema: {
			type: "object",
			properties: {
				npcId: { type: "number" },
				locationId: { type: "number" },
			},
			required: ["npcId", "locationId"],
		},
	},
	{
		name: "associate_npc_faction",
		description: "Associate an NPC with a faction",
		inputSchema: {
			type: "object",
			properties: {
				npcId: { type: "number" },
				factionId: { type: "number" },
			},
			required: ["npcId", "factionId"],
		},
	},
	{
		name: "associate_location_faction",
		description: "Associate a location with a faction",
		inputSchema: {
			type: "object",
			properties: {
				locationId: { type: "number" },
				factionId: { type: "number" },
			},
			required: ["locationId", "factionId"],
		},
	},
	{
		name: "associate_location_quest",
		description: "Associate a location with a quest",
		inputSchema: {
			type: "object",
			properties: {
				locationId: { type: "number" },
				questId: { type: "number" },
			},
			required: ["locationId", "questId"],
		},
	},
	{
		name: "associate_faction_quest",
		description: "Associate a faction with a quest",
		inputSchema: {
			type: "object",
			properties: {
				factionId: { type: "number" },
				questId: { type: "number" },
			},
			required: ["factionId", "questId"],
		},
	},
	{
		name: "associate_faction_npc",
		description: "Associate a faction with an NPC",
		inputSchema: {
			type: "object",
			properties: {
				factionId: { type: "number" },
				npcId: { type: "number" },
			},
			required: ["factionId", "npcId"],
		},
	},
	{
		name: "associate_faction_location",
		description: "Associate a faction with a location",
		inputSchema: {
			type: "object",
			properties: {
				factionId: { type: "number" },
				locationId: { type: "number" },
			},
			required: ["factionId", "locationId"],
		},
	},
]

export const relationToolHandlers: ToolHandlers<RelationToolNames> = {
	get_quest_npcs: async (args) => {
		if (!args) throw new Error("No arguments provided")
		const parsed = z.object({ questId: z.number() }).parse(args)
		logger.info("Getting NPCs for quest", { parsed })
		try {
			const result = await db.select().from(npcQuests).where(eq(npcQuests.questId, parsed.questId))
			logger.info("NPCs retrieved", { result })
			return { content: [{ type: "text", text: JSON.stringify(result) }] }
		} catch (error) {
			logger.error("Failed to get NPCs for quest", {
				error: (error as Error).message,
			})
			return {
				content: [
					{
						type: "text",
						text: `Error getting NPCs for quest: ${(error as Error).message}`,
					},
				],
			}
		}
	},

	associate_npc_quest: async (args) => {
		if (!args) throw new Error("No arguments provided")
		const parsed = z.object({ npcId: z.number(), questId: z.number() }).parse(args)
		logger.info("Associating NPC with quest", { parsed })
		try {
			const result = await db
				.insert(npcQuests)
				.values(parsed as any)
				.execute()
			logger.info("NPC associated with quest", { id: result })
			return { content: [{ type: "text", text: JSON.stringify({ id: result }) }] }
		} catch (error) {
			logger.error("Failed to associate NPC with quest", {
				error: (error as Error).message,
			})
			return {
				content: [
					{
						type: "text",
						text: `Error associating NPC with quest: ${(error as Error).message}`,
					},
				],
			}
		}
	},
	associate_npc_location: function (
		args,
	): Promise<{ content: Array<{ type: string; text: string }> }> {
		throw new Error("Function not implemented.")
	},
	associate_npc_faction: function (
		args,
	): Promise<{ content: Array<{ type: string; text: string }> }> {
		throw new Error("Function not implemented.")
	},
	associate_location_faction: function (
		args,
	): Promise<{ content: Array<{ type: string; text: string }> }> {
		throw new Error("Function not implemented.")
	},
	associate_location_quest: function (
		args,
	): Promise<{ content: Array<{ type: string; text: string }> }> {
		throw new Error("Function not implemented.")
	},
	associate_faction_quest: function (
		args,
	): Promise<{ content: Array<{ type: string; text: string }> }> {
		throw new Error("Function not implemented.")
	},
	associate_faction_npc: function (
		args,
	): Promise<{ content: Array<{ type: string; text: string }> }> {
		throw new Error("Function not implemented.")
	},
	associate_faction_location: function (
		args,
	): Promise<{ content: Array<{ type: string; text: string }> }> {
		throw new Error("Function not implemented.")
	},
	get_quest_locations: function (
		args,
	): Promise<{ content: Array<{ type: string; text: string }> }> {
		throw new Error("Function not implemented.")
	},
	get_quest_factions: function (args): Promise<{ content: Array<{ type: string; text: string }> }> {
		throw new Error("Function not implemented.")
	},
	get_location_npcs: function (args): Promise<{ content: Array<{ type: string; text: string }> }> {
		throw new Error("Function not implemented.")
	},
	get_location_factions: function (
		args,
	): Promise<{ content: Array<{ type: string; text: string }> }> {
		throw new Error("Function not implemented.")
	},
	get_faction_npcs: function (args): Promise<{ content: Array<{ type: string; text: string }> }> {
		throw new Error("Function not implemented.")
	},
	get_faction_locations: function (
		args,
	): Promise<{ content: Array<{ type: string; text: string }> }> {
		throw new Error("Function not implemented.")
	},
	get_faction_quests: function (args): Promise<{ content: Array<{ type: string; text: string }> }> {
		throw new Error("Function not implemented.")
	},
	get_npc_quests: function (args): Promise<{ content: Array<{ type: string; text: string }> }> {
		throw new Error("Function not implemented.")
	},
	get_npc_locations: function (args): Promise<{ content: Array<{ type: string; text: string }> }> {
		throw new Error("Function not implemented.")
	},
	get_npc_factions: function (args): Promise<{ content: Array<{ type: string; text: string }> }> {
		throw new Error("Function not implemented.")
	},
}
