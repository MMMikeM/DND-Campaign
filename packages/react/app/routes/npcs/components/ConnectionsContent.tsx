import * as Icons from "lucide-react"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { List } from "~/components/List"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Link } from "~/components/ui/link"
import type { NPC } from "~/lib/entities"
import { getRelationshipStrengthVariant } from "../utils"

interface ConnectionsContentProps {
	npc: NPC
}

export function ConnectionsContent({ npc }: ConnectionsContentProps) {
	const { name, relations, relatedFactions, relatedSites, relatedQuests } = npc

	console.log(relations)

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
								{relations.map(
									({
										id,
										creativePrompts,
										description,
										history,
										narrativeTensions,
										npc,
										relationshipDynamics,
										sharedGoals,
										strength,
										type,
									}) => (
										<div key={`relationship-${id}`} className="border rounded p-3">
											<div className="flex justify-between">
												<Link href={`/npcs/${npc?.slug}`}>
													<h4 className="font-medium">{npc?.name}</h4>
												</Link>
											</div>
											<BadgeWithTooltip
												variant={getRelationshipStrengthVariant(strength)}
												className="capitalize"
												tooltipContent={`Relationship type - Strength`}
											>
												{strength} - {type}
											</BadgeWithTooltip>

											{description && description.length > 0 && (
												<div className="mt-2">
													<p className="text-sm font-medium mb-1">Dynamics:</p>
													<List items={description} spacing="sm" textColor="muted" textSize="xs" maxItems={2} />
												</div>
											)}

											{narrativeTensions && narrativeTensions.length > 0 && (
												<div className="mt-2">
													<p className="text-sm font-medium mb-1 flex items-center">
														<Icons.AlertTriangle className="h-3 w-3 mr-1 text-amber-500" />
														Tensions:
													</p>
													<List items={narrativeTensions} spacing="sm" textColor="muted" textSize="xs" maxItems={2} />
												</div>
											)}
										</div>
									),
								)}
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
								{relatedFactions.map(({ id, faction, justification, loyalty, rank, role, secrets }) => (
									<div key={`faction-${id}`} className="border rounded p-3">
										<div className="flex justify-between">
											<h4 className="font-medium">
												{faction && <Link href={`/factions/${faction.slug}`}>{faction.name}</Link>}
											</h4>
											<BadgeWithTooltip
												variant={
													loyalty === "high"
														? "default"
														: loyalty === "medium"
															? "secondary"
															: loyalty === "low"
																? "outline"
																: "destructive"
												}
												tooltipContent={`Loyalty level: ${loyalty} - How loyal this NPC is to the faction`}
											>
												{loyalty} loyalty
											</BadgeWithTooltip>
										</div>
										<div className="mt-2 text-sm">
											<div className="flex">
												<span className="font-medium mr-2">Role:</span>
												<span className="text-muted-foreground">{role}</span>
											</div>
											<div className="flex mt-1">
												<span className="font-medium mr-2">Rank:</span>
												<span className="text-muted-foreground">{rank}</span>
											</div>
										</div>

										{secrets && secrets.length > 0 && (
											<div className="mt-3 pt-2 border-t">
												<p className="text-xs font-medium text-red-500 flex items-center">
													<Icons.Lock className="h-3 w-3 mr-1" />
													Secrets:
												</p>
												<List items={secrets} spacing="sm" textColor="muted" textSize="xs" maxItems={2} />
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
						{relatedSites && relatedSites.length > 0 ? (
							<div className="space-y-4">
								{relatedSites.map(({ id, creativePrompts, description, site }) => (
									<div key={`location-${id}`} className="border rounded p-3">
										<div className="flex justify-between">
											<h4 className="font-medium">
												{site && <Link href={`/sites/${site.slug}`}>{site.name}</Link>}
												{!site && <span>Unnamed Location</span>}
											</h4>
											<BadgeWithTooltip variant="outline" tooltipContent="Location associated with this NPC">
												Location
											</BadgeWithTooltip>
										</div>

										{description && description.length > 0 && (
											<div className="mt-2">
												<List items={description} spacing="sm" textColor="muted" textSize="xs" maxItems={2} />
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
								{relatedQuests.map(
									({ id, quest, importance, description, hiddenAspects, creativePrompts, dramaticMoments, role }) => (
										<div key={`quest-${id}`} className="border rounded p-3">
											<div className="flex justify-between">
												<h4 className="font-medium">
													{quest && <Link href={`/quests/${quest.slug}`}>{quest.name}</Link>}
												</h4>
												<BadgeWithTooltip
													variant={
														importance === "critical"
															? "destructive"
															: importance === "major"
																? "default"
																: importance === "supporting"
																	? "secondary"
																	: "outline"
													}
													tooltipContent={`Importance: ${importance} - How important this NPC is to the quest`}
												>
													{importance}
												</BadgeWithTooltip>
											</div>
											<p className="text-sm mt-1">
												<span className="font-medium">Role:</span> {role}
											</p>

											{description && description.length > 0 && (
												<div className="mt-2">
													<List items={description} spacing="sm" textColor="muted" textSize="xs" maxItems={2} />
												</div>
											)}

											{hiddenAspects && hiddenAspects.length > 0 && (
												<div className="mt-2 pt-2 border-t">
													<p className="text-xs font-medium text-red-500 flex items-center mb-2">
														<Icons.Lock className="h-3 w-3 mr-1" />
														Hidden aspects:
													</p>
													<List items={hiddenAspects} spacing="sm" textColor="muted" textSize="xs" maxItems={2} />
												</div>
											)}
										</div>
									),
								)}
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
