import React from "react";
import * as Icons from "lucide-react";
import { InfoCard } from "~/components/InfoCard";
import { Link } from "~/components/ui/link";
import type { WorldChange } from "~/lib/entities"; // Use the type from index.tsx

interface ImpactContentProps {
	change: WorldChange;
}

// Helper component to render a list of affected entities
const AffectedList = ({ title, icon, items, basePath }: { title: string; icon: React.ReactNode; items?: Array<{ id: number; name: string; slug: string }> | null; basePath: string }) => {
	if (!items || items.length === 0) {
		return null; // Don't render the card if there are no items
	}

	return (
		<InfoCard title={title} icon={icon} emptyMessage={`No ${title.toLowerCase()} affected.`}>
			<div className="space-y-2 p-4">
				{items.map((item) => (
					<Link key={item.id} href={`/${basePath}/${item.slug}`} className="block text-sm text-primary hover:underline">
						{item.name}
					</Link>
				))}
			</div>
		</InfoCard>
	);
};


export function ImpactContent({ change }: ImpactContentProps) {
	const {
		affectedFaction,
		affectedRegion,
		affectedLocation,
		affectedNpc,
		// Add other relevant impact fields if necessary
	} = change;

	// Wrap potentially single items in arrays for consistent mapping in AffectedList
	const factions = affectedFaction ? [affectedFaction] : [];
	const regions = affectedRegion ? [affectedRegion] : [];
	const locations = affectedLocation ? [affectedLocation] : [];
	const npcs = affectedNpc ? [affectedNpc] : [];


	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<AffectedList title="Affected Factions" icon={<Icons.Flag className="h-4 w-4 mr-2 text-red-600" />} items={factions} basePath="factions" />
			<AffectedList title="Affected Regions" icon={<Icons.Map className="h-4 w-4 mr-2 text-green-600" />} items={regions} basePath="regions" />
			<AffectedList title="Affected Locations" icon={<Icons.MapPin className="h-4 w-4 mr-2 text-purple-600" />} items={locations} basePath="locations" />
			<AffectedList title="Affected NPCs" icon={<Icons.User className="h-4 w-4 mr-2 text-indigo-600" />} items={npcs} basePath="npcs" />
		</div>
	);
}

export default ImpactContent;
