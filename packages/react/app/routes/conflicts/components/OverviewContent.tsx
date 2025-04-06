import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Link } from "~/components/ui/link"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { getConflictStatusVariant } from "../utils"
import type { Conflict } from "~/lib/entities"

interface OverviewContentProps {
	conflict: Conflict
}

export function OverviewContent({ conflict }: OverviewContentProps) {
	const {
		description,
		stakes,
		status,
		scope,
		nature,
		primaryRegion,
		cause,
		creativePrompts,
		hiddenTruths,
		id,
		moralDilemma,
		name,
		participants,
		possibleOutcomes,
		primaryRegionId,
		progression,
		slug,
	} = conflict

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div className="space-y-6">
				<InfoCard
					title="Description"
					icon={<Icons.ScrollText className="h-4 w-4 mr-2 text-blue-600" />}
					emptyMessage="No description provided."
				>
					<List items={description} spacing="sm" textColor="muted" />
				</InfoCard>

				<InfoCard
					title="Stakes"
					icon={<Icons.AlertTriangle className="h-4 w-4 mr-2 text-red-600" />}
					emptyMessage="No stakes defined."
				>
					<List items={stakes} spacing="sm" textColor="muted" />
				</InfoCard>
			</div>

			<div className="space-y-6">
				<InfoCard title="Details" icon={<Icons.Info className="h-4 w-4 mr-2 text-indigo-600" />}>
					<div className="space-y-3 p-4">
						<div className="flex justify-between items-center">
							<span className="font-medium text-sm">Status</span>
							<BadgeWithTooltip variant={getConflictStatusVariant(status)} tooltipContent={`Current status: ${status}`}>
								{status}
							</BadgeWithTooltip>
						</div>
						<div className="flex justify-between items-center">
							<span className="font-medium text-sm">Scope</span>
							<span className="text-muted-foreground text-sm">{scope}</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="font-medium text-sm">Nature</span>
							<span className="text-muted-foreground text-sm">{nature}</span>
						</div>
					</div>
				</InfoCard>

				<InfoCard
					title="Primary Region"
					icon={<Icons.MapPin className="h-4 w-4 mr-2 text-purple-600" />}
					emptyMessage="No primary region specified."
				>
					<div className="p-4">
						<Link href={`/regions/${primaryRegion.slug}`} className="text-primary hover:underline">
							{primaryRegion.name}
						</Link>
					</div>
				</InfoCard>
			</div>
		</div>
	)
}

export default OverviewContent
