import { NavLink, useParams, useNavigate } from "react-router"
import * as Icons from "lucide-react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { Separator } from "~/components/ui/separator"
import { getNpc } from "~/lib/entities"
import type { Route } from "./+types/$slug"
import { List } from "~/components/List"
import { Link } from "~/components/ui/link"
import SimpleCard from "~/components/SimpleCard"

export async function loader({ params }: Route.LoaderArgs) {
	if (!params.slug) {
		throw new Response("No slug provided", { status: 400 })
	}

	const npc = await getNpc(params.slug)
	if (!npc) {
		throw new Response("NPC not found", { status: 404 })
	}

	return npc
}

const getTrustVariant = (trust: string): "default" | "destructive" | "outline" | "secondary" => {
	switch (trust) {
		case "high":
			return "default"
		case "medium":
			return "default"
		case "low":
			return "secondary"
		case "none":
			return "destructive"
		default:
			return "outline"
	}
}

const getAdaptabilityVariant = (adaptability: string): "default" | "destructive" | "outline" | "secondary" => {
	switch (adaptability) {
		case "opportunistic":
			return "default"
		case "flexible":
			return "default"
		case "reluctant":
			return "secondary"
		case "rigid":
			return "destructive"
		default:
			return "outline"
	}
}

export default function NpcDetailPage({ loaderData }: Route.ComponentProps) {
	const npc = loaderData
	const { tab } = useParams()
	const activeTab = tab || "overview"
	const navigate = useNavigate()

	const {
		adaptability,
		age,
		alignment,
		appearance,
		attitude,
		avoidTopics,
		background,
		biases,
		dialogue,
		disposition,
		drives,
		fears,
		gender,
		id,
		knowledge,
		mannerisms,
		name,
		occupation,
		personalityTraits,
		preferredTopics,
		quirk,
		race,
		relatedClues,
		relatedFactions,
		relatedItems,
		relatedLocations,
		relatedQuestHooks,
		relatedQuests,
		rumours,
		secrets,
		slug,
		socialStatus,
		trustLevel,
		wealth,
		relations,
		voiceNotes,
	} = npc

	const handleTabChange = (value: string) => {
		navigate(`/npcs/${slug}/${value === "overview" ? "" : value}`)
	}

	if (!npc) {
		return (
			<div className="container mx-auto py-12 text-center">
				<h2 className="text-2xl font-bold mb-4">NPC Not Found</h2>
				<p className="mb-6">The requested NPC could not be found</p>
				<Button asChild>
					<NavLink to="/npcs">
						<Icons.ChevronLeft className="h-4 w-4 mr-2" />
						Back to NPCs
					</NavLink>
				</Button>
			</div>
		)
	}

	return (
		<div className="container mx-auto py-6">
			<div className="mb-6">
				<Button variant="outline" size="sm" asChild>
					<NavLink to="/npcs" className="flex items-center">
						<Icons.ChevronLeft className="h-4 w-4 mr-2" />
						Back to NPCs
					</NavLink>
				</Button>
			</div>

			<div className="mb-6">
				<h1 className="text-3xl font-bold flex items-center">
					<Icons.UserCircle className="h-6 w-6 mr-3 text-indigo-500" />
					{name}
				</h1>
				<div className="flex flex-wrap gap-2 mt-2">
					<BadgeWithTooltip variant="outline" className="flex items-center" tooltipContent="Character species">
						<Icons.BadgeInfo className="h-3.5 w-3.5 mr-1" />
						{race}
					</BadgeWithTooltip>
					<BadgeWithTooltip variant="outline" className="flex items-center" tooltipContent="Character's stage of life">
						<Icons.ScrollText className="h-3.5 w-3.5 mr-1" />
						{age}
					</BadgeWithTooltip>
					<BadgeWithTooltip
						variant="outline"
						className="flex items-center"
						tooltipContent="General attitude toward others"
					>
						<Icons.Smile className="h-3.5 w-3.5 mr-1" />
						{disposition}
					</BadgeWithTooltip>
					<BadgeWithTooltip
						variant="outline"
						className="flex items-center"
						tooltipContent="Economic standing and available resources"
					>
						<Icons.Building className="h-3.5 w-3.5 mr-1" />
						{wealth}
					</BadgeWithTooltip>
					<BadgeWithTooltip variant="outline" className="flex items-center" tooltipContent="Character identity">
						<Icons.Users className="h-3.5 w-3.5 mr-1" />
						{gender}
					</BadgeWithTooltip>
					<BadgeWithTooltip
						variant={getTrustVariant(trustLevel)}
						className="flex items-center"
						tooltipContent="How readily this character trusts others"
					>
						<Icons.UserCheck className="h-3.5 w-3.5 mr-1" />
						{trustLevel} trust
					</BadgeWithTooltip>
					<BadgeWithTooltip
						variant={getAdaptabilityVariant(adaptability)}
						className="flex items-center"
						tooltipContent="Flexibility in response to changing situations"
					>
						<Icons.Sparkles className="h-3.5 w-3.5 mr-1" />
						{adaptability}
					</BadgeWithTooltip>
					<BadgeWithTooltip variant="outline" className="flex items-center" tooltipContent="Role in society">
						<Icons.Briefcase className="h-3.5 w-3.5 mr-1" />
						{occupation}
					</BadgeWithTooltip>
				</div>
			</div>

			<Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
				<TabsList className="grid grid-cols-5 mb-6">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="personality">Personality</TabsTrigger>
					<TabsTrigger value="social">Social</TabsTrigger>
					<TabsTrigger value="knowledge">Knowledge</TabsTrigger>
					<TabsTrigger value="connections">Connections</TabsTrigger>
				</TabsList>

				<TabsContent value="overview">
					<Card className="mb-6">
						<CardHeader>
							<CardTitle className="text-xl">Overview</CardTitle>
							<CardDescription>Essential information about {name}</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div>
									<h3 className="font-medium mb-2 flex items-center">
										<Icons.BookOpen className="h-4 w-4 mr-2 text-blue-600" />
										Background
									</h3>
									<List items={background} spacing="sm" textColor="muted" />
								</div>

								<Separator />

								<div>
									<h3 className="font-medium mb-2 flex items-center">
										<Icons.UserCircle className="h-4 w-4 mr-2 text-indigo-600" />
										Appearance
									</h3>
									<List items={appearance} spacing="sm" textColor="muted" />
								</div>

								<Separator />

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<h3 className="font-medium mb-2 flex items-center">
											<Icons.Heart className="h-4 w-4 mr-2 text-red-500" />
											Alignment
										</h3>
										<p className="text-muted-foreground">{alignment}</p>
									</div>
									<div>
										<h3 className="font-medium mb-2 flex items-center">
											<Icons.Smile className="h-4 w-4 mr-2 text-amber-500" />
											Attitude
										</h3>
										<p className="text-muted-foreground">{attitude}</p>
									</div>
								</div>

								<Separator />

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<h3 className="font-medium mb-2 flex items-center">
											<Icons.Briefcase className="h-4 w-4 mr-2 text-emerald-600" />
											Occupation
										</h3>
										<p className="text-muted-foreground">{occupation}</p>
									</div>
									<div>
										<h3 className="font-medium mb-2 flex items-center">
											<Icons.Users className="h-4 w-4 mr-2 text-purple-600" />
											Social Status
										</h3>
										<p className="text-muted-foreground">{socialStatus}</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<SimpleCard
						title="Notable Feature"
						icon={<Icons.Sparkles className="h-4 w-4 mr-2 text-amber-500" />}
					>
						<div className="p-4 bg-muted rounded-md">
							<p className="text-lg italic">{quirk}</p>
						</div>
					</SimpleCard>
				</TabsContent>

				<TabsContent value="personality">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
						<SimpleCard title="Personality Traits" icon={<Icons.UserCircle className="h-4 w-4 mr-2 text-indigo-600" />}>
							<List items={personalityTraits} spacing="sm" />
						</SimpleCard>

						<SimpleCard title="Biases" icon={<Icons.AlertTriangle className="h-4 w-4 mr-2 text-amber-600" />}>
							<List items={biases} spacing="sm" />
						</SimpleCard>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
						<SimpleCard title="Drives" icon={<Icons.Brain className="h-4 w-4 mr-2 text-purple-600" />}>
							<List items={drives} spacing="sm" />
						</SimpleCard>

						<SimpleCard title="Fears" icon={<Icons.AlertTriangle className="h-4 w-4 mr-2 text-red-500" />}>
							<List items={fears} spacing="sm" />
						</SimpleCard>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<SimpleCard title="Mannerisms" icon={<Icons.MessageCircle className="h-4 w-4 mr-2 text-blue-600" />}>
							<List items={mannerisms} spacing="sm" />
						</SimpleCard>

						<SimpleCard title="Voice Notes" icon={<Icons.MessageCircle className="h-4 w-4 mr-2 text-emerald-600" />}>
							<List items={voiceNotes} spacing="sm" />
						</SimpleCard>
					</div>
				</TabsContent>

				<TabsContent value="social">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
						<SimpleCard
							title="Dialogue Examples"
							icon={<Icons.MessageCircle className="h-4 w-4 mr-2 text-indigo-600" />}
						>
							<List items={dialogue} spacing="sm" className="italic" />
						</SimpleCard>

						<SimpleCard title="Rumors & Gossip" icon={<Icons.MessageCircle className="h-4 w-4 mr-2 text-purple-600" />}>
							<List items={rumours} spacing="sm" />
						</SimpleCard>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<SimpleCard title="Preferred Topics" icon={<Icons.MessageCircle className="h-4 w-4 mr-2 text-green-600" />}>
							<List items={preferredTopics} spacing="sm" />
						</SimpleCard>

						<SimpleCard title="Avoided Topics" icon={<Icons.MessageCircle className="h-4 w-4 mr-2 text-red-600" />}>
							<List items={avoidTopics} spacing="sm" />
						</SimpleCard>
					</div>
				</TabsContent>

				<TabsContent value="knowledge">
					<div className="grid grid-cols-1 gap-6 mb-6">
						<SimpleCard title="Knowledge" icon={<Icons.BookOpen className="h-4 w-4 mr-2 text-blue-600" />}>
							<List items={knowledge} spacing="sm" />
						</SimpleCard>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<SimpleCard title="Secrets" icon={<Icons.LockKeyhole className="h-4 w-4 mr-2 text-red-600" />}>
							<List items={secrets} spacing="sm" />
						</SimpleCard>
					</div>
				</TabsContent>

				<TabsContent value="connections">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
						<SimpleCard
							title="Relationships"
							icon={<Icons.Network className="h-4 w-4 mr-2 text-indigo-600" />}
						>
							{relations?.length > 0 ? (
								<div className="space-y-4">
									{relations.map((relationship) => (
										<div key={`relationship-${relationship.id}`} className="border rounded p-3">
											<div className="flex justify-between">
												<Link href={`/npcs/${relationship.npc?.slug}`}>
													<h4 className="font-medium">{relationship.npc?.name}</h4>
												</Link>
											</div>
											<BadgeWithTooltip className="capitalize" tooltipContent={`Relationship type - Strength`}>
												{relationship.strength} - {relationship.type}
											</BadgeWithTooltip>

											{relationship.description && relationship.description.length > 0 && (
												<div className="mt-2">
													<p className="text-sm font-medium mb-1">Dynamics:</p>
													<List
														items={relationship.description}
														textSize="xs"
														textColor="muted"
														maxItems={2}
													/>
												</div>
											)}

											{relationship.narrativeTensions && relationship.narrativeTensions.length > 0 && (
												<div className="mt-2">
													<p className="text-sm font-medium mb-1 flex items-center">
														<Icons.AlertTriangle className="h-3 w-3 mr-1 text-amber-500" />
														Tensions:
													</p>
													<List
														items={relationship.narrativeTensions}
														textSize="xs"
														textColor="muted"
														maxItems={2}
													/>
												</div>
											)}
										</div>
									))}
								</div>
							) : (
								<p className="text-muted-foreground">No known relationships for this NPC</p>
							)}
						</SimpleCard>

						<SimpleCard
							title="Faction Affiliations"
							icon={<Icons.Flag className="h-4 w-4 mr-2" />}
						>
							{relatedFactions && relatedFactions.length > 0 ? (
								<div className="space-y-4">
									{relatedFactions.map((factionConnection) => (
										<div key={`faction-${factionConnection.id}`} className="border rounded p-3">
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
												<BadgeWithTooltip
													variant={
														factionConnection.loyalty === "high"
															? "default"
															: factionConnection.loyalty === "medium"
																? "default"
																: factionConnection.loyalty === "low"
																	? "secondary"
																	: "outline"
													}
													tooltipContent={`Loyalty level: ${factionConnection.loyalty} - How loyal this NPC is to the faction`}
												>
													{factionConnection.loyalty} loyalty
												</BadgeWithTooltip>
											</div>
											<div className="mt-2 text-sm">
												<div className="flex">
													<span className="font-medium mr-2">Role:</span>
													<span className="text-muted-foreground">{factionConnection.role}</span>
												</div>
												<div className="flex mt-1">
													<span className="font-medium mr-2">Rank:</span>
													<span className="text-muted-foreground">{factionConnection.rank}</span>
												</div>
											</div>

											{factionConnection.secrets && factionConnection.secrets.length > 0 && (
												<div className="mt-3 pt-2 border-t">
													<p className="text-xs font-medium text-red-500 flex items-center">
														<Icons.Lock className="h-3 w-3 mr-1" />
														Secrets:
													</p>
													<List
														items={factionConnection.secrets}
														textSize="xs"
														textColor="muted"
														maxItems={2}
													/>
												</div>
											)}
										</div>
									))}
								</div>
							) : (
								<p className="text-muted-foreground">No faction affiliations for this NPC</p>
							)}
						</SimpleCard>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
						<SimpleCard
							title="Associated Locations"
							icon={<Icons.MapPin className="h-4 w-4 mr-2" />}
						>
							{relatedLocations && relatedLocations.length > 0 ? (
								<div className="space-y-4">
									{relatedLocations.map((locationConnection) => (
										<div key={`location-${locationConnection.id}`} className="border rounded p-3">
											<div className="flex justify-between">
												<h4 className="font-medium">
													{locationConnection.location && (
														<NavLink
															to={`/locations/${locationConnection.location.slug}`}
															className="hover:text-indigo-500"
														>
															{locationConnection.location.name}
														</NavLink>
													)}
													{!locationConnection.location && <span>Unnamed Location</span>}
												</h4>
												<BadgeWithTooltip variant="outline" tooltipContent="Location associated with this NPC">
													Location
												</BadgeWithTooltip>
											</div>

											{locationConnection.description && locationConnection.description.length > 0 && (
												<div className="mt-2">
													<List
														items={locationConnection.description}
														textSize="xs"
														textColor="muted"
														maxItems={2}
													/>
												</div>
											)}
										</div>
									))}
								</div>
							) : (
								<p className="text-muted-foreground">No associated locations for this NPC</p>
							)}
						</SimpleCard>

						<SimpleCard
							title="Involved Quests"
							icon={<Icons.Scroll className="h-4 w-4 mr-2" />}
						>
							{relatedQuests && relatedQuests.length > 0 ? (
								<div className="space-y-4">
									{relatedQuests.map((questConnection) => (
										<div key={`quest-${questConnection.id}`} className="border rounded p-3">
											<div className="flex justify-between">
												<h4 className="font-medium">
													{questConnection.quest && (
														<NavLink to={`/quests/${questConnection.quest.slug}`} className="hover:text-indigo-500">
															{questConnection.quest.name}
														</NavLink>
													)}
												</h4>
												<BadgeWithTooltip
													variant={
														questConnection.importance === "critical"
															? "destructive"
															: questConnection.importance === "major"
																? "default"
																: questConnection.importance === "supporting"
																	? "secondary"
																	: "outline"
													}
													tooltipContent={`Importance: ${questConnection.importance} - How important this NPC is to the quest`}
												>
													{questConnection.importance}
												</BadgeWithTooltip>
											</div>
											<p className="text-sm mt-1">
												<span className="font-medium">Role:</span> {questConnection.role}
											</p>

											{questConnection.description && questConnection.description.length > 0 && (
												<div className="mt-2">
													<List
														items={questConnection.description}
														textSize="xs"
														textColor="muted"
														maxItems={2}
													/>
												</div>
											)}

											{questConnection.hiddenAspects && questConnection.hiddenAspects.length > 0 && (
												<div className="mt-2 pt-2 border-t">
													<p className="text-xs font-medium text-red-500 flex items-center mb-2">
														<Icons.Lock className="h-3 w-3 mr-1" />
														Hidden aspects:
													</p>
													<List
														items={questConnection.hiddenAspects}
														textSize="xs"
														textColor="muted"
														maxItems={2}
													/>
												</div>
											)}
										</div>
									))}
								</div>
							) : (
								<p className="text-muted-foreground">No quests involve this NPC</p>
							)}
						</SimpleCard>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}
