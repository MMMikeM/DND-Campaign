import QuestDisplayServer from "../QuestDisplayServer"

// This is a Server Component that handles Quest IDs
export default function QuestPage({ params }: { params: { id: string } }) {
	const { id } = params
	return <QuestDisplayServer questId={id} />
}
