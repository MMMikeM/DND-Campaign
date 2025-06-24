import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import addSlugs from "../utils/addSlugs"
import { unifyRelations } from "../utils/unify"
import { nameAndId } from "."

const npcConfig = {
	findById: (id: number) =>
		db.query.npcs.findFirst({
			where: (npcs, { eq }) => eq(npcs.id, id),
			with: {
				incomingRelations: { with: { sourceNpc: nameAndId } },
				outgoingRelations: { with: { targetNpc: nameAndId } },
				affectingConsequences: true,
				conflictParticipation: true,
				narrativeDestinationInvolvement: true,
				factionMemberships: { with: { faction: nameAndId } },
				incomingForeshadowing: true,
				itemHistory: true,
				itemRelations: true,
				questHooks: { with: { quest: nameAndId } },
				questStageDeliveries: { with: { quest: nameAndId } },
				questParticipants: { with: { quest: nameAndId } },
				siteAssociations: { with: { site: nameAndId } },
				stageInvolvement: true,
				loreLinks: true,
				outgoingForeshadowing: true,
			},
		}),

	getAll: () => db.query.npcs.findMany({}),
	getNamesAndIds: () => db.query.npcs.findMany(nameAndId),
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
