import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { Quest } from "~/lib/entities"

export default function StageOverviewTab({
	description,
	objectives,
	completionPaths,
	creativePrompts,
}: Quest["stages"][0]) {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<InfoCard title="Stage Details" icon={<Icons.FileText className="h-4 w-4 mr-2" />} className="md:col-span-2">
					<div>
						<List
							heading="Description"
							items={description}
							spacing="sm"
							textColor="default"
							icon={<Icons.Info className="h-4 w-4 mr-2" />}
						/>

						<div className="mt-4">
							<List
								heading="Objectives"
								items={objectives}
								spacing="sm"
								textColor="default"
								icon={<Icons.CheckCircle className="h-4 w-4 mr-2 text-green-500" />}
							/>
						</div>

						<div className="mt-4">
							<List
								heading="Completion Paths"
								items={completionPaths}
								spacing="sm"
								textColor="default"
								icon={<Icons.ArrowRight className="h-4 w-4 mr-2 text-blue-500" />}
							/>
						</div>
					</div>
				</InfoCard>
				{/* Creative Prompts - 1 Column */}
				<InfoCard title="Creative Prompts" icon={<Icons.Sparkles className="h-4 w-4 mr-2 text-amber-500" />}>
					<List
						items={creativePrompts}
						spacing="sm"
						textColor="default"
						icon={<Icons.Sparkles className="h-4 w-4 mr-2 text-amber-500" />}
					/>
				</InfoCard>
			</div>
		</div>
	)
}
