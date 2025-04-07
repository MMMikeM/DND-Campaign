import { z } from "zod"
import { tables } from "@tome-master/shared"
import { optionalId, camelToSnakeCase } from "./tool.utils" // Import camelToSnakeCase

const allTables = {
	...tables.associationTables,
	...tables.conflictTables,
	...tables.factionTables,
	...tables.foreshadowingTables,
	...tables.narrativeTables,
	...tables.npcTables,
	...tables.questTables,
	...tables.regionTables,
	...tables.worldTables,
}

// Extract table names (entity types), convert to snake_case, and filter out 'enums'
const entityTypes = Object.keys(allTables)
	.filter((key) => key !== "enums")
	.map(camelToSnakeCase) as [string, ...string[]] // Type assertion for non-empty array for Zod enum

if (entityTypes.length === 0) {
	throw new Error("No entity types found in shared tables object.")
}

export type AllEntityTypes = (typeof entityTypes)[number]

export const getEntitySchema = z
	.object({
		entity_type: z.enum(entityTypes).describe("Type of entity to retrieve"),
		id: optionalId.describe("Optional ID of the specific entity to retrieve"),
	})
	.strict()
	.describe("Get any entity by type and optional ID. If ID is omitted, retrieves all entities of the specified type.")
