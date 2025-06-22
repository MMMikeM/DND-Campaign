import * as Icons from "lucide-react"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Tags } from "~/components/Tags"
import type { Site } from "~/lib/entities"
// import { getDifficultyVariant } from "../utils" // Assuming utils will have this

export const SecretsContent = ({ secrets }: Pick<Site, "secrets">) => {
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
			{secrets.map(
				({
					id,
					secretType,
					difficultyToDiscover,
					description,
					discoveryMethod,
					consequences,
					creativePrompts,
					gmNotes,
					tags,
				}) => (
					<div key={`secret-${id}`} className="border rounded p-4">
						<div className="flex justify-between items-start mb-1">
							<h4 className="font-medium flex items-center">{secretType} Secret</h4>
							<BadgeWithTooltip
								variant={getDifficultyVariant(difficultyToDiscover)}
								tooltipContent={getDifficultyTooltip(difficultyToDiscover)}
								className="capitalize text-xs"
							>
								{difficultyToDiscover} Difficulty
							</BadgeWithTooltip>
						</div>
						<List items={description} spacing="sm" emptyText="No description." className="mb-2 text-sm" />

						<List items={discoveryMethod} spacing="sm" emptyText="No discovery method." className="mb-2 text-sm" />
						<List items={consequences} spacing="sm" emptyText="No consequences." className="mb-2 text-sm" />
						<List items={creativePrompts} spacing="sm" emptyText="No creative prompts." className="mb-2 text-sm" />
						<List items={gmNotes} spacing="sm" emptyText="No GM notes." className="mb-2 text-sm" />
						<Tags tags={tags} />
					</div>
				),
			)}
		</InfoCard>
	)
}
