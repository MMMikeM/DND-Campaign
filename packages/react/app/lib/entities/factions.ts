import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import addSlugs from "../utils/addSlugs"
import { unifyRelations } from "../utils/unify"
import { nameAndId } from "."

const factionConfig = {
	findById: (id: number) =>
		db.query.factions.findFirst({
			where: (factions, { eq }) => eq(factions.id, id),
			with: {
				agendas: true,
				conflicts: true,
				primaryHqSite: true,
				members: { with: { npc: nameAndId } },
				incomingRelations: { with: { sourceFaction: nameAndId } },
				outgoingRelations: { with: { targetFaction: nameAndId } },
				affectingConsequences: {
					with: {
						affectedFaction: nameAndId,
						affectedNpc: nameAndId,
						affectedRegion: nameAndId,
						affectedSite: nameAndId,
						affectedQuest: nameAndId,
						affectedArea: nameAndId,
						affectedConflict: nameAndId,
						affectedConsequence: nameAndId,
					},
				},

				incomingForeshadowing: {
					with: {
						sourceNpc: nameAndId,
						sourceQuest: nameAndId,
						sourceSite: nameAndId,
						sourceQuestStage: nameAndId,
						sourceLore: nameAndId,
					},
				},
				influence: {
					with: {
						area: nameAndId,
						faction: nameAndId,
						region: nameAndId,
						site: nameAndId,
					},
				},
				itemConnections: {
					with: {
						sourceItem: nameAndId,
					},
				},
				loreLinks: {
					with: {
						lore: nameAndId,
					},
				},
				questHooks: {
					with: {
						deliveryNpc: nameAndId,
						faction: nameAndId,
						site: nameAndId,
						quest: nameAndId,
					},
				},
				questParticipation: {
					with: {
						faction: nameAndId,
						npc: nameAndId,
						quest: nameAndId,
					},
				},
			},
		}),
	getAll: () => db.query.factions.findMany({}),
	getNamesAndIds: () =>
		db.query.factions.findMany({
			columns: {
				id: true,
				name: true,
			},
		}),
}

export const getAllFactions = async () => {
	const factions = await factionConfig.getAll()
	return addSlugs(factions)
}

export type Faction = Awaited<ReturnType<typeof getFaction>>

export const getFaction = async (slug: string) => {
	const selectedFaction = await factionConfig
		.getNamesAndIds()
		.then(addSlugs)
		.then((factions) => factions.find((faction) => faction.slug === slug || faction.id === Number(slug)))

	if (!selectedFaction) {
		throw new EntityNotFoundError("Faction", slug)
	}

	const byId = await factionConfig.findById(selectedFaction.id)

	if (!byId) {
		throw new EntityNotFoundError("Faction", selectedFaction.id)
	}

	const unified = unifyRelations(byId)
		.from({ property: "incomingRelations", key: "sourceFaction" })
		.with({ property: "outgoingRelations", key: "targetFaction" })
		.to({ property: "relations", key: "faction" })

	if (unified) {
		return addSlugs(unified)
	}

	throw new EntityNotFoundError("Faction", selectedFaction.id)
}
