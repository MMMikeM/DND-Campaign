import { NavLink } from "react-router"
import * as Icons from "lucide-react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Badge } from "~/components/ui/badge"
import { Separator } from "~/components/ui/separator"
import { getQuest } from "~/lib/entities"
import type { Route } from "./+types/$slug"
import { List } from "~/components/ui/list"
import { SimpleCard } from "../factions/components"

// Server-side data fetching
export async function loader({ params }: Route.LoaderArgs) {
	if (!params.slug) {
		throw new Response("No slug provided", { status: 400 })
	}

	const quest = await getQuest(params.slug)

	if (!quest) {
		throw new Response("Quest not found", { status: 404 })
	}

	return quest
}

// Helper function for quest type variant
function getTypeVariant(type: string) {
	switch (type) {
		case "main":
			return "default"
		case "side":
			return "secondary"
		case "faction":
			return "outline"
		case "character":
			return "destructive"
		case "generic":
			return "outline"
		default:
			return "outline"
	}
}

// Helper function for urgency variant
function getUrgencyVariant(urgency: string) {
	switch (urgency) {
		case "critical":
			return "destructive"
		case "urgent":
			return "default"
		case "developing":
			return "secondary"
		case "background":
			return "outline"
		default:
			return "outline"
	}
}

// Helper function for visibility variant
function getVisibilityVariant(visibility: string) {
	switch (visibility) {
		case "featured":
			return "default"
		case "known":
			return "secondary"
		case "rumored":
			return "outline"
		case "hidden":
			return "destructive"
		default:
			return "outline"
	}
}

export default function QuestDetailPage({ loaderData }: Route.ComponentProps) {
	const quest = loaderData

	const {
		creativePrompts,
		description,
		factions,
		failureOutcomes,
		id,
		inspirations,
		items,
		mood,
		name,
		npcs,
		objectives,
		prerequisites,
		region,
		regionId,
		requiredBy,
		requires,
		rewards,
		slug,
		stages,
		successOutcomes,
		themes,
		twists,
		type,
		urgency,
		visibility,
	} = quest

	if (!quest) {
		return (
			<div className="container mx-auto py-12 text-center">
				<h2 className="text-2xl font-bold mb-4">Quest Not Found</h2>
				<p className="mb-6">The requested quest could not be found</p>
				<Button asChild>
					<NavLink to="/quests">
						<Icons.ChevronLeft className="h-4 w-4 mr-2" />
						Back to Quests
					</NavLink>
				</Button>
			</div>
		)
	}

	return (
		<div className="container mx-auto py-6">
			<div className="mb-6">
				<Button variant="outline" size="sm" asChild>
					<NavLink to="/quests" className="flex items-center">
						<Icons.ChevronLeft className="h-4 w-4 mr-2" />
						Back to Quests
					</NavLink>
				</Button>
			</div>

			{/* Quest Header */}
			<div className="mb-6">
				<h1 className="text-3xl font-bold flex items-center">
					<Icons.Scroll className="h-6 w-6 mr-3 text-indigo-500" />
					{name}
				</h1>
				<div className="flex flex-wrap gap-2 mt-2">
					<Badge variant={getTypeVariant(type)} className="flex items-center">
						<Icons.Target className="h-3.5 w-3.5 mr-1" />
						{type}
					</Badge>
					<Badge variant={getUrgencyVariant(urgency)} className="flex items-center">
						<Icons.Clock className="h-3.5 w-3.5 mr-1" />
						{urgency}
					</Badge>
					<Badge variant={getVisibilityVariant(visibility)} className="flex items-center">
						<Icons.Eye className="h-3.5 w-3.5 mr-1" />
						{visibility}
					</Badge>
					{factions && factions.length > 0 && factions[0]?.faction && (
						<NavLink to={`/factions/${factions[0].faction.slug}`}>
							<Badge className="flex items-center cursor-pointer hover:bg-indigo-600">
								<Icons.Flag className="h-3.5 w-3.5 mr-1" />
								{factions[0].faction.name}
							</Badge>
						</NavLink>
					)}
					{region && (
						<NavLink to={`/regions/${region.slug}`}>
							<Badge variant="outline" className="flex items-center cursor-pointer hover:bg-indigo-600">
								<Icons.MapPin className="h-3.5 w-3.5 mr-1" />
								{region.name}
							</Badge>
						</NavLink>
					)}
				</div>
				<p className="mt-4 text-muted-foreground italic">"{mood}"</p>
			</div>

			<Tabs defaultValue="overview" className="mb-10">
				<TabsList className="grid grid-cols-5">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="stages">Stages</TabsTrigger>
					<TabsTrigger value="themes">Themes</TabsTrigger>
					<TabsTrigger value="connections">Connections</TabsTrigger>
					<TabsTrigger value="twists">Twists</TabsTrigger>
				</TabsList>

				{/* Overview Tab */}
				<TabsContent value="overview" className="space-y-6 mt-6">
					{/* Description Card */}
					<SimpleCard title="Description" description="Quest narrative and purpose">
						<List items={description} position="inside" spacing="sm" textColor="muted" />
					</SimpleCard>

					{/* Objectives Card */}
					<SimpleCard title="Objectives" icon={<Icons.Target className="h-5 w-5 mr-2" />}>
						<List items={objectives} position="inside" spacing="sm" textColor="muted" />
					</SimpleCard>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Prerequisites Card */}
						<SimpleCard title="Prerequisites" icon={<Icons.Milestone className="h-5 w-5 mr-2" />}>
							<List items={prerequisites} position="inside" spacing="sm" textColor="muted" />
						</SimpleCard>

						{/* Rewards Card */}
						<SimpleCard title="Rewards" icon={<Icons.Award className="h-5 w-5 mr-2" />}>
							<List items={rewards} position="inside" spacing="sm" textColor="muted" />
						</SimpleCard>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Success Outcomes Card */}
						<SimpleCard
							title="Success Outcomes"
							icon={<Icons.CheckCircle className="h-5 w-5 mr-2 text-green-500" />}
						>
							<List items={successOutcomes} position="inside" spacing="sm" textColor="muted" />
						</SimpleCard>

						{/* Failure Outcomes Card */}
						<SimpleCard
							title="Failure Outcomes"
							icon={<Icons.XCircle className="h-5 w-5 mr-2 text-red-500" />}
						>
							<List items={failureOutcomes} position="inside" spacing="sm" textColor="muted" />
						</SimpleCard>
					</div>

					{/* Items Card */}
					{items && items.length > 0 && (
						<SimpleCard title="Important Items" icon={<Icons.BookOpen className="h-5 w-5 mr-2" />}>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{items.map((item, i) => (
									<div key={`item-${i}`} className="border rounded p-3">
										<h4 className="font-medium">{item.name}</h4>
										<p className="text-sm text-muted-foreground">{item.type}</p>
										<p className="text-xs text-muted-foreground mt-1">{item.significance}</p>
									</div>
								))}
							</div>
						</SimpleCard>
					)}
				</TabsContent>

				{/* Stages Tab */}
				<TabsContent value="stages" className="space-y-6 mt-6">
					{stages && stages.length > 0 ? (
						stages.map((stage) => (
							<Card key={`stage-${stage.id}`} className="mb-8">
								<CardHeader>
									<CardTitle className="flex items-center">
										<Icons.StepForward className="h-5 w-5 mr-2" />
										Stage {stage.stage}: {stage.name}
									</CardTitle>
									<CardDescription>{stage.dramatic_question}</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div>
										<h3 className="text-base font-medium mb-2">Description</h3>
										<List items={stage.description} position="inside" spacing="sm" textColor="muted" />
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
										<div>
											<h3 className="text-base font-medium mb-2">Objectives</h3>
											<List items={stage.objectives} position="inside" textColor="muted" />
										</div>

										<div>
											<h3 className="text-base font-medium mb-2">Completion Paths</h3>
											<List items={stage.completionPaths} position="inside" textColor="muted" />
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
										<div>
											<h3 className="text-base font-medium mb-2">Encounters</h3>
											<List items={stage.encounters} position="inside" textColor="muted" />
										</div>

										<div>
											<h3 className="text-base font-medium mb-2">Dramatic Moments</h3>
											<List items={stage.dramatic_moments} position="inside" textColor="muted" />
										</div>
									</div>

									{/* Decision Points */}
									{stage.outgoingDecisions && stage.outgoingDecisions.length > 0 && (
										<>
											<Separator />
											<div>
												<h3 className="font-medium mb-3 flex items-center">
													<Icons.GitFork className="h-4 w-4 mr-2" />
													Decision Points
												</h3>
												<div className="space-y-4">
													{stage.outgoingDecisions.map((decision: any) => (
														<div
															key={`decision-${decision.id}`}
															className="border rounded-md p-4 bg-muted/50"
														>
															<h4 className="font-medium text-md mb-2">{decision.name}</h4>
															<Badge
																className="mb-3"
																variant={
																	decision.decision_type === "moral_choice" ? "destructive" : "default"
																}
															>
																{decision.decision_type.replace("_", " ")}
															</Badge>

															<p className="text-sm mb-2">
																{decision.conditionType}: {decision.conditionValue}
															</p>

															<div className="mt-3">
																<h5 className="text-sm font-medium mb-1">Description:</h5>
																<List
																	items={decision.description}
																	position="inside"
																	textSize="sm"
																	spacing="xs"
																	textColor="muted"
																	maxItems={2}
																	showMore={true}
																/>
															</div>

															<div className="mt-3">
																<h5 className="text-sm font-medium mb-1">Options:</h5>
																<List items={decision.options} position="inside" textSize="sm" spacing="xs" />
															</div>

															<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
																<div>
																	<h5 className="text-sm font-medium mb-1 flex items-center">
																		<Icons.CheckCircle className="h-3 w-3 mr-1 text-green-500" />
																		Success:
																	</h5>
																	<p className="text-xs text-muted-foreground">
																		{decision.successDescription?.[0]}
																	</p>
																</div>
																<div>
																	<h5 className="text-sm font-medium mb-1 flex items-center">
																		<Icons.XCircle className="h-3 w-3 mr-1 text-red-500" />
																		Failure:
																	</h5>
																	<p className="text-xs text-muted-foreground">
																		{decision.failureDescription?.[0]}
																	</p>
																</div>
															</div>
														</div>
													))}
												</div>
											</div>
										</>
									)}
								</CardContent>
							</Card>
						))
					) : (
						<div className="text-center py-6 text-muted-foreground">
							<p>No stages defined for this quest yet.</p>
						</div>
					)}
				</TabsContent>

				{/* Themes Tab */}
				<TabsContent value="themes" className="space-y-6 mt-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Themes Card */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center">
									<Icons.FilePieChart className="h-5 w-5 mr-2" />
									Themes
								</CardTitle>
								<CardDescription>Core thematic elements of this quest</CardDescription>
							</CardHeader>
							<CardContent>
								<List items={themes} position="inside" spacing="sm" textColor="muted" />
							</CardContent>
						</Card>

						{/* Inspirations Card */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center">
									<Icons.Lightbulb className="h-5 w-5 mr-2" />
									Inspirations
								</CardTitle>
								<CardDescription>Sources of inspiration for this quest</CardDescription>
							</CardHeader>
							<CardContent>
								<List items={inspirations} position="inside" spacing="sm" textColor="muted" />
							</CardContent>
						</Card>
					</div>

					{/* Creative Prompts Card */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<Icons.Brain className="h-5 w-5 mr-2" />
								Creative Prompts
							</CardTitle>
							<CardDescription>Ideas to spark your imagination for this quest</CardDescription>
						</CardHeader>
						<CardContent>
							<List items={creativePrompts} position="inside" spacing="sm" textColor="muted" />
						</CardContent>
					</Card>
				</TabsContent>

				{/* Connections Tab */}
				<TabsContent value="connections" className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<Card>
							<CardHeader>
								<CardTitle className="text-lg flex items-center">
									<Icons.Users className="h-4 w-4 mr-2" />
									NPCs Involved
								</CardTitle>
							</CardHeader>
							<CardContent>
								{npcs && npcs.length > 0 ? (
									<div className="space-y-4">
										{npcs.map((npcConnection) => (
											<div key={`npc-${npcConnection.id}`} className="border rounded-md p-3">
												<div className="flex justify-between">
													<h4 className="font-medium">
														{npcConnection.npc && (
															<NavLink
																to={`/npcs/${npcConnection.npc.slug}`}
																className="hover:text-indigo-500"
															>
																{npcConnection.npc.name}
															</NavLink>
														)}
													</h4>
													<Badge
														variant={
															npcConnection.importance === "critical"
																? "destructive"
																: npcConnection.importance === "major"
																	? "default"
																	: npcConnection.importance === "supporting"
																		? "secondary"
																		: "outline"
														}
													>
														{npcConnection.importance}
													</Badge>
												</div>
												<p className="text-sm text-muted-foreground mt-1">
													<span className="font-medium">Role:</span> {npcConnection.role}
												</p>

												{npcConnection.description && npcConnection.description.length > 0 && (
													<div className="mt-2">
														<p className="text-xs font-medium mb-1">Details:</p>
														<List
															items={npcConnection.description}
															position="inside"
															textSize="xs"
															textColor="muted"
															maxItems={1}
															showMore={true}
														/>
													</div>
												)}

												{npcConnection.hiddenAspects && npcConnection.hiddenAspects.length > 0 && (
													<div className="mt-2">
														<p className="text-xs font-medium text-amber-600 flex items-center">
															<Icons.Lock className="h-3 w-3 mr-1" />
															Hidden aspects:
														</p>
														<List
															items={npcConnection.hiddenAspects}
															position="inside"
															textSize="xs"
															textColor="muted"
															maxItems={1}
															showMore={true}
														/>
													</div>
												)}
											</div>
										))}
									</div>
								) : (
									<p className="text-muted-foreground">No NPCs associated with this quest.</p>
								)}
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-lg flex items-center">
									<Icons.Flag className="h-4 w-4 mr-2" />
									Factions Involved
								</CardTitle>
							</CardHeader>
							<CardContent>
								{factions && factions.length > 0 ? (
									<div className="space-y-4">
										{factions.map((factionConnection) => (
											<div key={`faction-${factionConnection.id}`} className="border rounded-md p-3">
												<div className="flex justify-between">
													<h4 className="font-medium">
														{factionConnection.faction && (
															<NavLink
																to={`/factions/${factionConnection.faction.slug}`}
																className="hover:text-indigo-500"
															>
																{factionConnection.faction.name}
															</NavLink>
														)}
													</h4>
												</div>
												<p className="text-sm text-muted-foreground mt-1">
													<span className="font-medium">Role:</span> {factionConnection.role}
												</p>

												{factionConnection.interest && factionConnection.interest.length > 0 && (
													<div className="mt-2">
														<p className="text-xs font-medium mb-1">Interest:</p>
														<List
															items={factionConnection.interest}
															position="inside"
															textSize="xs"
															textColor="muted"
														/>
													</div>
												)}
											</div>
										))}
									</div>
								) : (
									<p className="text-muted-foreground">No factions associated with this quest.</p>
								)}
							</CardContent>
						</Card>
					</div>

					<Card>
						<CardHeader>
							<CardTitle className="text-lg flex items-center">
								<Icons.Link className="h-4 w-4 mr-2" />
								Related Quests
							</CardTitle>
						</CardHeader>
						<CardContent>
							{factions && factions.length > 0 ? (
								<div className="space-y-4">
									{factions.map((relation: any) => (
										<div key={`relation-${relation.id}`} className="border rounded-md p-3">
											<div className="flex justify-between">
												<h4 className="font-medium">
													{relation.relatedQuest && (
														<NavLink
															to={`/quests/${relation.relatedQuest.slug}`}
															className="hover:text-indigo-500"
														>
															{relation.relatedQuest.name}
														</NavLink>
													)}
												</h4>
												<Badge>{relation.relationType}</Badge>
											</div>

											{relation.description && relation.description.length > 0 && (
												<div className="mt-2">
													<p className="text-xs font-medium mb-1">Connection:</p>
													<List
														items={relation.description}
														position="inside"
														textSize="xs"
														textColor="muted"
														maxItems={2}
														showMore={true}
													/>
												</div>
											)}

											{relation.prerequisites && relation.prerequisites.length > 0 && (
												<div className="mt-2 pt-2 border-t">
													<p className="text-xs font-medium text-amber-600 flex items-center">
														<Icons.ListChecks className="h-3 w-3 mr-1" />
														Prerequisites:
													</p>
													<List
														items={relation.prerequisites.map(
															(prereq: any) => `${prereq.prerequisiteType}: ${prereq.unlockCondition}`,
														)}
														position="inside"
														textSize="xs"
														textColor="muted"
													/>
												</div>
											)}
										</div>
									))}
								</div>
							) : (
								<p className="text-muted-foreground">No related quests.</p>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* Twists Tab */}
				<TabsContent value="twists" className="space-y-6 mt-6">
					{twists && twists.length > 0 ? (
						<div className="space-y-6">
							{twists.map((twist) => (
								<Card key={`twist-${twist.id}`}>
									<CardHeader>
										<div className="flex justify-between items-center">
											<CardTitle className="flex items-center">
												<Icons.TrendingUp className="h-5 w-5 mr-2" />
												{twist.twist_type} ({twist.impact} impact)
											</CardTitle>
											<Badge
												variant={
													twist.impact === "major"
														? "destructive"
														: twist.impact === "moderate"
															? "default"
															: "secondary"
												}
											>
												{twist.narrative_placement}
											</Badge>
										</div>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											<div>
												<h3 className="text-base font-medium mb-2">Description</h3>
												<List items={twist.description} position="inside" spacing="sm" textColor="muted" />
											</div>

											<div>
												<h3 className="text-base font-medium mb-2">Creative Prompts</h3>
												<List
													items={twist.creativePrompts}
													position="inside"
													spacing="sm"
													textColor="muted"
												/>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					) : (
						<div className="text-center py-6 text-muted-foreground">
							<p>No twists defined for this quest yet.</p>
						</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	)
}
