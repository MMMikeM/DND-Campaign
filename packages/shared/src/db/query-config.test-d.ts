import type { initializeDatabase } from "../db"

// Drizzle rc.4 under TypeScript 6+ stopped rejecting an unknown key once a known key sat beside it
// (https://github.com/drizzle-team/drizzle-orm/issues/6383). Each @ts-expect-error below fails the typecheck
// if an upgrade loosens that check again.

declare const db: ReturnType<typeof initializeDatabase>

// @ts-expect-error unknown column beside a known one
db.query.npcs.findFirst({ columns: { id: true, bogus: true } })

// @ts-expect-error findMany is checked the same way
db.query.npcs.findMany({ columns: { id: true, bogus: true } })

db.query.lore.findFirst({
	// @ts-expect-error unknown nested column beside a known one
	with: { links: { with: { npc: { columns: { id: true, description: true } } } } },
})

db.query.quests.findFirst({
	with: {
		stages: {
			with: {
				quest: { columns: { name: true } },
				// @ts-expect-error unknown nested relation beside a known one
				items: true,
			},
		},
	},
})

// @ts-expect-error unknown where column beside a known one
db.query.npcs.findFirst({ where: { id: 1, bogus: 2 } })

// @ts-expect-error unknown orderBy column beside a known one
db.query.npcs.findFirst({ orderBy: { name: "asc", bogus: "asc" } })
