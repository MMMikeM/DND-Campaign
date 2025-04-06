import React from "react"
import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { Link } from "~/components/ui/link" // Use UI Link for consistency
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import type { Area } from "~/lib/entities" // Import the Area type

export const SitesContent: React.FC<{ area: Area }> = ({ area }) => {
	const { sites } = area

	return (
		<InfoCard
			title="Sites within this Area"
			icon={<Icons.LocateFixed className="h-4 w-4 mr-2 text-primary" />}
			emptyMessage="No specific sites listed within this area."
		>
			{sites && sites.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{sites.map((site) => (
						<div key={`site-${site.id}`} className="border rounded p-4">
							<Link href={`/sites/${site.slug}`}>
								<h4 className="font-medium flex items-center">
									<Icons.MapPin className="h-4 w-4 mr-2 text-indigo-500" />
									{site.name}
								</h4>
							</Link>
							<BadgeWithTooltip variant="outline" className="mt-1 capitalize" tooltipContent={`Site type`}>
								{site.siteType}
							</BadgeWithTooltip>
						</div>
					))}
				</div>
			) : (
				<p className="text-muted-foreground">No specific sites listed within this area.</p>
			)}
		</InfoCard>
	)
}

export default SitesContent
