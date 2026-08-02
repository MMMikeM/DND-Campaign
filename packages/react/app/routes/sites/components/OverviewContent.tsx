import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Site } from "~/lib/entities"

export const OverviewContent = ({
	description,
}: Pick<Site, "description">) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<InfoCard title="Description" icon={<Icons.FileText className="h-4 w-4 text-primary" />}>
				<List items={description} spacing="sm" emptyText="No description available." />
			</InfoCard>
		</div>
	)
}
