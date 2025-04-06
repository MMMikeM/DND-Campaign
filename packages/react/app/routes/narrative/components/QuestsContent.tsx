import React from "react"
import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { Link } from "~/components/ui/link"
import type { NarrativeArc } from "~/lib/entities"

interface QuestsContentProps {
	arc: NarrativeArc
}

export function QuestsContent({ arc }: QuestsContentProps) {
	const { members, name } = arc

	return (
		<InfoCard
			title="Included Quests"
			icon={<Icons.Scroll className="h-4 w-4 mr-2 text-amber-600" />}
			emptyMessage={`No quests are currently part of the "${name}" arc.`}
		>
			{members && members.length > 0 && (
				<div className="space-y-3 p-4">
					{members.map((member) => (
						<div key={member.id} className="border rounded p-3 bg-background dark:bg-muted/30">
							<Link
								href={`/quests/${member.quest.slug}`}
								className="text-md font-semibold text-primary hover:underline"
							>
								{member.quest.name}
							</Link>
						</div>
					))}
				</div>
			)}
		</InfoCard>
	)
}

export default QuestsContent
