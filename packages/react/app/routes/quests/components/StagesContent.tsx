import React from "react"
import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import StageTreeViewer from "~/components/StageTreeViewer"
import type { Quest, QuestStage } from "~/lib/entities"

interface StagesContentProps {
	quest: Quest
	stages: QuestStage
	selectedStageId: number | null
	onStageSelect: (stageId: number) => void
}

export const StagesContent: React.FC<StagesContentProps> = ({ quest, stages, selectedStageId, onStageSelect }) => {
	// Find the selected stage
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
			{/* Stage Tree Viewer - Full Width at Top */}
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

			{/* Stage Header - Full Width */}
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

			{/* Three Column Grid for Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{/* Stage Description - 2 Columns */}
				<InfoCard title="Stage Details" icon={<Icons.FileText className="h-4 w-4 mr-2" />} className="md:col-span-2">
					<div>
						<List
							heading="Description"
							items={selectedStage.description}
							spacing="sm"
							textColor="default"
							icon={<Icons.Info className="h-4 w-4 mr-2" />}
						/>

						<div className="mt-4">
							<List
								heading="Objectives"
								items={selectedStage.objectives}
								spacing="sm"
								textColor="default"
								icon={<Icons.CheckCircle className="h-4 w-4 mr-2 text-green-500" />}
							/>
						</div>

						<div className="mt-4">
							<List
								heading="Completion Paths"
								items={selectedStage.completionPaths}
								spacing="sm"
								textColor="default"
								icon={<Icons.ArrowRight className="h-4 w-4 mr-2 text-blue-500" />}
							/>
						</div>
					</div>
				</InfoCard>

				{/* Decision Points - 1 Column if they exist */}
				{selectedStage.outgoingDecisions && selectedStage.outgoingDecisions.length > 0 && (
					<InfoCard title="Decision Points" icon={<Icons.GitMerge className="h-4 w-4 mr-2" />}>
						<p className="text-sm text-muted-foreground mb-4">Choices that affect quest flow</p>
						<div className="space-y-8">
							{selectedStage.outgoingDecisions.map((decision) => (
								<div key={decision.id} className="space-y-3">
									<h4 className="font-semibold text-lg">{decision.name}</h4>
									<p className="text-sm">{decision.description[0]}</p>

									<List
										items={decision.options}
										spacing="sm"
										textColor="default"
										icon={<Icons.ArrowRight className="h-4 w-4 mr-2 text-blue-500" />}
									/>
								</div>
							))}
						</div>
					</InfoCard>
				)}

				{/* Encounters - 1 Column */}
				<InfoCard title="Encounters" icon={<Icons.Swords className="h-4 w-4 mr-2" />}>
					<List
						items={selectedStage.encounters}
						spacing="sm"
						textColor="default"
						icon={<Icons.Target className="h-4 w-4 mr-2 text-red-500" />}
					/>
				</InfoCard>

				{/* Dramatic Elements - 2 or 3 Columns depending on decision points */}
				<InfoCard title="Dramatic Elements" icon={<Icons.Theater className="h-4 w-4 mr-2" />}>
					<List
						items={selectedStage.dramatic_moments}
						spacing="sm"
						textColor="default"
						icon={<Icons.Star className="h-4 w-4 mr-2 text-amber-500" />}
					/>
				</InfoCard>

				<InfoCard title="Sensory Elements" icon={<Icons.Eye className="h-4 w-4 mr-2" />}>
					<List
						items={selectedStage.sensory_elements}
						spacing="sm"
						textColor="default"
						icon={<Icons.Eye className="h-4 w-4 mr-2 text-purple-500" />}
					/>
				</InfoCard>
			</div>
		</div>
	)
}

export default StagesContent
