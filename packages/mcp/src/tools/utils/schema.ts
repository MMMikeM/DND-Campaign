import { z } from "zod/v4"

export const createManageSchema = <T extends Record<K[number], z.ZodObject>, K extends readonly [string, ...string[]]>(
	schemaObject: T,
	tableEnum: K,
) => {
	// `data` stays permissive at the field level: delete takes no data, update
	// takes a partial, and the table-specific shape can only be checked once
	// `table` and `operation` are known — all enforced in .check() below, which
	// the MCP SDK runs before dispatching the tool call.
	const baseSchema = z
		.object({
			table: z.enum(tableEnum),
			operation: z.enum(["create", "update", "delete"]),
			id: z.coerce.number().optional().describe("Required for 'update' and 'delete' operations, exclude to create"),
			data: z
				.record(z.string(), z.unknown())
				.optional()
				.describe("Entity data to create or update. The specific schema is determined by the 'table' parameter."),
		})
		.check((ctx) => {
			const { table, operation, id, data } = ctx.value

			const tableSchema = schemaObject[table]
			if (!tableSchema) {
				ctx.issues.push({
					input: table,
					code: "custom",
					path: ["table"],
					message: `Invalid table: ${table}`,
				})
				return
			}

			if (operation !== "create" && id === undefined) {
				ctx.issues.push({
					input: id,
					code: "custom",
					path: ["id"],
					message: `'id' is required for ${operation} operations`,
				})
			}

			if (operation === "delete") {
				return
			}

			if (data === undefined) {
				ctx.issues.push({
					input: data,
					code: "custom",
					path: ["data"],
					message: `'data' is required for ${operation} operations`,
				})
				return
			}

			// For create operations, require full data
			// For update operations, allow partial data
			const dataSchema = operation === "update" ? tableSchema.partial() : tableSchema
			const result = dataSchema.safeParse(data)

			if (!result.success) {
				// Add all validation errors to the data field
				result.error.issues.forEach((issue) => {
					ctx.issues.push({
						code: "custom",
						input: data,
						path: ["data", ...issue.path],
						message: issue.message,
					})
				})
			}
		})

	return baseSchema
}
