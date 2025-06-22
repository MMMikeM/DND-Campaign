import { List } from "~/components/List"
import { Tags } from "~/components/Tags"
import { Link } from "~/components/ui/link"
import type { Conflict } from "~/lib/entities"

export function ForeshadowingContent({ incomingForeshadowing }: Pick<Conflict, "incomingForeshadowing">) {
	return incomingForeshadowing.map(
		({
			id,
			name,
			creativePrompts,
			description,
			gmNotes,
			tags,
			subtlety,
			narrativeWeight,
			suggestedDeliveryMethods,
			sourceQuest,
			sourceQuestStage,
			sourceSite,
			sourceNpc,
			slug,
		}) => {
			return (
				<div key={id}>
					<Link href={`/conflicts/${slug}`}>
						<h3>{name}</h3>
					</Link>

					<p>{subtlety}</p>
					<p>{narrativeWeight}</p>
					<List items={description} heading="Description" />
					<List items={creativePrompts} heading="Creative Prompts" />
					<List items={gmNotes} heading="GM Notes" />
					<Tags tags={tags} />
					<p>{suggestedDeliveryMethods}</p>
					{sourceQuest && (
						<Link href={`/quests/${sourceQuest.slug}`}>
							<p>{sourceQuest.name}</p>
						</Link>
					)}
					{sourceQuestStage && (
						<Link href={`/quests/${sourceQuestStage.slug}`}>
							<p>{sourceQuestStage.name}</p>
						</Link>
					)}
					{sourceSite && (
						<Link href={`/sites/${sourceSite.slug}`}>
							<p>{sourceSite.name}</p>
						</Link>
					)}
					{sourceNpc && (
						<Link href={`/npcs/${sourceNpc.slug}`}>
							<p>{sourceNpc.name}</p>
						</Link>
					)}
				</div>
			)
		},
	)
}
