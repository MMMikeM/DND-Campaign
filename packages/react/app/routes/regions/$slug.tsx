import { NavLink, useParams, useNavigate } from "react-router"
import * as Icons from "lucide-react"
import { Button } from "~/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { getRegion } from "~/lib/entities"
import type { Route } from "./+types/$slug"
import { getDangerVariant } from "./utils"
import { RegionHeader } from "./components/RegionHeader"
import { OverviewContent } from "./components/OverviewContent"
import { DetailsContent } from "./components/DetailsContent"
import { AreasContent } from "./components/AreasContent" // Renamed import
import { LoreContent } from "./components/LoreContent"
import { ConnectionsContent } from "./components/ConnectionsContent"

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

	const { name, type, dangerLevel, economy, population, slug } = region

	const handleTabChange = (value: string) => {
		navigate(`/regions/${slug}/${value === "overview" ? "" : value}`)
	}

	if (!region) {
		return (
			<div className="container mx-auto py-12 text-center">
				<h2 className="text-2xl font-bold mb-4">Region Not Found</h2>
				<p className="mb-6">The requested region could not be found</p>
				<Button asChild>
					<NavLink to="/regions">
						<Icons.ChevronLeft className="h-4 w-4 mr-2" />
						Back to Regions
					</NavLink>
				</Button>
			</div>
		)
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
					<OverviewContent region={region} />
				</TabsContent>

				<TabsContent value="details">
					<DetailsContent region={region} />
				</TabsContent>

				{/* Changed value */}
				<TabsContent value="areas">
					{/* Use renamed component */}
					<AreasContent region={region} />
				</TabsContent>

				<TabsContent value="lore">
					<LoreContent region={region} />
				</TabsContent>

				<TabsContent value="connections">
					<ConnectionsContent region={region} />
				</TabsContent>
			</Tabs>
		</div>
	)
}
