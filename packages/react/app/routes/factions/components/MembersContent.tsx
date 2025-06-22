import * as Icons from "lucide-react"
import { NavLink } from "react-router"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Tags } from "~/components/Tags"
import type { Faction } from "~/lib/entities"

export function MembersContent({ members }: Pick<Faction, "members">) {
	return (
		<InfoCard
			title="Members"
			icon={<Icons.Users className="h-5 w-5 mr-2 text-blue-500" />}
			emptyMessage={`No known members of ${name}`}
		>
			{members.map(
				({ id, creativePrompts, description, gmNotes, tags, secrets, loyalty, role, justification, rank, npc }) => (
					<div key={`npc-${id}`} className="border rounded p-4">
						<div className="flex items-center justify-between">
							<h4 className="font-medium">
								<NavLink to={`/npcs/${npc.slug}`} className="hover:text-indigo-500">
									{npc.name}
								</NavLink>
							</h4>
							<BadgeWithTooltip
								variant={
									loyalty === "high"
										? "default"
										: loyalty === "medium"
											? "default"
											: loyalty === "low"
												? "secondary"
												: "outline"
								}
								tooltipContent="Dedication level to faction goals"
							>
								{loyalty}
							</BadgeWithTooltip>
						</div>
						<div className="mt-2 text-sm text-muted-foreground">
							<div className="flex">
								<span className="font-medium mr-2">Rank:</span>
								<span>{rank}</span>
							</div>
							<div className="flex mt-1">
								<span className="font-medium mr-2">Role:</span>
								<span>{role}</span>
							</div>
						</div>
						<p>Justification: {justification}</p>
						<List items={secrets} heading="Secrets" />
						<List items={description} heading="Description" />
						<List items={creativePrompts} heading="Creative Prompts" />
						<List items={gmNotes} heading="GM Notes" />
						<Tags tags={tags} />
					</div>
				),
			)}
		</InfoCard>
	)
}
