import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Tags } from "~/components/Tags"
import { Link } from "~/components/ui/link"
import type { Lore } from "~/lib/entities"

type ConnectionsContentProps = Pick<Lore, "incomingForeshadowing" | "connections_to_world" | "links">

export function ConnectionsContent({ incomingForeshadowing, connections_to_world, links }: ConnectionsContentProps) {
	return (
		<div className="space-y-6">
			<InfoCard title="Connections to World" icon={<Icons.Globe className="h-4 w-4 mr-2" />}>
				<List items={connections_to_world} />
			</InfoCard>

			<InfoCard title="Foreshadowing" icon={<Icons.Eye className="h-4 w-4 mr-2" />}>
				<div className="space-y-2">
					{incomingForeshadowing.map((foreshadow) => (
						<Link key={foreshadow.id} href={`/foreshadowing/${foreshadow.id}`} className="block">
							{foreshadow.name}
						</Link>
					))}
				</div>
			</InfoCard>
			<LoreLinks links={links} />
		</div>
	)
}

const LoreLinks = ({ links }: Pick<Lore, "links">) => {
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
					conflict,
					faction,
					foreshadowing,
					item,
					npc,
					quest,
					region,
					relatedLore,
				}) => (
					<div key={description[0]} className="border-b last:border-b-0 p-3 space-y-3">
						<Tags tags={tags} variant="secondary" maxDisplay={8} />
						<p>{linkDetailsText}</p>
						<p>{linkRoleOrTypeText}</p>
						<p>{linkStrength}</p>
						<List items={description} heading="Description" spacing="sm" textColor="muted" />
						<List items={gmNotes} heading="GM Notes" spacing="sm" textColor="muted" />
						<List items={creativePrompts} heading="Creative Prompts" spacing="sm" textColor="muted" />
						<LoreLink link={conflict} type="conflict" />
						<LoreLink link={faction} type="faction" />
						<LoreLink link={foreshadowing} type="foreshadowing" />
						<LoreLink link={item} type="item" />
						<LoreLink link={npc} type="npc" />
						<LoreLink link={quest} type="quest" />
						<LoreLink link={region} type="region" />
						<LoreLink link={relatedLore} type="lore" />
					</div>
				),
			)}
		</InfoCard>
	)
}

const LoreLink = ({
	link,
	type,
}: {
	link: { id: number; name: string; description: string[] | null } | null
	type: string
}) => {
	if (!link) return null
	return (
		<div>
			<p>{type}</p>
			<Link href={getHref(type, link.id.toString())}>{link.name}</Link>
			<List items={link.description ?? undefined} spacing="sm" textColor="muted" />
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
