import { pgExtension, pgMaterializedView } from "@mmmike/extra-drizzle-kit"
import { type SQL, type SQLWrapper, sql } from "drizzle-orm"
import {
	index,
	integer,
	type PgTable,
	type PgView,
	type QueryBuilder,
	text,
	unionAll,
	uniqueIndex,
} from "drizzle-orm/pg-core"
import { conflictSearchDataView } from "./conflicts/views"
import { consequenceSearchDataView } from "./consequences/views"
import { factionSearchDataView } from "./factions/views"
import { foreshadowingSearchDataView } from "./foreshadowing/views"
import { itemSearchDataView } from "./items/views"
import { loreSearchDataView } from "./lore/views"
import { npcSearchDataView } from "./npcs/views"
import { questSearchDataView } from "./quests/views"
import { areaSearchDataView, regionSearchDataView, siteSearchDataView } from "./regions/views"
import { searchableTables } from "./searchable-tables"
import { questStageDecisionSearchDataView, questStageSearchDataView } from "./stages/views"
import { deepText, weightedSearchVector } from "./view-utils"

type SearchDataView = PgView & { id: SQLWrapper; sourceTable: SQL.Aliased<string>; entityMain: SQLWrapper }

/** One entity's rows in `search_index`: its own text weighted above the text of the `related` fields. */
const searchSource =
	<V extends SearchDataView>(view: V, related: (view: V) => SQLWrapper[]) =>
	(qb: QueryBuilder) =>
		qb
			.select({
				id: sql<string>`${view.id}::text`.as("id"),
				sourceTable: view.sourceTable,
				name: sql<string>`${view.entityMain}->>'name'`.as("name"),
				slug: sql<string>`${view.entityMain}->>'slug'`.as("slug"),
				contentTsv: weightedSearchVector(
					view.entityMain,
					sql`jsonb_build_array(${sql.join(related(view), sql`, `)})`,
				).as("content_tsv"),
			})
			.from<PgView>(view)

const sources = [
	searchSource(regionSearchDataView, (v) => [v.areas, v.conflicts]),
	searchSource(areaSearchDataView, (v) => [v.region, v.sites]),
	searchSource(siteSearchDataView, (v) => [v.area, v.encounters]),
	searchSource(npcSearchDataView, (v) => [v.factionMemberships, v.siteAssociations]),
	searchSource(questSearchDataView, (v) => [v.stages]),
	searchSource(factionSearchDataView, (v) => [v.agendas, v.members]),
	searchSource(conflictSearchDataView, (v) => [v.participants, v.affectedByConsequences]),
	searchSource(itemSearchDataView, (v) => [v.relations]),
	searchSource(foreshadowingSearchDataView, (v) => [v.sourceQuest, v.targetQuest]),
	searchSource(loreSearchDataView, (v) => [v.links]),
	searchSource(consequenceSearchDataView, (v) => [
		v.triggerQuest,
		v.triggerQuestStageDecision,
		v.affectedFaction,
		v.affectedRegion,
		v.affectedArea,
		v.affectedSite,
		v.affectedNpc,
		v.affectedConsequence,
		v.affectedConflict,
		v.affectedQuest,
	]),
	searchSource(questStageSearchDataView, (v) => [v.quest, v.site]),
	searchSource(questStageDecisionSearchDataView, (v) => [v.quest, v.fromStage]),
]

type SearchSelect = ReturnType<(typeof sources)[number]>

const unionAllOf = ([first, second, ...rest]: SearchSelect[]) => unionAll(first, second, ...rest)

export const searchIndex = pgMaterializedView("search_index").as(
	(qb) => unionAllOf(sources.map((source) => source(qb))),
	(mv) => [
		// REFRESH MATERIALIZED VIEW CONCURRENTLY needs a unique index.
		uniqueIndex("search_index_source_table_id_idx").on(mv.sourceTable, mv.id),
		index("search_index_content_tsv_idx").using("gin", mv.contentTsv),
	],
)

export const trigrams = pgExtension("pg_trgm")
export const fuzzyStringMatch = pgExtension("fuzzystrmatch")

const ownWords = (table: PgTable) =>
	sql`select unnest(tsvector_to_array(to_tsvector('simple', ${deepText(sql`to_jsonb(${table}.*)`)}))) as word from ${table}`

/**
 * Every word entities use about themselves, unstemmed, for correcting misspelled search words. `ndoc` counts the
 * entities whose own text has the word: related entities' text would count a well-linked entity's words once per link.
 */
export const entityWords = pgMaterializedView(
	"entity_words",
	{ word: text("word"), ndoc: integer("ndoc"), sound: text("sound") },
	(t) => [
		uniqueIndex("entity_words_word_idx").on(t.word),
		index("entity_words_word_trgm_idx").using("gin", t.word.op("gin_trgm_ops")),
		index("entity_words_sound_idx").on(t.sound),
	],
).as(sql`select word, count(*)::integer as ndoc, dmetaphone(word) as sound
	from (${sql.join(Object.values(searchableTables).map(ownWords), sql` union all `)}) as words
	where word ~ '^[[:alpha:]]+$'
	group by word`)
