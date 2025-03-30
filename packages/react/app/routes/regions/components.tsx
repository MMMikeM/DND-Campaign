import React from "react"
import { NavLink } from "react-router"
import * as Icons from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { List } from "~/components/ui/list"
import { SimpleCard } from "../factions/components"
import type { Region } from "~/lib/entities"
import { Link } from "~/components/ui/link"

// Helper function for danger level badge variant
export const getDangerVariant = (level: string) => {
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

// Region Header component
export const RegionHeader: React.FC<{
	name: string
	type: string
	dangerLevel: string
	economy: string
	population: string
}> = ({ name, type, dangerLevel, economy, population }) => (
	<div className="mb-6">
		<h1 className="text-3xl font-bold flex items-center">
			<Icons.Map className="h-6 w-6 mr-3 text-indigo-500" />
			{name}
		</h1>
		<div className="flex flex-wrap gap-2 mt-2">
			<Badge variant="outline" className="flex items-center">
				<Icons.Mountain className="h-3.5 w-3.5 mr-1" />
				{type}
			</Badge>
			<Badge variant={getDangerVariant(dangerLevel)} className="flex items-center">
				<Icons.AlertTriangle className="h-3.5 w-3.5 mr-1" />
				{dangerLevel} danger
			</Badge>
			<Badge variant="outline" className="flex items-center">
				<Icons.CircleDollarSign className="h-3.5 w-3.5 mr-1" />
				{economy}
			</Badge>
			<Badge variant="outline" className="flex items-center">
				<Icons.Users className="h-3.5 w-3.5 mr-1" />
				Pop: {population}
			</Badge>
		</div>
	</div>
)

// Overview Card component
export const OverviewCard: React.FC<{
	name: string
	history: string
	description: string[]
	culturalNotes: string[]
}> = ({ name, history, description, culturalNotes }) => (
	<Card className="mb-6">
		<CardHeader>
			<CardTitle className="text-xl">Overview</CardTitle>
			<CardDescription>Essential information about {name}</CardDescription>
		</CardHeader>
		<CardContent>
			<div className="space-y-4">
				<div>
					<h3 className="font-medium mb-2 flex items-center">
						<Icons.BookOpen className="h-4 w-4 mr-2" />
						History
					</h3>
					<p className="text-muted-foreground">{history}</p>
				</div>

				<div className="border-t pt-4">
					<List
						heading="Description"
						items={description}
						position="outside"
						spacing="sm"
						textColor="muted"
						icon={<Icons.Info className="h-4 w-4 mr-2" />}
					/>
				</div>

				<div className="border-t pt-4">
					<List
						heading="Culture"
						items={culturalNotes}
						position="outside"
						spacing="sm"
						textColor="muted"
						icon={<Icons.Building className="h-4 w-4 mr-2" />}
					/>
				</div>
			</div>
		</CardContent>
	</Card>
)

// Region Stats Card component with SimpleCard
export const RegionTypeCard: React.FC<{
	type: string
	dangerLevel: string
}> = ({ type, dangerLevel }) => (
	<SimpleCard title="Type & Geography" icon={<Icons.Layers className="h-4 w-4 mr-2" />}>
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<span className="font-medium">Region Type:</span>
				<Badge variant="outline">{type}</Badge>
			</div>
			<div className="flex items-center justify-between">
				<span className="font-medium">Danger Level:</span>
				<Badge variant={getDangerVariant(dangerLevel)}>{dangerLevel}</Badge>
			</div>
			<p className="text-sm text-muted-foreground mt-2">
				This {type} region has a {dangerLevel} danger level, making it{" "}
				{dangerLevel === "safe"
					? "suitable for all travelers"
					: dangerLevel === "low"
						? "relatively safe for most adventurers"
						: dangerLevel === "moderate"
							? "challenging for inexperienced travelers"
							: "extremely hazardous to all but the most prepared"}
				.
			</p>
		</div>
	</SimpleCard>
)

// Key Stats Card component with SimpleCard
export const KeyStatsCard: React.FC<Region> = ({ population, economy, locations, factions, quests }) => (
	<SimpleCard title="Key Stats" icon={<Icons.NetworkIcon className="h-4 w-4 mr-2" />}>
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<span className="font-medium">Population:</span>
				<span>{population}</span>
			</div>
			<div className="flex items-center justify-between">
				<span className="font-medium">Economy:</span>
				<span>{economy}</span>
			</div>
			<div className="flex items-center justify-between">
				<span className="font-medium">Locations:</span>
				<Badge variant="outline">{locations.length}</Badge>
			</div>
			<div className="flex items-center justify-between">
				<span className="font-medium">Factions:</span>
				<Badge variant="outline">{factions.length}</Badge>
			</div>
			<div className="flex items-center justify-between">
				<span className="font-medium">Active Quests:</span>
				<Badge variant="outline">{quests.length}</Badge>
			</div>
		</div>
	</SimpleCard>
)

// ListCard component with SimpleCard
export const ListCard: React.FC<{
	title: string
	icon: React.ReactNode
	items: string[]
	emptyText?: string
}> = ({ title, icon, items, emptyText = "No information available" }) => (
	<SimpleCard title={title} icon={icon}>
		<List items={items} position="outside" spacing="sm" emptyText={emptyText} />
	</SimpleCard>
)

// Location Card component
export const LocationsCard: React.FC<{
	locations: Region["locations"]
}> = ({ locations }) => (
	<Card>
		<CardHeader>
			<CardTitle className="text-lg flex items-center">
				<Icons.Building2 className="h-4 w-4 mr-2" />
				Notable Locations
			</CardTitle>
			<CardDescription>Specific places of interest within this region</CardDescription>
		</CardHeader>
		<CardContent>
			{locations && locations.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{locations.map((location) => (
						<div key={`location-${location.id}`} className="border rounded p-4">
							<Link href={`/locations/${location.slug}`}>
								<h4 className="font-medium flex items-center">
									<Icons.LocateFixed className="h-4 w-4 mr-2 text-indigo-500" />
									{location.name}
								</h4>
							</Link>
							<Badge variant="outline" className="mt-1">
								{location.locationType}
							</Badge>
							<p className="text-xs mt-2 text-muted-foreground">{location.mood}</p>
							<div className="mt-3 space-y-2">
								<div className="flex text-xs text-muted-foreground">
									<span className="font-medium mr-2">Terrain:</span>
									<span>{location.terrain}</span>
								</div>
								<div className="flex text-xs text-muted-foreground">
									<span className="font-medium mr-2">Climate:</span>
									<span>{location.climate}</span>
								</div>
							</div>
							<div className="mt-3">
								<List
									items={location.description}
									position="outside"
									spacing="sm"
									emptyText="No description available"
								/>
							</div>
							{location.encounters && location.encounters.length > 0 && (
								<div className="mt-2">
									<Badge variant="secondary" className="text-xs">
										{location.encounters.length} encounters
									</Badge>
								</div>
							)}
							{location.secrets && location.secrets.length > 0 && (
								<div className="mt-1">
									<Badge variant="outline" className="text-xs">
										{location.secrets.length} secrets
									</Badge>
								</div>
							)}
						</div>
					))}
				</div>
			) : (
				<p className="text-muted-foreground">No specific locations have been added to this region yet.</p>
			)}
		</CardContent>
	</Card>
)

// Economy Card component with SimpleCard
export const EconomyCard: React.FC<{
	economy: string
	population: string
}> = ({ economy, population }) => (
	<SimpleCard title="Economy" icon={<Icons.CircleDollarSign className="h-4 w-4 mr-2" />}>
		<p>{economy}</p>
		<p className="mt-4 text-sm text-muted-foreground">
			The region has a {population} population with a {economy}-based economy.
		</p>
	</SimpleCard>
)

// Factions Card component
export const FactionsCard: React.FC<{
	name: string
	factions: Region["factions"]
}> = ({ name, factions }) => (
	<Card>
		<CardHeader>
			<CardTitle className="text-lg flex items-center">
				<Icons.Flag className="h-4 w-4 mr-2" />
				Factions in the Region
			</CardTitle>
			<CardDescription>Organizations operating in {name}</CardDescription>
		</CardHeader>
		<CardContent>
			{factions && factions.length > 0 ? (
				<div className="space-y-4">
					{factions.map((faction) => (
						<div key={`faction-${faction.id}`} className="border rounded p-3">
							<div className="flex justify-between">
								<h4 className="font-medium">
									<NavLink to={`/factions/${faction.faction.slug}`} className="hover:text-indigo-500">
										{faction.faction.name}
									</NavLink>
								</h4>
								<Badge
									variant={
										faction.controlLevel === "dominated"
											? "destructive"
											: faction.controlLevel === "controlled"
												? "default"
												: faction.controlLevel === "influenced"
													? "secondary"
													: "outline"
									}
								>
									{faction.controlLevel}
								</Badge>
							</div>
							<div className="mt-2">
								<List
									heading="Presence"
									items={faction.presence}
									position="outside"
									spacing="sm"
									emptyText="No details on presence"
								/>
							</div>
							<div className="mt-2">
								<List
									heading="Priorities"
									items={faction.priorities}
									position="outside"
									spacing="sm"
									emptyText="No stated priorities"
								/>
							</div>
						</div>
					))}
				</div>
			) : (
				<p className="text-muted-foreground">No factions are currently operating in this region.</p>
			)}
		</CardContent>
	</Card>
)
