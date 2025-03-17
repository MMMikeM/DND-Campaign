#!/usr/bin/env bun
import { Database } from "bun:sqlite"
import { readFileSync } from "fs"
import { parse } from "yaml"
import { FactionsFileSchema } from "../src/schemas/factionsSchema"

// Initialize database
const db = new Database("data.sqlite")

// Read and parse YAML file
const yamlContent = readFileSync(
	"/Users/mikemurray/Development/DND-Campaign/campaigns/shattered-spire/factions/factions.yaml",
	"utf8",
)
const data = parse(yamlContent)

const factionsFile = FactionsFileSchema.parse(data)

// Begin transaction
db.run("BEGIN TRANSACTION")

try {
	// Insert factions
	for (const [factionId, faction] of Object.entries(factionsFile.factions)) {
		// Insert main faction data
		db.run(
			`INSERT INTO factions (
                id, name, type, alignment, description, 
                public_goal, true_goal, headquarters, territory, 
                history, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				factionId,
				faction.name,
				faction.type,
				faction.alignment || null,
				faction.description || null,
				faction.public_goal || null,
				faction.true_goal || null,
				faction.headquarters || null,
				faction.territory || null,
				faction.history || null,
				faction.notes || null,
			],
		)

		// Insert resources
		if (faction.resources) {
			for (const resource of faction.resources) {
				db.run("INSERT INTO faction_resources (faction_id, resource) VALUES (?, ?)", [
					factionId,
					resource,
				])
			}
		}

		// Insert leadership
		if (faction.leadership) {
			for (const leader of faction.leadership) {
				db.run(
					`INSERT INTO faction_leaders (
                        faction_id, name, role, description, 
                        secret, stats, bio, is_secret_leader
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
					[
						factionId,
						leader.name,
						leader.role || null,
						leader.description || null,
						leader.secret || null,
						leader.stats || null,
						leader.bio || null,
						leader.role?.toLowerCase().includes("hidden") || false,
					],
				)
			}
		}

		// Insert members
		if (faction.members) {
			for (const member of faction.members) {
				db.run(
					"INSERT INTO faction_members (faction_id, name, description, stats) VALUES (?, ?, ?, ?)",
					[factionId, member.name, member.description || null, member.stats || null],
				)
			}
		}

		// Insert relationships (allies)
		if (faction.allies) {
			for (const ally of faction.allies) {
				db.run(
					"INSERT INTO faction_relationships (faction_id, related_faction_id, relationship_type) VALUES (?, ?, ?)",
					[factionId, ally, "ally"],
				)
			}
		}

		// Insert relationships (enemies)
		if (faction.enemies) {
			for (const enemy of faction.enemies) {
				db.run(
					"INSERT INTO faction_relationships (faction_id, related_faction_id, relationship_type) VALUES (?, ?, ?)",
					[factionId, enemy, "enemy"],
				)
			}
		}
	}

	// Insert key NPCs
	if (data.key_npcs) {
		for (const [npcId, npc] of Object.entries(data.key_npcs)) {
			// Insert main NPC data
			db.run(
				`INSERT INTO npcs (
                    name, role, location, description,
                    motivation, secret, stats
                ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
				[
					npcId,
					npc.role || null,
					npc.location || null,
					npc.description || null,
					npc.motivation || null,
					npc.secret || null,
					npc.stats || null,
				],
			)

			// Insert NPC relationships
			if (npc.relationships) {
				for (const relationship of npc.relationships) {
					db.run("INSERT INTO npc_relationships (npc_id, description) VALUES (?, ?)", [
						npcId,
						relationship,
					])
				}
			}
		}
	}

	// Commit transaction
	db.run("COMMIT")
	console.log("Successfully imported faction data!")
} catch (error) {
	// Rollback on error
	db.run("ROLLBACK")
	console.error("Error importing faction data:", error)
	throw error
}
