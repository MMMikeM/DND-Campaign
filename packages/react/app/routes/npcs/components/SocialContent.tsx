import * as Icons from "lucide-react"
import { InfoCard } from "~/components/InfoCard"
import { List } from "~/components/List"
import type { NPC } from "~/lib/entities"

export function SocialContent({}: Pick<NPC, "">) {
	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
				<InfoCard
					title="Conversation Hook"
					icon={<Icons.MessageCircle className="h-4 w-4 mr-2 text-blue-600" />}
					emptyMessage="No conversation hook specified."
					className="col-span-2"
				>
					<p className="text-sm text-muted-foreground mb-4">How to start a conversation with this NPC</p>
					<div className="p-4 bg-muted rounded-md">
						<p className="text-lg italic">{conversationHook}</p>
					</div>
				</InfoCard>

				<InfoCard
					title="Conversation Topics"
					icon={<Icons.MessageCircle className="h-4 w-4 mr-2 text-blue-600" />}
					emptyMessage="No preferred topics specified."
					className="row-span-2"
					contentClassName="space-y-4"
				>
					<List
						heading="Preferred Topics"
						icon={<Icons.ThumbsUp className="h-4 w-4 mr-2 text-emerald-600" />}
						items={preferredTopics}
						spacing="sm"
						textColor="muted"
						collapsible={false}
						className="pb-4 border-b"
					/>

					<List
						heading="Avoided Topics"
						icon={<Icons.ThumbsDown className="h-4 w-4 mr-2 text-red-500" />}
						items={avoidTopics}
						spacing="sm"
						textColor="muted"
						collapsible={false}
					/>
				</InfoCard>

				<InfoCard
					title="Rumors"
					icon={<Icons.MessagesSquare className="h-4 w-4 mr-2 text-amber-600" />}
					emptyMessage="No rumors specified."
					className="col-span-2"
				>
					<p className="text-sm text-muted-foreground mb-4">What others say about this character</p>
					<List items={rumours} spacing="sm" textColor="muted" />
				</InfoCard>
			</div>
		</>
	)
}
