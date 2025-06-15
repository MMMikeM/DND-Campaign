import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Link } from "~/components/ui/link"
import type { Conflict } from "~/lib/entities"

export function WorldConceptsContent({ worldConceptLinks }: Pick<Conflict, "worldConceptLinks">) {
	return (
		<InfoCard
			title="World Concepts"
			icon={<Icons.BookOpen className="h-4 w-4 mr-2 text-indigo-600" />}
			emptyMessage="No world concepts linked to this conflict."
		>
			<div className="space-y-4">
				{worldConceptLinks.map(
					({
						id,
						creativePrompts,
						description,
						gmNotes,
						tags,
						linkRoleOrTypeText,
						linkStrength,
						linkDetailsText,
						worldConcept,
					}) => (
						<div key={id} className="border rounded p-4 bg-background dark:bg-muted/30">
							<div className="flex justify-between items-start mb-3">
								<Link
									href={`/world-concepts/${worldConcept?.slug || worldConcept?.id}`}
									className="text-lg font-semibold text-primary hover:underline"
								>
									{worldConcept?.name}
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

							{description && description.length > 0 && (
								<div className="mb-3">
									<h4 className="font-medium text-sm mb-1 flex items-center">
										<Icons.FileText className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
										Description
									</h4>
									<List items={description} spacing="xs" textColor="muted" textSize="sm" />
								</div>
							)}

							{creativePrompts && creativePrompts.length > 0 && (
								<div className="mt-3">
									<h4 className="font-medium text-sm mb-1 flex items-center">
										<Icons.Lightbulb className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
										Creative Prompts
									</h4>
									<List items={creativePrompts} spacing="xs" textColor="muted" textSize="sm" />
								</div>
							)}

							{gmNotes && gmNotes.length > 0 && (
								<div className="mt-3">
									<h4 className="font-medium text-sm mb-1 flex items-center">
										<Icons.Eye className="h-3.5 w-3.5 mr-1.5 text-red-600" />
										GM Notes
									</h4>
									<List items={gmNotes} spacing="xs" textColor="muted" textSize="sm" />
								</div>
							)}

							{tags && tags.length > 0 && (
								<div className="mt-3">
									<h4 className="font-medium text-sm mb-1 flex items-center">
										<Icons.Tag className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
										Tags
									</h4>
									<div className="flex flex-wrap gap-1">
										{tags.map((tag) => (
											<span
												key={tag}
												className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
											>
												{tag}
											</span>
										))}
									</div>
								</div>
							)}
						</div>
					),
				)}
			</div>
		</InfoCard>
	)
}
