import { embeddingTextGenerators, tables } from "@tome-master/shared"
import { db } from "../.."

const { relationshipStrengths } = tables.factionTables.enums

const friendOrFoe = (
	relationship: (typeof relationshipStrengths)[number] | string,
	friendOrFoe: "friend" | "foe" | "neutral",
) => {
	//  const relationshipStrengths: readonly ["weak", "moderate", "friendly", "strong", "unbreakable", "friction", "cold", "hostile", "war"]
	const friendly = ["friendly", "strong", "unbreakable"]
	const hostile = ["weak", "moderate", "cold", "hostile", "war"]
	if (friendly.includes(relationship)) {
		return friendOrFoe
	}
	if (hostile.includes(relationship)) {
		return friendOrFoe
	}
}

export const embeddingTextForFaction = async (id: number): Promise<string> => {
	const faction = await db.query.factions.findFirst({
		where: (faction, { eq }) => eq(faction.id, id),
		with: {
			incomingRelationships: {
				with: {
					sourceFaction: {
						columns: { name: true },
					},
				},
			},
			outgoingRelationships: {
				with: {
					targetFaction: {
						columns: { name: true },
					},
				},
			},
			primaryHqSite: {
				columns: { name: true },
			},
			influence: {
				with: {
					area: {
						columns: { name: true },
					},
					region: {
						columns: { name: true },
					},
					site: {
						columns: { name: true },
					},
				},
			},
		},
	})

	if (!faction) {
		throw new Error(`Faction with id ${id} not found`)
	}

	const areasOfInfluence = faction.influence.map((influence) => {
		if (influence.area) {
			return `${influence.area.name} (Area)`
		}
		if (influence.region) {
			return `${influence.region.name} (Region)`
		}
		return "noneo"
	})

	const input: Parameters<typeof embeddingTextGenerators.factions>[0] = {
		name: faction.name,
		publicAlignment: faction.publicAlignment,
		secretAlignment: faction.secretAlignment,
		size: faction.size,
		wealth: faction.wealth,
		reach: faction.reach,
		type: faction.type,
		publicGoal: faction.publicGoal,
		secretGoal: faction.secretGoal,
		publicPerception: faction.publicPerception,
		transparencyLevel: faction.transparencyLevel,
		values: faction.values,
		history: faction.history,
		symbols: faction.symbols,
		rituals: faction.rituals,
		taboos: faction.taboos,
		aesthetics: faction.aesthetics,
		jargon: faction.jargon,
		recognitionSigns: faction.recognitionSigns,
		description: faction.description,
		creativePrompts: faction.creativePrompts,
		gmNotes: faction.gmNotes,
		tags: faction.tags,

		// Resolved fields
		primaryHqSiteName: faction.primaryHqSite?.name,
		keyAllyFactionNames: faction.incomingRelationships
			.filter((relationship) => friendOrFoe(relationship.strength, "friend"))
			.map((relationship) => relationship.sourceFaction?.name),
		keyEnemyFactionNames: faction.outgoingRelationships
			.filter((relationship) => friendOrFoe(relationship.strength, "foe"))
			.map((relationship) => relationship.targetFaction?.name),
		areasOfInfluence: areasOfInfluence,
	}

	return embeddingTextGenerators.factions(input)
}
