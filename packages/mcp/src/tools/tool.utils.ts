import type { RunResult } from "@tome-master/shared"
import type { SQLiteTable } from "drizzle-orm/sqlite-core"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { db, logger } from "../index"
import zodToMCP from "../zodToMcp"

export const inputSchema = (key: string) =>
	zodToMCP(
		z.object({
			[key]: z.number(),
		}),
	)

export type ToolHandlerReturn = RunResult | Record<string, unknown> | Record<string, unknown>[]

export type ToolDefinition = {
	description: string
	inputSchema: ReturnType<typeof inputSchema>
	handler: (args?: Record<string, unknown>) => Promise<ToolHandlerReturn>
}

export const jsonArray = z.array(z.string())

export type ToolHandlers<T extends PropertyKey> = Record<
	T,
	(args?: Record<string, unknown>) => Promise<ToolHandlerReturn>
>

/**
 * Creates a standardized description for manage/delete operations
 * @param entity The entity type being managed
 * @returns A consistent description string
 */
export const createEntityActionDescription = (entity: string): string =>
	`Create, update, or delete ${entity}. Exclude id to create, include id to update, provide only id to delete.`

/**
 * Creates a standardized handler for entity management operations (CRUD)
 *
 * @param table - The database table to operate on
 * @param schema - The Zod schema for validating inputs
 * @param entityName - A human-readable name for the entity type (for logging)
 * @returns An async function that handles create, update, and delete operations
 */
export const createEntityHandler = (
	table: SQLiteTable,
	schema: z.ZodType<any>,
	entityName: string,
): ((args?: Record<string, unknown>) => Promise<any>) => {
	return async (args?: Record<string, unknown>) => {
		// Return empty result if no args provided
		if (!args) {
			return [] as Record<string, unknown>[]
		}

		// Check if it's just a delete operation
		if (Object.keys(args).length === 1 && "id" in args) {
			const { id } = args as { id: number }
			logger.info(`Deleting ${entityName} with id ${id}`)
			return await db.delete(table).where(eq(table.id, id)).returning()
		}

		// Otherwise parse as normal and handle create/update
		const parsed = schema.parse(args)
		logger.info(`${parsed.id ? "Updating" : "Creating"} ${entityName}`, { parsed })

		if (parsed.id) {
			// Update operation
			return await db.update(table).set(parsed).where(eq(table.id, parsed.id)).returning()
		}
		// Create operation
		return await db.insert(table).values(parsed).returning()
	}
}
