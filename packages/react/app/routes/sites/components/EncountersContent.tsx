import * as Icons from "lucide-react"
import React from "react"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Site } from "~/lib/entities"

export const EncountersContent: React.FC<Site> = ({ encounters }) => {
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

	console.log(encounters)

	return (
		<InfoCard
			title="Potential Encounters"
			icon={<Icons.Swords className="h-4 w-4 mr-2 text-primary" />}
			emptyMessage="No specific encounters defined for this site."
		>
			{encounters.map((encounter) => (
				<div key={`encounter-${encounter.id}`} className="border rounded p-4">
					<h4 className="font-medium flex items-center mb-1">{encounter.name}</h4>
					<div className="flex flex-wrap items-center gap-2 mb-2">
						<BadgeWithTooltip variant="outline" tooltipContent="Encounter Type">
							{encounter.encounterType}
						</BadgeWithTooltip>
						<BadgeWithTooltip variant={getDangerVariant(encounter.dangerLevel)} tooltipContent="Danger Level">
							{encounter.dangerLevel}
						</BadgeWithTooltip>
						<BadgeWithTooltip variant={getDifficultyVariant(encounter.difficulty)} tooltipContent="Difficulty">
							{encounter.difficulty}
						</BadgeWithTooltip>
					</div>
					<List items={encounter.description} spacing="sm" emptyText="No description." className="mb-2 text-sm" />
					<List items={encounter.creatures} spacing="sm" emptyText="No creatures." className="mb-2 text-sm" />
					<List items={encounter.treasure} spacing="sm" emptyText="No treasure." className="mb-2 text-sm" />
				</div>
			))}
		</InfoCard>
	)
}

export default EncountersContent
