import React from "react"
import { NavLink } from "react-router"
import {
	Flag,
	Info,
	AlertTriangle,
	CreditCard,
	Globe,
	Landmark,
	Target,
	Heart,
	BookOpen,
	Briefcase,
	Users,
	UserCircle,
	MapPin,
	Compass,
	Network,
	Sparkles,
	Construction,
	Languages,
	ListFilter,
	Scroll,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { List } from "~/components/ui/list"
import type { Faction } from "~/lib/entities"

// Helper functions for badge variants
export const getAlignmentVariant = (alignment: string) => {
	if (alignment.includes("good")) return "default"
	if (alignment.includes("evil")) return "destructive"
	return "secondary"
}

export const getWealthVariant = (wealth: string) => {
	switch (wealth) {
		case "wealthy":
		case "rich":
			return "default"
		case "moderate":
			return "secondary"
		case "poor":
		case "destitute":
			return "destructive"
		default:
			return "outline"
	}
}

export const getSizeVariant = (size: string) => {
	switch (size) {
		case "massive":
		case "large":
			return "default"
		case "medium":
			return "secondary"
		case "small":
		case "tiny":
			return "outline"
		default:
			return "outline"
	}
}

export const getReachVariant = (reach: string) => {
	switch (reach) {
		case "global":
		case "continental":
			return "default"
		case "national":
			return "secondary"
		case "regional":
		case "local":
			return "outline"
		default:
			return "outline"
	}
}

// Simplified Card component
export const SimpleCard: React.FC<{
	title: string
	icon?: React.ReactNode
	description?: string
	children: React.ReactNode
}> = ({ title, icon, description, children }) => (
	<div className="border rounded-lg shadow-sm p-4">
		<div className="mb-4">
			<h3 className="text-lg font-medium flex items-center">
				{icon && <span className="mr-2">{icon}</span>}
				{title}
			</h3>
			{description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
		</div>
		<div>{children}</div>
	</div>
)

// Components
export const FactionHeader: React.FC<Faction> = ({ name, alignment, size, wealth, reach, type }) => (
	<div className="mb-6">
		<h1 className="text-3xl font-bold flex items-center">
			<Flag className="h-6 w-6 mr-3 text-indigo-500" />
			{name}
		</h1>
		<div className="flex flex-wrap gap-2 mt-2">
			<Badge variant={getAlignmentVariant(alignment)} className="flex items-center">
				<Heart className="h-3.5 w-3.5 mr-1" />
				{alignment}
			</Badge>
			<Badge variant={getSizeVariant(size)} className="flex items-center">
				<Users className="h-3.5 w-3.5 mr-1" />
				{size}
			</Badge>
			<Badge variant={getWealthVariant(wealth)} className="flex items-center">
				<CreditCard className="h-3.5 w-3.5 mr-1" />
				{wealth}
			</Badge>
			<Badge variant={getReachVariant(reach)} className="flex items-center">
				<Globe className="h-3.5 w-3.5 mr-1" />
				{reach}
			</Badge>
			<Badge variant="outline" className="flex items-center">
				<Landmark className="h-3.5 w-3.5 mr-1" />
				{type}
			</Badge>
		</div>
	</div>
)

export const OverviewGoalsCard: React.FC<Faction> = ({ publicGoal, secretGoal }) => (
	<div>
		<h3 className="font-medium mb-2 flex items-center">
			<Target className="h-4 w-4 mr-2" />
			Goals
		</h3>
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div className="border rounded-md p-3">
				<p className="text-sm font-medium mb-2">Public Goal</p>
				<p className="text-muted-foreground">{publicGoal}</p>
			</div>
			{secretGoal && (
				<div className="border rounded-md p-3 border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900">
					<p className="text-sm font-medium mb-2 flex items-center">
						<AlertTriangle className="h-4 w-4 mr-1 text-red-500" />
						Secret Goal
					</p>
					<p className="text-muted-foreground">{secretGoal}</p>
				</div>
			)}
		</div>
	</div>
)

export const PerceptionSection: React.FC<Faction> = ({ publicPerception }) => (
	<div>
		<h3 className="font-medium mb-2 flex items-center">
			<Info className="h-4 w-4 mr-2" />
			Public Perception
		</h3>
		<p className="text-muted-foreground">{publicPerception}</p>
	</div>
)

export const HeadquartersCard: React.FC<Faction> = ({ headquarters }) => (
	<Card>
		<CardHeader>
			<CardTitle className="text-xl">Headquarters</CardTitle>
			<CardDescription>Main base of operations</CardDescription>
		</CardHeader>
		<CardContent>
			{headquarters && headquarters.length > 0 ? (
				<div className="space-y-4">
					{headquarters.map(({ id, creativePrompts, description, location }) => (
						<div key={id}>
							<div>
								{console.log(location)}
								<h3 className="font-medium mb-2 flex items-center">
									<MapPin className="h-4 w-4 mr-2" />
									Location
								</h3>
								<List items={description} heading="Description" icon={<Info className="h-4 w-4 mr-2" />} />
								<List items={creativePrompts} />
								{location && (
									<div className="border rounded-md p-3">
										<NavLink to={`/locations/${location.slug}`} className="font-medium hover:text-indigo-500">
											{location.name}
										</NavLink>
									</div>
								)}
							</div>

							<div className="mt-4">
								<List items={description} heading="Description" icon={<Info className="h-4 w-4 mr-2" />} />
							</div>

							{creativePrompts && creativePrompts.length > 0 && (
								<div className="mt-4">
									<List
										items={creativePrompts}
										heading="Creative Prompts"
										icon={<Sparkles className="h-4 w-4 mr-2" />}
									/>
								</div>
							)}
						</div>
					))}
				</div>
			) : (
				<div className="text-center py-6 text-muted-foreground">
					<p>No headquarters information available</p>
				</div>
			)}
		</CardContent>
	</Card>
)

export const DetailsCard: React.FC<{ title: string; icon: React.ReactNode; items: string[] }> = ({
	title,
	icon,
	items,
}) => (
	<Card>
		<CardHeader>
			<CardTitle className="text-lg flex items-center">
				{icon}
				{title}
			</CardTitle>
		</CardHeader>
		<CardContent>
			<List items={items} heading={title} />
		</CardContent>
	</Card>
)

// Simplified version using SimpleCard
export const SimplifiedDetailsCard: React.FC<{ title: string; icon: React.ReactNode; items: string[] }> = ({
	title,
	icon,
	items,
}) => (
	<SimpleCard title={title} icon={icon}>
		<List items={items} />
	</SimpleCard>
)

export const CultureCard: React.FC<{ title: string; icon: React.ReactNode; items: string[] }> = ({
	title,
	icon,
	items,
}) => (
	<Card>
		<CardHeader>
			<CardTitle className="text-lg flex items-center">
				{icon}
				{title}
			</CardTitle>
		</CardHeader>
		<CardContent>
			<List items={items} heading={title} />
		</CardContent>
	</Card>
)

export const OperationCard: React.FC<{ operation: Faction["operations"][number] }> = ({ operation }) => (
	<Card>
		<CardHeader>
			<CardTitle className="text-xl flex items-center">
				<Construction className="h-5 w-5 mr-2 text-indigo-500" />
				{operation.name}
			</CardTitle>
			<div className="flex flex-wrap gap-2 mt-1">
				<Badge>{operation.type}</Badge>
				<Badge
					variant={
						operation.scale === "massive"
							? "destructive"
							: operation.scale === "major"
								? "default"
								: operation.scale === "moderate"
									? "secondary"
									: "outline"
					}
				>
					{operation.scale}
				</Badge>
				<Badge
					variant={
						operation.status === "completed"
							? "default"
							: operation.status === "ongoing"
								? "default"
								: operation.status === "planning"
									? "outline"
									: "secondary"
					}
				>
					{operation.status}
				</Badge>
				<Badge
					variant={
						operation.priority === "high"
							? "destructive"
							: operation.priority === "medium"
								? "default"
								: "outline"
					}
				>
					{operation.priority} priority
				</Badge>
			</div>
		</CardHeader>
		<CardContent>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<h4 className="font-medium mb-2">Description</h4>
					<List items={operation.description} />
				</div>
				<div>
					<h4 className="font-medium mb-2">Objectives</h4>
					<List items={operation.objectives} />

					<h4 className="font-medium mt-4 mb-2">Locations</h4>
					<List items={operation.locations} />
				</div>
			</div>

			{operation.involved_npcs && operation.involved_npcs.length > 0 && (
				<div className="mt-4">
					<h4 className="font-medium mb-2">NPCs Involved</h4>
					<div className="flex flex-wrap gap-2">
						{operation.involved_npcs.map((npc) => (
							<Badge key={`op-${operation.id}-npc-${npc}`} variant="outline">
								{npc}
							</Badge>
						))}
					</div>
				</div>
			)}
		</CardContent>
	</Card>
)

export const RegionInfluenceCard: React.FC<{ name: string; relatedRegions: Faction["relatedRegions"] }> = ({
	name,
	relatedRegions,
}) => (
	<Card>
		<CardHeader>
			<CardTitle className="text-lg flex items-center">
				<Compass className="h-4 w-4 mr-2" />
				Regions of Influence
			</CardTitle>
			<CardDescription>Areas where {name} holds power</CardDescription>
		</CardHeader>
		<CardContent>
			{relatedRegions && relatedRegions.length > 0 ? (
				<div className="space-y-4">
					{relatedRegions.map((factionRegion) => (
						<div key={`region-${factionRegion.id}`} className="border rounded p-3">
							<div className="flex justify-between">
								<h4 className="font-medium">
									<NavLink to={`/regions/${factionRegion.region?.slug}`} className="hover:text-indigo-500">
										{factionRegion.region?.name}
									</NavLink>
								</h4>
								<Badge
									variant={
										factionRegion.controlLevel === "dominated"
											? "destructive"
											: factionRegion.controlLevel === "controlled"
												? "default"
												: factionRegion.controlLevel === "influenced"
													? "secondary"
													: "outline"
									}
								>
									{factionRegion.controlLevel}
								</Badge>
							</div>

							{factionRegion.presence && factionRegion.presence.length > 0 && (
								<div className="mt-2">
									<p className="text-sm font-medium mb-1">Presence:</p>
									<List items={factionRegion.presence} />
								</div>
							)}

							{factionRegion.priorities && factionRegion.priorities.length > 0 && (
								<div className="mt-2">
									<p className="text-sm font-medium mb-1">Priorities:</p>
									<List items={factionRegion.priorities} />
								</div>
							)}
						</div>
					))}
				</div>
			) : (
				<p className="text-muted-foreground">No regional influence information available.</p>
			)}
		</CardContent>
	</Card>
)

export const RelationsCard: React.FC<{ outgoingRelationships: Faction["outgoingRelationships"] }> = ({
	outgoingRelationships,
}) => (
	<Card>
		<CardHeader>
			<CardTitle className="text-lg flex items-center">
				<Network className="h-4 w-4 mr-2" />
				Relations
			</CardTitle>
			<CardDescription>Relationships with other factions</CardDescription>
		</CardHeader>
		<CardContent>
			{outgoingRelationships && outgoingRelationships.length > 0 ? (
				<div className="space-y-4">
					{outgoingRelationships.map((relation) => (
						<div key={`relation-${relation.id}`} className="border rounded p-3">
							<div className="flex justify-between">
								<h4 className="font-medium">
									{relation.targetFaction && (
										<NavLink
											to={`/factions/${relation.targetFaction.slug}`}
											className="hover:text-indigo-500"
										>
											{relation.targetFaction.name}
										</NavLink>
									)}
								</h4>
								<Badge
									variant={
										relation.type === "ally"
											? "default"
											: relation.type === "enemy"
												? "destructive"
												: "secondary"
									}
								>
									{relation.type} ({relation.strength})
								</Badge>
							</div>

							{relation.description && relation.description.length > 0 && (
								<div className="mt-2">
									<List items={relation.description} />
								</div>
							)}
						</div>
					))}
				</div>
			) : (
				<p className="text-muted-foreground">No relations with other factions established.</p>
			)}
		</CardContent>
	</Card>
)

export const RelatedQuestsCard: React.FC<{ name: string; relatedQuests: Faction["relatedQuests"] }> = ({
	name,
	relatedQuests,
}) => (
	<Card>
		<CardHeader>
			<CardTitle className="text-lg flex items-center">
				<Scroll className="h-4 w-4 mr-2" />
				Related Quests
			</CardTitle>
			<CardDescription>Quests where {name} is involved</CardDescription>
		</CardHeader>
		<CardContent>
			{relatedQuests && relatedQuests.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{relatedQuests.map((questInfo) => (
						<div key={`quest-${questInfo.id}`} className="border rounded p-4">
							<h4 className="font-medium">
								<NavLink to={`/quests/${questInfo.quest?.slug}`} className="hover:text-indigo-500">
									{questInfo.quest?.name}
								</NavLink>
							</h4>
							<Badge className="mt-1">{questInfo.role}</Badge>
							<List items={questInfo.interest} heading="Interest" />
						</div>
					))}
				</div>
			) : (
				<p className="text-muted-foreground">No quests associated with this faction</p>
			)}
		</CardContent>
	</Card>
)

export const MembersCard: React.FC<{ name: string; members: Faction["members"] }> = ({ name, members }) => (
	<Card>
		<CardHeader>
			<CardTitle className="text-lg flex items-center">
				<UserCircle className="h-4 w-4 mr-2" />
				Members
			</CardTitle>
			<CardDescription>NPCs affiliated with {name}</CardDescription>
		</CardHeader>
		<CardContent>
			{members && members.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{members.map((npcInfo) => (
						<div key={`npc-${npcInfo.id}`} className="border rounded p-4">
							<div className="flex items-center justify-between">
								<h4 className="font-medium">
									<NavLink to={`/npcs/${npcInfo.npc?.slug!}`} className="hover:text-indigo-500">
										{npcInfo.npc?.name}
									</NavLink>
								</h4>
								<Badge
									variant={
										npcInfo.loyalty === "high"
											? "default"
											: npcInfo.loyalty === "medium"
												? "default"
												: npcInfo.loyalty === "low"
													? "secondary"
													: "outline"
									}
								>
									{npcInfo.loyalty}
								</Badge>
							</div>
							<div className="mt-2 text-sm text-muted-foreground">
								<div className="flex">
									<span className="font-medium mr-2">Rank:</span>
									<span>{npcInfo.rank}</span>
								</div>
								<div className="flex mt-1">
									<span className="font-medium mr-2">Role:</span>
									<span>{npcInfo.role}</span>
								</div>
							</div>
							{npcInfo.secrets && npcInfo.secrets.length > 0 && (
								<div className="mt-3 border-t pt-2">
									<List items={npcInfo.secrets} heading="Secrets" />
								</div>
							)}
						</div>
					))}
				</div>
			) : (
				<p className="text-muted-foreground">No NPCs are currently members of this faction</p>
			)}
		</CardContent>
	</Card>
)
