import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import addSlugs from "../utils/addSlugs"
import { nameAndId } from "."

const conflictConfig = {
	findById: (id: number) =>
		db.query.conflicts.findFirst({
			where: (conflicts, { eq }) => eq(conflicts.id, id),
			with: {
				region: nameAndId,
				itemConnections: nameAndId,
				loreLinks: {
					columns: {
						loreId: false,
						relatedLoreId: false,
						conflictId: false,
						factionId: false,
						npcId: false,
						questId: false,
						regionId: false,
					},
					with: {
						conflict: nameAndId,
						lore: nameAndId,
						relatedLore: nameAndId,
						faction: nameAndId,
						npc: nameAndId,
						quest: nameAndId,
						region: nameAndId,
					},
				},
				affectingConsequences: {
					with: {
						triggerQuest: nameAndId,
						triggerQuestStageDecision: nameAndId,
					},
				},
				incomingForeshadowing: {
					with: {
						sourceLore: nameAndId,
						sourceNpc: nameAndId,
						sourceQuest: nameAndId,
						sourceSite: nameAndId,
						sourceQuestStage: nameAndId,
					},
				},
				participants: {
					with: {
						faction: nameAndId,
						npc: nameAndId,
					},
				},
			},
		}),
	getAll: () =>
		db.query.conflicts.findMany({
			with: {
				region: nameAndId,
			},
		}),
	getNamesAndIds: () => db.query.conflicts.findMany(nameAndId),
}

export const getAllConflicts = async () => {
	const conflicts = await conflictConfig.getAll()

	return addSlugs(conflicts)
}

export type Conflict = Awaited<ReturnType<typeof getConflict>>

export const getConflict = async (slug: string) => {
	const selectedConflict = await conflictConfig
		.getNamesAndIds()
		.then(addSlugs)
		.then((conflicts) => conflicts.find((conflict) => conflict.slug === slug || conflict.id === Number(slug)))

	if (!selectedConflict) {
		throw new EntityNotFoundError("Conflict", slug)
	}

	const byId = await conflictConfig.findById(selectedConflict.id)

	if (byId) {
		return addSlugs(byId)
	}

	throw new EntityNotFoundError("Conflict", selectedConflict.id)
}
