import { db } from "~/lib/db"
import type { Route } from "./+types/$fileId"

export async function loader({ params }: Route.LoaderArgs) {
	const fileId = parseInt(params.fileId)

	if (!fileId || isNaN(fileId)) {
		throw new Response("Invalid file ID", { status: 400 })
	}

	const mapFile = await db.query.mapFiles.findFirst({
		where: (mapFiles, { eq }) => eq(mapFiles.id, fileId),
		columns: {
			mapImage: true,
			imageFormat: true,
			fileName: true,
		},
	})

	if (!mapFile || !mapFile.mapImage) {
		throw new Response("Image not found", { status: 404 })
	}

	const mimeType = mapFile.imageFormat === "jpg" ? "image/jpeg" : `image/${mapFile.imageFormat}`

	return new Response(mapFile.mapImage, {
		headers: {
			"Content-Type": mimeType,
			"Cache-Control": "public, max-age=31536000, immutable", // Cache for 1 year
			"Content-Disposition": `inline; filename="${mapFile.fileName}.${mapFile.imageFormat}"`,
		},
	})
}
