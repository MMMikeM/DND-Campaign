import React from "react"
import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { Link } from "~/components/ui/link" // Use UI Link for consistency
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import type { Site } from "~/lib/entities"
import { List } from "~/components/List"

interface LinksContentProps {
	site: Site
}

export const LinksContent: React.FC<LinksContentProps> = ({ site }) => {
	const { relations } = site

	const siteLinks = relations?.filter((relation) => relation.site) || []

	return (
		<InfoCard
			title="Linked Sites"
			icon={<Icons.Link2 className="h-4 w-4 mr-2 text-primary" />}
			emptyMessage="No other sites are directly linked to this one."
		>
			{siteLinks && siteLinks.length > 0 ? (
				<div className="space-y-4">
					{siteLinks.map((link) => (
						<div key={`link-${link.id}`} className="border rounded p-4">
							<div className="flex justify-between items-start mb-1">
								<Link href={`/sites/${link.site.slug}`}>
									<h4 className="font-medium flex items-center">
										<Icons.LocateFixed className="h-4 w-4 mr-2 text-indigo-500" />
										{link.site.name}
									</h4>
								</Link>
								<BadgeWithTooltip variant="outline" tooltipContent="Link Type" className="capitalize text-xs">
									{link.linkType}
								</BadgeWithTooltip>
							</div>

							<List items={link.description} spacing="sm" emptyText="No description." className="mb-2 text-sm" />
						</div>
					))}
				</div>
			) : (
				<p className="text-muted-foreground">No other sites are directly linked to this one.</p>
			)}
		</InfoCard>
	)
}

export default LinksContent
