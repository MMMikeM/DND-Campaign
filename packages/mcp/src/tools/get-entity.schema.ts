import { tables } from "@tome-master/shared"
import { z } from "zod/v4"

const camelToSnake = (str: string) => str.replace(/([A-Z])/g, "_$1").toLowerCase()

const combinedTableNames = Object.values(tables).flatMap((tableList) =>
	Object.keys(tableList).map((table) => camelToSnake(table)),
)

export const getEntitySchema = z
	.object({
		entity_type: z.enum(combinedTableNames as [string, ...string[]]).describe("The type of entity to retrieve"),
		id: z
			.number()
			.optional()
			.describe("Optional ID to get a specific entity. If not provided, returns all entities of the type."),
	})
	.describe("Get any entity by type and optional ID")
