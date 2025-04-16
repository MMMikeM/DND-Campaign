import * as Icons from "lucide-react"
import React from "react"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { InfoCard } from "~/components/InfoCard"
import { Link } from "~/components/ui/link"
import type { Area } from "~/lib/entities"

export const SitesContent: React.FC<Area> = ({ sites }) => {
	return (
		<InfoCard
			title="Sites within this Area"
			icon={<Icons.LocateFixed className="h-4 w-4 mr-2 text-primary" />}
			emptyMessage="No specific sites listed within this area."
			contentClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
		>
			{sites.map(({ name, siteType, id, slug }) => (
				<div key={`site-${id}`} className="border rounded p-4">
					<Link href={`/sites/${slug}`}>
						<h4 className="font-medium flex items-center">
							<Icons.MapPin className="h-4 w-4 mr-2 text-indigo-500" />
							{name}
						</h4>
					</Link>
					<BadgeWithTooltip variant="outline" className="mt-1 capitalize" tooltipContent={`Site type`}>
						{siteType}
					</BadgeWithTooltip>
				</div>
			))}
		</InfoCard>
	)
}

export default SitesContent
