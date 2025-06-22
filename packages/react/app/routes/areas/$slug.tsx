import * as Icons from "lucide-react"
import { NavLink, useNavigate, useParams } from "react-router"
import { Tags } from "~/components/Tags"
import { Button } from "~/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { getArea } from "~/lib/entities"
import type { Route } from "./+types/$slug"
import { AreaHeader } from "./components/AreaHeader"
import { ConsequencesContent } from "./components/ConsequencesContent"
import { DetailsContent } from "./components/DetailsContent"
import { InfluenceContent } from "./components/InfluenceContent"
import { OverviewContent } from "./components/OverviewContent"
import { SitesContent } from "./components/SitesContent"

export async function loader({ params }: Route.LoaderArgs) {
	if (!params.slug) {
		throw new Response("No slug provided", { status: 400 })
	}

	const area = await getArea(params.slug)
	if (!area) {
		throw new Response("Area not found", { status: 404 })
	}

	return area
}

const tabList = ["overview", "details", "sites", "influence", "consequences"]

export default function AreaDetailPage({ loaderData }: Route.ComponentProps) {
	const { tab } = useParams()
	const activeTab = tab || "overview"
	const navigate = useNavigate()

	const {
		slug,
		name,
		type,
		region,
		dangerLevel,
		tags,
		description,
		culturalNotes,
		pointsOfInterest,
		leadership,
		population,
		primaryActivity,
		creativePrompts,
		hazards,
		defenses,
		rumors,
		atmosphereType,
		gmNotes,
		revelationLayersSummary,
		sites,
		factionInfluence,
		consequences,
	} = loaderData

	const handleTabChange = (value: string) => {
		navigate(`/areas/${slug}/${value === "overview" ? "" : value}`)
	}

	return (
		<div className="container mx-auto py-6">
			<div className="mb-6">
				<Button variant="outline" size="sm" asChild>
					<NavLink to="/areas" className="flex items-center">
						<Icons.ChevronLeft className="h-4 w-4 mr-2" />
						Back to Areas
					</NavLink>
				</Button>
			</div>

			<AreaHeader name={name} type={type} region={region} dangerLevel={dangerLevel} />

			<Tags tags={tags} className="mb-6" />

			<Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
				<TabsList className="grid grid-cols-5 mb-8">
					{tabList.map((tab) => (
						<TabsTrigger key={tab} value={tab} className="capitalize">
							{tab}
						</TabsTrigger>
					))}
				</TabsList>

				<TabsContent value="overview">
					<OverviewContent
						description={description}
						culturalNotes={culturalNotes}
						pointsOfInterest={pointsOfInterest}
						leadership={leadership}
						population={population}
						primaryActivity={primaryActivity}
					/>
				</TabsContent>

				<TabsContent value="details">
					<DetailsContent
						creativePrompts={creativePrompts}
						hazards={hazards}
						defenses={defenses}
						rumors={rumors}
						atmosphereType={atmosphereType}
						gmNotes={gmNotes}
						revelationLayersSummary={revelationLayersSummary}
					/>
				</TabsContent>

				<TabsContent value="sites">
					<SitesContent sites={sites} />
				</TabsContent>

				<TabsContent value="influence">
					<InfluenceContent factionInfluence={factionInfluence} />
				</TabsContent>

				<TabsContent value="consequences">
					<ConsequencesContent consequences={consequences} />
				</TabsContent>
			</Tabs>
		</div>
	)
}
