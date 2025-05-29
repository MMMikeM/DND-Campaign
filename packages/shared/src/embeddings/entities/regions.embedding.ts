import { createEmbeddingBuilder } from "../embedding-helpers"
import type { AreaEmbeddingInput, RegionEmbeddingInput } from "../embedding-input-types"

export const embeddingTextForRegion = (region: RegionEmbeddingInput): string => {
	const builder = createEmbeddingBuilder()

	builder.setEntity("Region", region.name, region.description)

	builder.addFields("Basic Information", {
		type: region.type,
		dangerLevel: region.dangerLevel,
		atmosphere: region.atmosphereType,
		economy: region.economy,
		population: region.population,
		security: region.security,
		history: region.history,
	})

	builder
		.addList("Revelation Layers", region.revelationLayersSummary)
		.addList("Cultural Notes", region.culturalNotes)
		.addList("Hazards", region.hazards)
		.addList("Points of Interest", region.pointsOfInterest)
		.addList("Rumors", region.rumors)
		.addList("Secrets", region.secrets)

	return builder.build()
}

export const embeddingTextForArea = (area: AreaEmbeddingInput): string => {
	const builder = createEmbeddingBuilder()

	builder.setEntity("Area", area.name, area.description)

	builder.addFields("Basic Information", {
		type: area.type,
		dangerLevel: area.dangerLevel,
		atmosphere: area.atmosphereType,
		region: area.parentRegionName,
		leadership: area.leadership,
		population: area.population,
		primaryActivity: area.primaryActivity,
		defenses: area.defenses,
	})

	builder
		.addList("Revelation Layers", area.revelationLayersSummary)
		.addList("Cultural Notes", area.culturalNotes)
		.addList("Hazards", area.hazards)
		.addList("Points of Interest", area.pointsOfInterest)
		.addList("Rumors", area.rumors)

	return builder.build()
}
