import * as React from "react"
import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { NavLink } from "react-router"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import type { Region } from "~/lib/entities"

interface ConnectionsContentProps {
	region: Region
}

export function ConnectionsContent({ region }: ConnectionsContentProps) {
	const { name, factions = [], relations = [] } = region

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
			{/* Factions in Region */}
			<InfoCard title="Factions in the Region" icon={<Icons.Users className="h-4 w-4 mr-2" />}>
				{factions && factions.length > 0 ? (
					<div className="space-y-4">
						{factions.map((faction) => (
							<div key={`faction-${faction.id}`} className="border-b pb-3 last:border-b-0 last:pb-0">
								<div className="flex items-center justify-between mb-2">
									<NavLink
										to={`/factions/${faction.faction.slug}`}
										className="font-medium hover:text-primary transition-colors"
									>
										{faction.faction.name}
									</NavLink>
									<BadgeWithTooltip variant="outline" tooltipContent={`Level of control in ${name}`}>
										{faction.controlLevel}
									</BadgeWithTooltip>
								</div>
								<div className="space-y-2">
									<div>
										<h4 className="text-sm font-medium mb-1">Presence:</h4>
										<List items={faction.presence} spacing="xs" />
									</div>
									<div>
										<h4 className="text-sm font-medium mb-1">Priorities:</h4>
										<List items={faction.priorities} spacing="xs" />
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<p className="text-muted-foreground">No factions operate in this region.</p>
				)}
			</InfoCard>

			{/* Relations with other regions section */}
			<InfoCard title="Connected Regions" icon={<Icons.Network className="h-4 w-4 mr-2" />}>
				{relations && relations.length > 0 ? (
					<div className="space-y-4">
						{/* Render relations here */}
						<p>Region connections coming soon</p>
					</div>
				) : (
					<p className="text-muted-foreground">No connected regions defined yet.</p>
				)}
			</InfoCard>
		</div>
	)
}

export default ConnectionsContent
