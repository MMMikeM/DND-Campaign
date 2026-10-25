import { eq } from "drizzle-orm"
import { z } from "zod/v4"
import { db, logger } from "../../index"
import { serializeError } from "../../logger"
import { createUpdateSchema } from "./schema"
import { invalidateSearch } from "./search"
import type { baseTableWithId, ToolHandler, ToolHandlerReturn } from "./types"

export type CreateTableNames<T> = ReadonlyArray<keyof Omit<T, "enums">>
export type Schema<T extends string> = Record<T, z.ZodObject>

export const nameAndId = { columns: { name: true, id: true } } as const

export const id = z.coerce.number()
export const optionalId = z.coerce.number().optional()
export const list = z.array(z.string()).min(1).max(5)

export { createManageSchema } from "./schema"

// --- Response Helpers ---

export const createResponse = (message: string) => ({
	content: [{ type: "text" as const, text: message }],
})

export const createErrorResponse = (message: string) => {
	logger.error(message)
	return {
		isError: true,
		content: [{ type: "text" as const, text: message }],
	}
}

/**
 * Runs after the write has committed. Reporting a refresh failure as a failed write would invite the model to
 * retry and create a duplicate, so it is only logged.
 */
const refreshSearchAfterWrite = async (tableName: string) => {
	try {
		await invalidateSearch()
	} catch (error) {
		logger.error({ tableName, error: serializeError(error) }, "Search refresh failed after a committed write")
	}
}

const constraintViolationReasons: Record<string, string> = {
	"23502": "A required field is missing",
	"23503": "A referenced id does not exist, or other rows still reference this one",
	"23505": "An entry with these values already exists",
	"23514": "The values break a rule on this table",
}

/** Drizzle's own message contains the SQL, so only the Postgres error code and constraint name are passed on. */
const describeDatabaseError = (error: unknown) => {
	const cause = error instanceof Error ? error.cause : undefined
	if (!cause || typeof cause !== "object" || !("code" in cause)) {
		return ""
	}
	const reason = constraintViolationReasons[String(cause.code)]
	if (!reason) {
		return ""
	}
	const constraint = "constraint" in cause && cause.constraint ? ` (${cause.constraint})` : ""
	return ` ${reason}${constraint}.`
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
	logger.info({ id: deleteId.data }, `Deleting ${tableName} (via ${categoryToolName})`)
	let result: { deletedId: unknown }[]
	try {
		result = await db.delete(table).where(eq(table.id, deleteId.data)).returning({ deletedId: table.id })
	} catch (error) {
		logger.error({ tableName, error: serializeError(error) }, `Database error deleting ${tableName}`)
		return createErrorResponse(`Database error when deleting ${tableName}.${describeDatabaseError(error)}`)
	}
	await refreshSearchAfterWrite(tableName)
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
		await refreshSearchAfterWrite(tableName)

		const entityName = "name" in createData && typeof createData.name === "string" ? createData.name : tableName
		return createResponse(`Successfully created new ${entityName} with ID: ${result?.successfullyCreated}`)
	} catch (error) {
		logger.error(
			{
				tableName: tableName,
				error: serializeError(error),
				cause: error instanceof Error && error.cause ? serializeError(error.cause) : undefined,
			},
			`Database error creating ${tableName}`,
		)

		return createErrorResponse(`Database error when creating ${tableName}.${describeDatabaseError(error)}`)
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

	const parsedData = createUpdateSchema(schemas[tableName]).safeParse(parseResult.data)

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

		await refreshSearchAfterWrite(tableName)
		return createResponse(`Successfully updated ${tableName} with ID: ${updateId}`)
	} catch (error) {
		logger.error(
			{
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
			},
			`Database error updating ${tableName}`,
		)

		return createErrorResponse(`Database error: Failed to update ${tableName}.${describeDatabaseError(error)}`)
	}
}

export function createManageEntityHandler<TS extends Schema<TK[number]>, TK extends readonly [string, ...string[]]>(
	categoryToolName: string,
	tables: Record<TK[number], baseTableWithId>,
	tableEnum: TK,
	schemas: TS,
): ToolHandler {
	return async (args?: Record<string, unknown>): Promise<ToolHandlerReturn> => {
		logger.info({ args }, `Creating manage entity handler for ${categoryToolName}`)
		if (!args) {
			logger.error(`No arguments provided to ${categoryToolName} handler.`)
			return createErrorResponse(`Arguments provided to ${categoryToolName} are malformed`)
		}

		// The SDK validates table/operation against the tool's schema before dispatch
		const tableName = args.table as TK[number]
		const table = tables[tableName]
		const operation = args.operation as "create" | "update" | "delete"

		switch (operation) {
			case "delete":
				return handleDelete(args, table, tableName, categoryToolName)
			case "create":
				return handleCreate(args, table, tableName, schemas, categoryToolName)
			case "update":
				return handleUpdate(args, table, tableName, schemas, categoryToolName)
			default:
				return createErrorResponse(`An unknown error occurred in ${categoryToolName} handler.`)
		}
	}
}
