import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Tags } from "~/components/Tags"
import { Link } from "~/components/ui/link"
import type { Lore } from "~/lib/entities"

type ConnectionsContentProps = Pick<Lore, "itemRelations" | "incomingForeshadowing" | "connections_to_world" | "links">

export function ConnectionsContent({
	itemRelations,
	incomingForeshadowing,
	connections_to_world,
	links,
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
			<LoreLinks links={links} />
		</div>
	)
}

const getHref = (targetEntityType: string, slug: string) => {
	if (targetEntityType === "conflict") {
		return `/conflicts/${slug}`
	}

	if (targetEntityType === "faction") {
		return `/factions/${slug}`
	}

	if (targetEntityType === "npc") {
		return `/npcs/${slug}`
	}
	if (targetEntityType === "quest") {
		return `/quests/${slug}`
	}
	if (targetEntityType === "region") {
		return `/regions/${slug}`
	}
	if (targetEntityType === "lore") {
		return `/lore/${slug}`
	}

	throw new Error(`Unknown target entity type: ${targetEntityType}`)
}

const LoreLinks = ({ links }: Pick<Lore, "links">) => {
	console.log(links)
	return (
		<InfoCard
			title="Lore Links"
			icon={<Icons.Link className="h-4 w-4 mr-2" />}
			contentClassName="grid grid-cols-2 gap-6"
		>
			{links.map(
				({
					creativePrompts,
					description,
					gmNotes,
					linkDetailsText,
					linkRoleOrTypeText,
					linkStrength,
					tags,
					targetEntityType,
					targetConflict,
					targetFaction,
					targetLore,
					targetNpc,
					targetQuest,
					targetRegion,
				}) => (
					<div key={description[0]} className="border-b last:border-b-0 p-3 space-y-3">
						<p>{linkDetailsText}</p>
						<p>{linkRoleOrTypeText}</p>
						<p>{linkStrength}</p>
						<List items={description} heading="Description" spacing="sm" textColor="muted" />
						<List items={gmNotes} heading="GM Notes" spacing="sm" textColor="muted" />
						<List items={creativePrompts} heading="Creative Prompts" spacing="sm" textColor="muted" />
						<ConditionalLink targetEntityType={targetEntityType} targetEntity={targetConflict} />
						<ConditionalLink targetEntityType={targetEntityType} targetEntity={targetFaction} />
						<ConditionalLink targetEntityType={targetEntityType} targetEntity={targetLore} />
						<ConditionalLink targetEntityType={targetEntityType} targetEntity={targetNpc} />
						<ConditionalLink targetEntityType={targetEntityType} targetEntity={targetQuest} />
						<ConditionalLink targetEntityType={targetEntityType} targetEntity={targetRegion} />
						<Tags tags={tags} variant="secondary" maxDisplay={8} />
					</div>
				),
			)}
		</InfoCard>
	)
}

const ConditionalLink = ({
	targetEntityType,
	targetEntity,
}: {
	targetEntityType: string
	targetEntity: { id: number; name: string; slug: string } | null
}) => {
	if (targetEntityType === "conflict") {
		return <Link href={`/conflicts/${targetEntity?.slug}`}>{targetEntity?.name}</Link>
	}

	if (targetEntityType === "faction") {
		return <Link href={`/factions/${targetEntity?.slug}`}>{targetEntity?.name}</Link>
	}

	if (targetEntityType === "npc") {
		return <Link href={`/npcs/${targetEntity?.slug}`}>{targetEntity?.name}</Link>
	}

	if (targetEntityType === "quest") {
		return <Link href={`/quests/${targetEntity?.slug}`}>{targetEntity?.name}</Link>
	}

	if (targetEntityType === "region") {
		return <Link href={`/regions/${targetEntity?.slug}`}>{targetEntity?.name}</Link>
	}

	if (targetEntityType === "lore") {
		return <Link href={`/lore/${targetEntity?.slug}`}>{targetEntity?.name}</Link>
	}

	return null
}
