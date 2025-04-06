import React from "react"
import * as Icons from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { List } from "~/components/List"
import { Link } from "~/components/ui/link"
import type { NPC } from "~/lib/entities"
import { getRelationshipStrengthVariant } from "../utils"

interface ConnectionsContentProps {
	npc: NPC
}

export function ConnectionsContent({ npc }: ConnectionsContentProps) {
	const { name, relations, relatedFactions, relatedLocations, relatedQuests } = npc

	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center text-lg">
							<Icons.Network className="h-4 w-4 mr-2 text-indigo-600" />
							Relationships
						</CardTitle>
						<CardDescription>Connections to other NPCs</CardDescription>
					</CardHeader>
					<CardContent>
						{relations?.length > 0 ? (
							<div className="space-y-4">
								{relations.map((relationship) => (
									<div key={`relationship-${relationship.id}`} className="border rounded p-3">
										<div className="flex justify-between">
											<Link href={`/npcs/${relationship.npc?.slug}`}>
												<h4 className="font-medium">{relationship.npc?.name}</h4>
											</Link>
										</div>
										<BadgeWithTooltip
											variant={getRelationshipStrengthVariant(relationship.strength)}
											className="capitalize"
											tooltipContent={`Relationship type - Strength`}
										>
											{relationship.strength} - {relationship.type}
										</BadgeWithTooltip>

										{relationship.description && relationship.description.length > 0 && (
											<div className="mt-2">
												<p className="text-sm font-medium mb-1">Dynamics:</p>
												<List
													items={relationship.description}
													spacing="sm"
													textColor="muted"
													textSize="xs"
													maxItems={2}
												/>
											</div>
										)}

										{relationship.narrativeTensions && relationship.narrativeTensions.length > 0 && (
											<div className="mt-2">
												<p className="text-sm font-medium mb-1 flex items-center">
													<Icons.AlertTriangle className="h-3 w-3 mr-1 text-amber-500" />
													Tensions:
												</p>
												<List
													items={relationship.narrativeTensions}
													spacing="sm"
													textColor="muted"
													textSize="xs"
													maxItems={2}
												/>
											</div>
										)}
									</div>
								))}
							</div>
						) : (
							<p className="text-muted-foreground">No known relationships for this NPC</p>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center text-lg">
							<Icons.Flag className="h-4 w-4 mr-2 text-red-600" />
							Faction Affiliations
						</CardTitle>
						<CardDescription>Organizations {name} is associated with</CardDescription>
					</CardHeader>
					<CardContent>
						{relatedFactions && relatedFactions.length > 0 ? (
							<div className="space-y-4">
								{relatedFactions.map((factionConnection) => (
									<div key={`faction-${factionConnection.id}`} className="border rounded p-3">
										<div className="flex justify-between">
											<h4 className="font-medium">
												{factionConnection.faction && (
													<Link href={`/factions/${factionConnection.faction.slug}`}>
														{factionConnection.faction.name}
													</Link>
												)}
											</h4>
											<BadgeWithTooltip
												variant={
													factionConnection.loyalty === "high"
														? "default"
														: factionConnection.loyalty === "medium"
															? "secondary"
															: factionConnection.loyalty === "low"
																? "outline"
																: "destructive"
												}
												tooltipContent={`Loyalty level: ${factionConnection.loyalty} - How loyal this NPC is to the faction`}
											>
												{factionConnection.loyalty} loyalty
											</BadgeWithTooltip>
										</div>
										<div className="mt-2 text-sm">
											<div className="flex">
												<span className="font-medium mr-2">Role:</span>
												<span className="text-muted-foreground">{factionConnection.role}</span>
											</div>
											<div className="flex mt-1">
												<span className="font-medium mr-2">Rank:</span>
												<span className="text-muted-foreground">{factionConnection.rank}</span>
											</div>
										</div>

										{factionConnection.secrets && factionConnection.secrets.length > 0 && (
											<div className="mt-3 pt-2 border-t">
												<p className="text-xs font-medium text-red-500 flex items-center">
													<Icons.Lock className="h-3 w-3 mr-1" />
													Secrets:
												</p>
												<List
													items={factionConnection.secrets}
													spacing="sm"
													textColor="muted"
													textSize="xs"
													maxItems={2}
												/>
											</div>
										)}
									</div>
								))}
							</div>
						) : (
							<p className="text-muted-foreground">No faction affiliations for this NPC</p>
						)}
					</CardContent>
				</Card>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center text-lg">
							<Icons.MapPin className="h-4 w-4 mr-2 text-emerald-600" />
							Associated Locations
						</CardTitle>
						<CardDescription>Places where {name} can be found</CardDescription>
					</CardHeader>
					<CardContent>
						{relatedLocations && relatedLocations.length > 0 ? (
							<div className="space-y-4">
								{relatedLocations.map((locationConnection) => (
									<div key={`location-${locationConnection.id}`} className="border rounded p-3">
										<div className="flex justify-between">
											<h4 className="font-medium">
												{locationConnection.location && (
													<Link href={`/locations/${locationConnection.location.slug}`}>
														{locationConnection.location.name}
													</Link>
												)}
												{!locationConnection.location && <span>Unnamed Location</span>}
											</h4>
											<BadgeWithTooltip variant="outline" tooltipContent="Location associated with this NPC">
												Location
											</BadgeWithTooltip>
										</div>

										{locationConnection.description && locationConnection.description.length > 0 && (
											<div className="mt-2">
												<List
													items={locationConnection.description}
													spacing="sm"
													textColor="muted"
													textSize="xs"
													maxItems={2}
												/>
											</div>
										)}
									</div>
								))}
							</div>
						) : (
							<p className="text-muted-foreground">No associated locations for this NPC</p>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center text-lg">
							<Icons.Scroll className="h-4 w-4 mr-2 text-amber-600" />
							Involved Quests
						</CardTitle>
						<CardDescription>Quests where {name} plays a role</CardDescription>
					</CardHeader>
					<CardContent>
						{relatedQuests && relatedQuests.length > 0 ? (
							<div className="space-y-4">
								{relatedQuests.map((questConnection) => (
									<div key={`quest-${questConnection.id}`} className="border rounded p-3">
										<div className="flex justify-between">
											<h4 className="font-medium">
												{questConnection.quest && (
													<Link href={`/quests/${questConnection.quest.slug}`}>{questConnection.quest.name}</Link>
												)}
											</h4>
											<BadgeWithTooltip
												variant={
													questConnection.importance === "critical"
														? "destructive"
														: questConnection.importance === "major"
															? "default"
															: questConnection.importance === "supporting"
																? "secondary"
																: "outline"
												}
												tooltipContent={`Importance: ${questConnection.importance} - How important this NPC is to the quest`}
											>
												{questConnection.importance}
											</BadgeWithTooltip>
										</div>
										<p className="text-sm mt-1">
											<span className="font-medium">Role:</span> {questConnection.role}
										</p>

										{questConnection.description && questConnection.description.length > 0 && (
											<div className="mt-2">
												<List
													items={questConnection.description}
													spacing="sm"
													textColor="muted"
													textSize="xs"
													maxItems={2}
												/>
											</div>
										)}

										{questConnection.hiddenAspects && questConnection.hiddenAspects.length > 0 && (
											<div className="mt-2 pt-2 border-t">
												<p className="text-xs font-medium text-red-500 flex items-center mb-2">
													<Icons.Lock className="h-3 w-3 mr-1" />
													Hidden aspects:
												</p>
												<List
													items={questConnection.hiddenAspects}
													spacing="sm"
													textColor="muted"
													textSize="xs"
													maxItems={2}
												/>
											</div>
										)}
									</div>
								))}
							</div>
						) : (
							<p className="text-muted-foreground">No quests involve this NPC</p>
						)}
					</CardContent>
				</Card>
			</div>
		</>
	)
}
