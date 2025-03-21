import type { Tool } from "@modelcontextprotocol/sdk/types.js"
import { factions } from "@tome-master/shared"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"
import zodToMCP from "../zodToMcp"
import { z } from "zod"
import { db, type ToolHandlers } from "../index"
import logger from "../logger"
import { eq } from "drizzle-orm"

export type FactionToolNames =
	| "mcp_dnd_get_faction"
	| "mcp_dnd_get_all_factions"
	| "mcp_dnd_create_faction"
	| "mcp_dnd_update_faction"
	| "mcp_dnd_delete_faction"

export const factionTools: Array<Tool & { name: FactionToolNames }> = [
	{
		name: "mcp_dnd_create_faction",
		description: "Create a new faction",
		inputSchema: zodToMCP(createInsertSchema(factions)),
	},
	{
		name: "mcp_dnd_get_all_factions",
		description: "Get all factions",
		inputSchema: {
			type: "object",
			properties: {},
			required: [],
		},
	},
	{
		name: "mcp_dnd_get_faction",
		description: "Get a faction by ID",
		inputSchema: {
			type: "object",
			properties: {
				id: { type: "number" },
			},
			required: ["id"],
		},
	},
	{
		name: "mcp_dnd_update_faction",
		description: "Update a faction by ID",
		inputSchema: zodToMCP(
			createUpdateSchema(factions).extend({
				id: z.number(),
			}),
		),
	},
	{
		name: "mcp_dnd_delete_faction",
		description: "Delete a faction by ID",
		inputSchema: {
			type: "object",
			properties: {
				id: { type: "number" },
			},
			required: ["id"],
		},
	},
]

export const factionToolHandlers: ToolHandlers<FactionToolNames> = {
	mcp_dnd_create_faction: async (args) => {
		const parsedArgs = createInsertSchema(factions).parse(args)
		logger.debug("Creating faction", { parsedArgs })
		return await db.insert(factions).values(parsedArgs).returning()
	},
	mcp_dnd_get_all_factions: async () => {
		logger.debug("Getting all factions")
		return await db.select().from(factions)
	},
	mcp_dnd_get_faction: async (args) => {
		const parsed = z.object({ id: z.number() }).parse(args)
		logger.debug("Parsed args", { parsed })
		return await db.select().from(factions).where(eq(factions.id, parsed.id))
	},
	mcp_dnd_update_faction: async (args) => {
		const parsed = createUpdateSchema(factions, { id: z.number()}).parse(args)
		logger.debug("Parsed args", { parsed })
		return await db
			.update(factions)
			.set(parsed)
			.where(eq(factions.id, parsed.id))
			.returning()
	},
	mcp_dnd_delete_faction: async (args) => {
		logger.debug("Deleting faction by ID", { args })
		const parsed = z.object({ id: z.number() }).parse(args)
		logger.debug("Parsed args", { parsed })
		return await db.delete(factions).where(eq(factions.id, parsed.id)).returning()
	},
}
