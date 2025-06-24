import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Tags } from "~/components/Tags"
import { Link } from "~/components/ui/link"
import type { Conflict } from "~/lib/entities"

export function LoreContent({ loreLinks }: Pick<Conflict, "loreLinks">) {
	return (
		<InfoCard
			title="World Concepts"
			icon={<Icons.BookOpen className="h-4 w-4 mr-2 text-indigo-600" />}
			emptyMessage="No world concepts linked to this conflict."
		>
			<div className="space-y-4">
				{loreLinks.map(
					({
						id,
						creativePrompts,
						description,
						gmNotes,
						tags,
						linkRoleOrTypeText,
						linkStrength,
						linkDetailsText,
						lore,
						conflict,
						faction,
						foreshadowingId,
						narrativeDestinationId,
						npc,
						quest,
						region,
						relatedLore,
					}) => (
						<div key={id} className="border rounded p-4 bg-background dark:bg-muted/30">
							<div className="flex justify-between items-start mb-3">
								<Link
									href={`/world-concepts/${lore?.slug || lore?.id}`}
									className="text-lg font-semibold text-primary hover:underline"
								>
									{lore?.name}
								</Link>
							</div>

							{linkRoleOrTypeText && (
								<div className="mb-3">
									<h4 className="font-medium text-sm mb-1 flex items-center">
										<Icons.Target className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
										Role/Type
									</h4>
									<p className="text-sm text-muted-foreground">{linkRoleOrTypeText}</p>
								</div>
							)}

							{linkStrength && (
								<div className="mb-3">
									<h4 className="font-medium text-sm mb-1 flex items-center">
										<Icons.Zap className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
										Link Strength
									</h4>
									<p className="text-sm text-muted-foreground">{linkStrength}</p>
								</div>
							)}

							{linkDetailsText && (
								<div className="mb-3">
									<h4 className="font-medium text-sm mb-1 flex items-center">
										<Icons.Info className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
										Details
									</h4>
									<p className="text-sm text-muted-foreground">{linkDetailsText}</p>
								</div>
							)}

							<List items={description} heading="Description" />
							<List items={creativePrompts} heading="Creative Prompts" />
							<List items={gmNotes} heading="GM Notes" />
							<Tags tags={tags} />
						</div>
					),
				)}
			</div>
		</InfoCard>
	)
}
