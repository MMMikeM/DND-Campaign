import { useState } from "react"
import * as Icons from "lucide-react"
import { NavLink } from "react-router"

import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Badge } from "~/components/ui/badge"
import { getAllRegions } from "~/lib/entities"
import type { Route } from "./+types/index"

// Server-side data fetching
export async function loader({ params }: Route.LoaderArgs) {
	return await getAllRegions()
}

export default function RegionsIndexPage({ loaderData }: Route.ComponentProps) {
	const [searchTerm, setSearchTerm] = useState("")
	const regions = loaderData

	const filteredRegions = regions.filter(
		(region) =>
			region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			region.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
			region.economy.toLowerCase().includes(searchTerm.toLowerCase()),
	)

	return (
		<div className="container mx-auto py-6">
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-3xl font-bold">Regions</h1>
					<p className="text-muted-foreground">Browse and manage locations in your campaign world</p>
				</div>
				<Button>
					<NavLink to="/regions/new" className="flex items-center">
						<span className="mr-2">New Region</span>
						<Icons.Map className="h-4 w-4" />
					</NavLink>
				</Button>
			</div>

			<div className="mb-6">
				<div className="relative">
					<Icons.Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search regions..."
						className="pl-8"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{filteredRegions.map((region) => {
					const {
						creativePrompts,
						culturalNotes,
						description,
						economy,
						hazards,
						name,
						pointsOfInterest,
						population,
						type,
						dangerLevel,
						slug,
						history,
						rumors,
						secrets,
						security,
					} = region

					return (
						<NavLink key={region.id} to={`/regions/${slug}`}>
							<Card className="h-full hover:shadow-md transition-shadow">
								<CardHeader>
									<CardTitle className="flex items-center">
										{type === "city" ? (
											<Icons.Pin className="h-5 w-5 mr-2 text-indigo-500" />
										) : (
											<Icons.Map className="h-5 w-5 mr-2 text-indigo-500" />
										)}
										{name}
									</CardTitle>
									<CardDescription>
										<span className="capitalize">{type}</span> • {population}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground mb-2">{economy}</p>
									{description?.[0] && <p className="text-sm line-clamp-2">{description[0]}</p>}
									<div className="flex flex-wrap items-center gap-2 mt-3">
										<Badge
											variant={
												dangerLevel === "safe"
													? "outline"
													: dangerLevel === "low"
														? "secondary"
														: dangerLevel === "moderate"
															? "default"
															: "destructive"
											}
										>
											{dangerLevel}
										</Badge>
									</div>
								</CardContent>
								<CardFooter>
									<div className="flex flex-col w-full gap-2">
										<div className="flex items-center text-xs text-muted-foreground justify-between">
											<span>{hazards?.length || 0} hazards</span>
											<span>{pointsOfInterest?.length || 0} points of interest</span>
										</div>
										<div className="flex items-center text-xs text-muted-foreground justify-between">
											<span>{rumors?.length || 0} rumors</span>
											<span>{secrets?.length || 0} secrets</span>
										</div>
									</div>
								</CardFooter>
							</Card>
						</NavLink>
					)
				})}
			</div>

			{filteredRegions.length === 0 && (
				<div className="text-center py-12">
					<Icons.Map className="mx-auto h-12 w-12 text-muted-foreground" />
					<h3 className="mt-2 text-lg font-medium">No regions found</h3>
					<p className="mt-1 text-muted-foreground">Try adjusting your search term</p>
				</div>
			)}
		</div>
	)
}
