import * as Icons from "lucide-react"
import { ConsequenceList } from "~/components/ConsequenceList"
import { AlignmentBadge } from "~/components/alignment-badge"
import { ForeshadowingList } from "~/components/ForeshadowingList"
import { InfoCard } from "~/components/InfoCard"
import { Link } from "~/components/ui/link"
import { List } from "~/components/List"
import { Tags } from "~/components/Tags"
import { Badge } from "~/components/ui/badge"
import type { Faction } from "~/lib/entities"

export function DetailsContent({
	secretAlignment,
	transparencyLevel,
	tags,
	incomingForeshadowing,
	conflicts,
	itemConnections,
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
	| "conflicts"
	| "itemConnections"
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
				{conflicts.map(({ id, role, motivation, publicStance }) => (
					<div key={`conflict-${id}`} className="border-b last:border-0 p-3">
						<p className="text-sm font-medium capitalize">{role}</p>
						<p className="text-sm text-muted-foreground">{motivation}</p>
						<p className="text-sm text-muted-foreground">{publicStance}</p>
					</div>
				))}
			</InfoCard>

			<ForeshadowingList incoming={incomingForeshadowing} emptyMessage="No foreshadowing points toward this faction." />

			<InfoCard
				title="Connections"
				icon={<Icons.Link className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No connections"
			>
				{itemConnections.map(({ id, relationship, details, sourceItem }) => (
					<div key={`item-${id}`} className="border-b last:border-0 p-3">
						<p className="text-sm font-medium">{sourceItem.name}</p>
						<p className="text-sm text-muted-foreground">{relationship}</p>
						<List items={details} />
					</div>
				))}
				{loreLinks.map(({ id, lore, linkRoleOrTypeText, linkDetailsText, description }) => (
					<div key={`lore-${id}`} className="border-b last:border-0 p-3">
						<Link href={`/lore/${lore.slug}`} className="text-sm font-medium">
							{lore.name}
						</Link>
						<p className="text-sm text-muted-foreground">{linkRoleOrTypeText}</p>
						<p className="text-sm text-muted-foreground">{linkDetailsText}</p>
						<List items={description} />
					</div>
				))}
			</InfoCard>

			<ConsequenceList affecting={affectingConsequences} emptyMessage="No consequences have affected this faction." />
		</div>
	)
}
