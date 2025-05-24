import * as Icons from "lucide-react"
import { useState } from "react"
import { NavLink } from "react-router"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { InfoCard } from "~/components/InfoCard"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { getAllQuests } from "~/lib/entities"
import type { Route } from "./+types/index"
import { getTypeVariant, getUrgencyVariant } from "./utils"

export async function loader({ params }: Route.LoaderArgs) {
	const quests = await getAllQuests()
	if (!quests) {
		throw new Response("No quests found", { status: 404 })
	}
	return quests
}

export default function QuestsIndexPage({ loaderData }: Route.ComponentProps) {
	const [searchTerm, setSearchTerm] = useState("")
	const quests = loaderData

	const filteredQuests = quests.filter(
		(quest) =>
			quest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			quest.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
			quest.mood?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			quest.description?.some((desc) => desc.toLowerCase().includes(searchTerm.toLowerCase())) ||
			quest.objectives?.some((obj) => obj.toLowerCase().includes(searchTerm.toLowerCase())) ||
			false,
	)

	return (
		<div className="container mx-auto py-6">
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-3xl font-bold">Quests</h1>
					<p className="text-muted-foreground">Manage and track adventures in your campaign</p>
				</div>
				<Button>
					<NavLink to="/quests/new" className="flex items-center">
						<span className="mr-2">New Quest</span>
						<Icons.Scroll className="h-4 w-4" />
					</NavLink>
				</Button>
			</div>

			<div className="mb-6">
				<div className="relative">
					<Icons.Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search quests..."
						className="pl-8"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{filteredQuests.map((quest) => {
					const {
						name,
						type,
						urgency,
						visibility,
						mood,
						description,
						objectives,
						rewards,
						themes,
						inspirations,
						successOutcomes,
						failureOutcomes,
						creativePrompts,
						slug,
					} = quest

					return (
						<NavLink key={quest.id} to={`/quests/${slug}`}>
							<InfoCard
								title={name}
								icon={<Icons.Scroll className="h-4 w-4" />}
								className="h-full hover:shadow-md transition-shadow"
							>
								<div className="flex justify-between items-start mb-2">
									<div className="flex gap-2">
										<BadgeWithTooltip
											variant={getTypeVariant(type)}
											className="capitalize"
											tooltipContent={
												type === "main"
													? "Primary campaign quest"
													: type === "faction"
														? "Related to faction goals"
														: type === "character"
															? "Focused on character development"
															: type === "side"
																? "Optional adventure"
																: "General quest task"
											}
										>
											{type}
										</BadgeWithTooltip>
										<BadgeWithTooltip
											variant={getUrgencyVariant(urgency)}
											className="capitalize"
											tooltipContent={
												urgency === "critical"
													? "Requires immediate attention"
													: urgency === "urgent"
														? "Should be addressed soon"
														: urgency === "developing"
															? "Situation is evolving"
															: "Long-term background plot"
											}
										>
											<Icons.Clock className="h-3 w-3 mr-1" />
											{urgency}
										</BadgeWithTooltip>
										<BadgeWithTooltip
											variant="outline"
											className="capitalize"
											tooltipContent={
												visibility === "hidden"
													? "Not yet discovered by players"
													: visibility === "rumored"
														? "Hints circulating in the world"
														: visibility === "known"
															? "Actively available to players"
															: "Currently in spotlight"
											}
										>
											<Icons.EyeIcon className="h-3 w-3 mr-1" />
											{visibility}
										</BadgeWithTooltip>
									</div>
								</div>

								<p className="text-sm mb-3">{description?.[0]}</p>
								<div className="space-y-3">
									<div>
										<h4 className="text-xs font-medium text-muted-foreground mb-1 flex items-center">
											<Icons.BookIcon className="h-3 w-3 mr-1" />
											Objectives
										</h4>
										<ul className="text-sm list-disc list-inside">
											{objectives?.slice(0, 2).map((objective: string, index: number) => (
												<li key={`objective-${quest.id}-${index}`} className="truncate">
													{objective}
												</li>
											))}
											{objectives?.length > 2 && (
												<li className="text-muted-foreground text-xs">+ {objectives.length - 2} more</li>
											)}
										</ul>
									</div>
									{rewards?.length > 0 && (
										<div>
											<h4 className="text-xs font-medium text-muted-foreground mb-1 flex items-center">
												<Icons.BarChart className="h-3 w-3 mr-1" />
												Rewards
											</h4>
											<ul className="text-sm list-disc list-inside">
												{rewards.slice(0, 1).map((reward: string, index: number) => (
													<li key={`reward-${quest.id}-${index}`} className="truncate">
														{reward}
													</li>
												))}
												{rewards.length > 1 && (
													<li className="text-muted-foreground text-xs">+ {rewards.length - 1} more</li>
												)}
											</ul>
										</div>
									)}
								</div>

								<div className="mt-4 pt-3 border-t flex flex-col gap-2">
									<div className="text-xs text-muted-foreground flex items-center gap-2">
										<span className="font-medium">Mood:</span> {mood}
										{themes?.length > 0 && (
											<>
												<span>•</span>
												<span>{themes.length} themes</span>
											</>
										)}
									</div>
									<div className="text-xs text-muted-foreground">
										<span>{successOutcomes?.length || 0} success outcomes</span>
										<span className="mx-1">•</span>
										<span>{failureOutcomes?.length || 0} failure outcomes</span>
									</div>
								</div>
							</InfoCard>
						</NavLink>
					)
				})}
			</div>

			{filteredQuests.length === 0 && (
				<div className="text-center py-12">
					<Icons.Scroll className="mx-auto h-12 w-12 text-muted-foreground" />
					<h3 className="mt-2 text-lg font-medium">No quests found</h3>
					<p className="mt-1 text-muted-foreground">Try adjusting your search term</p>
				</div>
			)}
		</div>
	)
}
