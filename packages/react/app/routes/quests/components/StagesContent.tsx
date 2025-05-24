import * as Icons from "lucide-react"
import type React from "react"
import { NavLink, Outlet } from "react-router"
import { InfoCard } from "~/components/InfoCard"
import StageTreeViewer from "~/components/StageTreeViewer"
import type { Quest } from "~/lib/entities"

interface StagesContentProps {
	quest: Quest
	stages: QuestStage
	selectedStageId: number | null
	onStageSelect: (stageId: number) => void
	stageTab?: string
}

export const StagesContent: React.FC<StagesContentProps> = ({
	quest,
	stages,
	selectedStageId,
	onStageSelect,
	stageTab = "overview",
}) => {
	const selectedStage = selectedStageId ? quest.stages.find((stage) => stage.id === selectedStageId) : quest.stages[0]

	if (!selectedStage) {
		return (
			<div className="text-center p-12 text-muted-foreground">
				<Icons.AlertCircle className="h-10 w-10 mx-auto mb-4" />
				<h3 className="text-lg font-semibold mb-2">No stages available</h3>
				<p>This quest doesn't have any stages defined yet.</p>
			</div>
		)
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center text-sm text-muted-foreground">
				<NavLink to={`/quests/${quest.slug}`} className="hover:text-foreground transition-colors">
					{quest.name}
				</NavLink>
				<Icons.ChevronRight className="h-4 w-4 mx-1" />
				<NavLink
					to={`/quests/${quest.slug}/stages/${selectedStage.slug}`}
					className="hover:text-foreground transition-colors"
				>
					Stage {selectedStage.stage}: {selectedStage.name}
				</NavLink>
				{stageTab !== "overview" && (
					<>
						<Icons.ChevronRight className="h-4 w-4 mx-1" />
						<span className="capitalize">{stageTab}</span>
					</>
				)}
			</div>

			<div className="w-full">
				<p className="text-sm text-muted-foreground mb-4">Progression of stages</p>
				{stages?.stages ? (
					<StageTreeViewer stages={stages.stages} currentStageId={selectedStageId} onStageSelect={onStageSelect} />
				) : (
					<div className="text-center p-4 text-muted-foreground">
						<p>No stage relationships defined.</p>
					</div>
				)}
			</div>

			<InfoCard title={selectedStage.name} icon={<Icons.Milestone className="h-5 w-5 mr-2 text-primary" />}>
				<div>
					<div className="flex justify-between items-start">
						<p className="text-sm text-muted-foreground">Stage {selectedStage.stage}</p>
						<div className="text-right">
							<div className="text-sm text-muted-foreground">Dramatic Question:</div>
							<div className="italic">{selectedStage.dramatic_question}</div>
						</div>
					</div>
				</div>
			</InfoCard>

			<Outlet context={{ selectedStage, questSlug: quest.slug }} />
		</div>
	)
}

export default StagesContent
