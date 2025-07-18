import { tables } from "@tome-master/shared"
import { logger } from "../.."
import type { Context } from "../baseContext"
import { countBy, getUnderrepresentedKeys } from "../utils"

export function getNpcContentGaps({ conflicts, factions, npcs, quests, regions, areas, sites }: Context) {
	const gaps: Record<
		| "playerPerceptionGoal"
		| "factionMembership"
		| "narrativeIntegrationOpportunities"
		| "locationGaps"
		| "questGaps"
		| "conflictGaps",
		string[]
	> = {
		playerPerceptionGoal: [],
		factionMembership: [],
		narrativeIntegrationOpportunities: [],
		locationGaps: [],
		questGaps: [],
		conflictGaps: [],
	}

	// Analyze NPC complexity distribution

	const factionMembershipDistribution = countBy(
		factions.map((f) => ({ name: f.name, members: f.members.length ?? 0 })),
		(faction) => faction.name,
	)

	const underrepresentedFactions = getUnderrepresentedKeys(factionMembershipDistribution)

	if (underrepresentedFactions.length > 0) {
		gaps.factionMembership = underrepresentedFactions.map(
			(faction) =>
				`${faction} needs more NPC representation (${factionMembershipDistribution[faction]?.count ?? 0} current members)`,
		)
	}

	// Helper to extract NPC IDs from participant arrays
	type Participant = { npc: { id: string | number } | null }

	const extractNPCIds = (
		groups: { participants?: Participant[] }[],
		getParticipants?: (g: unknown) => Participant[] | undefined,
	): (string | number)[] =>
		groups.flatMap((group) => {
			const participants = getParticipants ? getParticipants(group) : group.participants
			return participants?.flatMap((p) => (p.npc?.id != null ? [p.npc.id] : [])) ?? []
		})

	const narrativeActiveNPCs = new Set([...extractNPCIds(quests), ...extractNPCIds(conflicts)])

	const inactiveNPCs = npcs.filter((npc) => !narrativeActiveNPCs.has(npc.id))

	if (inactiveNPCs.length > 3) {
		gaps.narrativeIntegrationOpportunities.push(
			`${inactiveNPCs.length} NPCs not involved in active storylines - integration opportunities`,
		)
	}

	// Analyze location gaps
	if (regions.length > 0) {
		regions.forEach((region) => {
			if (region.areas.length < 2) {
				gaps.locationGaps.push(`The region "${region.name}" feels sparse and could use more distinct areas.`)
			}
		})
	}

	if (areas.length > 0) {
		areas.forEach((area) => {
			const areaSites = sites.filter((site) => site.area?.id === area.id)
			if (areaSites.length < 3) {
				gaps.locationGaps.push(`The area "${area.name}" feels underdeveloped and needs more points of interest.`)
			}
		})
	}

	// Analyze quest distribution
	const questTypeDistribution = countBy(quests, (q) => q.type, tables.questTables.enums.questTypes)

	if (questTypeDistribution.main.count < 1) {
		gaps.questGaps.push("There are no 'main' quests to drive the central plot.")
	}

	if ((questTypeDistribution.side.percentage ?? 0) < 20) {
		gaps.questGaps.push("Could use more 'side' quests for player freedom and world exploration.")
	}

	const questUrgencyDistribution = countBy(quests, (q) => q.urgency)

	for (const [key, value] of Object.entries(questUrgencyDistribution)) {
		if (value.percentage > 20) {
			gaps.questGaps.push(
				`There may be too many '${key}' quests, potentially overwhelming the players. Consider adding more 'developing' or 'background' quests.`,
			)
		}
		if (value.percentage < 10) {
			gaps.questGaps.push(
				`There may be too few '${key}' quests, potentially overwhelming the players. Consider adding more 'urgent' quests.`,
			)
		}
	}

	// Analyze conflict dynamics
	const conflictStatusDistribution = countBy(conflicts, (c) => c.status, tables.conflictTables.enums.conflictStatuses)

	logger.info("Conflict status distribution", conflictStatusDistribution)

	if (conflictStatusDistribution.active.count < 1) {
		gaps.conflictGaps.push(
			"There are no 'active' conflicts, which may reduce tension. Consider introducing a new immediate threat.",
		)
	}
	if ((conflictStatusDistribution.brewing.percentage ?? 0) < 20) {
		gaps.conflictGaps.push(
			"There are few 'brewing' conflicts. Consider adding foreshadowing for future threats and political tensions.",
		)
	}

	logger.info("NPC Content Gaps", { gaps })

	return gaps
}
