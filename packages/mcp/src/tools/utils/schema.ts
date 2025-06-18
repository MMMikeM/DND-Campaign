import { z } from "zod/v4"
import zodToMCP from "../../zodToMcp"

export const createManageSchema = <T extends Record<K[number], z.ZodObject>, K extends readonly [string, ...string[]]>(
	schemaObject: T,
	tableEnum: K,
) => {
	const schemaValues = Object.values(schemaObject) as readonly z.ZodObject[]

	const baseSchema = z
		.object({
			table: z.enum(tableEnum),
			operation: z.enum(["create", "update", "delete"]),
			id: z.coerce.number().optional().describe("Required for 'update' and 'delete' operations, exclude to create"),
			data: z
				.union(schemaValues)
				.describe("Entity data to create or update. The specific schema is determined by the 'table' parameter."),
		})
		.check((ctx) => {
			// Validate the data field based on the selected table
			const tableSchema = schemaObject[ctx.value.table]
			if (!tableSchema) {
				ctx.issues.push({
					input: ctx.value.table,
					code: "custom",
					path: ["table"],
					message: `Invalid table: ${ctx.value.table}`,
				})
				return
			}

			// For create operations, require full data
			// For update operations, allow partial data
			const dataSchema = ctx.value.operation === "update" ? tableSchema.partial() : tableSchema
			const result = dataSchema.safeParse(ctx.value.data)

			if (!result.success) {
				// Add all validation errors to the data field
				result.error.issues.forEach((issue) => {
					ctx.issues.push({
						...issue,
						path: ["data", ...issue.path],
					})
				})
			}
		})

	return zodToMCP(baseSchema)
}
