import * as Icons from "lucide-react"
import { NavLink, useNavigate, useParams } from "react-router"
import { Button } from "~/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { getRegion } from "~/lib/entities"
import type { Route } from "./+types/$slug"
import { AreasContent } from "./components/AreasContent"
import { ConnectionsContent } from "./components/ConnectionsContent"
import { DetailsContent } from "./components/DetailsContent"
import { LoreContent } from "./components/LoreContent"
import { OverviewContent } from "./components/OverviewContent"
import { RegionHeader } from "./components/RegionHeader"

export async function loader({ params }: Route.LoaderArgs) {
	if (!params.slug) {
		throw new Response("No slug provided", { status: 400 })
	}

	const region = await getRegion(params.slug)
	if (!region) {
		throw new Response("Region not found", { status: 404 })
	}

	return region
}

export default function RegionDetailPage({ loaderData }: Route.ComponentProps) {
	const region = loaderData
	const { tab } = useParams()
	const activeTab = tab || "overview"
	const navigate = useNavigate()

	const {
		areas,
		atmosphereType,
		conflicts,
		consequences,
		creativePrompts,
		culturalNotes,
		dangerLevel,
		description,
		economy,
		factionInfluence,
		gmNotes,
		hazards,
		history,
		loreLinks,
		name,
		narrativeDestinations,
		pointsOfInterest,
		population,
		quests,
		relations,
		revelationLayersSummary,
		rumors,
		secrets,
		security,
		slug,
		tags,
		type,
	} = region

	const handleTabChange = (value: string) => {
		navigate(`/regions/${slug}/${value === "overview" ? "" : value}`)
	}

	return (
		<div className="container mx-auto py-6">
			<div className="mb-6">
				<Button variant="outline" size="sm" asChild>
					<NavLink to="/regions" className="flex items-center">
						<Icons.ChevronLeft className="h-4 w-4 mr-2" />
						Back to Regions
					</NavLink>
				</Button>
			</div>

			<RegionHeader name={name} type={type} dangerLevel={dangerLevel} economy={economy} population={population} />

			<Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
				<TabsList className="grid grid-cols-5 mb-6">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="details">Details</TabsTrigger>
					<TabsTrigger value="areas">Areas</TabsTrigger> {/* Changed value and label */}
					<TabsTrigger value="lore">Lore</TabsTrigger>
					<TabsTrigger value="connections">Connections</TabsTrigger>
				</TabsList>

				<TabsContent value="overview">
					<OverviewContent
						areas={areas}
						quests={quests}
						description={description}
						culturalNotes={culturalNotes}
						dangerLevel={dangerLevel}
						economy={economy}
						population={population}
						type={type}
					/>
				</TabsContent>

				<TabsContent value="details">
					<DetailsContent hazards={hazards} pointsOfInterest={pointsOfInterest} security={security} rumors={rumors} />
				</TabsContent>

				<TabsContent value="areas">
					<AreasContent
						areas={areas}
						slug={slug}
						economy={economy}
						population={population}
						creativePrompts={creativePrompts}
					/>
				</TabsContent>

				<TabsContent value="lore">
					<LoreContent history={history} secrets={secrets} rumors={rumors} />
				</TabsContent>

				<TabsContent value="connections">
					<ConnectionsContent relations={relations} territorialControl={factionInfluence} />
				</TabsContent>
			</Tabs>
		</div>
	)
}
