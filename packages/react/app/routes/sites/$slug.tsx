import { NavLink, useParams, useNavigate } from "react-router"
import * as Icons from "lucide-react"
import { Button } from "~/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { getSite } from "~/lib/entities" // Use the new function
import type { Route } from "./+types/$slug" // Assuming types file exists or will be created
// Placeholder imports for components to be created
// import { SiteHeader } from "./components/SiteHeader"
// import { OverviewContent } from "./components/OverviewContent"
// import { DetailsContent } from "./components/DetailsContent"
// import { EncountersContent } from "./components/EncountersContent"
// import { SecretsContent } from "./components/SecretsContent"
// import { LinksContent } from "./components/LinksContent"

export async function loader({ params }: Route.LoaderArgs) {
	if (!params.slug) {
		throw new Response("No slug provided", { status: 400 })
	}

	const site = await getSite(params.slug) // Use getSite
	if (!site) {
		// TODO: Use standardized error handling result if implemented
		throw new Response("Site not found", { status: 404 })
	}

	return site
}

export default function SiteDetailPage({ loaderData }: Route.ComponentProps) {
	const site = loaderData
	const { tab } = useParams()
	const activeTab = tab || "overview"
	const navigate = useNavigate()

	// Destructure relevant site properties (adjust based on actual Site type)
	const { id, name, siteType, area, slug /* ... other fields */ } = site

	const handleTabChange = (value: string) => {
		navigate(`/sites/${slug}/${value === "overview" ? "" : value}`)
	}

	if (!site) {
		// This part might become redundant if loader throws Response for 404
		return (
			<div className="container mx-auto py-12 text-center">
				<h2 className="text-2xl font-bold mb-4">Site Not Found</h2>
				<p className="mb-6">The requested site could not be found</p>
				<Button asChild>
					<NavLink to="/sites">
						<Icons.ChevronLeft className="h-4 w-4 mr-2" />
						Back to Sites
					</NavLink>
				</Button>
			</div>
		)
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

			{/* Placeholder for SiteHeader */}
			<div className="p-4 mb-6 border rounded bg-card text-card-foreground shadow-sm">
				<h1 className="text-2xl font-bold">{name}</h1>
				<p className="text-muted-foreground capitalize">{siteType}</p>
				{area && <p className="text-sm text-muted-foreground">In Area: <NavLink className="text-primary hover:underline" to={`/areas/${area.slug}`}>{area.name}</NavLink></p>}
				{area?.region && <p className="text-sm text-muted-foreground">In Region: <NavLink className="text-primary hover:underline" to={`/regions/${area.region.slug}`}>{area.region.name}</NavLink></p>}
				{/* Add terrain, climate, mood, etc. */}
			</div>
			{/* <SiteHeader site={site} /> */}


			<Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
				{/* Adjust grid cols based on final number of tabs */}
				<TabsList className="grid grid-cols-5 mb-6">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="details">Details</TabsTrigger>
					<TabsTrigger value="encounters">Encounters</TabsTrigger>
					<TabsTrigger value="secrets">Secrets</TabsTrigger>
					<TabsTrigger value="links">Links</TabsTrigger>
					{/* Add Items, NPCs tabs if applicable */}
				</TabsList>

				<TabsContent value="overview">
					{/* Placeholder for OverviewContent */}
					<p>Overview content for {name} goes here.</p>
					{/* <OverviewContent site={site} /> */}
				</TabsContent>

				<TabsContent value="details">
					{/* Placeholder for DetailsContent */}
					<p>Details content for {name} goes here.</p>
					{/* <DetailsContent site={site} /> */}
				</TabsContent>

				<TabsContent value="encounters">
					{/* Placeholder for EncountersContent */}
					<p>Encounters list for {name} goes here.</p>
					{/* <EncountersContent site={site} /> */}
				</TabsContent>

				<TabsContent value="secrets">
					{/* Placeholder for SecretsContent */}
					<p>Secrets list for {name} goes here.</p>
					{/* <SecretsContent site={site} /> */}
				</TabsContent>

				<TabsContent value="links">
					{/* Placeholder for LinksContent */}
					<p>Site links for {name} goes here.</p>
					{/* <LinksContent site={site} /> */}
				</TabsContent>

				{/* Add TabsContent for Items, NPCs if needed */}
			</Tabs>
		</div>
	)
}
