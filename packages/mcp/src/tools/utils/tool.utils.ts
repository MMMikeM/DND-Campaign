import { eq } from "drizzle-orm"
import { z } from "zod/v4"
import { db, logger } from "../../index"
import type { baseTableWithId, ToolHandler, ToolHandlerReturn } from "./types"

export type CreateTableNames<T> = ReadonlyArray<keyof Omit<T, "enums">>
export type Schema<T extends string> = Record<T, z.ZodObject>

export const id = z.coerce.number()
export const optionalId = z.coerce.number().optional()
export const list = z.array(z.string()).min(1).max(5)

export { createManageSchema } from "./schema"

// --- Response Helpers ---

export const createResponse = (message: string): ToolHandlerReturn => ({
	content: [{ type: "text", text: message }],
})

export const createErrorResponse = (message: string): ToolHandlerReturn => {
	logger.error(message)
	return {
		isError: true,
		content: [{ type: "text", text: message }],
	}
}

const safelyParseJSON = (data: unknown) => {
	if (typeof data !== "string") {
		return { success: true as const, data }
	}
	try {
		return { success: true as const, data: JSON.parse(data) }
	} catch (error) {
		logger.error(`Error parsing JSON data: ${error}`)
		return { success: false as const, error: "Invalid JSON data provided." }
	}
}

async function handleDelete(
	args: Record<string, unknown>,
	table: baseTableWithId,
	tableName: string,
	categoryToolName: string,
): Promise<ToolHandlerReturn> {
	const deleteId = z.coerce.number().safeParse(args?.id)

	if (!deleteId.success) {
		return createErrorResponse(`Invalid id '${args?.id}' provided to ${categoryToolName} handler.`)
	}
	logger.info(`Deleting ${tableName} (via ${categoryToolName})`, { id: deleteId.data })
	const result = await db.delete(table).where(eq(table.id, deleteId.data)).returning({ deletedId: table.id })
	return createResponse(
		result.length > 0
			? `Successfully deleted ${tableName} with ID: ${deleteId.data}`
			: `No ${tableName} found with ID: ${deleteId.data}`,
	)
}

async function handleCreate<TS extends Schema<string>>(
	args: Record<string, unknown>,
	table: baseTableWithId,
	tableName: string,
	schemas: TS,
	categoryToolName: string,
): Promise<ToolHandlerReturn> {
	const parseResult = safelyParseJSON(args?.data)
	if (!parseResult.success) {
		return createErrorResponse(`Invalid JSON data provided to ${categoryToolName} handler.`)
	}

	if (!schemas[tableName]) {
		return createErrorResponse(`Schema for ${tableName} not found.`)
	}

	const parsedData = schemas[tableName].safeParse(parseResult.data)

	if (!parsedData.success) {
		const prettyError = z.prettifyError(parsedData.error)
		return createErrorResponse(`Validation failed for ${tableName}:\n${prettyError}`)
	}

	const createData = parsedData.data

	try {
		const [result] = await db.insert(table).values(createData).returning({ successfullyCreated: table.id })

		const entityName = "name" in createData && typeof createData.name === "string" ? createData.name : tableName
		return createResponse(`Successfully created new ${entityName} with ID: ${result?.successfullyCreated}`)
	} catch (error) {
		logger.error(`Database error creating ${tableName}`, {
			tableName: tableName,
			error: error instanceof Error ? error.message : error,
		})

		return createErrorResponse(`Database error when creating ${tableName}.`)
	}
}

async function handleUpdate<TS extends Schema<string>>(
	args: Record<string, unknown>,
	table: baseTableWithId,
	tableName: string,
	schemas: TS,
	categoryToolName: string,
): Promise<ToolHandlerReturn> {
	if (args.id === undefined || args.id === null) {
		return createErrorResponse(`An ID must be provided for the 'update' operation in ${categoryToolName}.`)
	}
	const updateId = Number(args.id)

	const parseResult = safelyParseJSON(args?.data)
	if (!parseResult.success) {
		return createErrorResponse(`Invalid JSON data provided to ${categoryToolName} handler.`)
	}

	if (!schemas[tableName]) {
		return createErrorResponse(`Schema for ${tableName} not found.`)
	}

	const parsedData = schemas[tableName].partial().safeParse(parseResult.data)

	if (!parsedData.success) {
		const prettyError = z.prettifyError(parsedData.error)
		return createErrorResponse(`Validation failed for ${tableName}:\n${prettyError}`)
	}

	const dataToUpdate = parsedData.data

	try {
		logger.info(
			`Updating ${tableName} (via ${categoryToolName}) with ID ${updateId} and data ${JSON.stringify(dataToUpdate)}`,
		)
		const result = await db
			.update(table)
			.set(dataToUpdate)
			.where(eq(table.id, updateId))
			.returning({ successfullyUpdated: table.id })

		if (result.length !== 1 || result[0] === undefined) {
			logger.error(`No ${tableName} found with ID: ${updateId}`)
			return createErrorResponse(`No ${tableName} found with ID: ${updateId}`)
		}

		return createResponse(`Successfully updated ${tableName} with ID: ${updateId}`)
	} catch (error) {
		logger.error(`Database error updating ${tableName}`, {
			error:
				error instanceof Error
					? {
							name: error.name,
							message: error.message,
							stack: error.stack,
						}
					: error,
			tableName: tableName,
			data: dataToUpdate,
		})

		return createErrorResponse(
			`Database error: Failed to update ${tableName}. ${error instanceof Error ? error.message : "Unknown error"}`,
		)
	}
}

export function createManageEntityHandler<TS extends Schema<TK[number]>, TK extends readonly [string, ...string[]]>(
	categoryToolName: string,
	tables: Record<TK[number], baseTableWithId>,
	tableEnum: TK,
	schemas: TS,
): ToolHandler {
	return async (args?: Record<string, unknown>): Promise<ToolHandlerReturn> => {
		logger.info(`Creating manage entity handler for ${categoryToolName}`, { args })
		if (!args) {
			logger.error(`No arguments provided to ${categoryToolName} handler.`)
			return createErrorResponse(`Arguments provided to ${categoryToolName} are malformed`)
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

		switch (operation.data) {
			case "delete":
				return handleDelete(args, table, tableName.data, categoryToolName)
			case "create":
				return handleCreate(args, table, tableName.data, schemas, categoryToolName)
			case "update":
				return handleUpdate(args, table, tableName.data, schemas, categoryToolName)
			default:
				return createErrorResponse(`An unknown error occurred in ${categoryToolName} handler.`)
		}
	}
}
