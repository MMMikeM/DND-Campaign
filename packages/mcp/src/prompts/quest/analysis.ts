/**
 * Quest Analysis Functions
 *
 * Provides analysis functions for quest creation including fuzzy search
 * and entity matching capabilities.
 */

// Re-export the centralized search function for backward compatibility
export { searchBySimilarity } from "../../tools/utils/search"

/**
 * Analyzes quest type patterns to suggest quest structures
 */
export function analyzeQuestTypePatterns(
	questType: string | undefined,
	existingQuests: Array<{ name: string; type: string }>,
): string[] {
	const patterns: string[] = []

	if (!questType) return patterns

	// Analyze existing quest patterns
	const relatedQuests = existingQuests.filter(
		(q) =>
			q.type === questType ||
			(questType === "main" && q.type === "story") ||
			(questType === "faction" && q.type === "political"),
	)

	if (relatedQuests.length > 0) {
		patterns.push(`Follows pattern established by "${relatedQuests[0]?.name}"`)
		if (relatedQuests.length > 1) {
			patterns.push(`Similar complexity to "${relatedQuests[1]?.name}"`)
		}
	}

	// Add type-specific patterns
	const typePatterns = {
		main: ["Central to campaign progression", "Affects multiple factions", "Long-term consequences"],
		side: ["Optional but rewarding", "Character development focus", "Local impact"],
		faction: ["Political implications", "Reputation changes", "Faction relationship shifts"],
		personal: ["Character backstory integration", "Emotional stakes", "Individual growth"],
		investigation: ["Information gathering", "Multiple clues and leads", "Mystery progression"],
		combat: ["Strategic encounters", "Resource management", "Tactical challenges"],
	}

	const specificPatterns = typePatterns[questType as keyof typeof typePatterns]
	if (specificPatterns) {
		patterns.push(...specificPatterns)
	}

	return patterns
}

/**
 * Analyzes theme compatibility with existing campaign elements
 */
export function analyzeThemeCompatibility(
	theme: string | undefined,
	activeConflicts: Array<{ name: string; natures: string[] }>,
	availableFactions: Array<{ name: string; type: string }>,
): string[] {
	const compatibility: string[] = []

	if (!theme) return compatibility

	// Check theme alignment with active conflicts
	for (const conflict of activeConflicts) {
		const conflictNatures = conflict.natures || []

		if (theme === "combat" && conflictNatures.includes("military")) {
			compatibility.push(`Aligns with military aspects of "${conflict.name}"`)
		}
		if (theme === "diplomacy" && conflictNatures.includes("political")) {
			compatibility.push(`Could help resolve political tensions in "${conflict.name}"`)
		}
		if (theme === "investigation" && conflictNatures.includes("mystery")) {
			compatibility.push(`Investigative approach suits mysterious elements of "${conflict.name}"`)
		}
	}

	// Check theme alignment with faction types
	const militaryFactions = availableFactions.filter((f) => f.type === "military")
	const tradeFactions = availableFactions.filter((f) => f.type === "trade")
	const religiousFactions = availableFactions.filter((f) => f.type === "religious")

	if (theme === "combat" && militaryFactions.length > 0) {
		compatibility.push(`Military factions like "${militaryFactions[0]?.name}" could provide support`)
	}
	if (theme === "diplomacy" && tradeFactions.length > 0) {
		compatibility.push(`Trade factions like "${tradeFactions[0]?.name}" excel at negotiation`)
	}
	if (theme === "investigation" && religiousFactions.length > 0) {
		compatibility.push(`Religious orders like "${religiousFactions[0]?.name}" may have hidden knowledge`)
	}

	return compatibility
}
