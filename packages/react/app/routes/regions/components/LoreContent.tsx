import * as Icons from "lucide-react"
import type React from "react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Region } from "~/lib/entities"

type LoreContentProps = Pick<Region, "history" | "secrets" | "rumors">

export const LoreContent: React.FC<LoreContentProps> = ({ history, secrets, rumors }) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div className="col-span-2">
				<InfoCard title="History" icon={<Icons.BookOpen className="h-4 w-4 mr-2 text-primary" />}>
					<p className="whitespace-pre-line">{history}</p>
				</InfoCard>
			</div>
			<InfoCard
				title="Secrets"
				icon={<Icons.Lock className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No secrets uncovered yet"
			>
				<List items={secrets} emptyText="No secrets uncovered yet" />
			</InfoCard>

			<InfoCard title="Rumors" icon={<Icons.Bell className="h-4 w-4 mr-2 text-primary" />}>
				<List items={rumors} emptyText="No rumors found" />
			</InfoCard>
		</div>
	)
}
