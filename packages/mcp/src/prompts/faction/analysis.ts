import { tables } from "@tome-master/shared"
import { logger } from "../.."
import { unifyRelations } from "../../unify"
import type { Context } from "../baseContext"
import { countBy, getUnderrepresentedKeys } from "../utils"

const { agendaTypes, alignments, diplomaticStatuses, factionTypes } = tables.factionTables.enums

export function analyzePoliticalLandscape(context: Context) {
	const gaps: Record<
		| "factionTypes"
		| "alignmentGaps"
		| "agendaVariety"
		| "diplomaticStance"
		| "narrativeIntegration"
		| "territorialPresence"
		| "diplomaticOpenings"
		| "narrativeIntegrationPotential",
		string[]
	> = {
		factionTypes: [],
		alignmentGaps: [],
		agendaVariety: [],
		diplomaticStance: [],
		narrativeIntegration: [],
		territorialPresence: [],
		diplomaticOpenings: [],
		narrativeIntegrationPotential: [],
	}

	const { factions, conflicts } = context

	const agendas = factions.flatMap((f) => f.agendas)

	const factionTypeDistribution = countBy(
		factions.flatMap((f) => f.type),
		(type) => type,
		factionTypes,
	)

	const underrepresentedTypes = getUnderrepresentedKeys(factionTypeDistribution)

	if (underrepresentedTypes.length > 0) {
		gaps.factionTypes.push(`Limited representation in ${underrepresentedTypes.join(", ")} faction types`)
	}

	const alignmentDistribution = countBy(factions, (faction) => faction.publicAlignment, alignments)
	const underrepresentedAlignments = getUnderrepresentedKeys(alignmentDistribution)

	if (underrepresentedAlignments.length > 0) {
		gaps.alignmentGaps.push(`Missing factions with ${underrepresentedAlignments.join(", ")} alignments`)
	}

	const agendaTypeDistribution = countBy(agendas, (agenda) => agenda.agendaType, agendaTypes)
	const underrepresentedAgendas = getUnderrepresentedKeys(agendaTypeDistribution)

	if (underrepresentedAgendas.length > 0) {
		gaps.agendaVariety.push(`No active agendas in ${underrepresentedAgendas.join(", ")} spheres`)
	}

	const normalisedRelations = factions
		.map((f) =>
			unifyRelations(f)
				.from({ property: "outgoingRelations", key: "targetFaction" })
				.with({ property: "incomingRelations", key: "sourceFaction" })
				.to({ property: "relations", key: "faction" }),
		)
		.map((r) => ({ ...r, relationCount: r.relations.length }))

	logger.info("Normalised relations", normalisedRelations)
	const factionRelationCountDistribution = countBy(normalisedRelations, (f) => f.relationCount.toString())

	logger.info("Faction relation count distribution", factionRelationCountDistribution)
	const underrepresentedRelationCounts = getUnderrepresentedKeys(factionRelationCountDistribution)

	if (underrepresentedRelationCounts.length > 0) {
		gaps.diplomaticOpenings.push(`Underdeveloped diplomatic network - many factions lack formal relationships`)
	}

	const expectedConnections = Math.floor((factions.length * (factions.length - 1)) / 4) // Rough estimate

	const lowRelationCountFactions = []
	for (const [k, v] of Object.entries(factionRelationCountDistribution)) {
		if (v.count < expectedConnections) {
			lowRelationCountFactions.push(k)
		}
	}

	lowRelationCountFactions.forEach((f) => {
		gaps.diplomaticOpenings.push(`${f} has less than ${expectedConnections} relations`)
	})

	// Check for isolated factions

	const isolatedFactions = factions.filter((f) => !factionRelationCountDistribution[f.id])

	if (isolatedFactions.length > 0) {
		gaps.diplomaticOpenings.push(`${isolatedFactions.length} factions lack formal diplomatic relationships`)
	}

	// Analyze conflict participation
	const activeConflictParticipants = new Set(
		conflicts.flatMap((conflict) => conflict.participants.map((p) => p.faction?.id)).filter(Boolean),
	)

	const nonConflictFactions = factions.filter((f) => !activeConflictParticipants.has(f.id))

	if (nonConflictFactions.length > factions.length / 2) {
		gaps.narrativeIntegrationPotential.push("Many factions not involved in current conflicts")
	}
	// Analyze narrative arc participation - TODO

	// Territory analysis - look for geographic clustering opportunities
	const factionsWithHeadquarters = factions.filter((f) => f.primaryHqSite?.area)
	const locationCoverage = factionsWithHeadquarters.map((f) => f.primaryHqSite?.area?.name).filter(Boolean)

	if (locationCoverage.length < factions.length) {
		gaps.territorialPresence.push("Some regions may lack major faction presence")
	}

	return gaps
}

export async function analyzeFactionGaps({ factions }: Context) {
	const gaps = {
		typeRepresentation: [] as string[],
		alignmentRepresentation: [] as string[],
		agendaVariety: [] as string[],
		diplomaticStance: [] as string[],
		narrativeIntegration: [] as string[],
		territorialPresence: [] as string[],
	}

	// 1. Analyze Faction Type and Alignment Distribution
	const allFactionTypes = factions.flatMap((f) => f.type)
	const typeDistribution = countBy(allFactionTypes, (type) => type, factionTypes)
	gaps.typeRepresentation = getUnderrepresentedKeys(typeDistribution).map(
		(key) => `The world lacks factions of type: ${key}.`,
	)

	const alignmentDistribution = countBy(factions, (f) => f.publicAlignment, alignments)
	gaps.alignmentRepresentation = getUnderrepresentedKeys(alignmentDistribution).map(
		(key) => `There is a shortage of ${key} factions.`,
	)

	// 2. Analyze Agenda Variety
	const allAgendas = factions.flatMap((f) => f.agendas)
	const agendaTypeDistribution = countBy(allAgendas, (a) => a.agendaType, agendaTypes)
	gaps.agendaVariety = getUnderrepresentedKeys(agendaTypeDistribution).map(
		(key) => `Few factions are pursuing ${key} agendas.`,
	)

	// 3. Analyze Diplomatic Stance
	const allDiplomacy = factions
		.map((f) =>
			unifyRelations(f)
				.from({ property: "outgoingRelations", key: "targetFaction" })
				.with({ property: "incomingRelations", key: "sourceFaction" })
				.to({ property: "relations", key: "faction" }),
		)
		.flatMap((faction) => faction.relations.flatMap((r) => r.diplomaticStatus))

	const diplomacyStatusDistribution = countBy(allDiplomacy, (d) => d, diplomaticStatuses)
	if ((diplomacyStatusDistribution.ally?.percentage ?? 0) < 15) {
		gaps.diplomaticStance.push("The political landscape is highly fragmented. More alliances could create stability.")
	}
	if ((diplomacyStatusDistribution.enemy?.percentage ?? 0) === 0) {
		gaps.diplomaticStance.push('A lack of open enemies might indicate a "cold war" or hidden tensions brewing.')
	}

	// 4. Analyze Narrative Integration - TODO

	// 5. Analyze Territorial Presence
	const factionWithoutAreaInfluence = factions.filter((f) => !f.influence.some((i) => !i.area))

	if (factionWithoutAreaInfluence.length > 3) {
		gaps.territorialPresence.push(
			`${factionWithoutAreaInfluence.map((f) => f.name).join(", ")} have no established influence or territory, making them seem disconnected from the world.`,
		)
	}

	const factionsWithoutHq = factions.filter((f) => !f.primaryHqSite)
	if (factionsWithoutHq.length > 3) {
		gaps.territorialPresence.push(
			`${factionsWithoutHq.map((f) => f.name).join(", ")} have no primary headquarters, making them seem disconnected from the world.`,
		)
	}

	return gaps
}
