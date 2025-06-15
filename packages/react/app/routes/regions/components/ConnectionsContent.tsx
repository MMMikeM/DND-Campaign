import * as Icons from "lucide-react"
import { NavLink } from "react-router"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Region } from "~/lib/entities"

type ConnectionsContentProps = Pick<Region, "territorialControl" | "relations">

export function ConnectionsContent({ territorialControl, relations }: ConnectionsContentProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
			<InfoCard
				title="Factions in the Region"
				icon={<Icons.Users className="h-4 w-4 mr-2" />}
				emptyMessage="No factions in the region"
			>
				{territorialControl?.map(({ creativePrompts, description, faction, influenceLevel, presence, priorities }) => (
					<div key={`faction-${faction.id}`} className="border-b pb-3 last:border-b-0 last:pb-0">
						<div className="flex items-center justify-between mb-2">
							<NavLink to={`/factions/${faction.slug}`} className="font-medium hover:text-primary transition-colors">
								{faction.name}
							</NavLink>
							<BadgeWithTooltip variant="outline" tooltipContent={`Level of control in ${faction.name}`}>
								{influenceLevel}
							</BadgeWithTooltip>
						</div>
						<div className="space-y-2">
							<List heading="Description" items={description} spacing="xs" collapsible={false} />
							<List heading="Presence" items={presence} spacing="xs" />
							<List heading="Priorities" items={priorities} spacing="xs" />
							<List heading="Creative Prompts" items={creativePrompts} spacing="xs" />
						</div>
					</div>
				))}
			</InfoCard>

			{/* Relations with other regions section */}
			<InfoCard title="Connected Regions" icon={<Icons.Network className="h-4 w-4 mr-2" />}>
				{relations?.map(({ connectionType, details, description, creativePrompts }) => (
					<div key={`relation-${connectionType}`}>
						<h3 className="text-lg font-medium mb-2">{connectionType}</h3>
						<List heading="Description" items={description} spacing="xs" />
						<List heading="Creative Prompts" items={creativePrompts} spacing="xs" />
						{details.map(
							({
								controllingFaction,
								creativePrompts,
								description,
								pointsOfInterest,
								travelDifficulty,
								travelHazards,
								travelTime,
								routeType,
							}) => (
								<div key={`relation-${controllingFaction?.slug}`}>
									<h4 className="text-md font-medium mb-2">{controllingFaction?.name}</h4>
									<BadgeWithTooltip variant="outline" tooltipContent={`Travel Difficulty`}>
										{travelDifficulty}
									</BadgeWithTooltip>
									<BadgeWithTooltip variant="outline" tooltipContent={`Travel Hazards`}>
										{travelHazards}
									</BadgeWithTooltip>
									<BadgeWithTooltip variant="outline" tooltipContent={`Travel Time`}>
										{travelTime}
									</BadgeWithTooltip>
									<BadgeWithTooltip variant="outline" tooltipContent={`Route Type`}>
										{routeType}
									</BadgeWithTooltip>
									<List heading="Description" items={description} spacing="xs" />
									<List heading="Creative Prompts" items={creativePrompts} spacing="xs" />
									<List heading="Points of Interest" items={pointsOfInterest} spacing="xs" />
								</div>
							),
						)}
					</div>
				))}
			</InfoCard>
		</div>
	)
}
