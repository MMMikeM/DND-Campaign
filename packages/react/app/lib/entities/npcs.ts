import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import addSlugs from "../utils/addSlugs"
import { unifyRelations } from "../utils/unify"

const npcConfig = {
	findById: (id: number) =>
		db.query.npcs.findFirst({
			where: (npcs, { eq }) => eq(npcs.id, id),
			with: {
				relatedItems: true,
				relatedFactions: { with: { faction: { columns: { name: true, id: true } } } },
				relatedQuests: { with: { quest: { columns: { name: true, id: true } } } },
				incomingRelationships: { with: { sourceNpc: { columns: { name: true, id: true } } } },
				outgoingRelationships: { with: { targetNpc: { columns: { name: true, id: true } } } },
				relatedClues: {
					with: {
						stage: {
							columns: { name: true, id: true },
							with: { quest: { columns: { name: true, id: true } } },
						},
					},
				},
				relatedSites: {
					with: {
						site: {
							columns: { name: true, id: true },
							with: {
								area: { columns: { name: true, id: true }, with: { region: { columns: { name: true, id: true } } } },
							},
						},
					},
				},
				relatedQuestHooks: {
					with: {
						hook: {
							with: {
								quest: { columns: { name: true, id: true } },
								stage: { columns: { name: true, id: true } },
							},
						},
					},
				},
			},
		}),

	getAll: () => db.query.npcs.findMany({}),
	getNamesAndIds: () =>
		db.query.npcs.findMany({
			columns: {
				id: true,
				name: true,
			},
		}),
}

export const getAllNpcs = async () => {
	const npcs = await npcConfig.getAll()
	return addSlugs(npcs)
}

export type NPC = Awaited<ReturnType<typeof getNpc>>

export const getNpc = async (slug: string) => {
	const selectedNpc = await npcConfig
		.getNamesAndIds()
		.then(addSlugs)
		.then((npcs) => npcs.find((npc) => npc.slug === slug))

	if (!selectedNpc) {
		throw new EntityNotFoundError("NPC", slug)
	}

	const byId = await npcConfig.findById(selectedNpc.id)

	if (!byId) {
		throw new EntityNotFoundError("NPC", selectedNpc.id)
	}

	const unified = unifyRelations(byId)
		.from({ property: "incomingRelationships", key: "sourceNpc" })
		.with({ property: "outgoingRelationships", key: "targetNpc" })
		.to({ property: "relations", key: "npc" })

	if (unified) {
		return addSlugs(unified)
	}

	throw new EntityNotFoundError("NPC", selectedNpc.id)
}
