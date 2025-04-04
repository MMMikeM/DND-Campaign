import { NavLink, useNavigate, useParams } from "react-router"
import * as Icons from "lucide-react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { List } from "~/components/List"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import type { Route } from "./+types/$locationSlug"
import { getLocation } from "~/lib/entities"

// Server-side data fetching
export async function loader({ params }: Route.LoaderArgs) {
	if (!params.locationSlug || !params.regionSlug) {
		throw new Response("Missing slug parameters", { status: 400 })
	}

	const location = await getLocation(params.locationSlug)
	if (!location) {
		throw new Response("Location not found", { status: 404 })
	}

	return location
}

export default function LocationDetailPage({ loaderData }: Route.ComponentProps) {
	// Properly type the loaderData
	const location = loaderData
	const { tab } = useParams()
	const navigate = useNavigate()
	const activeTab = tab || "overview"

	if (!location) {
		return (
			<div className="container mx-auto py-12 text-center">
				<h2 className="text-2xl font-bold mb-4">Location Not Found</h2>
				<p className="mb-6">The requested location could not be found</p>
				<Button asChild>
					<NavLink to="/regions">
						<Icons.ChevronLeft className="h-4 w-4 mr-2" />
						Back to Regions
					</NavLink>
				</Button>
			</div>
		)
	}

	const {
		id,
		name,
		locationType,
		terrain,
		climate,
		mood,
		environment,
		creativePrompts,
		creatures,
		description,
		features,
		treasures,
		lightingDescription,
		soundscape,
		smells,
		weather,
		descriptors,
		encounters,
		secrets,
		npcs,
		items,
		region,
		regionId,
		relations,
		slug,
	} = location

	const handleTabChange = (value: string) => {
		// Navigate to the appropriate tab
		navigate(`/regions/${region?.slug}/locations/${location.slug}/${value === "overview" ? "" : value}`)
	}

	return (
		<div className="container mx-auto py-4">
			<div className="mb-4">
				<Button variant="outline" size="sm" asChild>
					<NavLink to={`/regions/${region?.slug}`} className="flex items-center">
						<Icons.ChevronLeft className="h-4 w-4 mr-2" />
						Back to {region?.name || "Region"}
					</NavLink>
				</Button>
			</div>
			WTEFETERSORSIT
			{/* Location Header - Compact */}
			<div className="mb-4">
				<h1 className="text-2xl font-bold flex items-center">
					<Icons.MapPin className="h-5 w-5 mr-2 text-indigo-500" />
					{name}
				</h1>
				<div className="flex flex-wrap gap-1.5 mt-1.5">
					<BadgeWithTooltip variant="outline" className="flex items-center" tooltipContent="Location type">
						<Icons.Building2 className="h-3 w-3 mr-1" />
						{locationType}
					</BadgeWithTooltip>
					<BadgeWithTooltip variant="outline" className="flex items-center" tooltipContent="Terrain type">
						<Icons.Mountain className="h-3 w-3 mr-1" />
						{terrain}
					</BadgeWithTooltip>
					<BadgeWithTooltip variant="outline" className="flex items-center" tooltipContent="Climate">
						<Icons.Cloud className="h-3 w-3 mr-1" />
						{climate}
					</BadgeWithTooltip>
					<BadgeWithTooltip variant="outline" className="flex items-center" tooltipContent="Environment">
						<Icons.Trees className="h-3 w-3 mr-1" />
						{environment}
					</BadgeWithTooltip>
					<BadgeWithTooltip variant="outline" className="flex items-center" tooltipContent="Mood">
						<Icons.Palette className="h-3 w-3 mr-1" />
						{mood}
					</BadgeWithTooltip>
				</div>
			</div>
			<div className="mb-4">
				<div className="flex flex-wrap gap-1.5">
					{descriptors.map((descriptor: string) => (
						<BadgeWithTooltip key={`descriptor-${descriptor}`} variant="outline" tooltipContent={descriptor}>
							{descriptor}
						</BadgeWithTooltip>
					))}
				</div>
			</div>
			<Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
				<TabsList className="grid w-full grid-cols-5 mb-4">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="sensory">Sensory Details</TabsTrigger>
					<TabsTrigger value="connections">Connections</TabsTrigger>
					<TabsTrigger value="encounters">Encounters</TabsTrigger>
					<TabsTrigger value="secrets">Secrets</TabsTrigger>
				</TabsList>

				<TabsContent value="overview">
					{/* Overview Tab - Updated with colored icons and consistent styling */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
						<div className="p-6 bg-white rounded-lg border shadow-sm lg:col-span-2">
							<h3 className="text-base font-semibold flex items-center mb-4">
								<Icons.FileText className="h-4 w-4 mr-2 text-blue-600" />
								Description
							</h3>
							<List
								items={description}
								position="outside"
								spacing="sm"
								textColor="muted"
								icon={<Icons.Info className="h-4 w-4 mr-2" />}
							/>
						</div>

						<div className="p-6 bg-white rounded-lg border shadow-sm">
							<h3 className="text-base font-semibold flex items-center mb-4">
								<Icons.ListFilter className="h-4 w-4 mr-2 text-indigo-600" />
								Details
							</h3>
							<div className="space-y-1">
								<div className="flex items-center justify-between">
									<span className="font-medium">Type:</span>
									<span>{locationType}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="font-medium">Terrain:</span>
									<span>{terrain}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="font-medium">Climate:</span>
									<span>{climate}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="font-medium">Environment:</span>
									<span>{environment}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="font-medium">Mood:</span>
									<span>{mood}</span>
								</div>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
						<div className="p-6 bg-white rounded-lg border shadow-sm">
							<h3 className="text-base font-semibold flex items-center mb-4">
								<Icons.Landmark className="h-4 w-4 mr-2 text-purple-600" />
								Features
							</h3>
							<List
								items={features}
								position="outside"
								spacing="sm"
								textColor="muted"
								icon={<Icons.LayoutList className="h-4 w-4 mr-2" />}
							/>
						</div>

						<div className="p-6 bg-white rounded-lg border shadow-sm">
							<h3 className="text-base font-semibold flex items-center mb-4">
								<Icons.Skull className="h-4 w-4 mr-2 text-red-600" />
								Creatures
							</h3>
							<List
								items={creatures}
								position="outside"
								spacing="sm"
								textColor="muted"
								icon={<Icons.Skull className="h-4 w-4 mr-2" />}
							/>
						</div>

						<div className="p-6 bg-white rounded-lg border shadow-sm">
							<h3 className="text-base font-semibold flex items-center mb-4">
								<Icons.Gem className="h-4 w-4 mr-2 text-amber-500" />
								Treasures
							</h3>
							<List
								items={treasures}
								position="outside"
								spacing="sm"
								textColor="muted"
								icon={<Icons.Gem className="h-4 w-4 mr-2" />}
							/>
						</div>

						<div className="p-6 bg-white rounded-lg border shadow-sm lg:col-span-3">
							<h3 className="text-base font-semibold flex items-center mb-4">
								<Icons.Lightbulb className="h-4 w-4 mr-2 text-emerald-500" />
								Creative Prompts
							</h3>
							<List items={creativePrompts} position="outside" spacing="sm" emptyText="No creative prompts available" />
						</div>
					</div>
				</TabsContent>

				<TabsContent value="sensory">
					{/* Sensory Details Tab - Redesigned to match example */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Lighting */}
						<div className="p-6 bg-white rounded-lg border shadow-sm">
							<h3 className="text-base font-semibold flex items-center mb-4">
								<Icons.Sun className="h-4 w-4 mr-2 text-amber-500" />
								Lighting
							</h3>
							<List
								items={lightingDescription}
								position="outside"
								spacing="sm"
								emptyText="No lighting details available"
							/>
						</div>

						{/* Sounds */}
						<div className="p-6 bg-white rounded-lg border shadow-sm">
							<h3 className="text-base font-semibold flex items-center mb-4">
								<Icons.Music className="h-4 w-4 mr-2 text-indigo-500" />
								Sounds
							</h3>
							<List items={soundscape} position="outside" spacing="sm" emptyText="No sound details available" />
						</div>

						{/* Smells */}
						<div className="p-6 bg-white rounded-lg border shadow-sm">
							<h3 className="text-base font-semibold flex items-center mb-4">
								<Icons.Wind className="h-4 w-4 mr-2 text-emerald-500" />
								Smells
							</h3>
							<List items={smells} position="outside" spacing="sm" emptyText="No smell details available" />
						</div>

						{/* Weather */}
						<div className="p-6 bg-white rounded-lg border shadow-sm">
							<h3 className="text-base font-semibold flex items-center mb-4">
								<Icons.Cloud className="h-4 w-4 mr-2 text-blue-500" />
								Weather
							</h3>
							<List items={weather} position="outside" spacing="sm" emptyText="No weather details available" />
						</div>
					</div>
				</TabsContent>

				<TabsContent value="connections">
					{/* Connections Tab - More efficient multi-column layout */}
					<div className="grid grid-cols-1 gap-4">
						{/* NPCs */}
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-lg flex items-center">
									<Icons.Users className="h-4 w-4 mr-2 text-purple-500" />
									NPCs at This Location
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-0">
								{npcs && npcs.length > 0 ? (
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
										{npcs.map((npcLocation) => (
											<div key={`npc-${npcLocation.id}`} className="border rounded p-3">
												<h4 className="font-medium flex items-center text-sm">
													<Icons.User className="h-3.5 w-3.5 mr-1.5 text-indigo-500" />
													{npcLocation.npc.name}
												</h4>
												<div className="mt-2">
													<List
														items={npcLocation.description}
														position="outside"
														spacing="sm"
														emptyText="No description available"
													/>
												</div>
												{npcLocation.npc.slug && (
													<div className="mt-2 text-right">
														<Button variant="link" size="sm" asChild className="h-auto py-0 px-0">
															<NavLink to={`/npcs/${npcLocation.npc.slug}`}>
																View NPC
																<Icons.ChevronRight className="h-3 w-3 ml-1" />
															</NavLink>
														</Button>
													</div>
												)}
											</div>
										))}
									</div>
								) : (
									<p className="text-muted-foreground">No NPCs associated with this location</p>
								)}
							</CardContent>
						</Card>

						{/* Items */}
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-lg flex items-center">
									<Icons.Package className="h-4 w-4 mr-2 text-orange-500" />
									Items at This Location
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-0">
								{items && items.length > 0 ? (
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
										{items.map((item) => (
											<div key={`item-${item.id}`} className="border rounded p-3">
												<div className="flex justify-between items-start">
													<h4 className="font-medium flex items-center text-sm">
														<Icons.Package className="h-3.5 w-3.5 mr-1.5 text-indigo-500" />
														{item.name}
													</h4>
													<BadgeWithTooltip
														variant="outline"
														tooltipContent="Item type"
														className="text-xs py-0 px-1.5"
													>
														{item.type}
													</BadgeWithTooltip>
												</div>
												<div className="mt-2">
													<List
														items={item.description}
														position="outside"
														spacing="sm"
														emptyText="No description available"
													/>
												</div>
												<div className="mt-1 text-xs text-muted-foreground">
													<span className="font-medium">Significance:</span> {item.significance}
												</div>
											</div>
										))}
									</div>
								) : (
									<p className="text-muted-foreground">No items associated with this location</p>
								)}
							</CardContent>
						</Card>

						{/* Related Locations */}
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-lg flex items-center">
									<Icons.Map className="h-4 w-4 mr-2 text-green-500" />
									Related Locations
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-0">
								{relations && relations.length > 0 ? (
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
										{relations.map((relation) => (
											<div key={`relation-${relation.id}`} className="border rounded p-3">
												<h4 className="font-medium flex items-center text-sm">
													<Icons.Link className="h-3.5 w-3.5 mr-1.5 text-indigo-500" />
													{relation.location?.name}
													<span className="ml-1.5 text-xs text-muted-foreground">({relation.relationType})</span>
												</h4>
												{relation.description && (
													<div className="mt-2">
														<List
															items={relation.description}
															position="outside"
															spacing="sm"
															emptyText="No description available"
														/>
													</div>
												)}
												{relation.location?.slug && (
													<div className="mt-2 text-right">
														<Button variant="link" size="sm" asChild className="h-auto py-0 px-0">
															<NavLink to={`/regions/${region?.slug}/locations/${relation.location?.slug}`}>
																View Location
																<Icons.ChevronRight className="h-3 w-3 ml-1" />
															</NavLink>
														</Button>
													</div>
												)}
											</div>
										))}
									</div>
								) : (
									<p className="text-muted-foreground">No related locations</p>
								)}
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="encounters">
					{/* Encounters Tab - More efficient layout */}
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-lg flex items-center">
								<Icons.Swords className="h-4 w-4 mr-2 text-red-500" />
								Potential Encounters
							</CardTitle>
						</CardHeader>
						<CardContent className="pt-0">
							{encounters && encounters.length > 0 ? (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									{encounters.map((encounter) => (
										<div key={`encounter-${encounter.id}`} className="border rounded p-3">
											<h4 className="font-medium flex items-center text-sm">
												<Icons.AlertCircle className="h-3.5 w-3.5 mr-1.5 text-indigo-500" />
												{encounter.name}
											</h4>
											<div className="flex flex-wrap gap-1.5 mt-1">
												<BadgeWithTooltip
													variant="outline"
													tooltipContent="Encounter type"
													className="text-xs py-0 px-1.5"
												>
													{encounter.encounterType}
												</BadgeWithTooltip>
												<BadgeWithTooltip
													variant="outline"
													tooltipContent="Difficulty level"
													className="text-xs py-0 px-1.5"
												>
													{encounter.difficulty}
												</BadgeWithTooltip>
												<BadgeWithTooltip
													variant="outline"
													tooltipContent="Danger level"
													className="text-xs py-0 px-1.5"
												>
													{encounter.dangerLevel}
												</BadgeWithTooltip>
											</div>
											<div className="mt-2">
												<List
													items={encounter.description}
													position="outside"
													spacing="sm"
													emptyText="No description available"
												/>
											</div>
											<div className="mt-2 grid grid-cols-2 gap-3">
												<div className="border-t pt-1">
													<h5 className="text-xs font-medium">Creatures:</h5>
													<List
														items={encounter.creatures}
														position="outside"
														spacing="sm"
														emptyText="None"
														className="text-xs leading-tight"
													/>
												</div>
												<div className="border-t pt-1">
													<h5 className="text-xs font-medium">Treasure:</h5>
													<List
														items={encounter.treasure}
														position="outside"
														spacing="sm"
														emptyText="None"
														className="text-xs leading-tight"
													/>
												</div>
											</div>
										</div>
									))}
								</div>
							) : (
								<p className="text-muted-foreground">No encounters defined for this location</p>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="secrets">
					{/* Secrets Tab - More efficient layout */}
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-lg flex items-center">
								<Icons.Lock className="h-4 w-4 mr-2 text-amber-600" />
								Location Secrets
							</CardTitle>
						</CardHeader>
						<CardContent className="pt-0">
							{secrets && secrets.length > 0 ? (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									{secrets.map((secret) => (
										<div key={`secret-${secret.id}`} className="border rounded p-3">
											<div className="flex justify-between items-start">
												<h4 className="font-medium flex items-center text-sm">
													<Icons.Lock className="h-3.5 w-3.5 mr-1.5 text-indigo-500" />
													{secret.secretType} Secret
												</h4>
												<BadgeWithTooltip
													variant="outline"
													tooltipContent="How difficult to discover"
													className="text-xs py-0 px-1.5"
												>
													{secret.difficultyToDiscover}
												</BadgeWithTooltip>
											</div>
											<div className="mt-2 grid grid-cols-1 gap-2">
												<div>
													<h5 className="text-xs font-medium">Description:</h5>
													<List
														items={secret.description}
														position="outside"
														spacing="sm"
														emptyText="None"
														className="text-sm"
													/>
												</div>
												<div className="grid grid-cols-2 gap-3">
													<div className="border-t pt-1">
														<h5 className="text-xs font-medium">Discovery Method:</h5>
														<List
															items={secret.discoveryMethod}
															position="outside"
															spacing="sm"
															emptyText="None"
															className="text-xs leading-tight"
														/>
													</div>
													<div className="border-t pt-1">
														<h5 className="text-xs font-medium">Consequences:</h5>
														<List
															items={secret.consequences}
															position="outside"
															spacing="sm"
															emptyText="None"
															className="text-xs leading-tight"
														/>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							) : (
								<p className="text-muted-foreground">No secrets defined for this location</p>
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
