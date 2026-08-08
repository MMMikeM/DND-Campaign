import { bySlugOrId, consequenceWithTrigger, nameAndId } from "."
import { db } from "../db"
import { EntityNotFoundError } from "../errors"

const conflictConfig = {
	findBy: (where: { id: number } | { slug: string }) =>
		db.query.conflicts.findFirst({
			where,
			with: {
				region: nameAndId,
				itemConnections: { with: { sourceItem: nameAndId } },
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
				affectingConsequences: consequenceWithTrigger,
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

export const getAllConflicts = () => conflictConfig.getAll()

export type Conflict = NonNullable<Awaited<ReturnType<typeof conflictConfig.findBy>>>

export const getConflict = async (slugOrId: string) => {
	const conflict = await conflictConfig.findBy(bySlugOrId(slugOrId))

	if (!conflict) {
		throw new EntityNotFoundError("Conflict", slugOrId)
	}

	return conflict
}

export const getConflictNames = () => conflictConfig.getNamesAndIds()
