import React from "react"
import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { List } from "~/components/List"
import { Link } from "~/components/ui/link"
import type { Conflict } from "~/lib/entities"

interface ProgressionContentProps {
	conflict: Conflict
}

const getQuestImpactVariant = (impact: string): "default" | "destructive" | "outline" | "secondary" => {
	switch (impact) {
		case "escalates":
			return "destructive"
		case "deescalates":
			return "default"
		case "reveals_truth":
		case "changes_sides":
			return "secondary"
		case "no_change":
		default:
			return "outline"
	}
}

export function ProgressionContent({ conflict }: ProgressionContentProps) {
	const { progression, name } = conflict

	return (
		<InfoCard
			title="Conflict Progression"
			icon={<Icons.TrendingUp className="h-4 w-4 mr-2 text-teal-600" />}
			emptyMessage="No quests are currently linked to this conflict's progression."
		>
			{progression && progression.length > 0 && (
				<div className="space-y-4 p-4">
					{progression.map((item) => (
						<div key={item.id} className="border rounded p-3 bg-background dark:bg-muted/30">
							<div className="flex justify-between items-start mb-2">
								<Link
									href={`/quests/${item.quest.slug}`}
									className="text-md font-semibold text-primary hover:underline"
								>
									{item.quest.name}
								</Link>
								<BadgeWithTooltip
									variant={getQuestImpactVariant(item.impact)}
									tooltipContent={`Impact on conflict: ${item.impact}`}
									className="capitalize"
								>
									{item.impact.replace("_", " ")}
								</BadgeWithTooltip>
							</div>

							{item.notes && item.notes.length > 0 && (
								<div>
									<h4 className="font-medium text-sm mb-1 flex items-center">
										<Icons.FileText className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
										Notes
									</h4>
									<List items={item.notes} spacing="xs" textColor="muted" textSize="sm" />
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</InfoCard>
	)
}

export default ProgressionContent
