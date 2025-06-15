import * as Icons from "lucide-react"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { InfoCard } from "~/components/InfoCard" // Use InfoCard
import { List } from "~/components/List"
import { Link } from "~/components/ui/link"
import type { Conflict } from "~/lib/entities"
import { getParticipantRoleVariant } from "../utils"

export function ParticipantsContent({ participants, name }: Pick<Conflict, "participants" | "name">) {
	return (
		<InfoCard
			title="Participants"
			icon={<Icons.Users className="h-4 w-4 mr-2 text-orange-600" />}
			emptyMessage="No participants listed for this conflict."
		>
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-lg font-medium">{name}</h2>
			</div>
			<div className="space-y-4 p-4">
				{participants.map(
					({
						id,
						creativePrompts,
						description,
						gmNotes,
						tags,
						role,
						motivation,
						publicStance,
						secretStance,
						faction,
						npc,
					}) => (
						<div key={id} className="border rounded p-3 bg-background dark:bg-muted/30">
							<div className="flex justify-between items-start mb-2">
								{faction ? (
									<Link
										href={`/factions/${faction?.slug}`}
										className="text-md font-semibold text-primary hover:underline"
									>
										{faction?.name}
									</Link>
								) : (
									<Link href={`/npcs/${npc?.slug}`} className="text-md font-semibold text-primary hover:underline">
										{npc?.name}
									</Link>
								)}
								<BadgeWithTooltip
									variant={getParticipantRoleVariant(role)}
									tooltipContent={`Role in conflict: ${role}`}
									className="capitalize"
								>
									{role}
								</BadgeWithTooltip>
							</div>
							<div className="mb-3">
								<h4 className="font-medium text-sm mb-1 flex items-center">
									<Icons.Goal className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
									Motivation
								</h4>
								<p className="text-sm text-muted-foreground">{motivation}</p>
							</div>
							<div className="mb-3">
								<h4 className="font-medium text-sm mb-1 flex items-center">
									<Icons.Megaphone className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
									Public Stance
								</h4>
								<p className="text-sm text-muted-foreground">{publicStance}</p>
							</div>
							<div className="mb-3">
								<h4 className="font-medium text-sm mb-1 flex items-center">
									<Icons.LockKeyhole className="h-3.5 w-3.5 mr-1.5 text-red-600" />
									Secret Stance
								</h4>
								<p className="text-sm text-muted-foreground italic">{secretStance}</p>
							</div>
							<div>
								<h4 className="font-medium text-sm mb-1 flex items-center">
									<Icons.Container className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
									Creative Prompts
								</h4>
								<List items={creativePrompts} spacing="xs" textColor="muted" textSize="sm" />
							</div>
							<div>
								<h4 className="font-medium text-sm mb-1 flex items-center">
									<Icons.Container className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
									Description
								</h4>
								<List items={description} spacing="xs" textColor="muted" textSize="sm" />
							</div>
							<div>
								<h4 className="font-medium text-sm mb-1 flex items-center">
									<Icons.Container className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
									GM Notes
								</h4>
								<List items={gmNotes} spacing="xs" textColor="muted" textSize="sm" />
							</div>
							<div>
								<h4 className="font-medium text-sm mb-1 flex items-center">
									<Icons.Container className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
									Tags
								</h4>
								<List items={tags} spacing="xs" textColor="muted" textSize="sm" />
							</div>
						</div>
					),
				)}
			</div>
		</InfoCard>
	)
}
