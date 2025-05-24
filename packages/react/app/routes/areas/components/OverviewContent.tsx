import * as Icons from "lucide-react"
import type React from "react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Area } from "~/lib/entities"

export const OverviewContent: React.FC<Area> = ({
	description,
	culturalNotes,
	pointsOfInterest,
	leadership,
	population,
	primaryActivity,
}) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<InfoCard title="Description" icon={<Icons.FileText className="h-4 w-4 text-primary" />}>
				<List items={description} spacing="sm" emptyText="No description available." />
			</InfoCard>

			<InfoCard title="Key Details" icon={<Icons.Info className="h-4 w-4 text-primary" />}>
				<ul className="space-y-1 text-sm">
					{population && (
						<li>
							<strong>Population:</strong> {population}
						</li>
					)}
					{leadership && (
						<li>
							<strong>Leadership:</strong> {leadership}
						</li>
					)}
					{primaryActivity && (
						<li>
							<strong>Primary Activity:</strong> {primaryActivity}
						</li>
					)}
				</ul>
				{!population && !leadership && !primaryActivity && (
					<p className="text-muted-foreground text-sm">No key details available.</p>
				)}
			</InfoCard>

			<InfoCard title="Cultural Notes" icon={<Icons.BookOpen className="h-4 w-4 text-primary" />}>
				<List items={culturalNotes} spacing="sm" emptyText="No cultural notes available." />
			</InfoCard>

			<InfoCard title="Points of Interest" icon={<Icons.Star className="h-4 w-4 text-primary" />}>
				<List items={pointsOfInterest} spacing="sm" emptyText="No points of interest listed." />
			</InfoCard>
		</div>
	)
}

export default OverviewContent
