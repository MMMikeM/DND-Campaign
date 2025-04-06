import React from "react"
import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { getForeshadowingSubtletyVariant } from "../utils"
import type { Foreshadowing } from "~/lib/entities"

interface DetailsContentProps {
	item: Foreshadowing
}

const getNarrativeWeightVariant = (weight: string): "default" | "destructive" | "outline" | "secondary" => {
	switch (weight) {
		case "crucial":
			return "destructive"
		case "major":
			return "default"
		case "supporting":
			return "secondary"
		case "minor":
		default:
			return "outline"
	}
}

export function DetailsContent({ item }: DetailsContentProps) {
	const { description, discoveryCondition, subtlety, narrativeWeight, foreshadowsElement, type } = item

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div className="space-y-6">
				<InfoCard
					title="Description"
					icon={<Icons.ScrollText className="h-4 w-4 mr-2 text-blue-600" />}
					emptyMessage="No description provided."
				>
					<List items={description} spacing="sm" textColor="muted" />
				</InfoCard>

				<InfoCard
					title="Discovery Conditions"
					icon={<Icons.Search className="h-4 w-4 mr-2 text-green-600" />}
					emptyMessage="No specific discovery conditions listed."
				>
					<List items={discoveryCondition} spacing="sm" textColor="muted" />
				</InfoCard>
			</div>

			<div className="space-y-6">
				<InfoCard title="Attributes" icon={<Icons.Info className="h-4 w-4 mr-2 text-indigo-600" />}>
					<div className="space-y-3 p-4">
						<div className="flex justify-between items-center">
							<span className="font-medium text-sm">Type</span>
							<span className="text-muted-foreground text-sm capitalize">{type}</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="font-medium text-sm">Subtlety</span>
							<BadgeWithTooltip
								variant={getForeshadowingSubtletyVariant(subtlety)}
								tooltipContent={`Subtlety: ${subtlety}`}
								className="capitalize"
							>
								{subtlety}
							</BadgeWithTooltip>
						</div>
						<div className="flex justify-between items-center">
							<span className="font-medium text-sm">Narrative Weight</span>
							<BadgeWithTooltip
								variant={getNarrativeWeightVariant(narrativeWeight)}
								tooltipContent={`Narrative Weight: ${narrativeWeight}`}
								className="capitalize"
							>
								{narrativeWeight}
							</BadgeWithTooltip>
						</div>
					</div>
				</InfoCard>

				<InfoCard
					title="Foreshadowed Element"
					icon={<Icons.Sparkles className="h-4 w-4 mr-2 text-yellow-600" />}
					emptyMessage="The specific element being foreshadowed is not defined."
				>
					<div className="p-4">
						<p className="text-sm text-muted-foreground">{foreshadowsElement}</p>
					</div>
				</InfoCard>
			</div>
		</div>
	)
}

export default DetailsContent
