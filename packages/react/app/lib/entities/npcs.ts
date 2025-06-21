import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import addSlugs from "../utils/addSlugs"
import { unifyRelations } from "../utils/unify"

const npcConfig = {
	findById: (id: number) =>
		db.query.npcs.findFirst({
			where: (npcs, { eq }) => eq(npcs.id, id),
			with: {
				incomingRelations: { with: { sourceNpc: { columns: { name: true, id: true } } } },
				outgoingRelations: { with: { targetNpc: { columns: { name: true, id: true } } } },
				affectingConsequences: true,
				conflictParticipation: true,
				narrativeDestinationInvolvement: true,
				factionMemberships: { with: { faction: { columns: { name: true, id: true } } } },
				incomingForeshadowing: true,
				itemHistory: true,
				itemRelations: true,
				questHooks: { with: { quest: { columns: { name: true, id: true } } } },
				questStageDeliveries: { with: { quest: { columns: { name: true, id: true } } } },
				questParticipants: { with: { quest: { columns: { name: true, id: true } } } },
				siteAssociations: { with: { site: { columns: { name: true, id: true } } } },
				stageInvolvement: true,
				loreLinks: true,
				outgoingForeshadowing: true,
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
		.from({ property: "incomingRelations", key: "sourceNpc" })
		.with({ property: "outgoingRelations", key: "targetNpc" })
		.to({ property: "relations", key: "npc" })

	if (unified) {
		return addSlugs(unified)
	}

	throw new EntityNotFoundError("NPC", selectedNpc.id)
}
