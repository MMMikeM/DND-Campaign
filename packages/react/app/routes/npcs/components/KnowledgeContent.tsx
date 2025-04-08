import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { NPC } from "~/lib/entities"

export function KnowledgeContent({ knowledge, secrets }: NPC) {
	return (
		<>
			<InfoCard
				title="Knowledge"
				icon={<Icons.BookOpen className="h-4 w-4 mr-2 text-blue-600" />}
				emptyMessage="No specific knowledge specified."
				className="mb-6"
			>
				{knowledge && knowledge.length > 0 && (
					<>
						<p className="text-sm text-muted-foreground mb-4">
							Information this NPC possesses that might be valuable to players
						</p>
						<List items={knowledge} spacing="sm" textColor="muted" />
					</>
				)}
			</InfoCard>

			<InfoCard
				title="Secrets"
				icon={<Icons.Lock className="h-4 w-4 mr-2 text-red-600" />}
				emptyMessage="No secrets specified."
			>
				{secrets && secrets.length > 0 && (
					<>
						<p className="text-sm text-muted-foreground mb-4">Hidden information this NPC keeps concealed</p>
						<List items={secrets} spacing="sm" textColor="muted" />
					</>
				)}
			</InfoCard>
		</>
	)
}
