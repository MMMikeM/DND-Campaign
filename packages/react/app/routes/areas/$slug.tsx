import * as Icons from "lucide-react"
import { NavLink, useNavigate, useParams } from "react-router"
import { Button } from "~/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { getArea } from "~/lib/entities"
import type { Route } from "./+types/$slug"
import { DetailsContent } from "./components/DetailsContent"
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

const tabs = ["Overview", "Details", "Sites"]

export default function AreaDetailPage({ loaderData }: Route.ComponentProps) {
	const {
		atmosphereType,
		consequences,
		creativePrompts,
		culturalNotes,
		dangerLevel,
		defenses,
		description,
		factionInfluence,
		gmNotes,
		hazards,
		id,
		leadership,
		name,
		pointsOfInterest,
		population,
		primaryActivity,
		region,
		regionId,
		revelationLayersSummary,
		rumors,
		sites,
		slug,
		tags,
		type,
	} = loaderData

	const { tab } = useParams()
	const activeTab = tab || "overview"
	const navigate = useNavigate()

	const handleTabChange = (value: string) => {
		navigate(`/areas/${slug}/${value === "overview" ? "" : value}`)
	}

	if (!loaderData) {
		return (
			<div className="container mx-auto py-12 text-center">
				<h2 className="text-2xl font-bold mb-4">Area Not Found</h2>
				<p className="mb-6">The requested area could not be found</p>
				<Button asChild>
					{/* Link back to areas index or parent region? */}
					<NavLink to="/areas">
						<Icons.ChevronLeft className="h-4 w-4 mr-2" />
						Back to Areas
					</NavLink>
				</Button>
			</div>
		)
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

			<div className="p-4 mb-6 border rounded bg-card text-card-foreground shadow-sm">
				<h1 className="text-2xl font-bold">{name}</h1>
				<p className="text-muted-foreground capitalize">{type}</p>
				{region && (
					<p className="text-sm text-muted-foreground">
						In Region:{" "}
						<NavLink className="text-primary hover:underline" to={`/regions/${region.slug}`}>
							{region.name}
						</NavLink>
					</p>
				)}
			</div>

			<Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
				<TabsList className="grid grid-cols-3 mb-8 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
					{tabs.map((tab) => (
						<TabsTrigger
							key={tab}
							value={titleToCamelCase(tab)}
							className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
						>
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
					<DetailsContent creativePrompts={creativePrompts} hazards={hazards} defenses={defenses} rumors={rumors} />
				</TabsContent>

				<TabsContent value="sites">
					<SitesContent sites={sites} />
				</TabsContent>
			</Tabs>
		</div>
	)
}
