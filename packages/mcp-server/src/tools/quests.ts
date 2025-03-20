import type { Tool } from "@modelcontextprotocol/sdk/types"
import { quests, npcs } from "@tome-keeper/shared"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"
import zodToMCP from "../zodToMcp"
import { z } from "zod"
import { eq } from "drizzle-orm"
import { db, type ToolHandlers } from "../index"
import logger from "../logger"

export type QuestToolNames =
	| "mcp_dnd_get_quest"
	| "mcp_dnd_get_all_quests"
	| "mcp_dnd_create_quest"
	| "mcp_dnd_update_quest"
	| "get_quest_npcs"
	| "mcp_dnd_create_npc"

export const questTools: Array<Tool & { name: QuestToolNames }> = [
	{
		name: "mcp_dnd_create_quest",
		description: "Create a new quest",
		inputSchema: zodToMCP(createInsertSchema(quests)),
	},
	{
		name: "mcp_dnd_get_all_quests",
		description: "Get all quests",
		inputSchema: {
			type: "object",
			properties: {},
			required: [],
		},
	},
	{
		name: "mcp_dnd_get_quest",
		description: "Get a quest by ID",
		inputSchema: {
			type: "object",
			properties: {
				id: { type: "number" },
			},
			required: ["id"],
		},
	},
	{
		name: "mcp_dnd_create_npc",
		description: "Create a new NPC",
		inputSchema: zodToMCP(createInsertSchema(npcs)),
	},

	{
		name: "get_quest_npcs",
		description: "Get all NPCs associated with a quest",
		inputSchema: {
			type: "object",
			properties: {
				questId: { type: "number" },
			},
			required: ["questId"],
		},
	},
	{
		name: "mcp_dnd_update_quest",
		description: "Update an existing quest",
		inputSchema: zodToMCP(
			createUpdateSchema(quests).extend({
				id: z.number(),
			}),
		),
	},
]

export const questToolHandlers: ToolHandlers<QuestToolNames> = {
	mcp_dnd_create_quest: async (args) => {
		if (!args) throw new Error("No arguments provided")
		const parsed = createInsertSchema(quests).parse(args)
		logger.info("Creating quest", { parsed })
		try {
			const result = await db
				.insert(quests)
				.values(parsed as any)
				.execute()
			logger.info("Quest created", { id: result })
			return {
				content: [{ type: "text", text: JSON.stringify({ id: result }) }],
			}
		} catch (error) {
			logger.error("Failed to create quest", {
				error: (error as Error).message,
			})
			return {
				content: [
					{
						type: "text",
						text: `Error creating quest: ${(error as Error).message}`,
					},
				],
			}
		}
	},

	mcp_dnd_get_quest: async (args) => {
		if (!args) throw new Error("No arguments provided")
		logger.debug("Parsing arguments", { args })
		const parsed = z.object({ id: z.number() }).parse(args)
		logger.debug("Getting quest", { parsed })
		try {
			const quest = await db.select().from(quests).where(eq(quests.id, parsed.id)).limit(1)
			logger.debug("Quest retrieved", { found: !!quest })
			return { content: [{ type: "text", text: JSON.stringify(quest) }] }
		} catch (error) {
			logger.error("Failed to get quest", {
				error: (error as Error).message,
			})
			return {
				content: [
					{
						type: "text",
						text: `Error getting quest: ${(error as Error).message}`,
					},
				],
			}
		}
	},

	mcp_dnd_update_quest: async (args) => {
		if (!args) throw new Error("No arguments provided")
		const parsed = z.object({ id: z.number(), questId: z.number() }).parse(args)
		logger.info("Updating quest", { parsed })
		try {
			const result = await db
				.update(quests)
				.set(parsed as any)
				.where(eq(quests.id, parsed.id))
				.execute()
			logger.info("Quest updated", { id: result })
			return {
				content: [{ type: "text", text: JSON.stringify({ id: result }) }],
			}
		} catch (error) {
			logger.error("Failed to update quest", {
				error: (error as Error).message,
			})
			return {
				content: [
					{
						type: "text",
						text: `Error updating quest: ${(error as Error).message}`,
					},
				],
			}
		}
	},

	mcp_dnd_get_all_quests: async () => {
		logger.info("Getting all quests")
		const result = await db.select().from(quests)
		logger.info("Quests retrieved", { result })
		return { content: [{ type: "text", text: JSON.stringify(result) }] }
	},
	get_quest_npcs: (args): Promise<{ content: Array<{ type: string; text: string }> }> => {
		throw new Error("Function not implemented.")
	},
	mcp_dnd_create_npc: (args): Promise<{ content: Array<{ type: string; text: string }> }> => {
		throw new Error("Function not implemented.")
	},
}
