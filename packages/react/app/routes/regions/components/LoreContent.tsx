import * as Icons from "lucide-react"
import type React from "react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Region } from "~/lib/entities"

type LoreContentProps = Pick<Region, "historyAndEconomy" | "loreAndSecrets">

export const LoreContent: React.FC<LoreContentProps> = ({ historyAndEconomy, loreAndSecrets }) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<InfoCard
				title="History & Economy"
				icon={<Icons.BookOpen className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No recorded history"
			>
				<List items={historyAndEconomy} spacing="sm" />
			</InfoCard>

			<InfoCard
				title="Lore & Secrets"
				icon={<Icons.Lock className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No secrets uncovered yet"
			>
				<List items={loreAndSecrets} spacing="sm" />
			</InfoCard>
		</div>
	)
}
