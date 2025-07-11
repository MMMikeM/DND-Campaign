import * as Icons from "lucide-react"
import type React from "react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Area } from "~/lib/entities"

export const OverviewContent: React.FC<Pick<Area, "description" | "cultureAndLeadership">> = (overview) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<InfoCard title="Description" icon={<Icons.FileText className="h-4 w-4 text-primary" />}>
				<List items={overview.description} spacing="sm" emptyText="No description available." />
			</InfoCard>

			<InfoCard title="Culture & Leadership" icon={<Icons.BookOpen className="h-4 w-4 text-primary" />}>
				<List
					items={overview.cultureAndLeadership}
					spacing="sm"
					emptyText="No culture and leadership information available."
				/>
			</InfoCard>
		</div>
	)
}
