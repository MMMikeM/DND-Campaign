import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Tags } from "~/components/Tags"
import { Link } from "~/components/ui/link"
import type { Area } from "~/lib/entities"

export const InfluenceContent = ({ factionInfluence }: Pick<Area, "factionInfluence">) => {
	return (
		<div className="space-y-6">
			<InfoCard
				title="Faction Influence"
				icon={<Icons.Flag className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No factions have influence in this area."
			>
				{factionInfluence.map(({ influenceLevel, presenceTypes, presenceDetails, priorities, tags, faction }) => (
					<div key={`influence-${faction.id}`} className="border rounded p-4 mb-4">
						<Link href={`/factions/${faction.slug}`}>
							<h3 className="text-lg font-semibold hover:underline">{faction.name}</h3>
						</Link>
						<div className="flex justify-between items-center mb-2">
							<p className="text-sm text-muted-foreground capitalize">{influenceLevel} Influence</p>
							<Tags tags={tags} />
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
							<List items={presenceTypes} heading="Presence Types" />
							<List items={presenceDetails} heading="Presence Details" />
							<List items={priorities} heading="Priorities" />
						</div>
					</div>
				))}
			</InfoCard>
		</div>
	)
}
