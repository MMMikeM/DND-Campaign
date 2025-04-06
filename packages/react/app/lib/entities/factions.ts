import { db } from "../db"
import addSlugs from "../utils/addSlugs"
import { EntityNotFoundError } from "../errors"
import { unifyRelations } from "../utils/unify"

const factionConfig = {
	findById: (id: number) =>
		db.query.factions.findFirst({
			where: (factions, { eq }) => eq(factions.id, id),
			with: {
				members: { with: { npc: { columns: { name: true, id: true } } } },
				headquarters: { with: { location: { columns: { name: true, id: true } } } },
				relatedQuests: { with: { quest: { columns: { name: true, id: true } } } },
				incomingRelationships: { with: { sourceFaction: { columns: { name: true, id: true } } } },
				outgoingRelationships: { with: { targetFaction: { columns: { name: true, id: true } } } },
				relatedRegions: { with: { region: { columns: { name: true, id: true } } } },
				operations: true,
				culture: true,
				influence: {
					with: {
						quest: { columns: { name: true, id: true } },
						region: { columns: { name: true, id: true } },
						area: { columns: { name: true, id: true } },
						site: { columns: { name: true, id: true } },
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
		.from({ property: "incomingRelationships", key: "sourceFaction" })
		.with({ property: "outgoingRelationships", key: "targetFaction" })
		.to({ property: "relations", key: "faction" })

	if (unified) {
		return addSlugs(unified)
	}

	throw new EntityNotFoundError("Faction", selectedFaction.id)
}
