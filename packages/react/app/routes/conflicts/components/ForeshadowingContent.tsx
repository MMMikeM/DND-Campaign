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
					<h3>{name}</h3>
					<p>{description}</p>
					<p>{creativePrompts}</p>
					<p>{gmNotes}</p>
					<p>{tags}</p>
					<p>{subtlety}</p>
					<p>{narrativeWeight}</p>
					<p>{suggestedDeliveryMethods}</p>
					<p>{sourceQuest?.name}</p>
					<p>{sourceQuestStage?.name}</p>
					<p>{sourceSite?.name}</p>
					<p>{sourceNpc?.name}</p>
					<p>{slug}</p>
				</div>
			)
		},
	)
}
