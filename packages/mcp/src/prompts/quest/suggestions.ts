/**
 * Quest Suggestions Functions
 *
 * Provides suggestion functions for quest connections, integration with
 * existing storylines, and narrative opportunities.
 */

import type { QuestCreationArgs } from "./types"

/**
 * Generates quest connection suggestions based on existing campaign elements
 */
export async function generateQuestConnectionSuggestions(
	args: QuestCreationArgs,
	existingQuests: Array<{ name: string; type: string }>,
	activeConflicts: Array<{ name: string; priority?: string }>,
	availableFactions: Array<{ name: string; type: string }>,
): Promise<string[]> {
	const suggestions: string[] = []

	// Suggest based on quest type patterns
	if (args.type_hint) {
		const relatedQuests = existingQuests.filter(
			(q) =>
				q.type === args.type_hint ||
				(args.type_hint === "main" && q.type === "story") ||
				(args.type_hint === "faction" && q.type === "political"),
		)

		if (relatedQuests.length > 0) {
			suggestions.push(`Continuation of ${relatedQuests[0]?.name} storyline`)
			if (relatedQuests.length > 1) {
				suggestions.push(`Parallel quest to ${relatedQuests[1]?.name} events`)
			}
		}
	}

	// Suggest conflict integration
	if (activeConflicts.length > 0) {
		const highPriorityConflicts = activeConflicts.filter((c) => c.priority === "high")
		if (highPriorityConflicts.length > 0) {
			suggestions.push(`Direct involvement in ${highPriorityConflicts[0]?.name} conflict`)
		} else {
			suggestions.push(`Side effects of ${activeConflicts[0]?.name} situation`)
		}
	}

	// Suggest faction involvement
	if (args.faction_hint && availableFactions.length > 0) {
		const matchingFactions = availableFactions.filter((f) =>
			f.name.toLowerCase().includes(args.faction_hint?.toLowerCase() || ""),
		)

		if (matchingFactions.length > 0) {
			suggestions.push(`${matchingFactions[0]?.name} commission or internal matter`)
		}
	}

	// Suggest theme-based connections
	if (args.theme_hint) {
		const themeConnections = {
			investigation: "Mystery requiring careful inquiry and evidence gathering",
			combat: "Direct confrontation with hostile forces",
			diplomacy: "Negotiation and relationship building between parties",
			rescue: "Time-sensitive mission to save someone or something",
			exploration: "Discovery of new locations or ancient secrets",
			heist: "Stealth mission to acquire something valuable",
			escort: "Protection mission with travel and social challenges",
			artifact: "Retrieval or protection of powerful magical items",
			political: "Navigate court intrigue and power struggles",
			revenge: "Personal vendetta with moral complexity",
		}

		const suggestion = themeConnections[args.theme_hint as keyof typeof themeConnections]
		if (suggestion) {
			suggestions.push(suggestion)
		}
	}

	return suggestions
}

/**
 * Suggests quest rewards based on type and context
 */
export function suggestQuestRewards(
	questType: string | undefined,
	factionContext: any,
	activeConflicts: Array<{ name: string }>,
): string[] {
	const rewards: string[] = []

	// Type-based reward suggestions
	const typeRewards = {
		main: [
			"Significant story progression",
			"Major faction relationship changes",
			"Access to new campaign areas",
			"Powerful magical items or knowledge",
		],
		side: [
			"Gold and equipment",
			"Local reputation gains",
			"Useful contacts and allies",
			"Skills or training opportunities",
		],
		faction: [
			"Faction rank advancement",
			"Political favors and connections",
			"Access to faction resources",
			"Diplomatic immunity or privileges",
		],
		personal: [
			"Character development moments",
			"Resolution of backstory elements",
			"Emotional closure or growth",
			"Personal magical items or boons",
		],
	}

	if (questType && typeRewards[questType as keyof typeof typeRewards]) {
		rewards.push(...typeRewards[questType as keyof typeof typeRewards])
	}

	// Context-based rewards
	if (factionContext?.factions?.length > 0) {
		rewards.push(`${factionContext.factions[0].name} patronage and support`)
		rewards.push("Access to faction-specific resources or information")
	}

	if (activeConflicts.length > 0) {
		rewards.push(`Intelligence about ${activeConflicts[0]?.name} situation`)
		rewards.push("Strategic advantage in ongoing conflicts")
	}

	return rewards
}

/**
 * Suggests quest complications and failure consequences
 */
export function suggestQuestComplications(
	args: QuestCreationArgs,
	activeConflicts: Array<{ name: string; natures: string[] }>,
	availableFactions: Array<{ name: string; type: string }>,
): string[] {
	const complications: string[] = []

	// Theme-based complications
	if (args.theme_hint) {
		const themeComplications = {
			investigation: ["False leads and red herrings", "Witnesses disappear or lie", "Evidence is destroyed or planted"],
			combat: [
				"Reinforcements arrive for enemies",
				"Collateral damage threatens innocents",
				"Tactical disadvantages in terrain",
			],
			diplomacy: [
				"Hidden agendas of negotiating parties",
				"Cultural misunderstandings cause offense",
				"Rival diplomats sabotage negotiations",
			],
			rescue: [
				"Time limits become more pressing",
				"Rescue target is moved or hidden",
				"Rescuer becomes captured as well",
			],
		}

		const complications_for_theme = themeComplications[args.theme_hint as keyof typeof themeComplications]
		if (complications_for_theme) {
			complications.push(...complications_for_theme)
		}
	}

	// Conflict-based complications
	for (const conflict of activeConflicts) {
		if (conflict.natures.includes("political")) {
			complications.push(`Political ramifications from ${conflict.name} affect quest`)
		}
		if (conflict.natures.includes("military")) {
			complications.push(`Military tensions from ${conflict.name} create obstacles`)
		}
	}

	// Faction-based complications
	const hostileFactions = availableFactions.filter((f) => f.type === "criminal" || f.type === "cult")
	if (hostileFactions.length > 0) {
		complications.push(`${hostileFactions[0]?.name} interferes with quest objectives`)
	}

	// General complications
	complications.push(
		"Moral dilemma forces difficult choice",
		"Unexpected ally becomes liability",
		"Quest objectives conflict with personal values",
		"Time pressure forces hasty decisions",
	)

	return complications
}

/**
 * Suggests future story hooks based on quest outcomes
 */
export function suggestFutureHooks(
	args: QuestCreationArgs,
	existingQuests: Array<{ name: string; type: string }>,
	availableFactions: Array<{ name: string }>,
): string[] {
	const hooks: string[] = []

	// Success-based hooks
	hooks.push(
		"Quest success attracts attention from powerful entities",
		"Completed objective reveals larger conspiracy",
		"Grateful allies request additional assistance",
		"Quest resolution changes local power dynamics",
	)

	// Failure-based hooks
	hooks.push(
		"Quest failure creates ongoing consequences",
		"Enemies gain advantage from quest outcome",
		"Failed objectives can be attempted again",
		"Failure teaches valuable lessons for future",
	)

	// Faction-based hooks
	if (availableFactions.length > 0) {
		hooks.push(`${availableFactions[0]?.name} offers follow-up opportunities`)
		if (availableFactions.length > 1) {
			hooks.push(`${availableFactions[1]?.name} becomes interested in party's capabilities`)
		}
	}

	// Quest chain hooks
	if (args.type_hint === "main") {
		hooks.push("Sets up major campaign milestone")
		hooks.push("Reveals information for future main quests")
	}

	return hooks
}
