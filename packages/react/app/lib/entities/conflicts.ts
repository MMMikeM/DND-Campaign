import { nameAndId } from "."
import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import addSlugs from "../utils/addSlugs"

const conflictConfig = {
	findById: (id: number) =>
		db.query.conflicts.findFirst({
			where: { id },
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
				affectingConsequences: {
					columns: {
						complicationDetails: true,
						conflictImpactDescription: true,
						description: true,
						escalationDetails: true,
						id: true,
						name: true,
						playerImpactFeel: true,
						consequenceType: true,
						severity: true,
						slug: true,
						sourceType: true,
						tags: true,
						timeframe: true,
						visibility: true,
						creativePrompts: true,
						twistRevealDetails: true,
					},
					// The affected* relations are omitted deliberately: chk_single_affected_entity
					// allows exactly one, and for this list it is always the parent conflict.
					with: {
						affectingConsequences: nameAndId,
						incomingForeshadowing: nameAndId,
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

export const getConflictNames = () => conflictConfig.getNamesAndIds().then(addSlugs)
