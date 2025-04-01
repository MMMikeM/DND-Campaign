import * as Icons from "lucide-react"
import { List } from "~/components/List"
import { InfoCard } from "~/components/InfoCard"
import type { Faction } from "~/lib/entities"

export function DetailsContent(faction: Faction) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2  gap-6">
			{/* History Card */}
			<InfoCard
				title="History"
				icon={<Icons.BookOpen className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No history available"
			>
				<List items={faction.history} />
			</InfoCard>

			{/* Values Card */}
			<InfoCard
				title="Values"
				icon={<Icons.Heart className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No values information available"
			>
				<List items={faction.values} />
			</InfoCard>

			{/* Resources Card */}
			<InfoCard
				title="Resources"
				icon={<Icons.Briefcase className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No resources information available"
			>
				<List items={faction.resources} />
			</InfoCard>

			{/* Recruitment Card */}
			<InfoCard
				title="Recruitment"
				icon={<Icons.UserPlus className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No recruitment information available"
			>
				<List items={faction.recruitment} />
			</InfoCard>
		</div>
	)
}
