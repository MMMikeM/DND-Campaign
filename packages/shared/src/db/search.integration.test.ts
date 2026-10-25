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
	container = await new PostgreSqlContainer("postgres:17").start()
	pool = new pg.Pool({ connectionString: container.getConnectionUri() })
	db = drizzle({ client: pool })
	await migrate(db, { migrationsFolder: fileURLToPath(new URL("../../drizzle", import.meta.url)) })

	await db.execute(sql`
		INSERT INTO regions (name, description, tags, danger_level, type, atmosphere_and_culture, features_and_hazards, history_and_economy, lore_and_secrets) VALUES
			('Sword Coast', '{"A long stretch of wild shoreline where goblin raiders prowl"}', '{}', 'low', 'coastal', '{}', '{}', '{}', '{}'),
			('Moonsea', '{"Cold water ringed by goblin warrens and goblin forts under dragon wings"}', '{}', 'high', 'inland', '{}', '{}', '{}', '{}'),
			('Cyprian Shore', '{"Lyra grew up in Paphos, where the king was kind"}', '{}', 'low', 'coastal', '{}', '{}', '{}', '{}');
		INSERT INTO areas (name, description, tags, region_id, type, culture_and_leadership, features_and_hazards, lore_and_secrets)
			SELECT 'Phandalin Outskirts', '{"Farmland ringed by old ruins and dragon wings"}', '{}', id, 'rural', '{}', '{}', '{}'
			FROM regions WHERE name = 'Sword Coast';
		REFRESH MATERIALIZED VIEW search_index;
		REFRESH MATERIALIZED VIEW entity_words;
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

	it("filters by table before applying the limit", async () => {
		const [unfiltered] = await search("coast", 1)
		expect(unfiltered).toMatchObject({ source_table: "regions" })

		expect(await search("coast", 1, ["areas"])).toEqual([
			expect.objectContaining({ source_table: "areas", name: "Phandalin Outskirts" }),
		])
	})

	it("returns nothing for an empty table filter", async () => {
		expect(await search("goblin", 10, [])).toEqual([])
	})

})

describe("spelling correction", () => {
	const names = async (term: string) => (await search(term)).map((r) => r.name)

	it("corrects a misspelled word to one an entity uses", async () => {
		expect(await names("shorline")).toContain("Sword Coast")
	})

	it("corrects a word spelled the way it sounds", async () => {
		expect(await names("Pafos")).toEqual(["Cyprian Shore"])
	})

	it("corrects every misspelled word of the term", async () => {
		expect(await names("lira pafos")).toEqual(["Cyprian Shore"])
	})

	it("corrects a short word when one candidate is closest", async () => {
		expect(await names("lira")).toEqual(["Cyprian Shore"])
	})

	// "wings" is as close to "kings" as "king" is, and more entities use it.
	it("leaves a word alone when it matches as written", async () => {
		expect(await names("kings")).toEqual(["Cyprian Shore"])
	})

	it("leaves a short word alone when candidates tie", async () => {
		expect(await names("kine")).toEqual([])
	})
})

describe("materialized views", () => {
	it.each(["search_index", "entity_words"])("refreshes %s concurrently", async (view) => {
		await db.execute(sql`REFRESH MATERIALIZED VIEW CONCURRENTLY ${sql.identifier(view)}`)
	})
})
