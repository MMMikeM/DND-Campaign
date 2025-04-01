import React from "react"
import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Link } from "~/components/ui/link"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import type { Region } from "~/lib/entities"

interface LocationsContentProps {
	region: Region
}

export const LocationsContent: React.FC<LocationsContentProps> = ({ region }) => {
	const { locations, slug, economy, population, creativePrompts } = region

	return (
		<>
			<div className="grid grid-cols-1 gap-6 mb-6">
				<InfoCard
					title="Notable Locations"
					icon={<Icons.Building2 className="h-4 w-4 mr-2 text-primary" />}
					emptyMessage="No notable locations in this region"
				>
					<p className="text-sm text-muted-foreground mb-4">Specific places of interest within this region</p>
					{locations && locations.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{locations.map((location) => (
								<div key={`location-${location.id}`} className="border rounded p-4">
									<Link href={`/regions/${slug}/locations/${location.slug}`}>
										<h4 className="font-medium flex items-center">
											<Icons.LocateFixed className="h-4 w-4 mr-2 text-indigo-500" />
											{location.name}
										</h4>
									</Link>
									<BadgeWithTooltip variant="outline" className="mt-1" tooltipContent={`Location type`}>
										{location.locationType}
									</BadgeWithTooltip>
									<p className="text-xs mt-2 text-muted-foreground">{location.mood}</p>
									<div className="mt-3 space-y-2">
										<div className="flex text-xs text-muted-foreground">
											<span className="font-medium mr-2">Terrain:</span>
											<span>{location.terrain}</span>
										</div>
										<div className="flex text-xs text-muted-foreground">
											<span className="font-medium mr-2">Climate:</span>
											<span>{location.climate}</span>
										</div>
									</div>
									<div className="mt-3">
										<List items={location.description} spacing="sm" emptyText="No description available" />
									</div>
									{location.encounters && location.encounters.length > 0 && (
										<div className="mt-2">
											<BadgeWithTooltip
												variant="secondary"
												className="text-xs"
												tooltipContent={`This location has ${location.encounters.length} potential encounters`}
											>
												<Icons.Zap className="h-3 w-3 mr-1" />
												{location.encounters.length} encounters
											</BadgeWithTooltip>
										</div>
									)}
								</div>
							))}
						</div>
					) : (
						<p className="text-muted-foreground">No notable locations in this region</p>
					)}
				</InfoCard>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<InfoCard title="Economy" icon={<Icons.CircleDollarSign className="h-4 w-4 mr-2 text-primary" />}>
					<p>{economy}</p>
					<p className="mt-4 text-sm text-muted-foreground">
						The region has a {population} population with a {economy}-based economy.
					</p>
				</InfoCard>

				<InfoCard
					title="Creative Prompts"
					icon={<Icons.Eye className="h-4 w-4 mr-2 text-primary" />}
					emptyMessage="No creative prompts available"
				>
					<List items={creativePrompts} spacing="sm" textColor="default" emptyText="No creative prompts available" />
				</InfoCard>
			</div>
		</>
	)
}

export default LocationsContent
