import * as Icons from "lucide-react"
import type React from "react"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Link } from "~/components/ui/link"
import type { Site } from "~/lib/entities"

export const LinksContent: React.FC<Site> = ({ relations }) => {
	return (
		<InfoCard
			title="Linked Sites"
			icon={<Icons.Link2 className="h-4 w-4 mr-2 text-primary" />}
			emptyMessage="No other sites are directly linked to this one."
		>
			{relations.map(({ linkType, creativePrompts, description, site }) => (
				<div key={`link-${site?.id}`} className="border rounded p-4">
					<div className="flex justify-between items-start mb-1">
						<Link href={`/sites/${site?.slug}`}>
							<h4 className="font-medium flex items-center">
								<Icons.LocateFixed className="h-4 w-4 mr-2 text-indigo-500" />
								{site?.name}
							</h4>
						</Link>
						<BadgeWithTooltip variant="outline" tooltipContent="Link Type" className="capitalize text-xs">
							{linkType}
						</BadgeWithTooltip>
					</div>

					<List items={description} spacing="sm" emptyText="No description." className="mb-2 text-sm" />
					<List items={creativePrompts} spacing="sm" emptyText="No creative prompts." className="mb-2 text-sm" />
				</div>
			))}
		</InfoCard>
	)
}

export { LinksContent }
