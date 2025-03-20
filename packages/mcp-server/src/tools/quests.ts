import type { Tool } from "@modelcontextprotocol/sdk/types"
import { quests, npcs, RunResult } from "@tome-keeper/shared"
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
  | "mcp_dnd_delete_quest"

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
		name: "mcp_dnd_update_quest",
		description: "Update an existing quest",
		inputSchema: zodToMCP(
			createUpdateSchema(quests).extend({
				id: z.number(),
			}),
		),
	},
	{
		name: "mcp_dnd_delete_quest",
		description: "Delete a quest by ID",
		inputSchema: {
			type: "object",
			properties: {
				id: { type: "number" },
			},
			required: ["id"],
		},
	},
]

export const questToolHandlers: ToolHandlers<QuestToolNames> = {
  mcp_dnd_create_quest: async (args) => {
    if (!args) throw new Error("No arguments provided")
    const parsed = createInsertSchema(quests).parse(args)
    logger.info("Creating quest", { parsed })
    return await db
      .insert(quests)
      .values(parsed as any)
      .execute()

  },

  mcp_dnd_get_quest: async (args) => {
    if (!args) throw new Error("No arguments provided")
    logger.debug("Parsing arguments", { args })
    const parsed = z.object({ id: z.number() }).parse(args)
    logger.debug("Getting quest", { parsed })
    return await db.select().from(quests).where(eq(quests.id, parsed.id)).limit(1)
  },

  mcp_dnd_update_quest: async (args) => {
    if (!args) throw new Error("No arguments provided")
    const parsed = z.object({ id: z.number(), questId: z.number() }).parse(args)
    logger.info("Updating quest", { parsed })
    return await db
      .update(quests)
      .set(parsed as any)
      .where(eq(quests.id, parsed.id))
      .execute()

  },
  mcp_dnd_get_all_quests: async function (args?: Record<string, unknown>): Promise<RunResult | Record<string, unknown> | Record<string, unknown>[]> {
    return await db.select().from(quests)
  },
  mcp_dnd_delete_quest: async function (args?: Record<string, unknown>): Promise<RunResult | Record<string, unknown> | Record<string, unknown>[]> {
    if (!args) throw new Error("No arguments provided")
    const parsed = z.object({ id: z.number() }).parse(args)
    logger.info("Deleting quest", { parsed })
    return await db
      .delete(quests)
      .where(eq(quests.id, parsed.id))
      .execute()
  }
}
