import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Link } from "~/components/ui/link"
import type { Conflict } from "~/lib/entities"

export function ItemsContent({ itemConnections }: Pick<Conflict, "itemConnections">) {
	return (
		<InfoCard
			title="Related Items"
			icon={<Icons.Package className="h-4 w-4 mr-2 text-purple-600" />}
			emptyMessage="No items related to this conflict."
		>
			<div className="space-y-6">
				{itemConnections.map(({ id, relationship, details, sourceItem }) => (
					<div key={id} className="border rounded-lg p-4 bg-background dark:bg-muted/30">
						{/* Header with item name and relationship */}
						<div className="flex justify-between items-start mb-3">
							<div>
								<Link href={`/items/${sourceItem.id}`} className="text-lg font-semibold text-primary hover:underline">
									{sourceItem.name}
								</Link>
								<p className="text-sm text-muted-foreground mt-1">
									<strong>Relationship:</strong> {relationship.replace(/_/g, " ")}
								</p>
							</div>
						</div>

						{/* Content sections */}
						<div className="space-y-3">
							<List
								heading="Details"
								icon={<Icons.FileText className="h-4 w-4 mr-2" />}
								items={details}
								spacing="sm"
								textSize="sm"
								bulletColor="blue"
							/>
						</div>
					</div>
				))}
			</div>
		</InfoCard>
	)
}
