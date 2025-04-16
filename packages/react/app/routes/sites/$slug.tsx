import * as Icons from "lucide-react"
import { NavLink, useNavigate, useParams } from "react-router"
import { Button } from "~/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { getSite } from "~/lib/entities"
import type { Route } from "./+types/$slug"
import { DetailsContent } from "./components/DetailsContent"
import { EncountersContent } from "./components/EncountersContent"
import { InhabitantsContent } from "./components/InhabitantsContent"
import LinksContent from "./components/LinksContent"
import { OverviewContent } from "./components/OverviewContent"
import SecretsContent from "./components/SecretsContent"
import SiteHeader from "./components/SiteHeader"

export async function loader({ params }: Route.LoaderArgs) {
	if (!params.slug) {
		throw new Response("No slug provided", { status: 400 })
	}

	const site = await getSite(params.slug)
	if (!site) {
		throw new Response("Site not found", { status: 404 })
	}

	return site
}

export default function SiteDetailPage({ loaderData }: Route.ComponentProps) {
	const site = loaderData
	const { tab } = useParams()
	const activeTab = tab || "overview"
	const navigate = useNavigate()

	const {
		id,
		name,
		siteType,
		area,
		slug,
		climate,
		creativePrompts,
		creatures,
		description,
		descriptors,
		encounters,
		environment,
		features,
		items,
		mood,
		npcs,
		secrets,
		terrain,
		worldChanges,
		lightingDescription,
		relations,
		smells,
		soundscape,
		territorialControl,
		treasures,
		weather,
	} = site

	const handleTabChange = (value: string) => {
		navigate(`/sites/${slug}/${value === "overview" ? "" : value}`)
	}

	return (
		<div className="container mx-auto py-6">
			<div className="mb-6">
				<Button variant="outline" size="sm" asChild>
					<NavLink to="/sites" className="flex items-center">
						<Icons.ChevronLeft className="h-4 w-4 mr-2" />
						Back to Sites
					</NavLink>
				</Button>
			</div>

			<SiteHeader {...site} />

			<Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
				<TabsList className="grid grid-cols-6 mb-6">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="details">Details</TabsTrigger>
					<TabsTrigger value="encounters">Encounters</TabsTrigger>
					<TabsTrigger value="inhabitants">Inhabitants</TabsTrigger>
					<TabsTrigger value="secrets">Secrets</TabsTrigger>
					<TabsTrigger value="links">Links</TabsTrigger>
				</TabsList>

				<TabsContent value="overview">
					<OverviewContent {...site} />
				</TabsContent>

				<TabsContent value="details">
					<DetailsContent {...site} />
				</TabsContent>

				<TabsContent value="inhabitants">
					<InhabitantsContent {...site} />
				</TabsContent>

				<TabsContent value="encounters">
					<EncountersContent {...site} />
				</TabsContent>

				<TabsContent value="secrets">
					<SecretsContent {...site} />
				</TabsContent>

				<TabsContent value="links">
					<LinksContent {...site} />
				</TabsContent>
			</Tabs>
		</div>
	)
}
