import * as Icons from "lucide-react"
import type React from "react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Quest } from "~/lib/entities"

type OverviewContentProps = Pick<
	Quest,
	| "description"
	| "hooks"
	| "objectives"
	| "otherUnlockConditionsNotes"
	| "payoff"
	| "prerequisiteQuest"
	| "promise"
	| "rewards"
	| "stakes"
>

export const OverviewContent: React.FC<OverviewContentProps> = ({
	description,
	hooks,
	objectives,
	otherUnlockConditionsNotes,
	payoff,
	prerequisiteQuest,
	promise,
	rewards,
	stakes,
}) => {

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
				title="Promise & Payoff"
				icon={<Icons.GitBranch className="h-4 w-4 mr-2 text-primary" />}
				className="col-span-6"
			>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div>
						<h4 className="text-sm font-medium mb-1">Promise</h4>
						<p className="text-sm text-muted-foreground">{promise}</p>
					</div>
					<div>
						<h4 className="text-sm font-medium mb-1">Payoff</h4>
						<p className="text-sm text-muted-foreground">{payoff}</p>
					</div>
					<List
						heading="Stakes"
						items={stakes}
						spacing="sm"
						textColor="muted"
						collapsible={false}
					/>
				</div>
			</InfoCard>
		</div>
	)
}
