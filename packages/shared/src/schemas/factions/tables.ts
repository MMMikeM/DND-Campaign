// factions/tables.ts
import { pgTable, unique } from "drizzle-orm/pg-core"
import { list, nullableFk, cascadeFk, pk, oneOf, string, nullableString } from "../../db/utils.js"
import { embeddings } from "../embeddings/tables.js"
import { sites } from "../regions/tables.js"
import { alignments, relationshipStrengths, wealthLevels } from "../common.js"

const sizeTypes = ["tiny", "small", "medium", "large", "massive"] as const
const reachLevels = ["local", "regional", "national", "continental", "global"] as const
const diplomaticTypes = ["ally", "enemy", "neutral", "vassal", "suzerain", "rival", "trade"] as const
const factionAgendaTypes = ["economic", "military", "political", "social", "occult", "technological"] as const
const factionAgendaStage = ["preparatory", "active", "concluding", "resolved"] as const
const factionAgendaImportance = ["peripheral", "significant", "central"] as const
const factionTypes = [
	"guild",
	"cult",
	"tribe",
	"noble_house",
	"mercantile",
	"religious",
	"military",
	"criminal",
	"political",
	"arcane",
] as const

export const factions = pgTable("factions", {
	id: pk(),
	name: string("name").unique(),
	alignment: oneOf("alignment", alignments),
	size: oneOf("size", sizeTypes),
	wealth: oneOf("wealth", wealthLevels),
	reach: oneOf("reach", reachLevels),
	type: oneOf("type", factionTypes),
	publicGoal: string("public_goal"),
	publicPerception: string("public_perception"),
	secretGoal: nullableString("secret_goal"),
	description: list("description").notNull(),
	values: list("values"),
	history: list("history"),
	notes: list("notes"),
	resources: list("resources"),
	recruitment: list("recruitment").notNull(),
	embeddingId: nullableFk("embedding_id", embeddings.id),
})

export const factionHeadquarters = pgTable(
	"faction_headquarters",
	{
		id: pk(),
		factionId: cascadeFk("faction_id", factions.id),
		siteId: cascadeFk("site_id", sites.id),
		description: list("description"),
		creativePrompts: list("creative_prompts"),
	},
	(t) => [unique().on(t.factionId, t.siteId)],
)

export const factionDiplomacy = pgTable(
	"faction_diplomacy",
	{
		id: pk(),
		factionId: cascadeFk("faction_id", factions.id),
		otherFactionId: cascadeFk("other_faction_id", factions.id),
		strength: oneOf("strength", relationshipStrengths),
		diplomaticStatus: oneOf("diplomatic_status", diplomaticTypes),
		description: list("description"),
		creativePrompts: list("creative_prompts"),
	},
	(t) => [unique().on(t.factionId, t.otherFactionId)],
)

export const factionAgendas = pgTable(
	"faction_agendas",
	{
		id: pk(),
		factionId: cascadeFk("faction_id", factions.id),
		name: string("name").unique(),
		agendaType: oneOf("agenda_type", factionAgendaTypes),
		currentStage: oneOf("current_stage", factionAgendaStage),
		importance: oneOf("importance", factionAgendaImportance),

		ultimateAim: string("ultimate_aim"),
		moralAmbiguity: string("moral_ambiguity"),

		description: list("description"),
		hiddenCosts: list("hidden_costs"),
		keyOpponents: list("key_opponents"),
		internalConflicts: list("internal_conflicts"),
		approach: list("approach"),
		publicImage: list("public_image"),
		personalStakes: list("personal_stakes"),
		storyHooks: list("story_hooks"),
		creativePrompts: list("creative_prompts"),
	},
	(t) => [unique().on(t.factionId, t.name)],
)

export const factionCulture = pgTable(
	"faction_culture",
	{
		id: pk(),
		factionId: cascadeFk("faction_id", factions.id),
		symbols: list("symbols"),
		rituals: list("rituals"),
		taboos: list("taboos"),
		aesthetics: list("aesthetics"),
		jargon: list("jargon"),
		recognitionSigns: list("recognition_signs"),
		embeddingId: nullableFk("embedding_id", embeddings.id),
	},
	(t) => [unique().on(t.factionId)],
)

export const enums = {
	diplomaticTypes,
	relationshipStrengths,
	sizeTypes,
	reachLevels,
	factionTypes,
	wealthLevels,
	alignments,
	factionAgendaTypes,
	factionAgendaStage,
	factionAgendaImportance,
}
