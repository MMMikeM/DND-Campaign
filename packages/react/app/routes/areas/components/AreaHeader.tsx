import React from "react"
import * as Icons from "lucide-react"
import { NavLink } from "react-router"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { getDangerVariant, getDangerTooltip } from "../utils"
import type { Area } from "~/lib/entities"

export const AreaHeader: React.FC<{ area: Area }> = ({ area }) => {
	const { name, type, dangerLevel, region, population, leadership, primaryActivity } = area

	return (
		<div className="p-4 mb-6 border rounded bg-card text-card-foreground shadow-sm">
			<div className="flex justify-between items-start mb-2">
				<div>
					<h1 className="text-2xl font-bold flex items-center">
						<Icons.Landmark className="h-6 w-6 mr-2 text-indigo-500" />
						{name}
					</h1>
					<p className="text-muted-foreground capitalize">{type}</p>
				</div>
				<NavLink to={`/regions/${region.slug}`} className="text-sm text-primary hover:underline flex items-center">
					<Icons.Map className="h-4 w-4 mr-1" />
					{region.name}
				</NavLink>
			</div>

			<div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-3">
				<BadgeWithTooltip
					variant={getDangerVariant(dangerLevel)}
					tooltipContent={getDangerTooltip(dangerLevel)}
					className="capitalize"
				>
					{dangerLevel} Danger
				</BadgeWithTooltip>
				<span className="flex items-center">
					<Icons.Users className="h-4 w-4 mr-1" /> Population: {population}
				</span>
				<span className="flex items-center">
					<Icons.Crown className="h-4 w-4 mr-1" /> Leadership: {leadership}
				</span>
				<span className="flex items-center">
					<Icons.Activity className="h-4 w-4 mr-1" /> Activity: {primaryActivity}
				</span>
			</div>
		</div>
	)
}

export default AreaHeader
