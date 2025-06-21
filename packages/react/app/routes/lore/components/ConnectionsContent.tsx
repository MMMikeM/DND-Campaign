import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Link } from "~/components/ui/link"
import type { Lore } from "~/lib/entities"

type ConnectionsContentProps = Pick<Lore, "itemRelations" | "incomingForeshadowing" | "connections_to_world">

export function ConnectionsContent({
	itemRelations,
	incomingForeshadowing,
	connections_to_world,
}: ConnectionsContentProps) {
	return (
		<div className="space-y-6">
			<InfoCard title="Connections to World" icon={<Icons.Globe className="h-4 w-4 mr-2" />}>
				<List items={connections_to_world} />
			</InfoCard>

			<InfoCard title="Related Items" icon={<Icons.Package className="h-4 w-4 mr-2" />}>
				<div className="space-y-2">
					{itemRelations.map((relation) => (
						<Link key={relation.sourceItem.id} href={`/items/${relation.sourceItem.slug}`} className="block">
							{relation.sourceItem.name} - {relation.relationshipType}
						</Link>
					))}
				</div>
			</InfoCard>

			<InfoCard title="Foreshadowing" icon={<Icons.Eye className="h-4 w-4 mr-2" />}>
				<div className="space-y-2">
					{incomingForeshadowing.map((foreshadow) => (
						<Link key={foreshadow.id} href={`/foreshadowing/${foreshadow.slug}`} className="block">
							{foreshadow.name}
						</Link>
					))}
				</div>
			</InfoCard>
		</div>
	)
}
