import * as Icons from "lucide-react"
import { NavLink, useNavigate, useParams } from "react-router"
import { Tags } from "~/components/Tags"
import { Button } from "~/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { getSite } from "~/lib/entities"
import type { Route } from "./+types/$slug"
import { DetailsContent } from "./components/DetailsContent"
import { EncountersContent } from "./components/EncountersContent"
import { InhabitantsContent } from "./components/InhabitantsContent"
import { ItemsContent } from "./components/ItemsContent"
import { LinksContent } from "./components/LinksContent"
import { MapContent } from "./components/MapContent"
import { NarrativeContent } from "./components/NarrativeContent"
import { OverviewContent } from "./components/OverviewContent"
import { SecretsContent } from "./components/SecretsContent"
import { SiteHeader } from "./components/SiteHeader"

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
		area,
		areaId,
		climate,
		consequences,
		creativePrompts,
		creatures,
		description,
		descriptors,
		encounters,
		environment,
		factionHqs,
		factionInfluence,
		features,
		gmNotes,
		incomingForeshadowing,
		intendedSiteFunction,
		itemHistory,
		itemRelations,
		lightingDescription,
		mapGroup,
		mood,
		name,
		npcAssociations,
		questHooks,
		questStages,
		relations,
		secrets,
		slug,
		smells,
		soundscape,
		tags,
		terrain,
		treasures,
		type,
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

			<SiteHeader
				name={name}
				type={type}
				area={area}
				terrain={terrain}
				climate={climate}
				mood={mood}
				environment={environment}
			/>

			{/* Tags */}
			<Tags tags={tags} variant="secondary" maxDisplay={8} className="mb-6" />

			<Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
				<TabsList className="grid grid-cols-9 mb-6">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="details">Details</TabsTrigger>
					<TabsTrigger value="map">Map</TabsTrigger>
					<TabsTrigger value="encounters">Encounters</TabsTrigger>
					<TabsTrigger value="inhabitants">Inhabitants</TabsTrigger>
					<TabsTrigger value="secrets">Secrets</TabsTrigger>
					<TabsTrigger value="links">Links</TabsTrigger>
					<TabsTrigger value="narrative">Narrative</TabsTrigger>
					<TabsTrigger value="items">Items</TabsTrigger>
				</TabsList>

				<TabsContent value="overview">
					<OverviewContent creatures={creatures} description={description} features={features} treasures={treasures} />
				</TabsContent>

				<TabsContent value="details">
					<DetailsContent
						weather={weather}
						creativePrompts={creativePrompts}
						descriptors={descriptors}
						lightingDescription={lightingDescription}
						soundscape={soundscape}
						smells={smells}
						intendedSiteFunction={intendedSiteFunction}
						gmNotes={gmNotes}
					/>
				</TabsContent>

				<TabsContent value="inhabitants">
					<InhabitantsContent
						npcAssociations={npcAssociations}
						factionInfluence={factionInfluence}
						factionHqs={factionHqs}
					/>
				</TabsContent>

				<TabsContent value="encounters">
					<EncountersContent encounters={encounters} />
				</TabsContent>

				<TabsContent value="secrets">
					<SecretsContent secrets={secrets} />
				</TabsContent>

				<TabsContent value="links">
					<LinksContent relations={relations} />
				</TabsContent>

				<TabsContent value="map">
					<MapContent mapGroup={mapGroup} />
				</TabsContent>

				<TabsContent value="narrative">
					<NarrativeContent
						questHooks={questHooks}
						questStages={questStages}
						incomingForeshadowing={incomingForeshadowing}
						consequences={consequences}
					/>
				</TabsContent>

				<TabsContent value="items">
					<ItemsContent itemHistory={itemHistory} itemRelations={itemRelations} />
				</TabsContent>
			</Tabs>
		</div>
	)
}
