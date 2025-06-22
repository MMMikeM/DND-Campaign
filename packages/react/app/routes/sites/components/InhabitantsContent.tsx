import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Tags } from "~/components/Tags"
import { Link } from "~/components/ui/link"
import type { Site } from "~/lib/entities"

export const InhabitantsContent = ({
	npcAssociations,
	factionInfluence,
	factionHqs,
}: Pick<Site, "npcAssociations" | "factionInfluence" | "factionHqs">) => {
	return (
		<div className="space-y-6">
			<InfoCard
				title="NPCs"
				icon={<Icons.Users className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No NPCs are present at this site."
			>
				{npcAssociations.map((npc) => (
					<div key={`npc-${npc.id}`} className="border rounded p-4"></div>
				))}
			</InfoCard>

			<InfoCard
				title="Faction Headquarters"
				icon={<Icons.Home className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No factions have their headquarters here."
			>
				{factionHqs.map((faction) => (
					<div key={`faction-hq-${faction.id}`} className="border rounded p-3 mb-2">
						<Link href={`/factions/${faction.slug}`}>
							<h4 className="font-medium text-primary hover:underline">{faction.name}</h4>
						</Link>
					</div>
				))}
			</InfoCard>

			<InfoCard
				title="Territorial Control"
				icon={<Icons.Flag className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No factions control this site."
			>
				{factionInfluence.map(
					({
						creativePrompts,
						description,
						influenceLevel,
						presenceTypes,
						presenceDetails,
						priorities,
						gmNotes,
						tags,
						faction,
					}) => (
						<div key={`control-${faction.id}`} className="border rounded p-4">
							<Link href={`/factions/${faction.slug}`}>
								<h3 className="text-lg font-semibold">{faction.name}</h3>
							</Link>
							<Tags tags={tags} />
							<p className="text-sm text-muted-foreground">{influenceLevel}</p>
							<List items={description} heading="Description" />
							<List items={presenceTypes} heading="Presence Types" />
							<List items={presenceDetails} heading="Presence Details" />
							<List items={priorities} heading="Priorities" />
							<List items={creativePrompts} heading="Creative Prompts" />
							<List items={gmNotes} heading="GM Notes" />
						</div>
					),
				)}
			</InfoCard>
		</div>
	)
}
