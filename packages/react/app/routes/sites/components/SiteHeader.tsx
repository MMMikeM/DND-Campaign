import React from "react"
import * as Icons from "lucide-react"
import { NavLink } from "react-router"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
// import { getSiteTypeIcon } from "../utils" // Import utils if needed
import type { Site } from "~/lib/entities" // Import the Site type

interface SiteHeaderProps {
	site: Site // Use the specific Site type
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({ site }) => {
	// Destructure relevant fields from the site object
	const { name, siteType, area, terrain, climate, mood, environment } = site

	return (
		<div className="p-4 mb-6 border rounded bg-card text-card-foreground shadow-sm">
			<div className="flex justify-between items-start mb-2">
				<div>
					<h1 className="text-2xl font-bold flex items-center">
						<Icons.LocateFixed className="h-6 w-6 mr-2 text-indigo-500" />
						{name}
					</h1>
					<p className="text-muted-foreground capitalize">{siteType}</p>
				</div>
				<div className="text-right text-sm">
					{area && (
						<NavLink to={`/areas/${area.slug}`} className="text-primary hover:underline flex items-center justify-end">
							<Icons.MapPin className="h-4 w-4 mr-1" />
							{area.name}
						</NavLink>
					)}
					{area?.region && (
						<NavLink
							to={`/regions/${area.region.slug}`}
							className="text-muted-foreground hover:underline flex items-center justify-end mt-1"
						>
							<Icons.Map className="h-4 w-4 mr-1" />
							{area.region.name}
						</NavLink>
					)}
				</div>
			</div>

			<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-3">
				{terrain && (
					<span className="flex items-center">
						<Icons.Mountain className="h-4 w-4 mr-1" /> Terrain: {terrain}
					</span>
				)}
				{climate && (
					<span className="flex items-center">
						<Icons.Thermometer className="h-4 w-4 mr-1" /> Climate: {climate}
					</span>
				)}
				{mood && (
					<span className="flex items-center">
						<Icons.Smile className="h-4 w-4 mr-1" /> Mood: {mood}
					</span>
				)}
				{environment && (
					<span className="flex items-center">
						<Icons.Trees className="h-4 w-4 mr-1" /> Environment: {environment}
					</span>
				)}
			</div>
		</div>
	)
}

export default SiteHeader
