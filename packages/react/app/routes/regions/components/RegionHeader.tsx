import * as Icons from "lucide-react"
import type React from "react"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { getDangerVariant } from "../utils"

interface RegionHeaderProps {
	name: string
	type: string
	dangerLevel: string
	economy: string
	population: string
}

export const RegionHeader: React.FC<RegionHeaderProps> = ({ name, type, dangerLevel, economy, population }) => (
	<div className="mb-6">
		<h1 className="text-3xl font-bold flex items-center">
			<Icons.Map className="h-6 w-6 mr-3 text-indigo-500" />
			{name}
		</h1>
		<div className="flex flex-wrap gap-2 mt-2">
			<BadgeWithTooltip variant="outline" className="flex items-center" tooltipContent={`Region type`}>
				<Icons.Mountain className="h-3.5 w-3.5 mr-1" />
				{type}
			</BadgeWithTooltip>
			<BadgeWithTooltip
				variant={getDangerVariant(dangerLevel)}
				className="flex items-center"
				tooltipContent={`Danger level - Risk level for travelers in this region`}
			>
				<Icons.AlertTriangle className="h-3.5 w-3.5 mr-1" />
				{dangerLevel} danger
			</BadgeWithTooltip>
			<BadgeWithTooltip
				variant="outline"
				className="flex items-center"
				tooltipContent={`Economy - Primary economic activity`}
			>
				<Icons.CircleDollarSign className="h-3.5 w-3.5 mr-1" />
				{economy}
			</BadgeWithTooltip>
			<BadgeWithTooltip variant="outline" className="flex items-center" tooltipContent={`Population`}>
				<Icons.Users className="h-3.5 w-3.5 mr-1" />
				Pop: {population}
			</BadgeWithTooltip>
		</div>
	</div>
)
