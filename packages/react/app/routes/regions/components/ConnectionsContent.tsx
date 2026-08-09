import * as Icons from "lucide-react"
import { NavLink } from "react-router"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Region } from "~/lib/entities"

type ConnectionsContentProps = Pick<Region, "conflicts" | "factionInfluence" | "relations">

export function ConnectionsContent({ conflicts, factionInfluence, relations }: ConnectionsContentProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
			<InfoCard
				title="Factions in the Region"
				icon={<Icons.Users className="h-4 w-4 mr-2" />}
				emptyMessage="No factions hold influence here."
			>
				{factionInfluence.map(
					({
						id,
						creativePrompts,
						description,
						faction,
						influenceLevel,
						presenceDetails,
						presenceTypes,
						priorities,
					}) => (
						<div key={`faction-influence-${id}`} className="border-b pb-3 last:border-b-0 last:pb-0">
							<div className="flex items-center justify-between mb-2">
								<NavLink to={`/factions/${faction.slug}`} className="font-medium hover:text-primary transition-colors">
									{faction.name}
								</NavLink>
								<BadgeWithTooltip variant="outline" tooltipContent={`${faction.name}'s level of control here`}>
									{influenceLevel}
								</BadgeWithTooltip>
							</div>
							<div className="space-y-2">
								<List heading="Description" items={description} spacing="xs" collapsible={false} />
								<List heading="Presence" items={presenceTypes} spacing="xs" />
								<List heading="Presence Details" items={presenceDetails} spacing="xs" />
								<List heading="Priorities" items={priorities} spacing="xs" />
								<List heading="Creative Prompts" items={creativePrompts} spacing="xs" />
							</div>
						</div>
					),
				)}
			</InfoCard>

			<InfoCard
				title="Connected Regions"
				icon={<Icons.Network className="h-4 w-4 mr-2" />}
				emptyMessage="No connections to other regions."
			>
				{relations.map(
					({
						id,
						connectionType,
						creativePrompts,
						description,
						pointsOfInterest,
						region,
						routeType,
						travelDifficulty,
						travelHazards,
						travelTime,
					}) => (
						<div key={`region-connection-${id}`} className="border-b pb-3 last:border-b-0 last:pb-0">
							<NavLink to={`/regions/${region.slug}`} className="text-lg font-medium hover:text-primary transition-colors">
								{region.name}
							</NavLink>

							<div className="flex flex-wrap gap-2 my-2">
								<BadgeWithTooltip variant="outline" tooltipContent="Connection type">
									{connectionType}
								</BadgeWithTooltip>
								<BadgeWithTooltip variant="outline" tooltipContent="Route type">
									{routeType}
								</BadgeWithTooltip>
								<BadgeWithTooltip variant="outline" tooltipContent="Travel difficulty">
									{travelDifficulty}
								</BadgeWithTooltip>
								<BadgeWithTooltip variant="outline" tooltipContent="Travel time">
									{travelTime}
								</BadgeWithTooltip>
							</div>

							<div className="space-y-2">
								<List heading="Description" items={description} spacing="xs" collapsible={false} />
								<List heading="Travel Hazards" items={travelHazards} spacing="xs" />
								<List heading="Points of Interest" items={pointsOfInterest} spacing="xs" />
								<List heading="Creative Prompts" items={creativePrompts} spacing="xs" />
							</div>
						</div>
					),
				)}
			</InfoCard>

			<InfoCard
				title="Conflicts"
				icon={<Icons.Swords className="h-4 w-4 mr-2" />}
				emptyMessage="No conflicts are centered on this region."
				className="md:col-span-2"
			>
				{conflicts.map(({ id, name, slug }) => (
					<div key={`region-conflict-${id}`} className="border-b pb-3 last:border-b-0 last:pb-0">
						<NavLink to={`/conflicts/${slug}`} className="font-medium hover:text-primary transition-colors">
							{name}
						</NavLink>
					</div>
				))}
			</InfoCard>
		</div>
	)
}
