import * as Icons from "lucide-react"
import type React from "react"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Link } from "~/components/ui/link"
import type { Region } from "~/lib/entities"

type AreasContentProps = Pick<Region, "areas" | "slug" | "economy" | "population" | "creativePrompts">

export const AreasContent: React.FC<AreasContentProps> = ({ areas, slug, economy, population, creativePrompts }) => {
	return (
		<>
			<div className="grid grid-cols-1 gap-6 mb-6">
				<InfoCard
					title="Notable Areas"
					icon={<Icons.MapPin className="h-4 w-4 mr-2 text-primary" />}
					emptyMessage="No notable areas in this region"
				>
					<p className="text-sm text-muted-foreground mb-4">Specific areas of interest within this region</p>
					{/* Check for 'areas' array safely */}
					{Array.isArray(areas) && areas.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{/* Map over 'areas' */}
							{areas.map(
								(area) =>
									// Add null check for area just in case
									area && (
										<div key={`area-${area.id}`} className="border rounded p-4">
											<Link href={`/areas/${area.slug}`}>
												<h4 className="font-medium flex items-center">
													<Icons.Landmark className="h-4 w-4 mr-2 text-indigo-500" />
													{area.name ?? "Unnamed Area"}
												</h4>
											</Link>
											<BadgeWithTooltip variant="outline" className="mt-1 capitalize" tooltipContent={`Area type`}>
												{area.type ?? "Unknown Type"}
											</BadgeWithTooltip>
											{/* Display count of sites within the area safely */}
											{Array.isArray(area.sites) && area.sites.length > 0 && (
												<div className="mt-2">
													<BadgeWithTooltip
														variant="secondary"
														className="text-xs"
														tooltipContent={`This area contains ${area.sites.length} specific sites`}
													>
														<Icons.LocateFixed className="h-3 w-3 mr-1" /> {/* Icon for sites */}
														{area.sites.length} site{area.sites.length !== 1 ? "s" : ""}
													</BadgeWithTooltip>
												</div>
											)}
										</div>
									),
							)}
						</div>
					) : (
						<p className="text-muted-foreground">No notable areas in this region</p>
					)}
				</InfoCard>
			</div>

			{/* Economy and Creative Prompts cards remain the same for the region */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<InfoCard title="Economy" icon={<Icons.CircleDollarSign className="h-4 w-4 mr-2 text-primary" />}>
					<p>{economy ?? "N/A"}</p>
					{population && economy && (
						<p className="mt-4 text-sm text-muted-foreground">
							The region has a {population} population with a {economy}-based economy.
						</p>
					)}
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

export { AreasContent }
