import { useState } from "react"
import * as Icons from "lucide-react"
import { NavLink } from "react-router"

import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { getAllNpcs } from "~/lib/entities"
import type { Route } from "./+types/index"

export async function loader({ params }: Route.LoaderArgs) {
	return await getAllNpcs()
}

export default function NpcsIndexPage({ loaderData }: Route.ComponentProps) {
	const [searchTerm, setSearchTerm] = useState("")
	const npcs = loaderData

	const filteredNpcs = npcs.filter(
		(npc) =>
			npc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			npc.race.toLowerCase().includes(searchTerm.toLowerCase()) ||
			npc.occupation.toLowerCase().includes(searchTerm.toLowerCase()),
	)

	return (
		<div className="container mx-auto py-6">
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-3xl font-bold">NPCs</h1>
					<p className="text-muted-foreground">Browse and manage characters in your campaign world</p>
				</div>
				<Button>
					<NavLink to="/npcs/new" className="flex items-center">
						<span className="mr-2">New NPC</span>
						<Icons.User className="h-4 w-4" />
					</NavLink>
				</Button>
			</div>

			<div className="mb-6">
				<div className="relative">
					<Icons.Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search NPCs..."
						className="pl-8"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{filteredNpcs.map((npc) => {
					const {
						name,
						race,
						occupation,
						appearance,
						background,
						alignment,
						gender,
						wealth,
						quirk,
						personalityTraits,
						attitude,
						biases,
						secrets,
						trustLevel,
						adaptability,
						slug,
					} = npc

					return (
						<NavLink key={npc.id} to={`/npcs/${slug}`}>
							<Card className="h-full hover:shadow-md transition-shadow">
								<CardHeader>
									<CardTitle className="flex items-center">
										<Icons.User className="h-5 w-5 mr-2 text-indigo-500" />
										{name}
									</CardTitle>
									<CardDescription className="flex flex-wrap gap-2">
										<span>{race}</span>
										<span>•</span>
										<span>{occupation}</span>
									</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm mb-2">{appearance?.[0] || background?.[0]}</p>
									<div className="flex flex-wrap items-center gap-2 mt-2">
										<BadgeWithTooltip variant="outline" tooltipContent="Moral compass and ethical stance">
											{alignment}
										</BadgeWithTooltip>
										<BadgeWithTooltip variant="outline" tooltipContent="Character identity">
											{gender}
										</BadgeWithTooltip>
										<BadgeWithTooltip
											variant="outline"
											className="capitalize"
											tooltipContent="Economic resources and status"
										>
											{wealth}
										</BadgeWithTooltip>
										{trustLevel && (
											<BadgeWithTooltip
												variant="secondary"
												className="capitalize"
												tooltipContent="How readily this character trusts others"
											>
												Trust: {trustLevel}
											</BadgeWithTooltip>
										)}
									</div>
								</CardContent>
								<CardFooter>
									<div className="flex flex-col w-full gap-2">
										<p className="text-xs text-muted-foreground">
											<span className="font-medium">Quirk:</span> {quirk || personalityTraits?.[0]}
										</p>
										{attitude && (
											<p className="text-xs text-muted-foreground">
												<span className="font-medium">Attitude:</span> {attitude}
											</p>
										)}
										<div className="text-xs text-muted-foreground">
											<span>{personalityTraits?.length || 0} traits</span>
											<span className="mx-1">•</span>
											<span>{biases?.length || 0} biases</span>
											<span className="mx-1">•</span>
											<span>{secrets?.length || 0} secrets</span>
										</div>
									</div>
								</CardFooter>
							</Card>
						</NavLink>
					)
				})}
			</div>

			{filteredNpcs.length === 0 && (
				<div className="text-center py-12">
					<Icons.Users className="mx-auto h-12 w-12 text-muted-foreground" />
					<h3 className="mt-2 text-lg font-medium">No NPCs found</h3>
					<p className="mt-1 text-muted-foreground">Try adjusting your search term</p>
				</div>
			)}
		</div>
	)
}
