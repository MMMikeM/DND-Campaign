import { foreshadowingWithSources, foreshadowingWithTargets, nameAndId } from "."
import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import addSlugs from "../utils/addSlugs"
import { unifyRelations } from "../utils/unify"

const npcConfig = {
	findById: (id: number) =>
		db.query.npcs.findFirst({
			where: { id },
			with: {
				incomingRelations: { with: { sourceNpc: nameAndId } },
				outgoingRelations: { with: { targetNpc: nameAndId } },
				site: nameAndId,
				affectingConsequences: true,
				conflictParticipation: true,
				factionMemberships: { with: { faction: nameAndId } },
				incomingForeshadowing: foreshadowingWithSources,
				itemConnections: { with: { sourceItem: nameAndId } },
				questHooks: { with: { quest: nameAndId } },
				questStageDeliveries: { with: { quest: nameAndId } },
				questParticipants: { with: { quest: nameAndId } },
				stageInvolvement: true,
				loreLinks: true,
				outgoingForeshadowing: foreshadowingWithTargets,
				details: true,
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
		.then((npcs) => npcs.find((npc) => npc.slug === slug || npc.id === Number(slug)))

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
