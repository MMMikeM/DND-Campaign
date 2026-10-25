import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Site } from "~/lib/entities"

export const ItemsContent = ({ itemConnections }: Pick<Site, "itemConnections">) => {
	return (
		<InfoCard
			title="Related Items"
			icon={<Icons.Gem className="h-4 w-4 text-primary" />}
			emptyMessage="No items are directly related to this site."
		>
			{itemConnections.map(({ id, relationship, details, sourceItem }) => (
				<div key={id} className="border rounded p-3 mb-2">
					<h4 className="font-medium">{sourceItem.name}</h4>
					<p className="text-sm capitalize text-muted-foreground">{relationship.replace(/_/g, " ")}</p>
					<List items={details} spacing="sm" emptyText="No details." className="mt-1 text-sm" />
				</div>
			))}
		</InfoCard>
	)
}
