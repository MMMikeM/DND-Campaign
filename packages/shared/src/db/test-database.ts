import { execFile } from "node:child_process"
import { mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { promisify } from "node:util"
import { PostgreSqlContainer } from "@testcontainers/postgresql"
import { drizzle } from "drizzle-orm/node-postgres"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import pg from "pg"

const packageRoot = fileURLToPath(new URL("../..", import.meta.url))

/** Writes the current schema's migrations into a fresh folder, as db:generate would into drizzle/. */
const generateMigrations = async () => {
	const out = mkdtempSync(join(tmpdir(), "tome-migrations-"))
	const config = join(out, "drizzle.config.ts")
	writeFileSync(
		config,
		`import config from ${JSON.stringify(join(packageRoot, "drizzle.config.ts"))}
export default { ...config, out: ${JSON.stringify(out)} }
`,
	)
	await promisify(execFile)(join(packageRoot, "node_modules/.bin/extra-drizzle-kit"), ["generate", "--config", config], {
		cwd: packageRoot,
	})
	return out
}

/** A throwaway Postgres with the current schema migrated into it. */
export const startMigratedDatabase = async () => {
	const [migrationsFolder, container] = await Promise.all([
		generateMigrations(),
		new PostgreSqlContainer("postgres:17").start(),
	])
	const pool = new pg.Pool({ connectionString: container.getConnectionUri() })
	await migrate(drizzle({ client: pool }), { migrationsFolder })
	return {
		pool,
		stop: async () => {
			await pool.end()
			await container.stop()
			rmSync(migrationsFolder, { recursive: true, force: true })
		},
	}
}
