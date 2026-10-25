import * as Icons from "lucide-react"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Link } from "~/components/ui/link"
import type { NPC } from "~/lib/entities"

const loyaltyVariant = (loyalty: string) => {
	if (loyalty === "high") return "default" as const
	if (loyalty === "medium") return "secondary" as const
	if (loyalty === "low") return "outline" as const
	return "destructive" as const
}

/**
 * npc_faction_memberships is unique on npcId, so an NPC has at most one membership.
 */
const FactionMembership = ({ membership }: { membership: NonNullable<NPC["factionMemberships"]> }) => {
	const { justification, loyalty, rank, role, secrets, faction } = membership

	return (
		<div className="p-3 space-y-3">
			<div className="flex justify-between">
				<h4 className="font-medium">{faction && <Link href={`/factions/${faction.slug}`}>{faction.name}</Link>}</h4>
				<BadgeWithTooltip
					variant={loyaltyVariant(loyalty)}
					tooltipContent={`Loyalty level: ${loyalty} - How loyal this NPC is to the faction`}
				>
					{loyalty} loyalty
				</BadgeWithTooltip>
			</div>
			<div className="flex">
				<span className="font-medium mr-2">Role:</span>
				<span className="text-muted-foreground">{role}</span>
			</div>
			<div className="flex">
				<span className="font-medium mr-2">Rank:</span>
				<span className="text-muted-foreground">{rank}</span>
			</div>
			<div className="text-sm">Justification: {justification}</div>

			<List
				heading="Secrets"
				icon={<Icons.Lock className="h-3 w-3 mr-1" />}
				items={secrets}
				spacing="sm"
				textColor="muted"
				textSize="xs"
				collapsible={false}
			/>
		</div>
	)
}

export function ConnectionsContent({
	name,
	relations,
	factionMemberships,
	questParticipants,
	itemConnections,
	loreLinks,
	questHooks,
	stageInvolvement,
	questStageDeliveries,
}: Pick<
	NPC,
	| "name"
	| "relations"
	| "factionMemberships"
	| "questParticipants"
	| "itemConnections"
	| "loreLinks"
	| "questHooks"
	| "stageInvolvement"
	| "questStageDeliveries"
>) {
	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
				<InfoCard
					title="Relationships"
					description="Connections to other NPCs"
					icon={<Icons.Network className="h-4 w-4 mr-2 text-indigo-600" />}
					emptyMessage="No known relationships for this NPC"
					contentClassName="space-y-4"
				>
					{relations.map(({ id, creativePrompts, description, npc, dynamicsAndHistory, relationship }) => (
						<div key={`relationship-${id}`} className="border-b last:border-b-0 p-3 space-y-3">
							<div className="flex justify-between">
								<Link href={`/npcs/${npc?.slug}`}>
									<h4 className="font-medium">{npc?.name}</h4>
								</Link>
							</div>
							<BadgeWithTooltip variant="outline" className="capitalize" tooltipContent="Relationship type">
								{relationship}
							</BadgeWithTooltip>

							<List
								heading="Description"
								icon={<Icons.Info className="h-3 w-3 mr-1" />}
								items={description}
								spacing="sm"
								textColor="muted"
								textSize="xs"
								collapsible={false}
							/>

							<List
								heading="Dynamics & History"
								icon={<Icons.History className="h-3 w-3 mr-1" />}
								items={dynamicsAndHistory}
								spacing="sm"
								textColor="muted"
								textSize="xs"
							/>
							<List
								heading="Creative Prompts"
								icon={<Icons.Sparkles className="h-3 w-3 mr-1" />}
								items={creativePrompts}
								spacing="sm"
								textColor="muted"
								textSize="xs"
							/>
						</div>
					))}
				</InfoCard>

				<InfoCard
					title="Faction Affiliation"
					description={`The organization ${name} belongs to`}
					icon={<Icons.Flag className="h-4 w-4 mr-2 text-red-600" />}
					emptyMessage="No known faction affiliation for this NPC"
					contentClassName="space-y-4"
				>
					{factionMemberships && <FactionMembership membership={factionMemberships} />}
				</InfoCard>
			</div>

			<InfoCard
				title="Lore Connections"
				description={`Lore related to ${name}`}
				icon={<Icons.BookOpen className="h-4 w-4 mr-2 text-rose-600" />}
				emptyMessage="No lore is related to this NPC"
				className="mb-6"
			>
				{loreLinks.map(({ id, lore, linkDetailsText }) => (
					<div key={`lore-link-${id}`} className="border-b last:border-b-0 p-3 space-y-3">
						<div className="flex justify-between">
							<Link href={`/lore/${lore?.slug}`}>
								<h4 className="font-medium">{lore?.name}</h4>
							</Link>
						</div>
						<p className="text-sm text-muted-foreground">{linkDetailsText}</p>
					</div>
				))}
			</InfoCard>

			<InfoCard
				title="Item Connections"
				description={`Items related to ${name}`}
				icon={<Icons.Sword className="h-4 w-4 mr-2 text-cyan-600" />}
				emptyMessage="No items are related to this NPC"
				className="mb-6"
			>
				{itemConnections.map(({ id, sourceItem, relationship }) => (
					<div key={`item-relation-${id}`} className="border-b last:border-b-0 p-3 space-y-3">
						<div className="flex justify-between">
							<h4 className="font-medium">{sourceItem.name}</h4>
							<BadgeWithTooltip variant="secondary" tooltipContent="Relationship Type">
								{relationship}
							</BadgeWithTooltip>
						</div>
					</div>
				))}
			</InfoCard>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<InfoCard
					title="Involved Quests"
					description={`Quests where ${name} plays a role`}
					icon={<Icons.Scroll className="h-4 w-4 mr-2 text-amber-600" />}
					emptyMessage="No quests involve this NPC"
				>
					{questParticipants.map(
						({
							id,
							quest,
							importanceInQuest,
							description,
							involvementDetails,
							creativePrompts,
							tags,
							roleInQuest,
						}) => (
							<div key={`quest-${id}`} className="border-b last:border-b-0 p-3 space-y-3">
								<div className="flex justify-between">
									<h4 className="font-medium">{quest && <Link href={`/quests/${quest.slug}`}>{quest.name}</Link>}</h4>
									<BadgeWithTooltip
										variant={
											importanceInQuest === "critical"
												? "destructive"
												: importanceInQuest === "major"
													? "default"
													: importanceInQuest === "supporting"
														? "secondary"
														: "outline"
										}
										tooltipContent={`Importance: ${importanceInQuest} - How important this NPC is to the quest`}
									>
										{importanceInQuest}
									</BadgeWithTooltip>
								</div>
								<p className="text-sm mt-1">
									<span className="font-medium">Role:</span> {roleInQuest}
								</p>

								<List
									heading="Description"
									icon={<Icons.Info className="h-3 w-3 mr-1" />}
									items={description}
									spacing="sm"
									textColor="muted"
									textSize="xs"
									collapsible={false}
								/>
								<List items={involvementDetails} spacing="sm" textColor="muted" textSize="xs" />
								<List items={tags} spacing="sm" textColor="muted" textSize="xs" />

								<List
									heading="Creative Prompts"
									icon={<Icons.Info className="h-3 w-3 mr-1" />}
									items={creativePrompts}
									spacing="sm"
									textColor="muted"
									textSize="xs"
								/>
							</div>
						),
					)}
					<div className="p-3 space-y-3">
						<h4 className="font-medium">Quest Hooks</h4>
						{questHooks.map(({ id, quest, name }) => (
							<div key={`quest-hook-${id}`} className="text-sm">
								<Link href={`/quests/${quest?.slug}`}>
									{name} ({quest?.name})
								</Link>
							</div>
						))}
					</div>
					<div className="p-3 space-y-3">
						<h4 className="font-medium">Quest Stage Deliveries</h4>
						{questStageDeliveries.map(({ id, name, quest, slug }) => (
							<div key={`quest-stage-delivery-${id}`} className="text-sm">
								<Link href={`/quests/${quest?.slug}/stages/${slug}`}>
									Delivers: {quest?.name} - {name}
								</Link>
							</div>
						))}
					</div>
					<div className="p-3 space-y-3">
						<h4 className="font-medium">Quest Stage Involvement</h4>
						{stageInvolvement.map(({ id, questStage }) => (
							<div key={`stage-involvement-${id}`} className="text-sm">
								Involved in: {questStage?.name}
							</div>
						))}
					</div>
				</InfoCard>
			</div>
		</>
	)
}
