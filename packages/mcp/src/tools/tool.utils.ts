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

export const jsonArray = z.array(z.string()).max(5)

export type ToolHandlers<T extends PropertyKey> = Record<
	T,
	(args?: Record<string, unknown>) => Promise<ToolHandlerReturn>
>

/**
 * Creates a standardized description for entity management tools
 * with clearer operation guidance
 */
export const createEntityActionDescription = (entity: string): string =>
	`
Manage ${entity} entities through create, update, or delete operations.

OPERATIONS:
- CREATE: Omit the 'id' field to create a new ${entity}
- UPDATE: Include 'id' and fields to update an existing ${entity}
- DELETE: Include ONLY the 'id' field to delete an ${entity}

For parameter details and required fields, use help({tool: 'manage_${entity.replace(/-/g, "_")}'})
`.trim()

/**
 * Creates an entity handler for CRUD operations with enhanced error handling
 *
 * @param table The SQLite table to operate on
 * @param schema The Zod schema for validation
 * @param entityName The name of the entity for logging and error messages
 * @returns A function that handles create, update, and delete operations
 */
export const createEntityHandler = (
	table: SQLiteTable,
	schema: z.ZodType<any>,
	entityName: string,
): ((args?: Record<string, unknown>) => Promise<any>) => {
	return async (args?: Record<string, unknown>) => {
		try {
			// Return empty result if no args provided
			if (!args) {
				return {
					content: [
						{
							type: "text",
							text: `Please provide parameters to manage ${entityName}. Use help({tool: 'manage_${entityName.replace(/-/g, "_")}'}) for details.`,
						},
					],
				}
			}

			// Check if it's just a delete operation
			if (Object.keys(args).length === 1 && "id" in args) {
				const { id } = args as { id: number }

				if (!id) {
					return {
						isError: true,
						content: [
							{
								type: "text",
								text: "Error: Valid ID is required for delete operations.",
							},
						],
					}
				}

				logger.info(`Deleting ${entityName} with id ${id}`)
				const result = await db.delete(table).where(eq(table.id, id)).returning({ deletedId: table.id })

				return {
					content: [
						{
							type: "text",
							text:
								result.length > 0
									? `Successfully deleted ${entityName} with ID: ${id}`
									: `No ${entityName} found with ID: ${id}`,
						},
					],
				}
			}

			// Validation with better error handling
			try {
				// Handle create/update operations
				const parsed = schema.parse(args)
				logger.info(`${parsed.id ? "Updating" : "Creating"} ${entityName}`, { parsed })

				if (parsed.id) {
					// Update operation
					const result = await db.update(table).set(parsed).where(eq(table.id, parsed.id)).returning({
						successfullyUpdated: table.id,
					})

					return {
						content: [
							{
								type: "text",
								text:
									result.length > 0
										? `Successfully updated ${entityName} with ID: ${parsed.id}`
										: `No ${entityName} found with ID: ${parsed.id}`,
							},
						],
					}
				}

				// Create operation
				const result = await db.insert(table).values(parsed).returning({
					successfullyCreated: table.id,
				})

				return {
					content: [
						{
							type: "text",
							text: `Successfully created new ${entityName} with ID: ${result[0]?.successfullyCreated}`,
						},
					],
				}
			} catch (validationError) {
				// Handle Zod validation errors with more descriptive messages
				if (validationError instanceof z.ZodError) {
					const errors = validationError.errors
						.map((err) => {
							const path = err.path.join(".")
							return `- '${path}': ${err.message}`
						})
						.join("\n")

					const operation = "id" in args ? "update" : "create"

					return {
						isError: true,
						content: [
							{
								type: "text",
								text: `Error ${operation}ing ${entityName}:\n${errors}\n\nUse help({tool: 'manage_${entityName.replace(/-/g, "_")}'}) for details on required parameters.`,
							},
						],
					}
				}

				// Re-throw other errors to be caught by the outer try/catch
				throw validationError
			}
		} catch (error) {
			// Handle any other unexpected errors
			logger.error(`Error in ${entityName} handler:`, error)

			return {
				isError: true,
				content: [
					{
						type: "text",
						text: `Error processing ${entityName}: ${error instanceof Error ? error.message : String(error)}\n\nUse help({tool: 'manage_${entityName.replace(/-/g, "_")}'}) for usage details.`,
					},
				],
			}
		}
	}
}

export type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}`
	? `${T extends Capitalize<T> ? "_" : ""}${Lowercase<T>}${CamelToSnakeCase<U>}`
	: S
