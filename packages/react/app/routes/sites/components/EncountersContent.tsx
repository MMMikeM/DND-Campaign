import * as Icons from "lucide-react"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Site } from "~/lib/entities"

export const EncountersContent = ({ encounters }: Pick<Site, "encounters">) => {
	return (
		<InfoCard
			title="Potential Encounters"
			icon={<Icons.Swords className="h-4 w-4 mr-2 text-primary" />}
			emptyMessage="No specific encounters defined for this site."
		>
			{encounters.map(
				({
					id,
					name,
					creativePrompts,
					gmNotes,
					tags,
					interactiveElements,
					siteId,
					mapVariantId,
					encounterVibe,
					objectiveType,
					objectiveDetails,
					hasTimer,
					timerValue,
					timerUnit,
					timerConsequence,
					coreEnemyGroups,
					synergyDescription,
					encounterCategory,
					recommendedProficiencyBonus,
					specialVariations,
					nonCombatOptions,
					encounterSpecificEnvironmentNotes,
					treasureOrRewards,
					slug,
				}) => (
					<div key={`encounter-${id}`} className="border rounded p-4">
						<h4 className="font-medium flex items-center mb-1">{name}</h4>
						<div className="flex flex-wrap items-center gap-2 mb-2">
							<BadgeWithTooltip variant="outline" tooltipContent="Encounter Type">
								{encounterVibe}
							</BadgeWithTooltip>
							<BadgeWithTooltip variant={getDangerVariant(danger)} tooltipContent="Danger Level">
								{danger}
							</BadgeWithTooltip>
							<BadgeWithTooltip variant={getDifficultyVariant(recommendedProficiencyBonus)} tooltipContent="Difficulty">
								{recommendedProficiencyBonus}
							</BadgeWithTooltip>
						</div>
						<List items={description} spacing="sm" emptyText="No description." className="mb-2 text-sm" />
						<List items={creatures} spacing="sm" emptyText="No creatures." className="mb-2 text-sm" />
						<List items={treasure} spacing="sm" emptyText="No treasure." className="mb-2 text-sm" />
					</div>
				),
			)}
		</InfoCard>
	)
}

const getDangerVariant = (level: string | null | undefined) => {
	switch (level) {
		case "safe":
			return "outline"
		case "low":
			return "secondary"
		case "moderate":
			return "default"
		case "high":
			return "destructive"
		case "deadly":
			return "destructive"
		default:
			return "outline"
	}
}
const getDifficultyVariant = (level: string | null | undefined) => {
	switch (level) {
		case "easy":
			return "secondary"
		case "medium":
			return "default"
		case "hard":
			return "destructive"
		default:
			return "outline"
	}
}
