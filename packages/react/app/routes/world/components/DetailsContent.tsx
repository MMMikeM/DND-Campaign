import React from "react";
import * as Icons from "lucide-react";
import { InfoCard } from "~/components/InfoCard";
import { List } from "~/components/List";
import { BadgeWithTooltip } from "~/components/badge-with-tooltip";
import { getChangeSeverityVariant } from "../utils"; // Assuming severity variant helper is in utils
import type { WorldChange } from "~/lib/entities"; // Use the type from index.tsx

interface DetailsContentProps {
	change: WorldChange;
}

// Placeholder for visibility variant - move to utils if needed
const getVisibilityVariant = (visibility: string): "default" | "destructive" | "outline" | "secondary" => {
	switch (visibility) {
		case "public":
			return "default";
		case "secret":
			return "destructive";
		case "obscure":
		default:
			return "outline";
	}
};

export function DetailsContent({ change }: DetailsContentProps) {
	const {
		description,
		// cause, // This field does not exist
		changeType,
		severity,
		visibility,
		sourceType, // Add sourceType
		timeframe,
		// Add other relevant detail fields if necessary
	} = change;

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			{/* Left Column */}
			<div className="space-y-6">
				<InfoCard
					title="Description"
					icon={<Icons.ScrollText className="h-4 w-4 mr-2 text-blue-600" />}
					emptyMessage="No description provided."
				>
					{description && description.length > 0 && (
						<List items={description} spacing="sm" textColor="muted" />
					)}
				</InfoCard>

				{/* Removed Cause InfoCard */}
			</div>

			{/* Right Column */}
			<div className="space-y-6">
				<InfoCard
					title="Attributes"
					icon={<Icons.Info className="h-4 w-4 mr-2 text-indigo-600" />}
				>
					<div className="space-y-3 p-4">
						<div className="flex justify-between items-center">
							<span className="font-medium text-sm">Type</span>
							<span className="text-muted-foreground text-sm capitalize">{changeType}</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="font-medium text-sm">Severity</span>
							<BadgeWithTooltip
								variant={getChangeSeverityVariant(severity)}
								tooltipContent={`Severity: ${severity}`}
								className="capitalize"
							>
								{severity}
							</BadgeWithTooltip>
						</div>
						<div className="flex justify-between items-center">
							<span className="font-medium text-sm">Visibility</span>
							<BadgeWithTooltip
								variant={getVisibilityVariant(visibility)}
								tooltipContent={`Visibility: ${visibility}`}
								className="capitalize"
							>
								{visibility}
							</BadgeWithTooltip>
						</div>
						<div className="flex justify-between items-center">
							<span className="font-medium text-sm">Timeframe</span>
							<span className="text-muted-foreground text-sm capitalize">{timeframe}</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="font-medium text-sm">Source Type</span>
							<span className="text-muted-foreground text-sm capitalize">{sourceType}</span>
						</div>
					</div>
				</InfoCard>

				{/* Add more InfoCards here for other relevant detail data */}
			</div>
		</div>
	);
}

export default DetailsContent;
