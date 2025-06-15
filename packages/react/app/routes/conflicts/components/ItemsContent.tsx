import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import { Tags } from "~/components/tags"
import { Link } from "~/components/ui/link"
import type { Conflict } from "~/lib/entities"

// const itemRelations: ({
//   id: number;
//   creativePrompts: string[];
//   description: string[];
//   gmNotes: string[];
//   tags: string[];
//   relationshipType: string;
//   relationshipDetails: string | null;
//   item: {
//     id: number;
//     name: string;
//     slug: string;
//   };
// })[]

export function ItemsContent({ itemRelations }: Pick<Conflict, "itemRelations">) {
	return (
		<InfoCard
			title="Related Items"
			icon={<Icons.Package className="h-4 w-4 mr-2 text-purple-600" />}
			emptyMessage="No items related to this conflict."
		>
			<div className="space-y-6">
				{itemRelations.map(
					({ id, creativePrompts, description, gmNotes, tags, relationshipType, relationshipDetails, item }) => (
						<div key={id} className="border rounded-lg p-4 bg-background dark:bg-muted/30">
							{/* Header with item name and relationship type */}
							<div className="flex justify-between items-start mb-3">
								<div>
									<Link
										href={`/items/${item?.slug || item?.id}`}
										className="text-lg font-semibold text-primary hover:underline"
									>
										{item?.name}
									</Link>
									<p className="text-sm text-muted-foreground mt-1">
										<strong>Relationship:</strong> {relationshipType.replace(/_/g, " ")}
									</p>
								</div>
							</div>

							{/* Tags */}
							{tags && tags.length > 0 && (
								<div className="mb-3">
									<Tags tags={tags} variant="secondary" maxDisplay={6} />
								</div>
							)}

							{/* Content sections */}
							<div className="space-y-3">
								{/* Relationship details */}
								{relationshipDetails && (
									<div>
										<h4 className="text-sm font-medium text-foreground mb-1">Details</h4>
										<p className="text-sm text-muted-foreground">{relationshipDetails}</p>
									</div>
								)}

								{/* Description */}
								<List
									heading="Description"
									icon={<Icons.FileText className="h-4 w-4 mr-2" />}
									items={description}
									spacing="sm"
									textSize="sm"
									bulletColor="blue"
								/>

								<List
									heading="Creative Prompts"
									icon={<Icons.Lightbulb className="h-4 w-4 mr-2" />}
									items={creativePrompts}
									spacing="sm"
									textSize="sm"
									bulletColor="amber"
								/>

								<List
									heading="GM Notes"
									icon={<Icons.Eye className="h-4 w-4 mr-2" />}
									items={gmNotes}
									spacing="sm"
									textSize="sm"
									bulletColor="red"
								/>
							</div>
						</div>
					),
				)}
			</div>
		</InfoCard>
	)
}
