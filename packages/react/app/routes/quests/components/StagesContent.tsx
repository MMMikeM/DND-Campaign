import * as Icons from "lucide-react"
import type React from "react"
import { NavLink, Outlet } from "react-router"
import { InfoCard } from "~/components/InfoCard"
import StageTreeViewer from "~/components/StageTreeViewer"
import type { Quest } from "~/lib/entities"

interface StagesContentProps extends Pick<Quest, "name" | "slug" | "stages"> {
	selectedStageId: number | null
	onStageSelect: (stageId: number) => void
	stageTab?: string
}

export const StagesContent: React.FC<StagesContentProps> = ({
	name,
	slug,
	stages,
	selectedStageId,
	onStageSelect,
	stageTab = "overview",
}) => {
	const selectedStage = selectedStageId ? stages.find((stage) => stage.id === selectedStageId) : stages[0]

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
				<NavLink to={`/quests/${slug}`} className="hover:text-foreground transition-colors">
					{name}
				</NavLink>
				<Icons.ChevronRight className="h-4 w-4 mx-1" />
				<NavLink
					to={`/quests/${slug}/stages/${selectedStage.slug}`}
					className="hover:text-foreground transition-colors"
				>
					Stage {selectedStage.stageOrder}: {selectedStage.name}
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
				{stages ? (
					<StageTreeViewer stages={stages} currentStageId={selectedStageId} onStageSelect={onStageSelect} />
				) : (
					<div className="text-center p-4 text-muted-foreground">
						<p>No stage relationships defined.</p>
					</div>
				)}
			</div>

			<InfoCard title={selectedStage.name} icon={<Icons.Milestone className="h-5 w-5 mr-2 text-primary" />}>
				<div>
					<div className="flex justify-between items-start">
						<p className="text-sm text-muted-foreground">Stage {selectedStage.stageOrder}</p>
						<div className="text-right">
							<div className="text-sm text-muted-foreground">Dramatic Question:</div>
							<div className="italic">{selectedStage.dramatic_question}</div>
						</div>
					</div>
				</div>
			</InfoCard>

			<Outlet context={{ selectedStage, questSlug: slug }} />
		</div>
	)
}
