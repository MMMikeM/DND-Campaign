import { eq } from "drizzle-orm"
import { z } from "zod"
import { db, logger } from "../index"
import zodToMCP from "../zodToMcp"
import { PgTableWithId, ToolHandler, ToolHandlerReturn } from "./utils/types"

export type CreateTableNames<T> = ReadonlyArray<keyof Omit<T, "enums">>
export type Schema<T extends string> = Record<T, z.ZodObject<z.ZodRawShape, "strict", z.ZodTypeAny, unknown, unknown>>

export const camelToSnakeCase = (str: string) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)

export const id = z.coerce.number()
export const optionalId = z.coerce.number().optional()

// --- Response Helpers ---

export const createErrorResponse = (message: string): ToolHandlerReturn => ({
	isError: true,
	content: [{ type: "text", text: message }],
})

export const createResponse = (message: string): ToolHandlerReturn => ({
	content: [{ type: "text", text: message }],
})

export const formatZodErrors = (
	error: z.ZodError,
	entityName: string,
	args: Record<string, unknown>,
): ToolHandlerReturn => {
	const errors = error.errors.map((err) => `- '${err.path.join(".")}': ${err.message}`).join("\n")

	const operation = "operation" in args ? args.operation : "id" in args ? "update/delete" : "create"
	logger.error(`Validation error during ${operation} ${entityName}:`, {
		errors,
	})

	return createErrorResponse(
		`Error during ${operation} ${entityName}:\n${errors}\n\nUse help({tool: 'relevant_tool_name'}) for details.`, // Update tool name dynamically later if needed
	)
}

export function createManageEntityHandler<TS extends Schema<TK[number]>, TK extends readonly [string, ...string[]]>(
	categoryToolName: string,
	tables: Record<TK[number], PgTableWithId>,
	tableEnum: TK,
	schemas: TS,
): ToolHandler {
	return async (args?: Record<string, unknown>): Promise<ToolHandlerReturn> => {
		if (!args) {
			logger.error(`No arguments provided to ${categoryToolName} handler.`)
			return createErrorResponse(`Aguments provided to ${categoryToolName} are malformed`)
		}

		const tableName = z.enum(tableEnum).safeParse(args?.table)

		if (!tableName.success) {
			return createErrorResponse(`Invalid table name '${args?.table}' provided to ${categoryToolName} handler.`)
		}

		const table = tables[tableName.data]

		const operation = z.enum(["create", "update", "delete"]).safeParse(args?.operation)

		if (!operation.success) {
			return createErrorResponse(`Invalid operation '${args?.operation}' provided to ${categoryToolName} handler.`)
		}

		if (operation.data === "delete") {
			const deleteId = z.coerce.number().safeParse(args?.id)

			if (!deleteId.success) {
				return createErrorResponse(`Invalid id '${args?.id}' provided to ${categoryToolName} handler.`)
			}
			logger.info(`Deleting ${tableName} (via ${categoryToolName}) with id ${deleteId}`)
			const result = await db.delete(table).where(eq(table.id, deleteId)).returning({ deletedId: table.id })
			return createResponse(
				result.length > 0
					? `Successfully deleted ${tableName} with ID: ${deleteId}`
					: `No ${tableName} found with ID: ${deleteId}`,
			)
		}

		if (operation.data === "create") {
			const createData = schemas[tableName.data].safeParse(args?.data)

			if (!createData.success) {
				return createErrorResponse(`Invalid data '${args?.data}' provided to ${categoryToolName} handler.`)
			}

			logger.info(`Creating ${tableName} (via ${categoryToolName}) with data ${createData.data}`)
			// @ts-expect-error
			const result = await db.insert(table).values(createData.data).returning({ successfullyCreated: table.id })
			return createResponse(`Successfully created new ${tableName} with ID: ${result[0]?.successfullyCreated}`)
		}

		if (operation.data === "update") {
			const updateData = schemas[tableName.data].partial().safeParse(args?.data)

			if (!updateData.success) {
				return createErrorResponse(`Invalid data '${args?.data}' provided to ${categoryToolName} handler.`)
			}

			logger.info(`Updating ${tableName} (via ${categoryToolName}) with data ${updateData.data}`)
			const result = await db
				.update(table)
				.set(updateData.data)
				.where(eq(table.id, updateData.data.id))
				.returning({ successfullyUpdated: table.id })
			return createResponse(`Successfully updated ${tableName} with ID: ${result[0]?.successfullyUpdated}`)
		}
		return createErrorResponse(`An unknown error occurred in ${categoryToolName} handler.`)
	}
}

export const createManageSchema = (
	schemaObject: Record<string, z.AnyZodObject>,
	tableEnum: readonly [string, ...string[]],
) =>
	zodToMCP(
		z.object({
			table: z.enum(tableEnum),
			action: z.enum(["create", "update", "delete"]),
			id: z.coerce.number().optional().describe("Required for 'update' and 'delete' operations, exclude to create"),
			data: z
				.object(schemaObject)
				.partial()
				.describe("Provide only one of the following fields to create or update an entity. Update accepsts a partial")
				.refine((data) => Object.keys(data).length === 1),
		}),
	)
