import type { Tool } from "@modelcontextprotocol/sdk/types"
import { locations } from "@tome-keeper/shared"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"
import zodToMCP from "../zodToMcp"
import { z } from "zod"
import { db, type ToolHandlers } from "../index"
import logger from "../logger"
import { eq } from "drizzle-orm"

export type LocationToolNames =
	| "mcp_dnd_get_location"
	| "mcp_dnd_get_all_locations"
	| "mcp_dnd_create_location"
	| "mcp_dnd_update_location"
	| "mcp_dnd_delete_location"

export const locationTools: Array<Tool & { name: LocationToolNames }> = [
	{
		name: "mcp_dnd_create_location",
		description: "Create a new location",
		inputSchema: zodToMCP(createInsertSchema(locations)),
	},
	{
		name: "mcp_dnd_get_all_locations",
		description: "Get all locations",
		inputSchema: {
			type: "object",
			properties: {},
			required: [],
		},
	},
	{
		name: "mcp_dnd_get_location",
		description: "Get a location by ID",
		inputSchema: {
			type: "object",
			properties: {
				id: { type: "number" },
			},
			required: ["id"],
		},
	},
	{
		name: "mcp_dnd_update_location",
		description: "Update a location by ID",
		inputSchema: zodToMCP(
			createUpdateSchema(locations).extend({
				id: z.number(),
			}),
		),
	},
	{
		name: "mcp_dnd_delete_location",
		description: "Delete a location by ID",
		inputSchema: {
			type: "object",
			properties: {
				id: { type: "number" },
			},
			required: ["id"],
		},
	},
]

export const locationToolHandlers: ToolHandlers<LocationToolNames> = {
	mcp_dnd_create_location: async (args) => {
		logger.debug("Creating location", { args })
		const parsedArgs = createInsertSchema(locations).parse(args)
		return await db.insert(locations).values(parsedArgs).returning()
	},
	mcp_dnd_get_all_locations: async () => {
		logger.debug("Getting all locations")

		return await db.select().from(locations)
	},
	mcp_dnd_get_location: async (args) => {
		logger.debug("Getting location by ID", { args })
		const parsed = z.object({ id: z.number() }).parse(args)
		logger.debug("Parsed args", { parsed })
		return await db.select().from(locations).where(eq(locations.id, parsed.id))
	},
	mcp_dnd_update_location: async (args) => {
		logger.debug("Updating location by ID", { args })
		const parsed = createUpdateSchema(locations).extend({ id: z.number() }).parse(args)
		return await db.update(locations).set(parsed).where(eq(locations.id, parsed.id)).returning()
	},
	mcp_dnd_delete_location: async (args) => {
		logger.debug("Deleting location by ID", { args })
		const parsed = z.object({ id: z.number() }).parse(args)
		logger.debug("Parsed args", { parsed })
		return await db.delete(locations).where(eq(locations.id, parsed.id)).returning()
	},
}
