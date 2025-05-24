import * as Icons from "lucide-react"
import type React from "react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Quest } from "~/lib/entities"

interface OverviewContentProps {
	quest: Quest
}

export const OverviewContent: React.FC<OverviewContentProps> = ({ quest }) => {
	const { name, description, themes, inspirations, objectives, successOutcomes, failureOutcomes, rewards } = quest

	return (
		<div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
			<InfoCard
				title="Overview"
				icon={<Icons.Info className="h-4 w-4 mr-2 text-primary" />}
				className="lg:col-span-4 row-span-2"
			>
				<div className="space-y-4">
					<div>
						<List
							heading="Description"
							items={description}
							spacing="sm"
							textColor="muted"
							icon={<Icons.Info className="h-4 w-4 mr-2" />}
							collapsible={false}
						/>
					</div>

					<div className="border-t pt-4">
						<List
							heading="Themes"
							items={themes}
							spacing="sm"
							textColor="muted"
							icon={<Icons.Layers className="h-4 w-4 mr-2" />}
							collapsible={false}
						/>
					</div>

					<div className="border-t pt-4">
						<List
							heading="Inspirations"
							items={inspirations}
							spacing="sm"
							textColor="muted"
							icon={<Icons.Lightbulb className="h-4 w-4 mr-2" />}
							collapsible={false}
						/>
					</div>
				</div>
			</InfoCard>

			<InfoCard
				title="Objectives"
				icon={<Icons.Target className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No objectives defined"
				className="lg:col-span-2 "
			>
				<div>
					<p className="text-sm text-muted-foreground mb-4">Goals for this quest</p>
					{objectives && objectives.length > 0 && <List items={objectives} textColor="default" />}
				</div>
			</InfoCard>

			<InfoCard
				title="Rewards"
				icon={<Icons.Gift className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No rewards defined"
				className="lg:col-span-2 "
			>
				<div>
					<p className="text-sm text-muted-foreground mb-4">What players can gain from this quest</p>
					<List
						heading="Rewards"
						items={rewards}
						spacing="sm"
						textColor="default"
						icon={<Icons.Trophy className="h-4 w-4 mr-2 text-amber-500" />}
						collapsible={false}
					/>
				</div>
			</InfoCard>

			<InfoCard
				title="Possible Outcomes"
				icon={<Icons.GitBranch className="h-4 w-4 mr-2 text-primary" />}
				className="col-span-6"
			>
				<div>
					<p className="text-sm text-muted-foreground mb-4">Consequences of success or failure</p>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<List
								heading="Success Outcomes"
								items={successOutcomes}
								spacing="sm"
								textColor="default"
								icon={<Icons.ThumbsUp className="h-4 w-4 mr-2 text-green-500" />}
								collapsible={false}
							/>
						</div>

						<div>
							<List
								heading="Failure Outcomes"
								items={failureOutcomes}
								spacing="sm"
								textColor="default"
								icon={<Icons.ThumbsDown className="h-4 w-4 mr-2 text-red-500" />}
								collapsible={false}
							/>
						</div>
					</div>
				</div>
			</InfoCard>
		</div>
	)
}

export default OverviewContent
