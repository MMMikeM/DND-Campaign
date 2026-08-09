import * as Icons from "lucide-react"
import type React from "react"
import { BadgeWithTooltip } from "~/components/badge-with-tooltip"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Tags } from "~/components/Tags"
import { Link } from "~/components/ui/link"
import type { Region } from "~/lib/entities"

type LoreContentProps = Pick<Region, "historyAndEconomy" | "loreAndSecrets" | "loreLinks">

export const LoreContent: React.FC<LoreContentProps> = ({ historyAndEconomy, loreAndSecrets, loreLinks }) => {
	return (
		<div className="space-y-6">
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

			<InfoCard
				title="Lore Connections"
				icon={<Icons.Library className="h-4 w-4 mr-2 text-primary" />}
				emptyMessage="No lore is linked to this region."
				contentClassName="space-y-4"
			>
				{loreLinks.map(
					({ id, lore, linkRoleOrTypeText, linkDetailsText, linkStrength, description, creativePrompts, tags }) => (
						<div key={`lore-link-${id}`} className="border rounded p-4">
							<div className="flex items-start justify-between gap-2 mb-2">
								<Link href={`/lore/${lore.slug}`} className="font-medium hover:text-primary transition-colors">
									{lore.name}
								</Link>
								<div className="flex flex-wrap gap-2">
									{linkRoleOrTypeText && (
										<BadgeWithTooltip variant="outline" tooltipContent="Role this lore plays here">
											{linkRoleOrTypeText}
										</BadgeWithTooltip>
									)}
									<BadgeWithTooltip variant="outline" tooltipContent="Strength of the connection">
										{linkStrength}
									</BadgeWithTooltip>
								</div>
							</div>

							{linkDetailsText && <p className="text-sm text-muted-foreground mb-2">{linkDetailsText}</p>}

							<div className="space-y-2">
								<List heading="Description" items={description} spacing="xs" collapsible={false} />
								<List heading="Creative Prompts" items={creativePrompts} spacing="xs" />
							</div>

							<Tags tags={tags} className="mt-2" />
						</div>
					),
				)}
			</InfoCard>
		</div>
	)
}
