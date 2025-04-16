import * as Icons from "lucide-react"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Optional } from "~/components/Optional"
import { Link } from "~/components/ui/link"
import type { NPC } from "~/lib/entities"
import { getRelationshipStrengthVariant } from "../utils"

export function ConnectionsContent({ name, relations, relatedFactions, relatedSites, relatedQuests }: NPC) {
	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
				<InfoCard
					title="Relationships"
					description="Connections to other NPCs"
					icon={<Icons.Network className="h-4 w-4 mr-2 text-indigo-600" />}
					emptyMessage="No known relationships for this NPC"
					contentClassName="space-y-4"
				>
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
							<div key={`relationship-${id}`} className="border-b last:border-b-0 p-3 space-y-3">
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

								<List
									heading="Description"
									icon={<Icons.Info className="h-3 w-3 mr-1" />}
									items={description}
									spacing="sm"
									textColor="muted"
									textSize="xs"
									collapsible={false}
								/>

								<List
									heading="Tensions"
									icon={<Icons.AlertTriangle className="h-3 w-3 mr-1 text-amber-500" />}
									items={narrativeTensions}
									spacing="sm"
									textColor="muted"
									textSize="xs"
								/>
								<List
									heading="Shared Goals"
									icon={<Icons.Info className="h-3 w-3 mr-1" />}
									items={sharedGoals}
									spacing="sm"
									textColor="muted"
									textSize="xs"
								/>
								<List
									heading="Relationship Dynamics"
									icon={<Icons.Info className="h-3 w-3 mr-1" />}
									items={relationshipDynamics}
									spacing="sm"
									textColor="muted"
									textSize="xs"
								/>
								<List
									heading="Creative Prompts"
									icon={<Icons.Info className="h-3 w-3 mr-1" />}
									items={creativePrompts}
									spacing="sm"
									textColor="muted"
									textSize="xs"
								/>
								<List
									heading="History"
									icon={<Icons.Info className="h-3 w-3 mr-1" />}
									items={history}
									spacing="sm"
									textColor="muted"
									textSize="xs"
								/>
							</div>
						),
					)}
				</InfoCard>

				<InfoCard
					title="Faction Affiliations"
					description="Organizations {name} is associated with"
					icon={<Icons.Flag className="h-4 w-4 mr-2 text-red-600" />}
					emptyMessage="No known faction affiliations for this NPC"
					contentClassName="space-y-4"
				>
					{relatedFactions.map(({ id, faction, justification, loyalty, rank, role, secrets }) => (
						<div key={`faction-${id}`} className="border-b last:border-b-0 p-3 space-y-3">
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
							<div className="flex">
								<span className="font-medium mr-2">Role:</span>
								<span className="text-muted-foreground">{role}</span>
							</div>
							<div className="flex">
								<span className="font-medium mr-2">Rank:</span>
								<span className="text-muted-foreground">{rank}</span>
							</div>
							<div className=" text-sm">Justification: {justification}</div>

							<List
								heading="Secrets"
								icon={<Icons.Lock className="h-3 w-3 mr-1" />}
								items={secrets}
								spacing="sm"
								textColor="muted"
								textSize="xs"
								collapsible={false}
							/>
						</div>
					))}
				</InfoCard>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<InfoCard
					title="Associated Locations"
					description={`Places where ${name} can be found`}
					icon={<Icons.MapPin className="h-4 w-4 mr-2 text-emerald-600" />}
					emptyMessage="No associated locations for this NPC"
				>
					<Optional fallback={<p className="text-muted-foreground">No associated locations for this NPC</p>}>
						{relatedSites.map(({ id, creativePrompts, description, site }) => (
							<div key={`location-${id}`} className="border-b last:border-b-0 rounded p-3">
								<div className="flex justify-between">
									<h4 className="font-medium">
										{site ? <Link href={`/sites/${site.slug}`}>{site.name}</Link> : <span>Unnamed Location</span>}
									</h4>
									<BadgeWithTooltip variant="outline" tooltipContent="Location associated with this NPC">
										Location
									</BadgeWithTooltip>
								</div>

								<List items={description} spacing="sm" textColor="muted" textSize="xs" />
							</div>
						))}
					</Optional>
				</InfoCard>

				<InfoCard
					title="Involved Quests"
					description={`Quests where ${name} plays a role`}
					icon={<Icons.Scroll className="h-4 w-4 mr-2 text-amber-600" />}
					emptyMessage="No quests involve this NPC"
				>
					{relatedQuests.map(
						({ id, quest, importance, description, hiddenAspects, creativePrompts, dramaticMoments, role }) => (
							<div key={`quest-${id}`} className="border-b last:border-b-0 p-3 space-y-3">
								<div className="flex justify-between">
									<h4 className="font-medium">{quest && <Link href={`/quests/${quest.slug}`}>{quest.name}</Link>}</h4>
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

								<List
									heading="Description"
									icon={<Icons.Info className="h-3 w-3 mr-1" />}
									items={description}
									spacing="sm"
									textColor="muted"
									textSize="xs"
									collapsible={false}
								/>

								<List
									heading="Dramatic Moments"
									icon={<Icons.Info className="h-3 w-3 mr-1" />}
									items={dramaticMoments}
									spacing="sm"
									textColor="muted"
									textSize="xs"
								/>

								<List
									icon={<Icons.Lock className="h-3 w-3 mr-1" />}
									items={hiddenAspects}
									spacing="sm"
									textColor="muted"
									textSize="xs"
									heading="Hidden aspects"
								/>

								<List
									heading="Creative Prompts"
									icon={<Icons.Info className="h-3 w-3 mr-1" />}
									items={creativePrompts}
									spacing="sm"
									textColor="muted"
									textSize="xs"
								/>
							</div>
						),
					)}
				</InfoCard>
			</div>
		</>
	)
}
