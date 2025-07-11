import * as Icons from "lucide-react"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Optional } from "~/components/Optional"
import { Link } from "~/components/ui/link"
import type { NPC } from "~/lib/entities"
import { getRelationshipStrengthVariant } from "../utils"

export function ConnectionsContent({
	name,
	relations,
	factionMemberships,
	questParticipants,
	itemRelations,
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
	| "itemRelations"
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
					{relations.map(
						({
							id,
							creativePrompts,
							description,
							history,
							narrativeTensions,
							npc,
							relationshipDynamics,
							sharedGoals,
							strength,
							relationshipType,
						}) => (
							<div key={`relationship-${id}`} className="border-b last:border-b-0 p-3 space-y-3">
								<div className="flex justify-between">
									<Link href={`/npcs/${npc?.slug}`}>
										<h4 className="font-medium">{npc?.name}</h4>
									</Link>
								</div>
								<BadgeWithTooltip
									variant={getRelationshipStrengthVariant(strength)}
									className="capitalize"
									tooltipContent={`Relationship type - Strength`}
								>
									{strength} - {relationshipType}
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
									heading="Tensions"
									icon={<Icons.AlertTriangle className="h-3 w-3 mr-1 text-amber-500" />}
									items={narrativeTensions}
									spacing="sm"
									textColor="muted"
									textSize="xs"
								/>
								<List
									heading="Shared Goals"
									icon={<Icons.Info className="h-3 w-3 mr-1" />}
									items={sharedGoals}
									spacing="sm"
									textColor="muted"
									textSize="xs"
								/>
								<List
									heading="Relationship Dynamics"
									icon={<Icons.Info className="h-3 w-3 mr-1" />}
									items={relationshipDynamics}
									spacing="sm"
									textColor="muted"
									textSize="xs"
								/>
								<List
									heading="Creative Prompts"
									icon={<Icons.Info className="h-3 w-3 mr-1" />}
									items={creativePrompts}
									spacing="sm"
									textColor="muted"
									textSize="xs"
								/>
								<List
									heading="History"
									icon={<Icons.Info className="h-3 w-3 mr-1" />}
									items={history}
									spacing="sm"
									textColor="muted"
									textSize="xs"
								/>
							</div>
						),
					)}
				</InfoCard>

				<InfoCard
					title="Faction Affiliations"
					description="Organizations {name} is associated with"
					icon={<Icons.Flag className="h-4 w-4 mr-2 text-red-600" />}
					emptyMessage="No known faction affiliations for this NPC"
					contentClassName="space-y-4"
				>
					{factionMemberships.map(({ id, justification, loyalty, rank, role, secrets, faction }) => (
						<div key={`faction-${id}`} className="border-b last:border-b-0 p-3 space-y-3">
							<div className="flex justify-between">
								<h4 className="font-medium">
									{faction && <Link href={`/factions/${faction.slug}`}>{faction.name}</Link>}
								</h4>
								<BadgeWithTooltip
									variant={
										loyalty === "high"
											? "default"
											: loyalty === "medium"
												? "secondary"
												: loyalty === "low"
													? "outline"
													: "destructive"
									}
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
							<div className=" text-sm">Justification: {justification}</div>

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
					))}
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
				{itemRelations.map(({ id, sourceItem, relationshipType }) => (
					<div key={`item-relation-${id}`} className="border-b last:border-b-0 p-3 space-y-3">
						<div className="flex justify-between">
							<Link href={`/items/${sourceItem?.slug}`}>
								<h4 className="font-medium">{sourceItem?.name}</h4>
							</Link>
							<BadgeWithTooltip variant="secondary" tooltipContent="Relationship Type">
								{relationshipType}
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
							gmNotes,
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

								<List items={gmNotes} spacing="sm" textColor="muted" textSize="xs" />
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
						{questStageDeliveries.map(({ id, quest, questStage }) => (
							<div key={`quest-stage-delivery-${id}`} className="text-sm">
								<Link href={`/quests/${quest?.slug}`}>
									Delivers: {quest?.name} - {questStage?.name}
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
