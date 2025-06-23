import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Tags } from "~/components/Tags"
import type { Lore } from "~/lib/entities"

export const LoreOverviewContent = ({
	description,
	tags,
	summary,
	gmNotes,
	creativePrompts,
}: Pick<Lore, "description" | "tags" | "summary" | "gmNotes" | "creativePrompts">) => {
	return (
		<InfoCard title="Overview" icon={<Icons.BookOpen className="h-4 w-4 mr-2" />}>
			<p>{summary}</p>
			{description && <List items={description} heading="Description" spacing="sm" textColor="muted" />}
			<List items={gmNotes} heading="GM Notes" spacing="sm" textColor="muted" collapsible={false} />
			<List items={creativePrompts} heading="Creative Prompts" spacing="sm" textColor="muted" collapsible={false} />
			<Tags tags={tags} variant="secondary" maxDisplay={8} />
		</InfoCard>
	)
}
