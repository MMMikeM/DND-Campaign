import { NavLink } from "react-router"
import * as Icons from "lucide-react"
import { Button } from "~/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { getRegion } from "~/lib/entities"
import type { Route } from "./+types/$slug"
import {
	RegionHeader,
	OverviewCard,
	RegionTypeCard,
	KeyStatsCard,
	ListCard,
	LocationsCard,
	EconomyCard,
	FactionsCard,
} from "./components"
import { SimpleCard } from "../factions/components"

function getDangerVariant(level: string) {
	switch (level) {
		case "safe":
			return "outline"
		case "low":
			return "secondary"
		case "moderate":
			return "default"
		case "high":
			return "destructive"
		case "deadly":
			return "destructive"
		default:
			return "outline"
	}
}

// Server-side data fetching
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

	const {
		creativePrompts,
		culturalNotes,
		dangerLevel,
		description,
		economy,
		factions,
		hazards,
		history,
		id,
		locations,
		name,
		pointsOfInterest,
		population,
		quests,
		rumors,
		secrets,
		security,
		slug,
		type,
		relations,
	} = region

	const allRelations = [...relations]

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

			<RegionHeader
				name={name}
				type={type}
				dangerLevel={dangerLevel}
				economy={economy}
				population={population}
			/>

			<Tabs defaultValue="overview" className="w-full">
				<TabsList className="grid grid-cols-5 mb-6">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="details">Details</TabsTrigger>
					<TabsTrigger value="features">Features</TabsTrigger>
					<TabsTrigger value="lore">Lore</TabsTrigger>
					<TabsTrigger value="connections">Connections</TabsTrigger>
				</TabsList>

				<TabsContent value="overview">
					<OverviewCard
						name={name}
						history={history}
						description={description}
						culturalNotes={culturalNotes}
					/>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<RegionTypeCard type={type} dangerLevel={dangerLevel} />
						<KeyStatsCard {...region} />
					</div>
				</TabsContent>

				<TabsContent value="details">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<ListCard
							title="Hazards"
							icon={<Icons.AlertTriangle className="h-4 w-4 mr-2" />}
							items={hazards}
							emptyText="No known hazards"
						/>

						<ListCard
							title="Points of Interest"
							icon={<Icons.MapPin className="h-4 w-4 mr-2" />}
							items={pointsOfInterest}
							emptyText="No notable points of interest"
						/>

						<ListCard
							title="Security"
							icon={<Icons.Shield className="h-4 w-4 mr-2" />}
							items={security}
							emptyText="No security information available"
						/>

						<ListCard
							title="Rumors"
							icon={<Icons.MessageCircle className="h-4 w-4 mr-2" />}
							items={rumors}
							emptyText="No rumors circulating"
						/>
					</div>
				</TabsContent>

				<TabsContent value="features">
					<div className="grid grid-cols-1 gap-6 mb-6">
						<LocationsCard locations={locations} />
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<EconomyCard economy={economy} population={population} />

						<ListCard
							title="Creative Prompts"
							icon={<Icons.Eye className="h-4 w-4 mr-2" />}
							items={creativePrompts}
							emptyText="No creative prompts available"
						/>
					</div>
				</TabsContent>

				<TabsContent value="lore">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<ListCard
							title="Secrets"
							icon={<Icons.Lock className="h-4 w-4 mr-2" />}
							items={secrets}
							emptyText="No secrets uncovered yet"
						/>

						<SimpleCard title="History" icon={<Icons.BookOpen className="h-4 w-4 mr-2" />}>
							<p className="whitespace-pre-line">{history}</p>
						</SimpleCard>
					</div>
				</TabsContent>

				<TabsContent value="connections">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
						{/* Factions in Region */}
						<FactionsCard name={name} factions={factions} />

						{/* Relations with other regions section can go here */}
						{allRelations.length > 0 ? (
							<SimpleCard title="Connected Regions" icon={<Icons.Network className="h-4 w-4 mr-2" />}>
								<div className="space-y-4">
									{/* Render relations here */}
									<p>Region connections coming soon</p>
								</div>
							</SimpleCard>
						) : (
							<SimpleCard title="Connected Regions" icon={<Icons.Network className="h-4 w-4 mr-2" />}>
								<p className="text-muted-foreground">No connected regions defined yet.</p>
							</SimpleCard>
						)}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}
