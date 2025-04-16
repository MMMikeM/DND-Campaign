import * as Icons from "lucide-react"
import React from "react"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Region } from "~/lib/entities"
import { getDangerVariant } from "../utils"

type OverviewContentProps = Pick<
	Region,
	"description" | "culturalNotes" | "type" | "dangerLevel" | "population" | "economy" | "quests" | "areas"
>

export const OverviewContent: React.FC<OverviewContentProps> = ({
	description,
	culturalNotes,
	type,
	dangerLevel,
	population,
	economy,
	quests,
}) => {
	return (
		<>
			<InfoCard title="Overview" icon={<Icons.Info className="h-4 w-4 mr-2 text-primary" />} className="mb-6">
				<div className="space-y-4">
					<div className="pt-4">
						<List
							heading="Description"
							items={description}
							spacing="sm"
							textColor="muted"
							icon={<Icons.Info className="h-4 w-4 mr-2" />}
							collapsible={false}
						/>
					</div>

					<div className="border-t pt-4">
						<List
							heading="Culture"
							items={culturalNotes}
							spacing="sm"
							textColor="muted"
							icon={<Icons.Building className="h-4 w-4 mr-2" />}
							collapsible={false}
						/>
					</div>
				</div>
			</InfoCard>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Region Type Card */}
				<InfoCard title="Type & Geography" icon={<Icons.Layers className="h-4 w-4 mr-2 text-primary" />}>
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<span className="font-medium">Region Type:</span>
							<BadgeWithTooltip variant="outline" tooltipContent={`Region type`}>
								{type}
							</BadgeWithTooltip>
						</div>
						<div className="flex items-center justify-between">
							<span className="font-medium">Danger Level:</span>
							<BadgeWithTooltip variant={getDangerVariant(dangerLevel)} tooltipContent={`Danger level`}>
								{dangerLevel}
							</BadgeWithTooltip>
						</div>
						<p className="text-sm text-muted-foreground mt-2">
							This {type} region has a {dangerLevel} danger level, making it{" "}
							{dangerLevel === "safe"
								? "suitable for all travelers"
								: dangerLevel === "low"
									? "relatively safe for most adventurers"
									: dangerLevel === "moderate"
										? "challenging for inexperienced travelers"
										: "extremely hazardous to all but the most prepared"}
							.
						</p>
					</div>
				</InfoCard>

				{/* Key Stats Card */}
				<InfoCard title="Key Stats" icon={<Icons.NetworkIcon className="h-4 w-4 mr-2 text-primary" />}>
					<div className="space-y-2">
						<div className="">
							<div className="font-medium">Population:</div>
							<div>{population}</div>
						</div>
						<div className="">
							<div className="font-medium">Economy:</div>
							<div>{economy}</div>
						</div>
						<div className="flex items-center justify-between">
							<div className="font-medium">Active Quests:</div>
							<BadgeWithTooltip variant="outline" tooltipContent={`Quests in this region`}>
								{quests.length}
							</BadgeWithTooltip>
						</div>
					</div>
				</InfoCard>
			</div>
		</>
	)
}

export default OverviewContent
