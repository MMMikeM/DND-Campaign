import { Suspense } from "react"
import NPCDisplayClient from "@/components/content-types/NPCDisplayClient"

// This is a Server Component that handles NPC IDs
export default function NPCPage({ params }: { params: { id: string } }) {
	const { id } = params

	return (
		<Suspense fallback={<div>Loading NPC data...</div>}>
			<NPCDisplayClient npcId={id} />
		</Suspense>
	)
}
