import { tables } from "@tome-master/shared"
import { z } from "zod/v4"

const allTableNames = [
	...Object.keys(tables.conflictTables),
	...Object.keys(tables.eventTables),
	...Object.keys(tables.factionTables),
	...Object.keys(tables.foreshadowingTables),
	...Object.keys(tables.itemTables),
	...Object.keys(tables.narrativeTables),
	...Object.keys(tables.mapTables),
	...Object.keys(tables.npcTables),
	...Object.keys(tables.questTables),
	...Object.keys(tables.regionTables),
	...Object.keys(tables.worldbuildingTables),
] as const

export const getEntitySchema = z
	.object({
		entity_type: z.enum(allTableNames as [string, ...string[]]).describe("The type of entity to retrieve"),
		id: z
			.number()
			.optional()
			.describe("Optional ID to get a specific entity. If not provided, returns all entities of the type."),
	})
	.describe("Get any entity by type and optional ID")
