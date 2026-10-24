import { fileURLToPath } from "node:url"
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql"
import { sql } from "drizzle-orm"
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import pg from "pg"
import { afterAll, beforeAll, describe, expect, it } from "vite-plus/test"
import { selectEntityNames } from "./entity-names"
import { buildFullTextQuery, type FullTextHit } from "./search-query"

// Booting a container and pulling the image the first time is slow.
const BOOT_TIMEOUT = 180_000

let container: StartedPostgreSqlContainer
let pool: pg.Pool
let db: NodePgDatabase

// Runs the whole generated migration chain against an empty database, as a fresh clone would.
beforeAll(async () => {
	container = await new PostgreSqlContainer("pgvector/pgvector:pg17").start()
	pool = new pg.Pool({ connectionString: container.getConnectionUri() })
	db = drizzle({ client: pool })
	await migrate(db, { migrationsFolder: fileURLToPath(new URL("../../drizzle", import.meta.url)) })

	await db.execute(sql`
		INSERT INTO regions (name, description, tags, danger_level, type) VALUES
			('Sword Coast', '{"A long stretch of wild shoreline where goblin raiders prowl"}', '{}', 'low', 'coastal'),
			('Moonsea', '{"Cold water ringed by goblin warrens and goblin forts"}', '{}', 'high', 'inland');
		INSERT INTO areas (name, description, tags, region_id, type, culture_and_leadership, features_and_hazards, lore_and_secrets)
			SELECT 'Phandalin Outskirts', '{"Farmland ringed by old ruins"}', '{}', id, 'rural', '{}', '{}', '{}'
			FROM regions WHERE name = 'Sword Coast';
		REFRESH MATERIALIZED VIEW search_index;
	`)
}, BOOT_TIMEOUT)

afterAll(async () => {
	await pool?.end()
	await container?.stop()
})

const search = async (...args: Parameters<typeof buildFullTextQuery>): Promise<FullTextHit[]> => {
	const { rows } = await db.execute<FullTextHit>(buildFullTextQuery(...args))
	return rows
}

describe("selectEntityNames", () => {
	it("lists every entity with its table and generated slug", async () => {
		const names = await selectEntityNames(db)

		expect(names).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ table: "regions", name: "Sword Coast", slug: "sword-coast" }),
				expect.objectContaining({ table: "regions", name: "Moonsea", slug: "moonsea" }),
				expect.objectContaining({ table: "areas", name: "Phandalin Outskirts", slug: "phandalin-outskirts" }),
			]),
		)
	})
})

describe("buildFullTextQuery", () => {
	it("finds an entity by a word in its description and returns how to link to it", async () => {
		const [hit] = await search("shoreline")

		expect(hit).toMatchObject({ source_table: "regions", name: "Sword Coast", slug: "sword-coast" })
		expect(hit?.score).toBeGreaterThan(0)
	})

	it("matches stemmed forms of a word", async () => {
		const rows = await search("raider")
		expect(rows.map((r) => r.name)).toContain("Sword Coast")
	})

	it("orders results by descending score", async () => {
		const rows = await search("goblin")
		const scores = rows.map((r) => r.score)

		expect(rows.length).toBeGreaterThan(1)
		expect(scores).toEqual([...scores].sort((a, b) => b - a))
	})

	it("respects the limit argument", async () => {
		expect(await search("goblin", 1)).toHaveLength(1)
	})

	it("leaves misspellings to name search", async () => {
		expect(await search("shorline")).toEqual([])
	})
})
