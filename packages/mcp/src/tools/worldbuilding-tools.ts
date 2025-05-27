import { tables } from "@tome-master/shared"
import { db } from "../index"
import { createManageEntityHandler, createManageSchema } from "./tool.utils"
import type { CreateEntityGetters, ToolDefinition } from "./utils/types"
import { schemas, tableEnum } from "./worldbuilding-tools-schema"

type WorldbuildingGetters = CreateEntityGetters<typeof tables.worldbuildingTables>

export const entityGetters: WorldbuildingGetters = {
	all_world_concepts: () => db.query.worldConcepts.findMany({}),
	all_concept_relationships: () => db.query.conceptRelationships.findMany({}),
	all_world_concept_links: () => db.query.worldConceptLinks.findMany({}),

	world_concept_by_id: (id: number) =>
		db.query.worldConcepts.findFirst({
			where: (worldConcepts, { eq }) => eq(worldConcepts.id, id),
		}),

	concept_relationship_by_id: (id: number) =>
		db.query.conceptRelationships.findFirst({
			where: (conceptRelationships, { eq }) => eq(conceptRelationships.id, id),
		}),

	world_concept_link_by_id: (id: number) =>
		db.query.worldConceptLinks.findFirst({
			where: (worldConceptLinks, { eq }) => eq(worldConceptLinks.id, id),
		}),
}

export const worldToolDefinitions: Record<"manage_worldbuilding", ToolDefinition> = {
	manage_worldbuilding: {
		description: "Manage worldbuilding-related entities.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_worldbuilding", tables.worldbuildingTables, tableEnum, schemas),
	},
}
