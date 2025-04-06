import React from "react"
import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import type { Site } from "~/lib/entities"
// import { getDifficultyVariant } from "../utils" // Assuming utils will have this

interface SecretsContentProps {
	site: Site
}

export const SecretsContent: React.FC<SecretsContentProps> = ({ site }) => {
	const { secrets } = site

	// Placeholder difficulty variant function (move to utils)
	const getDifficultyVariant = (level: string | null | undefined) => {
		switch (level) {
			case "obvious":
				return "outline"
			case "simple":
				return "secondary"
			case "moderate":
				return "default"
			case "challenging":
				return "destructive"
			case "nearly impossible":
				return "destructive" // Or a different style
			default:
				return "outline"
		}
	}
	const getDifficultyTooltip = (level: string | null | undefined) => {
		switch (level) {
			case "obvious":
				return "Easily discovered"
			case "simple":
				return "Requires minimal investigation"
			case "moderate":
				return "Requires some effort or specific checks"
			case "challenging":
				return "Difficult to uncover"
			case "nearly impossible":
				return "Extremely well hidden or protected"
			default:
				return "Discovery difficulty unknown"
		}
	}

	return (
		<InfoCard
			title="Secrets"
			icon={<Icons.Key className="h-4 w-4 mr-2 text-primary" />}
			emptyMessage="No known secrets at this site."
		>
			{secrets && secrets.length > 0 ? (
				<div className="space-y-4">
					{secrets.map((secret) => (
						<div key={`secret-${secret.id}`} className="border rounded p-4">
							<div className="flex justify-between items-start mb-1">
								<h4 className="font-medium flex items-center">{secret.secretType} Secret</h4>
								<BadgeWithTooltip
									variant={getDifficultyVariant(secret.difficultyToDiscover)}
									tooltipContent={getDifficultyTooltip(secret.difficultyToDiscover)}
									className="capitalize text-xs"
								>
									{secret.difficultyToDiscover} Difficulty
								</BadgeWithTooltip>
							</div>
							<List items={secret.description} spacing="sm" emptyText="No description." className="mb-2 text-sm" />

							<List
								items={secret.discoveryMethod}
								spacing="sm"
								emptyText="No discovery method."
								className="mb-2 text-sm"
							/>
							<List items={secret.consequences} spacing="sm" emptyText="No consequences." className="mb-2 text-sm" />
						</div>
					))}
				</div>
			) : (
				<p className="text-muted-foreground">No known secrets at this site.</p>
			)}
		</InfoCard>
	)
}

export default SecretsContent
