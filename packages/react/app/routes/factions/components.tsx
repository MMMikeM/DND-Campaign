/**
 * FACTION COMPONENTS REFACTORING GUIDE
 * 
 * This file has been restructured to improve maintainability.
 * Components have been moved to:
 * 
 * 1. Shared/reusable components:
 *    - FactionCard: in ./components/FactionCard.tsx
 *    - FactionHeader: in ./components/FactionHeader.tsx
 * 
 * 2. Components used only in specific tab files:
 *    - $slug.tsx: MembersCard, RelatedQuestsCard
 *    - OverviewContent.tsx: FactionStatsCard, FactionGoalsCard, KeyNotesCard, HeadquartersCard
 *    - DetailsContent.tsx: DetailsCards for history, description, etc.
 *    - CultureContent.tsx: CultureCards for symbols, rituals, etc.
 *    - OperationsContent.tsx: OperationCard
 *    - InfluenceContent.tsx: RegionInfluenceCard, FactionInfluenceCard, RelationsCard
 * 
 * This improves code organization by colocating components with their usage,
 * reducing unnecessary files, and making the codebase more maintainable.
 */

// Helper functions (still exported for shared use)
export const getAlignmentVariant = (alignment: string) => {
	if (alignment.includes("good")) return "default"
	if (alignment.includes("evil")) return "destructive"
	return "secondary"
}

export const getWealthVariant = (wealth: string) => {
	switch (wealth) {
		case "wealthy":
		case "rich":
			return "default"
		case "moderate":
			return "secondary"
		case "poor":
		case "destitute":
			return "destructive"
		default:
			return "outline"
	}
}

export const getSizeVariant = (size: string) => {
	switch (size) {
		case "massive":
		case "large":
			return "default"
		case "medium":
			return "secondary"
		case "small":
		case "tiny":
			return "outline"
		default:
			return "outline"
	}
}

export const getReachVariant = (reach: string) => {
	switch (reach) {
		case "global":
		case "continental":
			return "default"
		case "national":
			return "secondary"
		case "regional":
		case "local":
			return "outline"
		default:
			return "outline"
	}
}
