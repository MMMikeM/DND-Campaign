import * as Icons from "lucide-react"
import { NavLink } from "react-router"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Faction } from "~/lib/entities"

export function MembersContent({ name, members }: Faction) {
	return (
		<InfoCard
			title="Members"
			icon={<Icons.Users className="h-5 w-5 mr-2 text-blue-500" />}
			emptyMessage={`No known members of ${name}`}
		>
			{members && members.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
					{members.map((npcInfo) => (
						<div key={`npc-${npcInfo.id}`} className="border rounded p-4">
							<div className="flex items-center justify-between">
								<h4 className="font-medium">
									<NavLink to={`/npcs/${npcInfo.npc?.slug!}`} className="hover:text-indigo-500">
										{npcInfo.npc?.name}
									</NavLink>
								</h4>
								<BadgeWithTooltip
									variant={
										npcInfo.loyalty === "high"
											? "default"
											: npcInfo.loyalty === "medium"
												? "default"
												: npcInfo.loyalty === "low"
													? "secondary"
													: "outline"
									}
									tooltipContent="Dedication level to faction goals"
								>
									{npcInfo.loyalty}
								</BadgeWithTooltip>
							</div>
							<div className="mt-2 text-sm text-muted-foreground">
								<div className="flex">
									<span className="font-medium mr-2">Rank:</span>
									<span>{npcInfo.rank}</span>
								</div>
								<div className="flex mt-1">
									<span className="font-medium mr-2">Role:</span>
									<span>{npcInfo.role}</span>
								</div>
							</div>
							{npcInfo.secrets && npcInfo.secrets.length > 0 && (
								<div className="mt-3 border-t pt-2">
									<List items={npcInfo.secrets} heading="Secrets" />
								</div>
							)}
						</div>
					))}
				</div>
			) : null}
		</InfoCard>
	)
}
