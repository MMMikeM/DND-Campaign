import { bySlugOrId, consequenceWithTrigger, foreshadowingWithSources, nameAndId } from "."
import { db } from "../db"
import { EntityNotFoundError } from "../errors"
import { unifyRelations } from "../utils/unify"

const factionConfig = {
	findBy: (where: { id: number } | { slug: string }) =>
		db.query.factions.findFirst({
			where,
			with: {
				agendas: true,
				conflicts: true,
				primaryHqSite: true,
				members: { with: { npc: nameAndId } },
				incomingRelations: { with: { sourceFaction: nameAndId } },
				outgoingRelations: { with: { targetFaction: nameAndId } },
				affectingConsequences: consequenceWithTrigger,

				incomingForeshadowing: foreshadowingWithSources,
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
	getNamesAndIds: () => db.query.factions.findMany(nameAndId),
}

export const getAllFactions = () => factionConfig.getAll()

export type Faction = Awaited<ReturnType<typeof getFaction>>

export const getFaction = async (slugOrId: string) => {
	const faction = await factionConfig.findBy(bySlugOrId(slugOrId))

	if (!faction) {
		throw new EntityNotFoundError("Faction", slugOrId)
	}

	return unifyRelations(faction)
		.from({ property: "incomingRelations", key: "sourceFaction" })
		.with({ property: "outgoingRelations", key: "targetFaction" })
		.to({ property: "relations", key: "faction" })
}

export const getFactionNames = () => factionConfig.getNamesAndIds()
