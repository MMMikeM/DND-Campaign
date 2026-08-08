import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Tags } from "~/components/Tags"
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
						conflictImpactDescription,
						creativePrompts,
						playerImpactFeel,
						slug,
						tags,
						timeframe,
						triggerQuestStageDecision,
					}) => (
						<div key={id} className="border rounded p-4">
							<div className="flex justify-between items-start">
								<h4 className="font-medium text-lg">{name}</h4>
								<Tags tags={tags} />
							</div>
							<div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-2">
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
								{timeframe && (
									<span className="capitalize">
										<strong>Timeframe:</strong> {timeframe}
									</span>
								)}
							</div>
							<List items={description} />
							{playerImpactFeel && (
								<p className="text-sm text-muted-foreground mt-2">
									<strong>Player impact:</strong> {playerImpactFeel}
								</p>
							)}
							<List items={creativePrompts} heading="Creative Prompts" spacing="sm" className="mt-2" />
							{conflictImpactDescription && (
								<p className="text-sm text-muted-foreground mt-1">
									<strong>Conflict impact:</strong> {conflictImpactDescription}
								</p>
							)}
							{(triggerQuest || triggerQuestStageDecision) && (
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
