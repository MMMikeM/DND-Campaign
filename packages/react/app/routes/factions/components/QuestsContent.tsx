import * as Icons from "lucide-react"
import { NavLink } from "react-router"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Faction } from "~/lib/entities"

export function QuestsContent(faction: Faction) {
	return (
		<InfoCard
			title="Related Quests"
			icon={<Icons.Scroll className="h-5 w-5 mr-2 text-amber-500" />}
			emptyMessage={`No quests associated with ${faction.name}`}
		>
			{faction.relatedQuests && faction.relatedQuests.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
					{faction.relatedQuests.map((questInfo) => (
						<div key={`quest-${questInfo.id}`} className="border rounded p-4">
							<h4 className="font-medium">
								<NavLink to={`/quests/${questInfo.quest?.slug}`} className="hover:text-indigo-500">
									{questInfo.quest?.name}
								</NavLink>
							</h4>
							<BadgeWithTooltip className="mt-1" tooltipContent="How this faction participates in the quest">
								{questInfo.role}
							</BadgeWithTooltip>
							<List items={questInfo.interest} heading="Interest" />
						</div>
					))}
				</div>
			) : null}
		</InfoCard>
	)
}
