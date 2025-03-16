import QuestDisplayServer from "../../QuestDisplayServer"

// This is a Server Component that handles Quest Categories
export default function QuestCategoryPage({
	params,
}: {
	params: { category: string }
}) {
	const { category } = params
	return <QuestDisplayServer category={category} />
}
