import * as Icons from "lucide-react"
import { AlignmentBadge } from "~/components/alignment-badge"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Tags } from "~/components/Tags"
import { Badge } from "~/components/ui/badge"
import type { Faction } from "~/lib/entities"

export function DetailsContent({
	secretAlignment,
	transparencyLevel,
	tags,
	incomingForeshadowing,
	narrativeDestinationInvolvement,
	conflicts,
	itemRelations,
	loreLinks,
	creativePrompts,
	affectingConsequences,
	publicAlignment,
	size,
	wealth,
	reach,
	type,
}: Pick<
	Faction,
	| "secretAlignment"
	| "transparencyLevel"
	| "tags"
	| "incomingForeshadowing"
	| "narrativeDestinationInvolvement"
	| "conflicts"
	| "itemRelations"
	| "loreLinks"
	| "creativePrompts"
	| "affectingConsequences"
	| "publicAlignment"
	| "size"
	| "wealth"
	| "reach"
	| "type"
>) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			<InfoCard
				title="Vitals"
				icon={<Icons.HeartPulse className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No vitals available"
			>
				<List items={creativePrompts} />

				<div className="space-y-2">
					<div className="flex items-center">
						<p className="font-semibold mr-2">Public Alignment:</p>
						<AlignmentBadge alignment={publicAlignment} />
					</div>
					<div className="flex items-center">
						<p className="font-semibold mr-2">Size:</p>
						<Badge>{size}</Badge>
					</div>
					<div className="flex items-center">
						<p className="font-semibold mr-2">Wealth:</p>
						<Badge>{wealth}</Badge>
					</div>
					<div className="flex items-center">
						<p className="font-semibold mr-2">Reach:</p>
						<Badge>{reach}</Badge>
					</div>
					<div className="flex items-center">
						<p className="font-semibold mr-2">Type:</p>
						<Badge>{type.join(", ")}</Badge>
					</div>
				</div>
			</InfoCard>
			<InfoCard
				title="Secrets"
				icon={<Icons.Lock className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No secret information available"
				className="lg:col-span-1"
			>
				<div className="space-y-2">
					{secretAlignment && (
						<div className="flex items-center">
							<p className="font-semibold mr-2">Secret Alignment:</p>
							<AlignmentBadge alignment={secretAlignment} />
						</div>
					)}
					{transparencyLevel && (
						<div className="flex items-center">
							<p className="font-semibold mr-2">Transparency:</p>
							<Badge>{transparencyLevel}</Badge>
						</div>
					)}
				</div>
			</InfoCard>
			<Tags tags={tags} />
			<InfoCard
				title="Narrative"
				icon={<Icons.BookHeart className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No narrative links"
			>
				{JSON.stringify(incomingForeshadowing)}
				{JSON.stringify(narrativeDestinationInvolvement)}oe
			</InfoCard>

			<InfoCard
				title="Connections"
				icon={<Icons.Link className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No connections"
			>
				{JSON.stringify(itemRelations)}
				{JSON.stringify(loreLinks)}
			</InfoCard>

			<InfoCard
				title="Affecting Consequences"
				icon={<Icons.AlertTriangle className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No affecting consequences"
			>
				{JSON.stringify(affectingConsequences)}
			</InfoCard>
		</div>
	)
}
