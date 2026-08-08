import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { NPC } from "~/lib/entities"

export function GmContent({ name, details, roleplayingGuide }: Pick<NPC, "name" | "details" | "roleplayingGuide">) {
	return (
		<InfoCard
			title="GM Notes"
			description={`Behind the screen information for ${name}`}
			icon={<Icons.ScrollText className="h-4 w-4 mr-2 text-gray-600" />}
			emptyMessage="No GM notes for this NPC."
		>
			<div className="space-y-4">
				<List heading="Roleplaying Guide" items={roleplayingGuide} spacing="sm" textColor="muted" collapsible />
				<List heading="Goals & Fears" items={details?.goalsAndFears} spacing="sm" textColor="muted" collapsible />
				<List heading="Biases" items={details?.biases} spacing="sm" textColor="muted" collapsible />
			</div>
		</InfoCard>
	)
}
