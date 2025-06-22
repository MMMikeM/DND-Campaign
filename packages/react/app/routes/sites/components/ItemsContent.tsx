import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { Link } from "~/components/ui/link"
import type { Site } from "~/lib/entities"

export const ItemsContent = ({ itemHistory, itemRelations }: Pick<Site, "itemHistory" | "itemRelations">) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<InfoCard
				title="Item History"
				icon={<Icons.Scroll className="h-4 w-4 text-primary" />}
				emptyMessage="No notable item events have occurred here."
			>
				{itemHistory.map((history) => (
					<div key={history.id} className="border rounded p-3 mb-2">
						{history.item && (
							<Link href={`/items/${history.item.slug}`}>
								<h4 className="font-medium text-primary hover:underline">{history.item.name}</h4>
							</Link>
						)}
						<p className="text-sm text-muted-foreground">{history.timeframe}</p>
						<p className="text-sm mt-1">{history.eventDescription}</p>
					</div>
				))}
			</InfoCard>

			<InfoCard
				title="Related Items"
				icon={<Icons.Gem className="h-4 w-4 text-primary" />}
				emptyMessage="No items are directly related to this site."
			>
				{itemRelations.map((relation) => (
					<div key={relation.id} className="border rounded p-3 mb-2">
						{relation.sourceItem && (
							<Link href={`/items/${relation.sourceItem.slug}`}>
								<h4 className="font-medium text-primary hover:underline">{relation.sourceItem.name}</h4>
							</Link>
						)}
						<p className="text-sm capitalize text-muted-foreground">{relation.relationshipType.replace(/_/g, " ")}</p>
						<p className="text-sm mt-1">{relation.relationshipDetails}</p>
					</div>
				))}
			</InfoCard>
		</div>
	)
}
