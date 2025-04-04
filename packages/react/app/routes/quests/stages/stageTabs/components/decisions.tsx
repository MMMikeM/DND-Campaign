import * as Icons from "lucide-react"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Quest } from "~/lib/entities"
import { getConditionTypeBadgeProps, getDecisionTypeBadgeProps } from "../../utils"
import { cn } from "~/lib/utils"

export default function StageDecisionsTab(selectedStage: Quest["stages"][0]) {
	console.log({ selectedStage })
	return selectedStage?.outgoingDecisions.length > 0 ? (
		selectedStage.outgoingDecisions.map((decision) => (
			<InfoCard
				key={decision.id}
				title="Decision Points"
				icon={<Icons.GitMerge className="h-4 w-4 mr-2" />}
				className="col-span-3 mb-4"
			>
				<div className="flex flex-col space-y-4">
					<h4 className="font-semibold text-lg">{decision.name}</h4>
					<div className="flex gap-2 my-2">
						<BadgeWithTooltip {...getConditionTypeBadgeProps(decision.conditionType)} />
						<BadgeWithTooltip {...getDecisionTypeBadgeProps(decision.decision_type)} />
					</div>
					<div>
						<h5 className="text-sm font-medium">Condition Value</h5>
						<p className="text-sm">{decision.conditionValue}</p>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<List
							heading="Description"
							items={decision.description}
							textColor="default"
							icon={<Icons.Info className="h-4 w-4 mr-2" />}
						/>
						<List
							heading="Options"
							items={decision.options}
							textColor="default"
							icon={<Icons.ArrowRight className="h-4 w-4 mr-2 text-blue-500" />}
						/>
					</div>

					<div className=" flex flex-col gap-6">
						<div className="grid grid-cols-3 gap-4 border-t pt-6">
							<List
								heading="Narrative Transition"
								items={decision.narrativeTransition}
								textColor="default"
								icon={<Icons.ArrowRightCircle className="h-4 w-4 mr-2 text-blue-500" />}
								maxItems={2}
							/>
							<List
								heading="Player Reactions"
								items={decision.potential_player_reactions}
								textColor="default"
								icon={<Icons.Users className="h-4 w-4 mr-2 text-purple-500" />}
								maxItems={2}
							/>
							<List
								heading="Creative Prompts"
								items={decision.creativePrompts}
								textColor="default"
								icon={<Icons.Sparkles className="h-4 w-4 mr-2 text-amber-500" />}
								maxItems={2}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4 border-t pt-6 ">
							<List
								heading="Success Description"
								items={decision.successDescription}
								textColor="default"
								icon={<Icons.CheckCircle className="h-4 w-4 mr-2 text-green-500" />}
								maxItems={2}
							/>
							<List
								heading="Failure Description"
								items={decision.failureDescription}
								textColor="default"
								icon={<Icons.XCircle className="h-4 w-4 mr-2 text-red-500" />}
								maxItems={2}
							/>
						</div>

						{decision.consequences && decision.consequences.length > 0 && (
							<div className="py-6 border-t">
								<h5 className="text-xl font-medium mb-4">Consequences</h5>
								<div className="grid grid-cols-2">
									{decision.consequences.map((consequence, index) => (
										<div key={consequence.id} className={cn(index % 2 === 0 ? "pr-6 mr-6 border-r" : "")}>
											<div className="flex gap-2 mb-4">
												<BadgeWithTooltip tooltipContent={"Severity"} className="flex items-center">
													<Icons.Info className="h-4 w-4 mr-2" />
													{consequence.severity}
												</BadgeWithTooltip>
												<BadgeWithTooltip tooltipContent={"Visibility"} className="flex items-center">
													<Icons.Info className="h-4 w-4 mr-2" />
													{consequence.visibility}
												</BadgeWithTooltip>
												<BadgeWithTooltip tooltipContent={"Delay"} className="flex items-center">
													<Icons.Info className="h-4 w-4 mr-2" />
													{consequence.delay_factor}
												</BadgeWithTooltip>
												<BadgeWithTooltip tooltipContent={"Type"} className="flex items-center">
													<Icons.Info className="h-4 w-4 mr-2" />
													{consequence.consequence_type}
												</BadgeWithTooltip>
											</div>

											<List
												heading="Description"
												items={consequence.description}
												textColor="default"
												icon={<Icons.Info className="h-4 w-4 mr-2" />}
												maxItems={2}
											/>
											<List
												heading="Creative Prompts"
												items={consequence.creativePrompts}
												textColor="default"
												icon={<Icons.Sparkles className="h-4 w-4 mr-2 text-amber-500" />}
												maxItems={2}
											/>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</InfoCard>
		))
	) : (
		<div className="text-center p-4 text-muted-foreground">
			<p>No decision points defined for this stage.</p>
		</div>
	)
}
