import { tables } from "@tome-master/shared"
import { db } from "../index"
import { createManageEntityHandler, createManageSchema } from "./utils/tool.utils"
import type { ToolDefinition } from "./utils/types"
import { createEntityGettersFactory } from "./utils/types"
import { schemas, tableEnum } from "./world-concept-tools.schema"

const createEntityGetters = createEntityGettersFactory(tables.worldConceptTables)

export const entityGetters = createEntityGetters({
	all_world_concepts: () => db.query.worldConcepts.findMany({}),
	all_world_concept_relations: () => db.query.worldConceptRelations.findMany({}),
	all_world_concept_links: () => db.query.worldConceptLinks.findMany({}),

	world_concept_by_id: (id: number) =>
		db.query.worldConcepts.findFirst({
			where: (worldConcepts, { eq }) => eq(worldConcepts.id, id),
			with: {
				itemRelations: true,
				links: {
					with: {
						linkedConflict: true,
						linkedFaction: true,
						linkedNpc: true,
						linkedQuest: true,
						linkedRegion: true,
						worldConcept: true,
					},
				},
				incomingForeshadowing: true,
				incomingRelations: true,
				outgoingRelations: true,
			},
		}),

	world_concept_relation_by_id: (id: number) =>
		db.query.worldConceptRelations.findFirst({
			where: (worldConceptRelations, { eq }) => eq(worldConceptRelations.id, id),
			with: {
				sourceWorldConcept: true,
				targetWorldConcept: true,
			},
		}),

	world_concept_link_by_id: (id: number) =>
		db.query.worldConceptLinks.findFirst({
			where: (worldConceptLinks, { eq }) => eq(worldConceptLinks.id, id),
			with: {
				linkedConflict: true,
				linkedFaction: true,
				linkedNpc: true,
				linkedQuest: true,
				linkedRegion: true,
				worldConcept: true,
			},
		}),
})

export const worldToolDefinitions: Record<"manage_world_concept", ToolDefinition> = {
	manage_world_concept: {
		description: "Manage worldbuilding-related entities.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_world_concept", tables.worldConceptTables, tableEnum, schemas),
		annotations: {
			title: "Manage World Concepts",
			readOnlyHint: false,
			destructiveHint: false,
			idempotentHint: false,
			openWorldHint: false,
		},
	},
}
