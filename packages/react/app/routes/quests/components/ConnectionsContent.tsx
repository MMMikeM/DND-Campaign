import * as Icons from "lucide-react"
import type React from "react"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Link } from "~/components/ui/link"
import type { Quest } from "~/lib/entities"

interface ConnectionsContentProps {
	quest: Quest
}

export const ConnectionsContent: React.FC<ConnectionsContentProps> = ({ quest }) => {
	const { factions, npcs, relations } = quest

	const precedes =
		relations?.filter((rel) => rel.dependencyType === "prerequisite" || rel.dependencyType === "hidden_connection") ||
		[]

	const follows =
		relations?.filter(
			(rel) =>
				rel.dependencyType === "sequel" || rel.dependencyType === "parallel" || rel.dependencyType === "alternative",
		) || []

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<InfoCard
				title="Related Factions"
				icon={<Icons.Flag className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No related factions"
			>
				{factions.map(({ faction, role, interest, creativePrompts }) => {
					return (
						<div key={`faction-${faction?.id}`} className="border-b pb-4 last:border-0">
							<div className="flex justify-between items-center mb-2">
								<Link href={`/factions/${faction?.slug}`} className="font-medium hover:text-primary flex items-center">
									<Icons.Users className="h-4 w-4 mr-2" />
									{faction?.name}
								</Link>
								<BadgeWithTooltip variant="outline" tooltipContent={`Role in this quest`}>
									{role}
								</BadgeWithTooltip>
							</div>

							<ul className="text-sm list-disc list-inside text-muted-foreground ml-2">
								{interest?.map((item, i) => (
									<li key={`interest-${faction?.id}-${i}`}>{item}</li>
								))}
							</ul>
						</div>
					)
				})}
			</InfoCard>

			<InfoCard
				title="Related NPCs"
				icon={<Icons.UserCircle className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No related NPCs"
			>
				{npcs.map((npcRel) => {
					if (!npcRel.npc) return null

					const { npc, role, importance, dramaticMoments } = npcRel
					return (
						<div key={`npc-${npc.id}`} className="border-b pb-4 last:border-0">
							<div className="flex justify-between items-center mb-2">
								<Link href={`/npcs/${npc.slug}`} className="font-medium hover:text-primary flex items-center">
									<Icons.User className="h-4 w-4 mr-2" />
									{npc.name}
								</Link>

								<div className="flex items-center gap-2">
									<BadgeWithTooltip
										variant={
											importance === "critical"
												? "destructive"
												: importance === "major"
													? "default"
													: importance === "supporting"
														? "secondary"
														: "outline"
										}
										tooltipContent="Importance to quest"
									>
										{importance}
									</BadgeWithTooltip>

									<BadgeWithTooltip variant="outline" tooltipContent="Role in quest">
										{role}
									</BadgeWithTooltip>
								</div>
							</div>

							{dramaticMoments && dramaticMoments.length > 0 && (
								<div className="mt-2">
									<h4 className="text-xs font-medium text-muted-foreground mb-1">Key Scenes:</h4>
									<ul className="text-sm list-disc list-inside text-muted-foreground ml-2">
										{dramaticMoments.map((moment, idx) => (
											<li key={`moment-${npc.id}-${idx}`}>{moment}</li>
										))}
									</ul>
								</div>
							)}
						</div>
					)
				})}
			</InfoCard>

			<InfoCard
				title="Quest Connections"
				icon={<Icons.GitBranch className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No connected quests"
				className="lg:col-span-2"
			>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<h3 className="text-sm font-medium mb-3 flex items-center">
							<Icons.ArrowRightCircle className="h-4 w-4 mr-2 text-green-500" />
							Leads To
						</h3>

						{precedes.length > 0 ? (
							<div className="space-y-4">
								{precedes.map(({ creativePrompts, description, quest, dependencyType }) => {
									if (!quest) return null
									return (
										<div key={`follows-${quest.id}`} className="border-b pb-3 last:border-0">
											<Link href={`/quests/${quest.slug}`} className="font-medium hover:text-primary">
												{quest.name}
											</Link>
											<BadgeWithTooltip
												variant="outline"
												className="ml-2"
												tooltipContent={
													dependencyType === "prerequisite"
														? "This quest must be completed before the linked quest"
														: "Hidden connection to this quest"
												}
											>
												{dependencyType.replace("_", " ")}
											</BadgeWithTooltip>

											<List
												heading="Description"
												items={description}
												spacing="sm"
												textColor="muted"
												icon={<Icons.Info className="h-4 w-4 mr-2" />}
											/>
											<List
												heading="Creative Prompts"
												items={creativePrompts}
												spacing="sm"
												textColor="muted"
												icon={<Icons.Sparkles className="h-4 w-4 mr-2" />}
											/>
										</div>
									)
								})}
							</div>
						) : (
							<p className="text-muted-foreground text-sm italic">No following quests defined</p>
						)}
					</div>

					<div>
						<h3 className="text-sm font-medium mb-3 flex items-center">
							<Icons.ArrowLeftCircle className="h-4 w-4 mr-2 text-blue-500" />
							Follows From
						</h3>

						{follows.length > 0 ? (
							<div className="space-y-4">
								{follows.map(({ creativePrompts, description, quest, dependencyType }) => {
									return (
										<div key={`precedes-${quest?.id}`} className="border-b pb-3 last:border-0">
											<Link href={`/quests/${quest?.slug}`} className="font-medium hover:text-primary">
												{quest?.name}
											</Link>
											<BadgeWithTooltip
												variant="outline"
												className="ml-2"
												tooltipContent={
													dependencyType === "sequel"
														? "This quest follows the linked quest"
														: dependencyType === "parallel"
															? "This quest runs alongside the linked quest"
															: "Alternative path to the linked quest"
												}
											>
												{dependencyType.replace("_", " ")}
											</BadgeWithTooltip>

											<List
												heading="Description"
												items={description}
												spacing="sm"
												textColor="muted"
												icon={<Icons.Info className="h-4 w-4 mr-2" />}
											/>
											<List
												heading="Creative Prompts"
												items={creativePrompts}
												spacing="sm"
												textColor="muted"
												icon={<Icons.Sparkles className="h-4 w-4 mr-2" />}
											/>
										</div>
									)
								})}
							</div>
						) : (
							<p className="text-muted-foreground text-sm italic">No preceding quests defined</p>
						)}
					</div>
				</div>
			</InfoCard>
		</div>
	)
}
