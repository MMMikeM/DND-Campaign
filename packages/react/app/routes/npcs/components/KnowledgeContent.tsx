import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { NPC } from "~/lib/entities"

export function KnowledgeContent({ knowledge, secrets }: Pick<NPC, "knowledge" | "secrets">) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<InfoCard
				title="Knowledge"
				icon={<Icons.BookOpen className="h-4 w-4 mr-2 text-blue-600" />}
				emptyMessage="No specific knowledge specified."
			>
				<p className="text-sm text-muted-foreground mb-4">
					Information this NPC possesses that might be valuable to players
				</p>
				<List items={knowledge} spacing="sm" textColor="muted" />
			</InfoCard>

			<InfoCard
				title="Secrets"
				icon={<Icons.Lock className="h-4 w-4 mr-2 text-red-600" />}
				emptyMessage="No secrets specified."
			>
				<p className="text-sm text-muted-foreground mb-4">Hidden information this NPC keeps concealed</p>
				<List items={secrets} spacing="sm" textColor="muted" />
			</InfoCard>
		</div>
	)
}
