import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Conflict } from "~/lib/entities"

type ProgressionContentProps = Pick<Conflict, "currentTensionLevel" | "possibleOutcomes" | "questImpacts">

export function ProgressionContent({ currentTensionLevel, possibleOutcomes, questImpacts }: ProgressionContentProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div className="space-y-6">
				<InfoCard
					title="Current Tension Level"
					icon={<Icons.TrendingUp className="h-4 w-4 mr-2 text-red-600" />}
					emptyMessage="No tension level recorded."
				>
					{currentTensionLevel && (
						<div className="flex items-center">
							<Icons.Thermometer className="h-5 w-5 mr-2 text-red-500" />
							<span className="text-lg font-medium capitalize">{currentTensionLevel}</span>
						</div>
					)}
				</InfoCard>

				<InfoCard
					title="Possible Outcomes"
					icon={<Icons.GitBranch className="h-4 w-4 mr-2 text-blue-600" />}
					emptyMessage="No possible outcomes defined."
				>
					<List items={possibleOutcomes} spacing="sm" textColor="muted" />
				</InfoCard>
			</div>

			<div className="space-y-6">
				<InfoCard
					title="Quest Impacts"
					icon={<Icons.Scroll className="h-4 w-4 mr-2 text-purple-600" />}
					emptyMessage="No quest impacts recorded."
				>
					<List items={questImpacts} spacing="sm" textColor="muted" />
				</InfoCard>
			</div>
		</div>
	)
}
