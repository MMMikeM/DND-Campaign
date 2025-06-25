import { tables } from "@tome-master/shared"
import { db } from "../index"
import { schemas, tableEnum } from "./lore-tools.schema"
import { createManageEntityHandler, createManageSchema } from "./utils/tool.utils"
import type { ToolDefinition } from "./utils/types"
import { createEntityGettersFactory } from "./utils/types"

const createEntityGetters = createEntityGettersFactory(tables.loreTables)

const loreTableDefs = {
	lore: tables.loreTables.lore,
	loreLinks: tables.loreTables.loreLinks,
}

export const entityGetters = createEntityGetters({
	all_lore: () =>
		db.query.lore.findMany({
			columns: {
				id: true,
				name: true,
				description: true,
				interactions_and_rules: true,
				loreType: true,
				summary: true,
				surfaceImpression: true,
				modernRelevance: true,
			},
		}),
	all_lore_links: () => db.query.loreLinks.findMany({}),

	lore_by_id: (id: number) =>
		db.query.lore.findFirst({
			where: (lore, { eq }) => eq(lore.id, id),
			with: {
				incomingForeshadowing: true,
				links: {
					with: {
						conflict: true,
						narrativeDestination: true,
						quest: true,
						faction: true,
						npc: true,
						foreshadowing: true,
						region: true,
						item: true,
						relatedLore: { columns: { name: true, id: true } },
					},
				},
			},
		}),

	lore_link_by_id: (id: number) =>
		db.query.loreLinks.findFirst({
			where: (loreLinks, { eq }) => eq(loreLinks.id, id),
			with: {
				conflict: true,
				narrativeDestination: true,
				quest: true,
				faction: true,
				npc: true,
				foreshadowing: true,
				region: true,
				relatedLore: { columns: { name: true, id: true } },
			},
		}),
})

export const loreToolDefinitions: Record<"manage_lore", ToolDefinition> = {
	manage_lore: {
		enums: tables.loreTables.enums,
		description: "Manage lore-related entities.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_lore", loreTableDefs, tableEnum, schemas),
		annotations: {
			title: "Manage Lore",
			readOnlyHint: false,
			destructiveHint: false,
			idempotentHint: false,
			openWorldHint: false,
		},
	},
}
