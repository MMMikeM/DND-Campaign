import * as Icons from "lucide-react"
import { NavLink } from "react-router"
// import { getSiteTypeIcon } from "../utils" // Import utils if needed
import type { Site } from "~/lib/entities" // Import the Site type

export const SiteHeader = ({
	name,
	area,
}: Pick<Site, "name" | "area">) => {
	return (
		<div className="p-4 mb-6 border rounded bg-card text-card-foreground shadow-sm">
			<div className="flex justify-between items-start mb-2">
				<div>
					<h1 className="text-2xl font-bold flex items-center">
						<Icons.LocateFixed className="h-6 w-6 mr-2 text-indigo-500" />
						{name}
					</h1>
				</div>
				<div className="text-right text-sm">
					<NavLink to={`/areas/${area.slug}`} className="text-primary hover:underline flex items-center justify-end">
						<Icons.MapPin className="h-4 w-4 mr-1" />
						{area.name}
					</NavLink>
					<NavLink
						to={`/regions/${area.region.slug}`}
						className="text-muted-foreground hover:underline flex items-center justify-end mt-1"
					>
						<Icons.Map className="h-4 w-4 mr-1" />
						{area.region.name}
					</NavLink>
				</div>
			</div>
		</div>
	)
}
