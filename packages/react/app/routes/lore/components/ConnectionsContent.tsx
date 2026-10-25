import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { ForeshadowingList } from "~/components/ForeshadowingList"
import { Tags } from "~/components/Tags"
import { Link } from "~/components/ui/link"
import type { Lore } from "~/lib/entities"

type ConnectionsContentProps = Pick<Lore, "incomingForeshadowing" | "outgoingForeshadowing" | "connectionsToWorld" | "links">

export function ConnectionsContent({
	incomingForeshadowing,
	outgoingForeshadowing,
	connectionsToWorld,
	links,
}: ConnectionsContentProps) {
	return (
		<div className="space-y-6">
			<InfoCard title="Connections to World" icon={<Icons.Globe className="h-4 w-4 mr-2" />}>
				<List items={connectionsToWorld} />
			</InfoCard>

			<ForeshadowingList
				incoming={incomingForeshadowing}
				outgoing={outgoingForeshadowing}
				emptyMessage="No foreshadowing is linked to this lore."
			/>
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
					id,
					creativePrompts,
					description,
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
					<div key={id} className="border-b last:border-b-0 p-3 space-y-3">
						<Tags tags={tags} variant="secondary" maxDisplay={8} />
						<p>{linkDetailsText}</p>
						<p>{linkRoleOrTypeText}</p>
						<p>{linkStrength}</p>
						<List items={description} heading="Description" spacing="sm" textColor="muted" />
						<List items={creativePrompts} heading="Creative Prompts" spacing="sm" textColor="muted" />
						<LoreLink label="conflict" route="conflicts" entity={conflict} details={conflict?.description} />
						<LoreLink label="faction" route="factions" entity={faction} details={faction?.description} />
						<LoreLink
							label="foreshadowing"
							route="foreshadowing"
							entity={foreshadowing}
							details={foreshadowing?.description}
						/>
						<LoreLink label="item" entity={item} details={item?.description} />
						<LoreLink label="npc" route="npcs" entity={npc} details={npc?.summary} />
						<LoreLink label="quest" route="quests" entity={quest} details={quest?.description} />
						<LoreLink label="region" route="regions" entity={region} details={region?.description} />
						<LoreLink label="lore" route="lore" entity={relatedLore} details={relatedLore?.description} />
					</div>
				),
			)}
		</InfoCard>
	)
}

const LoreLink = ({
	label,
	route,
	entity,
	details,
}: {
	label: string
	route?: string
	entity: { name: string; slug: string } | null
	details?: string[] | null
}) => {
	if (!entity) return null
	return (
		<div>
			<p>{label}</p>
			{route ? <Link href={`/${route}/${entity.slug}`}>{entity.name}</Link> : <span>{entity.name}</span>}
			<List items={details ?? undefined} spacing="sm" textColor="muted" />
		</div>
	)
}
