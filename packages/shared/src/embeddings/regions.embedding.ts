import { EmbeddingBuilder } from "./embedding-helpers"
import type { AreaEmbeddingInput, RegionEmbeddingInput } from "./embedding-input-types"

export const embeddingTextForRegion = (region: RegionEmbeddingInput): string => {
	return new EmbeddingBuilder()
		.title("Region", region.name)
		.overview(region.description)
		.basicInfoSection([
			{ label: "Type", value: region.type },
			{ label: "Danger Level", value: region.dangerLevel },
			{ label: "Atmosphere", value: region.atmosphereType },
			{ label: "Economy", value: region.economy },
			{ label: "Population", value: region.population },
			{ label: "Security", value: region.security },
			{ label: "History", value: region.history },
		])
		.list("Revelation Layers", region.revelationLayersSummary)
		.list("Cultural Notes", region.culturalNotes)
		.lists([
			{ title: "Hazards", items: region.hazards },
			{ title: "Points of Interest", items: region.pointsOfInterest },
			{ title: "Rumors", items: region.rumors },
			{ title: "Secrets", items: region.secrets },
		])
		.build()
}

export const embeddingTextForArea = (area: AreaEmbeddingInput): string => {
	return new EmbeddingBuilder()
		.title("Area", area.name)
		.overview(area.description)
		.basicInfoSection([
			{ label: "Type", value: area.type },
			{ label: "Danger Level", value: area.dangerLevel },
			{ label: "Atmosphere", value: area.atmosphereType },
			{ label: "Region", value: area.parentRegionName },
			{ label: "Leadership", value: area.leadership },
			{ label: "Population", value: area.population },
			{ label: "Primary Activity", value: area.primaryActivity },
			{ label: "Defenses", value: area.defenses },
		])
		.list("Revelation Layers", area.revelationLayersSummary)
		.list("Cultural Notes", area.culturalNotes)
		.lists([
			{ title: "Hazards", items: area.hazards },
			{ title: "Points of Interest", items: area.pointsOfInterest },
			{ title: "Rumors", items: area.rumors },
		])
		.build()
}
