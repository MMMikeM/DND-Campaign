import { eq } from "drizzle-orm"
import { z } from "zod/v4"
import { db, logger } from "../../index"
import zodToMCP from "../../zodToMcp"
import type { baseTableWithId, ToolHandler, ToolHandlerReturn } from "./types"

export type CreateTableNames<T> = ReadonlyArray<keyof Omit<T, "enums">>
export type Schema<T extends string> = Record<T, z.ZodObject>

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

export function createManageEntityHandler<TS extends Schema<TK[number]>, TK extends readonly [string, ...string[]]>(
	categoryToolName: string,
	tables: Record<TK[number], baseTableWithId>,
	tableEnum: TK,
	schemas: TS,
): ToolHandler {
	return async (args?: Record<string, unknown>): Promise<ToolHandlerReturn> => {
		logger.info(`Creating manage entity handler for ${categoryToolName} with args ${JSON.stringify(args)}`)
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
			const parsedData = schemas[tableName.data].safeParse(args?.data)

			if (!parsedData.success) {

				return createErrorResponse(`Invalid data '${JSON.stringify(args?.data)}' provided to ${categoryToolName} handler. ${parsedData.error.message}`)
			}

			const createData = parsedData.data

			logger.info(`Creating ${tableName.data} (via ${categoryToolName}) with data ${JSON.stringify(createData)}`)
			const [result] = await db.insert(table).values(createData).returning({ successfullyCreated: table.id })

			// Get the entity name from the created data if available
			const entityName = createData?.name || tableName.data
			return createResponse(`Successfully created new ${entityName} with ID: ${result?.successfullyCreated}`)
		}

		if (operation.data === "update") {
			const parsedData = schemas[tableName.data].partial().safeParse(args?.data)

			if (!parsedData.success) {
				return createErrorResponse(`Invalid data '${args?.data}' provided to ${categoryToolName} handler.`)
			}

			if (args.id === undefined || args.id === null) {
				return createErrorResponse(`An ID must be provided for the 'update' operation in ${categoryToolName}.`)
			}

			const dataToUpdate = parsedData.data

			logger.info(
				`Updating ${tableName.data} (via ${categoryToolName}) with ID ${args.id} and data ${JSON.stringify(dataToUpdate)}`,
			)
			const result = await db
				.update(table)
				.set(dataToUpdate)
				.where(eq(table.id, args.id))
				.returning({ successfullyUpdated: table.id })

			if (result.length !== 1 || result[0] === undefined) {
				logger.error(`No ${tableName.data} found with ID: ${args.id}`)
				return createErrorResponse(`No ${tableName.data} found with ID: ${args.id}`)
			}

			return createResponse(`Successfully updated ${tableName.data} with ID: ${args.id}`)
		}
		return createErrorResponse(`An unknown error occurred in ${categoryToolName} handler.`)
	}
}

export const createManageSchema = (
	schemaObject: Record<string, z.ZodObject>,
	tableEnum: readonly [string, ...string[]],
) =>
	zodToMCP(
		z.object({
			table: z.enum(tableEnum),
			operation: z.enum(["create", "update", "delete"]),
			id: z.coerce.number().optional().describe("Required for 'update' and 'delete' operations, exclude to create"),
			data: z
				.object(schemaObject)
				.partial()
				.describe("Provide only one of the following fields to create or update an entity. Update accepsts a partial")
				.refine((data) => Object.keys(data).length === 1),
		}),
	)
