import * as Icons from "lucide-react"
import type React from "react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Site } from "~/lib/entities"

export const OverviewContent: React.FC<Site> = ({ description, features, creatures, treasures }) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<InfoCard title="Description" icon={<Icons.FileText className="h-4 w-4 text-primary" />}>
				<List items={description} spacing="sm" emptyText="No description available." />
			</InfoCard>

			<InfoCard title="Key Features" icon={<Icons.Star className="h-4 w-4 text-primary" />}>
				<List items={features} spacing="sm" emptyText="No notable features listed." />
			</InfoCard>

			<InfoCard title="Creatures" icon={<Icons.Bug className="h-4 w-4 text-primary" />}>
				<List items={creatures} spacing="sm" emptyText="No creatures commonly found here." />
			</InfoCard>

			<InfoCard title="Treasures" icon={<Icons.Gem className="h-4 w-4 text-primary" />}>
				<List items={treasures} spacing="sm" emptyText="No known treasures." />
			</InfoCard>
		</div>
	)
}

export default OverviewContent
