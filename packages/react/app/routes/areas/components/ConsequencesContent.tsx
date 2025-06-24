import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Link } from "~/components/ui/link"
import type { Area } from "~/lib/entities"

export const ConsequencesContent = ({ consequences }: Pick<Area, "consequences">) => {
	return (
		<InfoCard
			title="Consequences"
			icon={<Icons.AlertTriangle className="h-4 w-4 mr-2 text-primary" />}
			emptyMessage="This area is not directly affected by any major consequences."
		>
			<div className="space-y-4">
				{consequences.map(
					({
						id,
						name,
						description,
						consequenceType,
						severity,
						visibility,
						sourceType,
						triggerQuest,
						triggerConflict,
						conflictImpactDescription,
						creativePrompts,
						gmNotes,
						playerImpactFeel,
						slug,
						tags,
						timeframe,
						triggerQuestStageDecision,
					}) => (
						<div key={id} className="border rounded p-4">
							<h4 className="font-medium text-lg">{name}</h4>
							<div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
								<span className="capitalize">
									<strong>Severity:</strong> {severity}
								</span>
								<span className="capitalize">
									<strong>Visibility:</strong> {visibility}
								</span>
								<span className="capitalize">
									<strong>Type:</strong> {consequenceType}
								</span>
								<span className="capitalize">
									<strong>Source:</strong> {sourceType}
								</span>
							</div>
							<List items={description} />
							{(triggerQuest || triggerQuestStageDecision || triggerConflict) && (
								<div className="mt-2">
									<h5 className="font-semibold">Triggered By:</h5>
									{triggerQuest && (
										<Link className="text-primary hover:underline" href={`/quests/${triggerQuest.slug}`}>
											Quest: {triggerQuest.name}
										</Link>
									)}
									{/* Similar links for decision and conflict if needed */}
								</div>
							)}
						</div>
					),
				)}
			</div>
		</InfoCard>
	)
}
