import * as Icons from "lucide-react"
import { NavLink, useNavigate, useParams } from "react-router"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { Button } from "~/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { getNpc } from "~/lib/entities"
import type { Route } from "./+types/$slug"
import { ConnectionsContent } from "./components/ConnectionsContent"
import { KnowledgeContent } from "./components/KnowledgeContent"
import { OverviewContent } from "./components/OverviewContent"
import { PersonalityContent } from "./components/PersonalityContent"
import { SocialContent } from "./components/SocialContent"

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

export default function NpcDetailPage({ loaderData }: Route.ComponentProps) {
	const npc = loaderData
	const { tab } = useParams()
	const activeTab = tab || "overview"
	const navigate = useNavigate()

	const {
		loreLinks,
		itemRelations,
		questHooks,
		id,
		name,
		creativePrompts,
		description,
		gmNotes,
		tags,
		secrets,
		alignment,
		gender,
		race,
		trustLevel,
		wealth,
		adaptability,
		complexityProfile,
		playerPerceptionGoal,
		availability,
		capability,
		proactivity,
		relatability,
		disposition,
		age,
		attitude,
		occupation,
		quirk,
		socialStatus,
		currentGoals,
		appearance,
		avoidTopics,
		background,
		biases,
		dialogue,
		drives,
		fears,
		knowledge,
		mannerisms,
		personalityTraits,
		preferredTopics,
		rumours,
		voiceNotes,
		relations,
		factionMemberships,
		siteAssociations,
		conflictParticipation,
		affectingConsequences,
		incomingForeshadowing,
		itemHistory,
		narrativeDestinationInvolvement,
		questStageDeliveries,
		stageInvolvement,
		slug,
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
					<OverviewContent {...npc} />
				</TabsContent>

				<TabsContent value="personality">
					<PersonalityContent {...npc} />
				</TabsContent>

				<TabsContent value="social">
					<SocialContent {...npc} />
				</TabsContent>

				<TabsContent value="knowledge">
					<KnowledgeContent {...npc} />
				</TabsContent>

				<TabsContent value="connections">
					<ConnectionsContent {...npc} />
				</TabsContent>
			</Tabs>
		</div>
	)
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
