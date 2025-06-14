import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import addSlugs from "../utils/addSlugs"
import { unifyRelations } from "../utils/unify"

const factionConfig = {
	findById: (id: number) =>
		db.query.factions.findFirst({
			where: (factions, { eq }) => eq(factions.id, id),
			with: {
				agendas: true,
				conflicts: true,
				members: { with: { npc: { columns: { name: true, id: true } } } },
				incomingRelations: { with: { sourceFaction: { columns: { name: true, id: true } } } },
				outgoingRelations: { with: { targetFaction: { columns: { name: true, id: true } } } },
				consequences: {
					with: {
						affectedFaction: { columns: { id: true, name: true } },
						affectedNpc: { columns: { id: true, name: true } },
						affectedRegion: { columns: { id: true, name: true } },
						affectedSite: { columns: { id: true, name: true } },
						affectedQuest: { columns: { id: true, name: true } },
						triggerConflict: { columns: { id: true, name: true } },
						triggerStageDecision: { columns: { id: true, name: true } },
						triggerQuest: { columns: { id: true, name: true } },
						affectedArea: { columns: { id: true, name: true } },
						affectedConflict: { columns: { id: true, name: true } },
						affectedDestination: { columns: { id: true, name: true } },
					},
				},
				narrativeDestinationInvolvement: {
					with: {
						destination: { columns: { id: true, name: true } },
						faction: { columns: { id: true, name: true } },
						npc: { columns: { id: true, name: true } },
					},
				},
				foreshadowingTarget: {
					with: {
						sourceNpc: { columns: { id: true, name: true } },
						sourceQuest: { columns: { id: true, name: true } },
						sourceSite: { columns: { id: true, name: true } },
						sourceQuestStage: { columns: { id: true, name: true } },
						targetFaction: { columns: { id: true, name: true } },
						targetNpc: { columns: { id: true, name: true } },
						targetQuest: { columns: { id: true, name: true } },
						targetSite: { columns: { id: true, name: true } },
						targetWorldConcept: { columns: { id: true, name: true } },
						targetConflict: { columns: { id: true, name: true } },
						targetNarrativeDestination: { columns: { id: true, name: true } },
						targetNarrativeEvent: { columns: { id: true, name: true } },
						targetItem: { columns: { id: true, name: true } },
					},
				},
				influence: {
					with: {
						area: { columns: { id: true, name: true } },
						faction: { columns: { id: true, name: true } },
						region: { columns: { id: true, name: true } },
						site: { columns: { id: true, name: true } },
					},
				},
				itemRelations: {
					with: {
						sourceItem: { columns: { id: true, name: true } },
					},
				},
				worldConceptLinks: {
					with: {
						linkedConflict: { columns: { id: true, name: true } },
						linkedFaction: { columns: { id: true, name: true } },
						linkedNpc: { columns: { id: true, name: true } },
						linkedQuest: { columns: { id: true, name: true } },
						linkedRegion: { columns: { id: true, name: true } },
						worldConcept: { columns: { id: true, name: true } },
					},
				},
				primaryHqSite: true,
				questHooks: {
					with: {
						deliveryNpc: { columns: { id: true, name: true } },
						faction: { columns: { id: true, name: true } },
						site: { columns: { id: true, name: true } },
						quest: { columns: { id: true, name: true } },
					},
				},
				questParticipation: {
					with: {
						faction: { columns: { id: true, name: true } },
						npc: { columns: { id: true, name: true } },
						quest: { columns: { id: true, name: true } },
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
		.then((factions) => factions.find((faction) => faction.slug === slug))

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
