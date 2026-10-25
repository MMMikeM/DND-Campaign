import * as Icons from "lucide-react"
import type React from "react"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Link } from "~/components/ui/link"
import type { Quest } from "~/lib/entities"

type ConnectionsContentProps = Pick<
	Quest,
	"dependentQuests" | "itemConnections" | "loreLinks" | "participants" | "relations"
>

type Participant = Quest["participants"][number]
type Relation = Quest["relations"][number]

const importanceVariant = (importance: string) => {
	if (importance === "critical") return "destructive" as const
	if (importance === "major") return "default" as const
	if (importance === "supporting") return "secondary" as const
	return "outline" as const
}

export const ConnectionsContent: React.FC<ConnectionsContentProps> = ({
	dependentQuests,
	itemConnections,
	loreLinks,
	participants,
	relations,
}) => {
	const factionParticipants = participants.filter((participant) => participant.faction !== null)
	const npcParticipants = participants.filter((participant) => participant.npc !== null)

	const leadsTo = relations.filter(pointsAway)
	const followsFrom = relations.filter((relation) => !pointsAway(relation))

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<InfoCard
				title="Related Factions"
				icon={<Icons.Flag className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No related factions"
			>
				{factionParticipants.map((participant) => (
					<ParticipantEntry
						key={`faction-participant-${participant.id}`}
						participant={participant}
						href={`/factions/${participant.faction?.slug}`}
						name={participant.faction?.name}
						icon={<Icons.Users className="h-4 w-4 mr-2" />}
					/>
				))}
			</InfoCard>

			<InfoCard
				title="Related NPCs"
				icon={<Icons.UserCircle className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No related NPCs"
			>
				{npcParticipants.map((participant) => (
					<ParticipantEntry
						key={`npc-participant-${participant.id}`}
						participant={participant}
						href={`/npcs/${participant.npc?.slug}`}
						name={participant.npc?.name}
						icon={<Icons.User className="h-4 w-4 mr-2" />}
					/>
				))}
			</InfoCard>

			<InfoCard
				title="Unlocks"
				icon={<Icons.KeyRound className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No quests are gated behind this one"
			>
				{dependentQuests.map(({ id, name, slug }) => (
					<div key={`dependent-${id}`} className="border-b last:border-0 p-3">
						<Link href={`/quests/${slug}`} className="font-medium hover:text-primary">
							{name}
						</Link>
					</div>
				))}
			</InfoCard>

			<InfoCard
				title="Items"
				icon={<Icons.Package className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No items are tied to this quest"
			>
				{itemConnections.map(({ id, sourceItem, relationship }) => (
					<div key={`item-${id}`} className="border-b last:border-0 p-3">
						<span className="font-medium">{sourceItem.name}</span>
						<span className="text-sm text-muted-foreground ml-2">{relationship}</span>
					</div>
				))}
			</InfoCard>

			<InfoCard
				title="Lore"
				icon={<Icons.BookOpen className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No lore is linked to this quest"
				className="lg:col-span-2"
			>
				{loreLinks.map(({ id, linkRoleOrTypeText, linkDetailsText }) => (
					<div key={`lore-${id}`} className="border-b last:border-0 p-3">
						<p className="text-sm font-medium">{linkRoleOrTypeText}</p>
						<p className="text-sm text-muted-foreground">{linkDetailsText}</p>
					</div>
				))}
			</InfoCard>

			<InfoCard
				title="Quest Connections"
				icon={<Icons.GitBranch className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No connected quests"
				className="lg:col-span-2"
			>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<h3 className="text-sm font-medium mb-3 flex items-center">
							<Icons.ArrowRightCircle className="h-4 w-4 mr-2 text-green-500" />
							Leads To
						</h3>

						{leadsTo.length > 0 ? (
							<div className="space-y-4">
								{leadsTo.map((relation) => (
									<RelationEntry key={`leads-to-${relation.id}`} relation={relation} />
								))}
							</div>
						) : (
							<p className="text-muted-foreground text-sm italic">No following quests defined</p>
						)}
					</div>

					<div>
						<h3 className="text-sm font-medium mb-3 flex items-center">
							<Icons.ArrowLeftCircle className="h-4 w-4 mr-2 text-blue-500" />
							Follows From
						</h3>

						{followsFrom.length > 0 ? (
							<div className="space-y-4">
								{followsFrom.map((relation) => (
									<RelationEntry key={`follows-from-${relation.id}`} relation={relation} />
								))}
							</div>
						) : (
							<p className="text-muted-foreground text-sm italic">No preceding quests defined</p>
						)}
					</div>
				</div>
			</InfoCard>
		</div>
	)
}

const ParticipantEntry = ({
	participant,
	href,
	name,
	icon,
}: {
	participant: Participant
	href: string
	name?: string
	icon: React.ReactNode
}) => {
	const { creativePrompts, description, importanceInQuest, involvementDetails, roleInQuest } = participant

	return (
		<div className="border-b pb-4 last:border-0">
			<div className="flex justify-between items-center mb-2">
				<Link href={href} className="font-medium hover:text-primary flex items-center">
					{icon}
					{name}
				</Link>
				<div className="flex items-center gap-2">
					<BadgeWithTooltip variant={importanceVariant(importanceInQuest)} tooltipContent="Importance to quest">
						{importanceInQuest}
					</BadgeWithTooltip>
					<BadgeWithTooltip variant="outline" tooltipContent="Role in this quest">
						{roleInQuest}
					</BadgeWithTooltip>
				</div>
			</div>

			<List heading="Involvement" items={involvementDetails} spacing="sm" textColor="muted" />
			<List heading="Description" items={description} spacing="sm" textColor="muted" />
			<List heading="Creative Prompts" items={creativePrompts} spacing="sm" textColor="muted" />
		</div>
	)
}

/**
 * A relation reads "source <type> target": a prerequisite or hidden connection points from the source to the
 * target, and the other types point back at the source. Seen from the target's page, the direction flips.
 */
const pointsAway = ({ relationshipType, direction }: Relation) =>
	(relationshipType === "prerequisite" || relationshipType === "hidden_connection") === (direction === "outgoing")

const relationTooltips: Record<Relation["direction"], Record<Relation["relationshipType"], string>> = {
	outgoing: {
		prerequisite: "This quest must be completed before the linked quest",
		hidden_connection: "Hidden connection to the linked quest",
		sequel: "This quest follows the linked quest",
		parallel: "This quest runs alongside the linked quest",
		alternative: "Alternative path to the linked quest",
	},
	incoming: {
		prerequisite: "The linked quest must be completed before this quest",
		hidden_connection: "Hidden connection from the linked quest",
		sequel: "The linked quest follows this quest",
		parallel: "The linked quest runs alongside this quest",
		alternative: "The linked quest is an alternative path to this quest",
	},
}

const RelationEntry = ({ relation }: { relation: Relation }) => {
	const { creativePrompts, description, direction, quest, relationshipType } = relation

	return (
		<div className="border-b pb-3 last:border-0">
			<Link href={`/quests/${quest.slug}`} className="font-medium hover:text-primary">
				{quest.name}
			</Link>
			<BadgeWithTooltip
				variant="outline"
				className="ml-2"
				tooltipContent={relationTooltips[direction][relationshipType]}
			>
				{relationshipType.replace("_", " ")}
			</BadgeWithTooltip>

			<List heading="Description" items={description} spacing="sm" textColor="muted" />
			<List heading="Creative Prompts" items={creativePrompts} spacing="sm" textColor="muted" />
		</div>
	)
}
