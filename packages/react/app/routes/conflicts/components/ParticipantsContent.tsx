import React from "react"
import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard" // Use InfoCard
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { List } from "~/components/List"
import { Link } from "~/components/ui/link"
import type { Conflict } from "~/lib/entities"

interface ParticipantsContentProps {
	conflict: Conflict
}

const getParticipantRoleVariant = (role: string): "default" | "destructive" | "outline" | "secondary" => {
	switch (role) {
		case "instigator":
		case "opponent":
			return "destructive"
		case "ally":
			return "default"
		case "mediator":
			return "secondary"
		case "beneficiary":
			return "secondary"
		case "neutral":
		default:
			return "outline"
	}
}

export function ParticipantsContent({ conflict }: ParticipantsContentProps) {
	const { participants, name } = conflict

	return (
		<InfoCard
			title="Participants"
			icon={<Icons.Users className="h-4 w-4 mr-2 text-orange-600" />}
			emptyMessage="No participants listed for this conflict."
		>
			{participants && participants.length > 0 && (
				<div className="space-y-4 p-4">
					{participants.map((participant) => (
						<div key={participant.id} className="border rounded p-3 bg-background dark:bg-muted/30">
							<div className="flex justify-between items-start mb-2">
								<Link
									href={`/factions/${participant.faction.slug}`}
									className="text-md font-semibold text-primary hover:underline"
								>
									{participant.faction.name}
								</Link>
								<BadgeWithTooltip
									variant={getParticipantRoleVariant(participant.role)}
									tooltipContent={`Role in conflict: ${participant.role}`}
									className="capitalize"
								>
									{participant.role}
								</BadgeWithTooltip>
							</div>
							<div className="mb-3">
								<h4 className="font-medium text-sm mb-1 flex items-center">
									<Icons.Goal className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
									Motivation
								</h4>
								<p className="text-sm text-muted-foreground">{participant.motivation}</p>
							</div>
							{participant.publicStance && (
								<div className="mb-3">
									<h4 className="font-medium text-sm mb-1 flex items-center">
										<Icons.Megaphone className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
										Public Stance
									</h4>
									<p className="text-sm text-muted-foreground">{participant.publicStance}</p>
								</div>
							)}
							{participant.secretStance && (
								<div className="mb-3">
									<h4 className="font-medium text-sm mb-1 flex items-center">
										<Icons.LockKeyhole className="h-3.5 w-3.5 mr-1.5 text-red-600" />
										Secret Stance
									</h4>
									<p className="text-sm text-muted-foreground italic">{participant.secretStance}</p>
								</div>
							)}
							{participant.resources && participant.resources.length > 0 && (
								<div>
									<h4 className="font-medium text-sm mb-1 flex items-center">
										<Icons.Container className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
										Resources Committed
									</h4>
									<List items={participant.resources} spacing="xs" textColor="muted" textSize="sm" />
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</InfoCard>
	)
}

export default ParticipantsContent
