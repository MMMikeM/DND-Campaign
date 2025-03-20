import type { Tool } from "@modelcontextprotocol/sdk/types"
import { npcs } from "@tome-keeper/shared"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"
import zodToMCP from "../zodToMcp"
import { z } from "zod"
import { db, type ToolHandlers } from "../index"
import logger from "../logger"
import { eq } from "drizzle-orm"

export type NcpToolNames =
	| "mcp_dnd_get_all_npcs"
	| "mcp_dnd_get_npc"
	| "mcp_dnd_create_npc"
	| "mcp_dnd_update_npc"
	| "mcp_dnd_delete_npc"

export const npcTools: Array<Tool & { name: NcpToolNames }> = [
	{
		name: "mcp_dnd_create_npc",
		description: "Create a new NPC",
		inputSchema: zodToMCP(createInsertSchema(npcs)),
	},
	{
		name: "mcp_dnd_get_all_npcs",
		description: "Get all NPCs",
		inputSchema: {
			type: "object",
			properties: {},
			required: [],
		},
	},
	{
		name: "mcp_dnd_get_npc",
		description: "Get a NPC by ID",
		inputSchema: {
			type: "object",
			properties: {
				id: { type: "number" },
			},
			required: ["id"],
		},
	},
	{
		name: "mcp_dnd_update_npc",
		description: "Update a NPC by ID",
		inputSchema: zodToMCP(
			createUpdateSchema(npcs).extend({
				id: z.number(),
			}),
		),
	},
	{
		name: "mcp_dnd_delete_npc",
		description: "Delete a NPC by ID",
		inputSchema: {
			type: "object",
			properties: {
				id: { type: "number" },
			},
			required: ["id"],
		},
	},
]

export const npcToolHandlers: ToolHandlers<NcpToolNames> = {
	mcp_dnd_create_npc: async (args) => {
		if (!args) throw new Error("No arguments provided")
		const parsed = createInsertSchema(npcs).parse(args)
		logger.info("Creating NPC", { parsed })
		try {
			const result = await db
				.insert(npcs)
				.values(parsed as any)
				.execute()
			logger.info("NPC created", { id: result })
			return {
				content: [{ type: "text", text: JSON.stringify({ id: result }) }],
			}
		} catch (error) {
			logger.error("Failed to create NPC", {
				error: (error as Error).message,
			})
			return {
				content: [
					{
						type: "text",
						text: `Error creating NPC: ${(error as Error).message}`,
					},
				],
			}
		}
	},

	mcp_dnd_get_npc: async (args) => {
		if (!args) throw new Error("No arguments provided")
		const parsed = z.object({ id: z.number() }).parse(args)
		logger.info("Getting NPC", { parsed })
		try {
			const npc = await db.select().from(npcs).where(eq(npcs.id, parsed.id)).limit(1)
			logger.info("NPC retrieved", { found: !!npc })
			return { content: [{ type: "text", text: JSON.stringify(npc) }] }
		} catch (error) {
			logger.error("Failed to get NPC", {
				error: (error as Error).message,
			})
			return {
				content: [
					{
						type: "text",
						text: `Error getting NPC: ${(error as Error).message}`,
					},
				],
			}
		}
	},
	mcp_dnd_update_npc: async (args) => {
		if (!args) throw new Error("No arguments provided")
		const parsed = createInsertSchema(npcs).parse(args)
		if (!parsed.id) {
			throw new Error("ID is required for updating NPC")
		}
		logger.info("Updating NPC", { parsed })
		try {
			const result = await db
				.update(npcs)
				.set(parsed as any)
				.where(eq(npcs.id, parsed.id))
				.execute()
			logger.info("NPC updated", { id: result })
			return {
				content: [{ type: "text", text: JSON.stringify({ id: result }) }],
			}
		} catch (error) {
			logger.error("Failed to update NPC", {
				error: (error as Error).message,
			})
			return {
				content: [
					{
						type: "text",
						text: `Error updating NPC: ${(error as Error).message}`,
					},
				],
			}
		}
	},
	mcp_dnd_delete_npc: async (args) => {
		if (!args) throw new Error("No arguments provided")
		const parsed = z.object({ id: z.number() }).parse(args)
		logger.info("Deleting NPC", { parsed })
		try {
			const result = await db.delete(npcs).where(eq(npcs.id, parsed.id)).execute()
			logger.info("NPC deleted", { id: result })
			return {
				content: [{ type: "text", text: JSON.stringify({ id: result }) }],
			}
		} catch (error) {
			logger.error("Failed to delete NPC", {
				error: (error as Error).message,
			})
			return {
				content: [
					{
						type: "text",
						text: `Error deleting NPC: ${(error as Error).message}`,
					},
				],
			}
		}
	},
	mcp_dnd_get_all_npcs: function (
		args,
	): Promise<{ content: Array<{ type: string; text: string }> }> {
		throw new Error("Function not implemented.")
	},
}
