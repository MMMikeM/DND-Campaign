import type pg from "pg"
import { afterAll, beforeAll, describe, expect, it } from "vite-plus/test"
import { startMigratedDatabase } from "./test-database"

const BOOT_TIMEOUT = 180_000

let database: Awaited<ReturnType<typeof startMigratedDatabase>>
let pool: pg.Pool

beforeAll(async () => {
	database = await startMigratedDatabase()
	pool = database.pool
}, BOOT_TIMEOUT)

afterAll(() => database?.stop())

type Row = Record<string, unknown>

const requiredColumns = new Map<string, { name: string; type: string }[]>()

/** NOT NULL columns with no default, so a test only spells out the columns it cares about. */
const columnsToFill = async (table: string) => {
	let columns = requiredColumns.get(table)
	if (!columns) {
		const { rows } = await pool.query<{ column_name: string; data_type: string }>(
			`SELECT column_name, data_type FROM information_schema.columns
			 WHERE table_name = $1 AND is_nullable = 'NO' AND column_default IS NULL AND is_generated = 'NEVER'`,
			[table],
		)
		columns = rows.map((row) => ({ name: row.column_name, type: row.data_type }))
		requiredColumns.set(table, columns)
	}
	return columns
}

const placeholderFor = (type: string) => {
	if (type === "ARRAY") return "{}"
	if (type === "boolean") return false
	if (type === "integer") return 1
	if (type === "bytea") return Buffer.from([0])
	return "x"
}

let nameCounter = 0

const insert = async (table: string, values: Row = {}): Promise<Row> => {
	const row: Row = {}
	for (const { name, type } of await columnsToFill(table)) {
		row[name] = name === "name" ? `${table} ${++nameCounter}` : placeholderFor(type)
	}
	Object.assign(row, values)
	const keys = Object.keys(row)
	const { rows } = await pool.query(
		`INSERT INTO ${table} (${keys.map((key) => `"${key}"`).join(", ")})
		 VALUES (${keys.map((_, i) => `$${i + 1}`).join(", ")}) RETURNING *`,
		Object.values(row),
	)
	return rows[0]
}

const count = async (table: string, where: string, params: unknown[]) => {
	const { rows } = await pool.query(`SELECT count(*)::int AS n FROM ${table} WHERE ${where}`, params)
	return rows[0].n as number
}

const pgErrorCode = async (promise: Promise<unknown>) => {
	try {
		await promise
	} catch (error) {
		return (error as { code?: string }).code
	}
	return undefined
}

const world = async () => {
	const region = await insert("regions")
	const area = await insert("areas", { region_id: region.id })
	const site = await insert("sites", { area_id: area.id })
	const quest = await insert("quests")
	const stage = await insert("quest_stages", { quest_id: quest.id })
	const faction = await insert("factions")
	const conflict = await insert("conflicts")
	const item = await insert("items")
	const lore = await insert("lore")
	return { region, area, site, quest, stage, faction, conflict, item, lore }
}

describe("slug", () => {
	it("transliterates accented letters", async () => {
		expect((await insert("regions", { name: "Château Brûlé" })).slug).toBe("chateau-brule")
	})

	it("falls back to the id when a name leaves no ASCII letters", async () => {
		const row = await insert("regions", { name: "東京" })
		expect(row.slug).toBe(String(row.id))
	})

	it("falls back to the id when a name would read as a number", async () => {
		for (const name of ["1408", "0x10", "1e3"]) {
			const row = await insert("npcs", { name })
			expect(row.slug).toBe(String(row.id))
		}
	})

	it("rejects a name whose slug another row already has", async () => {
		await insert("regions", { name: "Red Keep" })
		expect(await pgErrorCode(insert("regions", { name: "red keep!" }))).toBe("23505")
	})

	it("may repeat across tables", async () => {
		await insert("factions", { name: "Harpers" })
		expect((await insert("npcs", { name: "Harpers" })).slug).toBe("harpers")
	})
})

describe("exclusive-arc uniques", () => {
	it("rejects a duplicate item connection", async () => {
		const { item } = await world()
		const npc = await insert("npcs")
		await insert("item_connections", { source_item_id: item.id, connected_npc_id: npc.id })
		expect(await pgErrorCode(insert("item_connections", { source_item_id: item.id, connected_npc_id: npc.id }))).toBe(
			"23505",
		)
	})

	it("rejects a duplicate lore link", async () => {
		const { lore, faction } = await world()
		await insert("lore_links", { lore_id: lore.id, faction_id: faction.id })
		expect(await pgErrorCode(insert("lore_links", { lore_id: lore.id, faction_id: faction.id }))).toBe("23505")
	})

	it("rejects duplicate faction influence", async () => {
		const { faction, site } = await world()
		await insert("faction_influence", { faction_id: faction.id, site_id: site.id })
		expect(await pgErrorCode(insert("faction_influence", { faction_id: faction.id, site_id: site.id }))).toBe("23505")
	})

	it("still lets two factions take part in one conflict", async () => {
		const { conflict } = await world()
		const [a, b] = [await insert("factions"), await insert("factions")]
		await insert("conflict_participants", { conflict_id: conflict.id, faction_id: a.id })
		await insert("conflict_participants", { conflict_id: conflict.id, faction_id: b.id })
		expect(await count("conflict_participants", "conflict_id = $1", [conflict.id])).toBe(2)
	})
})

describe("consequence triggers", () => {
	it("requires a decision source to name its decision", async () => {
		const w = await world()
		const decision = await insert("quest_stage_decisions", { from_quest_stage_id: w.stage.id })
		expect(await pgErrorCode(insert("consequences", { source_type: "decision", affected_faction_id: w.faction.id }))).toBe("23514")
		expect(
			await pgErrorCode(
				insert("consequences", { source_type: "decision", trigger_quest_id: w.quest.id, affected_faction_id: w.faction.id }),
			),
		).toBe("23514")
		await insert("consequences", {
			source_type: "decision",
			trigger_quest_stage_decision_id: decision.id,
			affected_faction_id: w.faction.id,
		})
	})

	it("requires a quest completion to name its quest", async () => {
		const w = await world()
		expect(
			await pgErrorCode(insert("consequences", { source_type: "quest_completion", affected_faction_id: w.faction.id })),
		).toBe("23514")
	})

	it("rejects a trigger on a world event", async () => {
		const w = await world()
		expect(
			await pgErrorCode(
				insert("consequences", { source_type: "world_event", trigger_quest_id: w.quest.id, affected_faction_id: w.faction.id }),
			),
		).toBe("23514")
	})
})

describe("deleting an entity", () => {
	it("deletes an NPC along with every exclusive-arc row that points at it", async () => {
		const w = await world()
		const npc = await insert("npcs", { site_id: w.site.id })
		await insert("item_connections", { source_item_id: w.item.id, connected_npc_id: npc.id })
		await insert("lore_links", { lore_id: w.lore.id, npc_id: npc.id })
		await insert("conflict_participants", { conflict_id: w.conflict.id, npc_id: npc.id })
		await insert("quest_participants", { quest_id: w.quest.id, npc_id: npc.id })
		await insert("quest_hooks", { quest_id: w.quest.id, hook_source_type: "npc", delivery_npc_id: npc.id })
		await insert("foreshadowing", { source_npc_id: npc.id, target_quest_id: w.quest.id })
		await insert("foreshadowing", { source_site_id: w.site.id, target_npc_id: npc.id })
		await insert("consequences", { source_type: "world_event", affected_npc_id: npc.id })
		await insert("quest_stages", { quest_id: w.quest.id, delivery_npc_id: npc.id })

		await pool.query("DELETE FROM npcs WHERE id = $1", [npc.id])

		expect(await count("item_connections", "connected_npc_id = $1", [npc.id])).toBe(0)
		expect(await count("lore_links", "npc_id = $1", [npc.id])).toBe(0)
		expect(await count("conflict_participants", "npc_id = $1", [npc.id])).toBe(0)
		expect(await count("quest_participants", "npc_id = $1", [npc.id])).toBe(0)
		expect(await count("quest_hooks", "delivery_npc_id = $1", [npc.id])).toBe(0)
		expect(await count("foreshadowing", "source_npc_id = $1 OR target_npc_id = $1", [npc.id])).toBe(0)
		expect(await count("consequences", "affected_npc_id = $1", [npc.id])).toBe(0)
		expect(await count("quest_stages", "quest_id = $1", [w.quest.id])).toBe(2)
	})

	it("deletes a quest through its stages and triggered consequences, and clears it as a prerequisite", async () => {
		const w = await world()
		const sequel = await insert("quests", { prerequisite_quest_id: w.quest.id })
		await insert("foreshadowing", { source_quest_stage_id: w.stage.id, target_faction_id: w.faction.id })
		await insert("item_connections", { source_item_id: w.item.id, connected_quest_stage_id: w.stage.id })
		await insert("consequences", { source_type: "quest_completion", trigger_quest_id: w.quest.id, affected_faction_id: w.faction.id })

		await pool.query("DELETE FROM quests WHERE id = $1", [w.quest.id])

		expect(await count("quests", "id = $1 AND prerequisite_quest_id IS NULL", [sequel.id])).toBe(1)
		expect(await count("foreshadowing", "target_faction_id = $1", [w.faction.id])).toBe(0)
		expect(await count("item_connections", "source_item_id = $1", [w.item.id])).toBe(0)
		expect(await count("consequences", "affected_faction_id = $1", [w.faction.id])).toBe(0)
	})

	it("deletes a region through its areas and sites", async () => {
		const w = await world()
		await insert("faction_influence", { faction_id: w.faction.id, site_id: w.site.id })
		await insert("faction_influence", { faction_id: w.faction.id, region_id: w.region.id })
		await insert("lore_links", { lore_id: w.lore.id, region_id: w.region.id })
		await insert("item_connections", { source_item_id: w.item.id, connected_site_id: w.site.id })
		await insert("foreshadowing", { source_site_id: w.site.id, target_area_id: w.area.id })
		await insert("consequences", { source_type: "world_event", affected_area_id: w.area.id })
		await pool.query("UPDATE factions SET hq_site_id = $1 WHERE id = $2", [w.site.id, w.faction.id])

		await pool.query("DELETE FROM regions WHERE id = $1", [w.region.id])

		expect(await count("faction_influence", "faction_id = $1", [w.faction.id])).toBe(0)
		expect(await count("factions", "id = $1 AND hq_site_id IS NULL", [w.faction.id])).toBe(1)
		expect(await count("sites", "id = $1", [w.site.id])).toBe(0)
	})

	it("deletes the consequences that affect a deleted consequence", async () => {
		const { faction } = await world()
		const cause = await insert("consequences", { source_type: "world_event", affected_faction_id: faction.id })
		const knockOn = await insert("consequences", { source_type: "world_event", affected_consequence_id: cause.id })
		const seed = await insert("foreshadowing", { source_site_id: (await world()).site.id, target_consequence_id: knockOn.id })

		await pool.query("DELETE FROM factions WHERE id = $1", [faction.id])

		expect(await count("consequences", "id = ANY($1)", [[cause.id, knockOn.id]])).toBe(0)
		expect(await count("foreshadowing", "id = $1", [seed.id])).toBe(0)
	})
})

describe("search_index", () => {
	it("holds one row per entity when every entity has several of each relation", async () => {
		const w = await world()
		const otherFaction = await insert("factions")
		const otherQuest = await insert("quests")
		const otherRegion = await insert("regions")
		await insert("areas", { region_id: w.region.id })
		const secondSite = await insert("sites", { area_id: w.area.id })
		const secondStage = await insert("quest_stages", { quest_id: w.quest.id, site_id: w.site.id })
		const npcs = [await insert("npcs", { site_id: w.site.id }), await insert("npcs", { site_id: w.site.id })]

		await insert("region_connections", { source_region_id: w.region.id, target_region_id: otherRegion.id })
		await insert("region_connections", { source_region_id: otherRegion.id, target_region_id: w.region.id })
		await insert("site_links", { source_site_id: w.site.id, target_site_id: secondSite.id })
		await insert("site_links", { source_site_id: secondSite.id, target_site_id: w.site.id })
		await insert("site_secrets", { site_id: w.site.id })
		await insert("site_secrets", { site_id: w.site.id })
		await insert("npc_relations", { source_npc_id: npcs[0].id, target_npc_id: npcs[1].id })
		await insert("npc_relations", { source_npc_id: npcs[1].id, target_npc_id: npcs[0].id })
		await insert("faction_diplomacy", { source_faction_id: w.faction.id, target_faction_id: otherFaction.id })
		await insert("faction_diplomacy", { source_faction_id: otherFaction.id, target_faction_id: w.faction.id })
		await insert("quest_relations", { source_quest_id: w.quest.id, target_quest_id: otherQuest.id })
		await insert("quest_relations", { source_quest_id: otherQuest.id, target_quest_id: w.quest.id })
		await insert("quest_stage_decisions", { from_quest_stage_id: w.stage.id, to_quest_stage_id: secondStage.id })
		await insert("quest_stage_decisions", { from_quest_stage_id: secondStage.id, to_quest_stage_id: w.stage.id })
		await insert("conflicts", { region_id: w.region.id })

		for (const [i, npc] of npcs.entries()) {
			await insert("npc_faction_memberships", { npc_id: npc.id, faction_id: w.faction.id })
			await insert("faction_agendas", { faction_id: w.faction.id })
			await insert("faction_influence", { faction_id: w.faction.id, site_id: [w.site, secondSite][i].id })
			await insert("conflict_participants", { conflict_id: w.conflict.id, npc_id: npc.id })
			await insert("conflict_participants", { conflict_id: w.conflict.id, faction_id: [w.faction, otherFaction][i].id })
			await insert("quest_participants", { quest_id: w.quest.id, npc_id: npc.id })
			await insert("quest_participants", { quest_id: w.quest.id, faction_id: [w.faction, otherFaction][i].id })
			await insert("quest_hooks", { quest_id: w.quest.id, source: `s${i}`, hook_source_type: "npc", delivery_npc_id: npc.id })
			await insert("quest_hooks", { quest_id: w.quest.id, source: `f${i}`, hook_source_type: "faction", faction_id: w.faction.id })
			await insert("quest_hooks", { quest_id: w.quest.id, source: `l${i}`, hook_source_type: "site", site_id: w.site.id })
			await insert("npc_quest_stage_involvement", { npc_id: npc.id, quest_stage_id: w.stage.id })
			await insert("item_connections", { source_item_id: w.item.id, connected_npc_id: npc.id })
			await insert("item_connections", { source_item_id: w.item.id, connected_faction_id: [w.faction, otherFaction][i].id })
			await insert("item_connections", { source_item_id: w.item.id, connected_site_id: [w.site, secondSite][i].id })
			await insert("item_connections", { source_item_id: w.item.id, connected_quest_id: [w.quest, otherQuest][i].id })
			await insert("item_connections", { source_item_id: w.item.id, connected_quest_stage_id: [w.stage, secondStage][i].id })
			await insert("lore_links", { lore_id: w.lore.id, npc_id: npc.id })
			await insert("lore_links", { lore_id: w.lore.id, faction_id: [w.faction, otherFaction][i].id })
			await insert("lore_links", { lore_id: w.lore.id, region_id: [w.region, otherRegion][i].id })
			await insert("lore_links", { lore_id: w.lore.id, quest_id: [w.quest, otherQuest][i].id })
			await insert("foreshadowing", { source_npc_id: npc.id, target_quest_id: w.quest.id })
			await insert("foreshadowing", { source_site_id: w.site.id, target_npc_id: npc.id })
			await insert("foreshadowing", { source_quest_stage_id: w.stage.id, target_faction_id: w.faction.id })
			await insert("foreshadowing", { source_lore_id: w.lore.id, target_area_id: w.area.id })
			await insert("foreshadowing", { source_item_id: w.item.id, target_region_id: w.region.id })
			await insert("consequences", { source_type: "quest_completion", trigger_quest_id: w.quest.id, affected_npc_id: npc.id })
			await insert("consequences", { source_type: "quest_completion", trigger_quest_id: w.quest.id, affected_faction_id: w.faction.id })
			await insert("consequences", { source_type: "world_event", affected_region_id: w.region.id })
			await insert("consequences", { source_type: "world_event", affected_area_id: w.area.id })
			await insert("consequences", { source_type: "world_event", affected_site_id: w.site.id })
			await insert("consequences", { source_type: "world_event", affected_conflict_id: w.conflict.id, conflict_impact_description: "x" })
		}

		await pool.query("REFRESH MATERIALIZED VIEW CONCURRENTLY search_index")

		const { rows } = await pool.query(
			"SELECT count(*)::int AS total, count(DISTINCT (source_table, id))::int AS distinct_rows FROM search_index",
		)
		expect(rows[0].total).toBeGreaterThan(30)
		expect(rows[0].total).toBe(rows[0].distinct_rows)
	}, 30_000)
})
