import LocationDisplayServer from "../LocationDisplayServer"

// This is a Server Component that handles Location IDs
export default function LocationPage({ params }: { params: { id: string } }) {
	const { id } = params
	return <LocationDisplayServer locationId={id} />
}
