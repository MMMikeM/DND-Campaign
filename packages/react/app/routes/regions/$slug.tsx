import * as Icons from "lucide-react"
import { NavLink, useNavigate, useParams } from "react-router"
import { ConsequenceList } from "~/components/ConsequenceList"
import { ForeshadowingList } from "~/components/ForeshadowingList"
import { Tags } from "~/components/Tags"
import { buttonVariants } from "~/components/ui/button"
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
		atmosphereAndCulture,
		conflicts,
		consequences,
		dangerLevel,
		description,
		factionInfluence,
		featuresAndHazards,
		incomingForeshadowing,
		historyAndEconomy,
		loreAndSecrets,
		loreLinks,
		name,
		relations,
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
				<NavLink to="/regions" className={buttonVariants({ variant: "outline", size: "sm" })}>
					<Icons.ChevronLeft className="h-4 w-4 mr-2" />
					Back to Regions
				</NavLink>
			</div>

			<RegionHeader name={name} type={type} dangerLevel={dangerLevel} />

			<Tags tags={tags} className="mb-6" />

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
						atmosphereAndCulture={atmosphereAndCulture}
						dangerLevel={dangerLevel}
						description={description}
						type={type}
					/>
				</TabsContent>

				<TabsContent value="details">
					<DetailsContent featuresAndHazards={featuresAndHazards} />
				</TabsContent>

				<TabsContent value="areas">
					<AreasContent areas={areas} slug={slug} />
				</TabsContent>

				<TabsContent value="lore">
					<LoreContent
						historyAndEconomy={historyAndEconomy}
						loreAndSecrets={loreAndSecrets}
						loreLinks={loreLinks}
					/>
				</TabsContent>

				<TabsContent value="connections">
					<ConnectionsContent relations={relations} factionInfluence={factionInfluence} conflicts={conflicts} />
					<ForeshadowingList
						incoming={incomingForeshadowing}
						emptyMessage="No foreshadowing points toward this region."
					/>
					<ConsequenceList affecting={consequences} emptyMessage="No consequences have affected this region." />
				</TabsContent>
			</Tabs>
		</div>
	)
}
