import * as Icons from "lucide-react"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Tags } from "~/components/Tags"
import type { Site } from "~/lib/entities"

export const EncountersContent = ({ encounters }: Pick<Site, "encounters">) => {
	return (
		<InfoCard
			title="Potential Encounters"
			icon={<Icons.Swords className="h-4 w-4 mr-2 text-primary" />}
			emptyMessage="No specific encounters defined for this site."
			contentClassName="space-y-4"
		>
			{encounters.map(
				({
					id,
					name,
					creativePrompts,
					encounterSpecificEnvironmentNotes,
					encounterVibe,
					interactiveElements,
					nonCombatOptions,
					objectiveDetails,
					objectiveType,
					specialVariations,
					tags,
					treasureOrRewards,
				}) => (
					<div key={`encounter-${id}`} className="border rounded p-4">
						<h4 className="font-medium mb-2">{name}</h4>

						<div className="flex flex-wrap items-center gap-2 mb-2">
							<BadgeWithTooltip variant="outline" tooltipContent="Objective type">
								{objectiveType}
							</BadgeWithTooltip>
							{encounterVibe.map((vibe) => (
								<BadgeWithTooltip key={`vibe-${id}-${vibe}`} variant="secondary" tooltipContent="Encounter vibe">
									{vibe}
								</BadgeWithTooltip>
							))}
						</div>

						<p className="text-sm mb-2">{objectiveDetails}</p>
						{encounterSpecificEnvironmentNotes && (
							<p className="text-sm text-muted-foreground mb-2">{encounterSpecificEnvironmentNotes}</p>
						)}

						<List items={interactiveElements} heading="Interactive Elements" spacing="sm" textColor="muted" />
						<List items={nonCombatOptions} heading="Non-Combat Options" spacing="sm" textColor="muted" />
						<List items={specialVariations} heading="Special Variations" spacing="sm" textColor="muted" />
						<List items={treasureOrRewards} heading="Treasure & Rewards" spacing="sm" textColor="muted" />
						<List items={creativePrompts} heading="Creative Prompts" spacing="sm" textColor="muted" />
						<Tags tags={tags} variant="secondary" maxDisplay={8} />
					</div>
				),
			)}
		</InfoCard>
	)
}
