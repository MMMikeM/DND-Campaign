import React from "react"
import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { getArcStatusVariant } from "../utils"
import type { NarrativeArc } from "~/lib/entities"

interface OverviewContentProps {
	arc: NarrativeArc
}

const getThemeVariant = (theme: string): "default" | "destructive" | "outline" | "secondary" => {
	return "outline"
}

export function OverviewContent({ arc }: OverviewContentProps) {
	const {
		description,
		promise,
		themes,
		status,
		type,
		// goal, // This field does not exist on NarrativeArc type
	} = arc

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div className="space-y-6">
				<InfoCard
					title="Description"
					icon={<Icons.ScrollText className="h-4 w-4 mr-2 text-blue-600" />}
					emptyMessage="No description provided."
				>
					{description && description.length > 0 && <List items={description} spacing="sm" textColor="muted" />}
				</InfoCard>

				<InfoCard
					title="Promise / Goal"
					icon={<Icons.Target className="h-4 w-4 mr-2 text-green-600" />}
					emptyMessage="No promise specified."
				>
					{promise && (
						<div className="p-4">
							<p className="text-sm text-muted-foreground">{promise}</p>
						</div>
					)}
				</InfoCard>
			</div>

			<div className="space-y-6">
				<InfoCard title="Attributes" icon={<Icons.Info className="h-4 w-4 mr-2 text-indigo-600" />}>
					<div className="space-y-3 p-4">
						<div className="flex justify-between items-center">
							<span className="font-medium text-sm">Type</span>
							<span className="text-muted-foreground text-sm capitalize">{type}</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="font-medium text-sm">Status</span>
							<BadgeWithTooltip
								variant={getArcStatusVariant(status)}
								tooltipContent={`Status: ${status}`}
								className="capitalize"
							>
								{status}
							</BadgeWithTooltip>
						</div>
					</div>
				</InfoCard>

				<InfoCard
					title="Themes"
					icon={<Icons.Palette className="h-4 w-4 mr-2 text-pink-600" />}
					emptyMessage="No themes listed for this arc."
				>
					{themes && themes.length > 0 && (
						<div className="flex flex-wrap gap-2 p-4">
							{themes.map((theme) => (
								<BadgeWithTooltip
									key={theme}
									variant={getThemeVariant(theme)}
									tooltipContent={`Theme: ${theme}`}
									className="capitalize"
								>
									{theme}
								</BadgeWithTooltip>
							))}
						</div>
					)}
				</InfoCard>

			</div>
		</div>
	)
}

export default OverviewContent
