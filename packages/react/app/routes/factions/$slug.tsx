import { ChevronLeft } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Link } from "~/components/ui/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Separator } from "~/components/ui/separator"
import { getFaction } from "~/lib/entities"
import React from "react"
import * as Icons from "lucide-react"
import {
	FactionHeader,
	OverviewGoalsCard,
	PerceptionSection,
	HeadquartersCard,
	DetailsCard,
	SimplifiedDetailsCard,
	CultureCard,
	OperationCard,
	RegionInfluenceCard,
	RelationsCard,
	RelatedQuestsCard,
	MembersCard,
} from "./components"
import type { Route } from "./+types/$slug"

// Server-side data fetching
export async function loader({ params }: Route.LoaderArgs) {
	if (!params.slug) {
		throw new Response("No slug provided", { status: 400 })
	}

	const faction = await getFaction(params.slug)
	if (!faction) {
		throw new Response("Faction not found", { status: 404 })
	}

	return faction
}

export default function Faction({ loaderData }: Route.ComponentProps) {
	const faction = loaderData

	return (
		<div className="container py-8">
			<div className="mb-8">
				<Link href="/factions" asButton variant="outline" className="mb-4">
					<Icons.ChevronLeft className="h-4 w-4 mr-1" />
					Back to Factions
				</Link>

				<FactionHeader {...faction} />

				<Tabs defaultValue="overview" className="mt-6">
					<TabsList className="grid grid-cols-7 mb-8">
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="details">Details</TabsTrigger>
						<TabsTrigger value="culture">Culture</TabsTrigger>
						<TabsTrigger value="operations">Operations</TabsTrigger>
						<TabsTrigger value="influence">Influence</TabsTrigger>
						<TabsTrigger value="quests">Quests</TabsTrigger>
						<TabsTrigger value="members">Members</TabsTrigger>
					</TabsList>

					{/* Overview Tab */}
					<TabsContent value="overview" className="space-y-8">
						<OverviewGoalsCard {...faction} />
						<Separator />
						<PerceptionSection {...faction} />
						<Separator />
						<HeadquartersCard {...faction} />
					</TabsContent>

					{/* Details Tab */}
					<TabsContent value="details" className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<SimplifiedDetailsCard
								title="History"
								icon={<Icons.BookOpen className="h-4 w-4 mr-2" />}
								items={faction.history}
							/>

							<SimplifiedDetailsCard
								title="Description"
								icon={<Icons.Briefcase className="h-4 w-4 mr-2" />}
								items={faction.description}
							/>

							<DetailsCard
								title="Values"
								icon={<Icons.ListFilter className="h-4 w-4 mr-2" />}
								items={faction.values}
							/>

							<DetailsCard
								title="Resources"
								icon={<Icons.Briefcase className="h-4 w-4 mr-2" />}
								items={faction.resources}
							/>

							<DetailsCard
								title="Recruitment"
								icon={<Icons.UserCircle className="h-4 w-4 mr-2" />}
								items={faction.recruitment}
							/>
						</div>
					</TabsContent>

					{/* Culture Tab */}
					<TabsContent value="culture" className="space-y-6">
						{faction.culture.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{faction.culture.map((culture) => (
									<React.Fragment key={`culture-${culture.id}`}>
										<CultureCard
											title="Symbols"
											icon={<Icons.Fingerprint className="h-4 w-4 mr-2" />}
											items={culture.symbols}
										/>

										<CultureCard
											title="Rituals"
											icon={<Icons.Calendar className="h-4 w-4 mr-2" />}
											items={culture.rituals}
										/>

										<CultureCard
											title="Taboos"
											icon={<Icons.Accessibility className="h-4 w-4 mr-2" />}
											items={culture.taboos}
										/>

										<CultureCard
											title="Aesthetics"
											icon={<Icons.Fingerprint className="h-4 w-4 mr-2" />}
											items={culture.aesthetics}
										/>

										<CultureCard
											title="Jargon"
											icon={<Icons.Languages className="h-4 w-4 mr-2" />}
											items={culture.jargon}
										/>

										<CultureCard
											title="Recognition Signs"
											icon={<Icons.Fingerprint className="h-4 w-4 mr-2" />}
											items={culture.recognitionSigns}
										/>
									</React.Fragment>
								))}
							</div>
						) : (
							<p className="text-muted-foreground text-center py-10">
								No cultural information available for this faction.
							</p>
						)}
					</TabsContent>

					{/* Operations Tab */}
					<TabsContent value="operations" className="space-y-8">
						{faction.operations.map((operation) => (
							<OperationCard key={`operation-${operation.id}`} operation={operation} />
						)) ?? (
							<p className="text-muted-foreground text-center py-10">
								No active operations for this faction.
							</p>
						)}
					</TabsContent>

					{/* Influence Tab */}
					<TabsContent value="influence" className="space-y-8">
						<RegionInfluenceCard name={faction.name} relatedRegions={faction.relatedRegions} />
						<RelationsCard outgoingRelationships={faction.outgoingRelationships} />
					</TabsContent>

					{/* Quests Tab */}
					<TabsContent value="quests" className="space-y-8">
						<RelatedQuestsCard name={faction.name} relatedQuests={faction.relatedQuests} />
					</TabsContent>

					{/* Members Tab */}
					<TabsContent value="members">
						<MembersCard name={faction.name} members={faction.members} />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	)
}
