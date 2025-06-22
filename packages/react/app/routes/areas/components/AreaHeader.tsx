import * as Icons from "lucide-react"
import { NavLink } from "react-router"

import { Badge } from "~/components/ui/badge"
import type { Area } from "~/lib/entities"

export function AreaHeader({
	name,
	type,
	region,
	dangerLevel,
}: Pick<Area, "name" | "type" | "region" | "dangerLevel">) {
	return (
		<div className="p-4 mb-6 border rounded bg-card text-card-foreground shadow-sm">
			<div className="flex justify-between items-start">
				<div>
					<h1 className="text-2xl font-bold flex items-center">
						<Icons.MapPinned className="h-6 w-6 mr-2 text-indigo-500" />
						{name}
					</h1>
					<p className="text-muted-foreground capitalize">{type}</p>
				</div>
				<div className="text-right">
					{region && (
						<NavLink
							className="text-sm text-primary hover:underline flex items-center justify-end"
							to={`/regions/${region.slug}`}
						>
							<Icons.Map className="h-4 w-4 mr-1" />
							{region.name}
						</NavLink>
					)}
				</div>
			</div>
			<div className="mt-3">
				<Badge variant={getDangerVariant(dangerLevel)} className="capitalize">
					{dangerLevel}
				</Badge>
			</div>
		</div>
	)
}

const getDangerVariant = (level: string) => {
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
