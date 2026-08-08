import { bySlugOrId, consequenceWithTrigger, foreshadowingWithSources, foreshadowingWithTargets, nameAndId } from "."
import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import { unifyRelations } from "../utils/unify"

const npcConfig = {
	findBy: (where: { id: number } | { slug: string }) =>
		db.query.npcs.findFirst({
			where,
			with: {
				incomingRelations: { with: { sourceNpc: nameAndId } },
				outgoingRelations: { with: { targetNpc: nameAndId } },
				site: nameAndId,
				affectingConsequences: consequenceWithTrigger,
				conflictParticipation: { with: { conflict: nameAndId } },
				factionMemberships: { with: { faction: nameAndId } },
				incomingForeshadowing: foreshadowingWithSources,
				itemConnections: { with: { sourceItem: nameAndId } },
				questHooks: { with: { quest: nameAndId } },
				questStageDeliveries: { with: { quest: nameAndId } },
				questParticipants: { with: { quest: nameAndId } },
				stageInvolvement: { with: { questStage: nameAndId } },
				loreLinks: { with: { lore: nameAndId } },
				outgoingForeshadowing: foreshadowingWithTargets,
				details: true,
			},
		}),

	getAll: () => db.query.npcs.findMany({}),
	getNamesAndIds: () => db.query.npcs.findMany(nameAndId),
}

export const getAllNpcs = () => npcConfig.getAll()

export type NPC = Awaited<ReturnType<typeof getNpc>>

export const getNpc = async (slugOrId: string) => {
	const npc = await npcConfig.findBy(bySlugOrId(slugOrId))

	if (!npc) {
		throw new EntityNotFoundError("NPC", slugOrId)
	}

	return unifyRelations(npc)
		.from({ property: "incomingRelations", key: "sourceNpc" })
		.with({ property: "outgoingRelations", key: "targetNpc" })
		.to({ property: "relations", key: "npc" })
}

export const getNpcNames = () => npcConfig.getNamesAndIds()
