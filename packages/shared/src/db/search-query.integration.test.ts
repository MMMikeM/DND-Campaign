import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql"
import { drizzle } from "drizzle-orm/node-postgres"
import pg from "pg"
import { afterAll, beforeAll, describe, expect, it } from "vite-plus/test"
import { buildSimilarityQuery, type SimilarityHit } from "./search-query"

// Booting a container and pulling the image the first time is slow.
const BOOT_TIMEOUT = 180_000

let container: StartedPostgreSqlContainer
let pool: pg.Pool
let db: ReturnType<typeof drizzle>

/**
 * Mirrors the columns `search_index` exposes in
 * packages/shared/src/schemas/search-view.ts, which is all this query touches.
 */
const SEED = [
	{ id: 1, source_table: "npcs", name: "Gundren Rockseeker", body: "A dwarf merchant who hires the party." },
	{ id: 2, source_table: "npcs", name: "Sildar Hallwinter", body: "A human knight of the Lords' Alliance." },
	{ id: 3, source_table: "factions", name: "Cragmaw Goblins", body: "Goblin raiders holding the Triboar trail." },
	{ id: 4, source_table: "sites", name: "Wave Echo Cave", body: "A lost mine humming with arcane forges." },
]

beforeAll(async () => {
	container = await new PostgreSqlContainer("pgvector/pgvector:pg17").start()
	pool = new pg.Pool({ connectionString: container.getConnectionUri() })
	db = drizzle({ client: pool })

	await pool.query(`
		CREATE EXTENSION IF NOT EXISTS pg_trgm;
		CREATE EXTENSION IF NOT EXISTS unaccent;
		CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;

		CREATE TABLE search_index (
			id INTEGER NOT NULL,
			source_table TEXT NOT NULL,
			raw_data JSONB NOT NULL,
			content TEXT NOT NULL,
			content_tsv TSVECTOR NOT NULL
		);
	`)

	for (const row of SEED) {
		const content = `${row.name} ${row.body}`
		await pool.query(
			`INSERT INTO search_index (id, source_table, raw_data, content, content_tsv)
			 VALUES ($1, $2, $3, $4, to_tsvector('english', $4))`,
			[row.id, row.source_table, JSON.stringify({ name: row.name }), content],
		)
	}
}, BOOT_TIMEOUT)

afterAll(async () => {
	await pool?.end()
	await container?.stop()
})

const search = async (...args: Parameters<typeof buildSimilarityQuery>): Promise<SimilarityHit[]> => {
	const { rows } = await db.execute<SimilarityHit>(buildSimilarityQuery(...args))
	return rows
}

describe("buildSimilarityQuery", () => {
	it("finds an exact full-text match and scores it", async () => {
		const rows = await search("Gundren")

		expect(rows.map((r) => r.id)).toContain(1)
		const hit = rows.find((r) => r.id === 1)
		expect(hit?.source_table).toBe("npcs")
		expect(hit?.raw_data).toEqual({ name: "Gundren Rockseeker" })
		expect(hit?.final_score).toBeGreaterThan(0)
	})

	it("finds a misspelling that full-text search alone would miss", async () => {
		// One transposition from "Rockseeker" - within the Levenshtein bound,
		// but not a full-text match, so this exercises the fuzzy arm.
		const rows = await search("Rockseker")

		expect(rows.map((r) => r.id)).toContain(1)
		const hit = rows.find((r) => r.id === 1)
		expect(hit?.fts_score).toBeNull()
		expect(hit?.fuzzy_score).toBeGreaterThan(0)
	})

	it("matches phonetically via metaphone", async () => {
		// "Kragmaw" sounds like "Cragmaw" but is 2 edits away at the word level.
		const rows = await search("Kragmaw")
		expect(rows.map((r) => r.id)).toContain(3)
	})

	it("falls back to ILIKE for terms under three characters", async () => {
		const rows = await search("Wa")
		expect(rows.map((r) => r.id)).toContain(4)
	})

	it("respects the limit argument", async () => {
		const rows = await search("cave", 1.0, 0.3, 2, 2, 1)
		expect(rows).toHaveLength(1)
	})

	it("orders results by descending final score", async () => {
		const rows = await search("goblin")
		const scores = rows.map((r) => r.final_score)
		expect(scores).toEqual([...scores].sort((a, b) => b - a))
	})

	it("applies fuzzyWeight to the fuzzy arm", async () => {
		const [weighted] = await search("Rockseker", 2.0)
		const [neutral] = await search("Rockseker", 1.0)

		expect(weighted.final_score).toBeGreaterThan(neutral.final_score)
	})
})
