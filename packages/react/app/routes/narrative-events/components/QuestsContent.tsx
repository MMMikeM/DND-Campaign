import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { Link } from "~/components/ui/link"
import type { NarrativeEvent } from "~/lib/entities"

export function QuestsContent({ questStage, relatedQuest }: Pick<NarrativeEvent, "questStage" | "relatedQuest">) {
	return (
		<InfoCard
			title="Included Quests"
			icon={<Icons.Scroll className="h-4 w-4 mr-2 text-amber-600" />}
			emptyMessage={`No quests are currently part of the "${relatedQuest?.name}" event.`}
		>
			{JSON.stringify(questStage)}
			{JSON.stringify(relatedQuest)}
		</InfoCard>
	)
}
