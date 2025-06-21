import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Faction } from "~/lib/entities"

export function DetailsContent(faction: Faction) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2  gap-6">
			<InfoCard
				title="History"
				icon={<Icons.BookOpen className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No history available"
			>
				<List items={faction.history} />
			</InfoCard>

			<InfoCard
				title="Values"
				icon={<Icons.Heart className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No values information available"
			>
				<List items={faction.values} />
			</InfoCard>
		</div>
	)
}
