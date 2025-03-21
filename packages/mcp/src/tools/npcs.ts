import type { Tool } from "@modelcontextprotocol/sdk/types.js"
import { npcs } from "@tome-master/shared"
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
		const parsed = createInsertSchema(npcs).parse(args)
		logger.info("Creating NPC", { parsed })
		return await db
				.insert(npcs)
				.values(parsed as any)
	},

	mcp_dnd_get_npc: async (args) => {
		const parsed = z.object({ id: z.number() }).parse(args)
		logger.info("Getting NPC", { parsed })
		return await db.select().from(npcs).where(eq(npcs.id, parsed.id)).limit(1)

	},
	mcp_dnd_update_npc: async (args) => {
		const parsed = createUpdateSchema(npcs, { id: z.number() }).parse(args)
		logger.info("Updating NPC", { parsed })
		return await db
				.update(npcs)
				.set(parsed as any)
				.where(eq(npcs.id, parsed.id))

	},
	mcp_dnd_delete_npc: async (args) => {
		const parsed = z.object({ id: z.number() }).parse(args)
		logger.info("Deleting NPC", { parsed })
		return await db.delete(npcs).where(eq(npcs.id, parsed.id))

	},
	mcp_dnd_get_all_npcs: async function (args) {
		logger.info("Getting all NPCs")
		return await db.select().from(npcs)
	},
}
