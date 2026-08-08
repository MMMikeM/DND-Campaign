import * as Icons from "lucide-react"
import type React from "react"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Link } from "~/components/ui/link"
import type { Quest } from "~/lib/entities"

interface ConnectionsContentProps {
	quest: Quest
}

type Participant = Quest["participants"][number]
type Relation = Quest["relations"][number]

const importanceVariant = (importance: string) => {
	if (importance === "critical") return "destructive" as const
	if (importance === "major") return "default" as const
	if (importance === "supporting") return "secondary" as const
	return "outline" as const
}

export const ConnectionsContent: React.FC<ConnectionsContentProps> = ({ quest }) => {
	const { participants, relations } = quest

	const factionParticipants = participants.filter((participant) => participant.faction !== null)
	const npcParticipants = participants.filter((participant) => participant.npc !== null)

	// "prerequisite" and "hidden_connection" point away from this quest; the rest point back toward it.
	const leadsTo = relations.filter(
		({ relationshipType }) => relationshipType === "prerequisite" || relationshipType === "hidden_connection",
	)
	const followsFrom = relations.filter(
		({ relationshipType }) =>
			relationshipType === "sequel" || relationshipType === "parallel" || relationshipType === "alternative",
	)

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

const relationTooltips: Record<string, string> = {
	prerequisite: "This quest must be completed before the linked quest",
	hidden_connection: "Hidden connection to this quest",
	sequel: "This quest follows the linked quest",
	parallel: "This quest runs alongside the linked quest",
	alternative: "Alternative path to the linked quest",
}

const RelationEntry = ({ relation }: { relation: Relation }) => {
	const { creativePrompts, description, quest, relationshipType } = relation

	return (
		<div className="border-b pb-3 last:border-0">
			<Link href={`/quests/${quest.slug}`} className="font-medium hover:text-primary">
				{quest.name}
			</Link>
			<BadgeWithTooltip variant="outline" className="ml-2" tooltipContent={relationTooltips[relationshipType]}>
				{relationshipType.replace("_", " ")}
			</BadgeWithTooltip>

			<List heading="Description" items={description} spacing="sm" textColor="muted" />
			<List heading="Creative Prompts" items={creativePrompts} spacing="sm" textColor="muted" />
		</div>
	)
}
