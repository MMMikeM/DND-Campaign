import type { NPCOperations, RequiredNPC } from "./types"
import { SQLiteBaseOperations } from "./base"
import type { Database } from "bun:sqlite"

export class SQLiteNPCOperations extends SQLiteBaseOperations implements NPCOperations {
  constructor(db: Database) {
    super(db)
  }

  createNPC(npc: RequiredNPC): void {
    const transaction = this.transaction()
    try {
      // Insert main NPC data
      this.prepare(
        "INSERT INTO npcs (id, name, race, gender, occupation, role, quirk, background, motivation, secret, stats) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      ).run(npc.id, npc.name, npc.race, npc.gender, npc.occupation, npc.role || null, npc.quirk || null, npc.background, npc.motivation, npc.secret, npc.stats)

      // Insert descriptions
      if (npc.description) {
        for (const desc of npc.description) {
          this.prepare("INSERT INTO npc_descriptions (npc_id, description) VALUES (?, ?)").run(npc.id, desc)
        }
      }

      // Insert personality traits
      if (npc.personality) {
        for (const trait of npc.personality) {
          this.prepare("INSERT INTO npc_personality_traits (npc_id, trait) VALUES (?, ?)").run(npc.id, trait)
        }
      }

      // Insert quests
      if (npc.quests) {
        for (const quest of npc.quests) {
          this.prepare("INSERT INTO npc_quests (npc_id, quest_id, description) VALUES (?, ?, ?)").run(npc.id, quest.id, quest.description)
        }
      }

      // Insert relationships
      if (npc.relationships) {
        for (const rel of npc.relationships) {
          this.prepare("INSERT INTO npc_relationships (npc_id, target_id, description) VALUES (?, ?, ?)").run(npc.id, rel.id, rel.description)
        }
      }

      // Insert locations
      if (npc.location) {
        for (const loc of npc.location) {
          this.prepare("INSERT INTO npc_locations (npc_id, location_id, description) VALUES (?, ?, ?)").run(npc.id, loc.id, loc.description)
        }
      }

      // Insert inventory items
      if (npc.inventory) {
        for (const item of npc.inventory) {
          this.prepare("INSERT INTO npc_inventory (npc_id, item) VALUES (?, ?)").run(npc.id, item)
        }
      }

      transaction.commit()
    } catch (error) {
      transaction.rollback()
      throw error
    }
  }

  getNPC(id: string): RequiredNPC | null {
    const npc = this.get<any>(`
      SELECT n.*,
        GROUP_CONCAT(DISTINCT nd.description) as descriptions,
        GROUP_CONCAT(DISTINCT npt.trait) as personality_traits,
        GROUP_CONCAT(DISTINCT ni.item) as inventory_items
      FROM npcs n
      LEFT JOIN npc_descriptions nd ON n.id = nd.npc_id
      LEFT JOIN npc_personality_traits npt ON n.id = npt.npc_id
      LEFT JOIN npc_inventory ni ON n.id = ni.npc_id
      WHERE n.id = '${id}'
      GROUP BY n.id
    `)

    if (!npc) return null

    // Get quests
    const quests = this.query<any>(`
      SELECT quest_id as id, description
      FROM npc_quests
      WHERE npc_id = '${id}'
    `)

    // Get relationships
    const relationships = this.query<any>(`
      SELECT target_id as id, description
      FROM npc_relationships
      WHERE npc_id = '${id}'
    `)

    // Get locations
    const locations = this.query<any>(`
      SELECT location_id as id, description
      FROM npc_locations
      WHERE npc_id = '${id}'
    `)

    return {
      ...npc,
      description: npc.descriptions ? npc.descriptions.split(",") : [],
      personality: npc.personality_traits ? npc.personality_traits.split(",") : [],
      inventory: npc.inventory_items ? npc.inventory_items.split(",") : [],
      quests,
      relationships,
      location: locations,
    }
  }

  updateNPC(npc: RequiredNPC): void {
    const transaction = this.transaction()
    try {
      // Update main NPC data
      this.prepare(
        "UPDATE npcs SET name = ?, race = ?, gender = ?, occupation = ?, role = ?, quirk = ?, background = ?, motivation = ?, secret = ?, stats = ? WHERE id = ?",
      ).run(npc.name, npc.race, npc.gender, npc.occupation, npc.role || null, npc.quirk || null, npc.background, npc.motivation, npc.secret, npc.stats, npc.id)

      // Delete existing related data
      this.exec(`DELETE FROM npc_descriptions WHERE npc_id = '${npc.id}'`)
      this.exec(`DELETE FROM npc_personality_traits WHERE npc_id = '${npc.id}'`)
      this.exec(`DELETE FROM npc_quests WHERE npc_id = '${npc.id}'`)
      this.exec(`DELETE FROM npc_relationships WHERE npc_id = '${npc.id}'`)
      this.exec(`DELETE FROM npc_locations WHERE npc_id = '${npc.id}'`)
      this.exec(`DELETE FROM npc_inventory WHERE npc_id = '${npc.id}'`)

      // Re-insert descriptions
      if (npc.description) {
        for (const desc of npc.description) {
          this.prepare("INSERT INTO npc_descriptions (npc_id, description) VALUES (?, ?)").run(npc.id, desc)
        }
      }

      // Re-insert personality traits
      if (npc.personality) {
        for (const trait of npc.personality) {
          this.prepare("INSERT INTO npc_personality_traits (npc_id, trait) VALUES (?, ?)").run(npc.id, trait)
        }
      }

      // Re-insert quests
      if (npc.quests) {
        for (const quest of npc.quests) {
          this.prepare("INSERT INTO npc_quests (npc_id, quest_id, description) VALUES (?, ?, ?)").run(npc.id, quest.id, quest.description)
        }
      }

      // Re-insert relationships
      if (npc.relationships) {
        for (const rel of npc.relationships) {
          this.prepare("INSERT INTO npc_relationships (npc_id, target_id, description) VALUES (?, ?, ?)").run(npc.id, rel.id, rel.description)
        }
      }

      // Re-insert locations
      if (npc.location) {
        for (const loc of npc.location) {
          this.prepare("INSERT INTO npc_locations (npc_id, location_id, description) VALUES (?, ?, ?)").run(npc.id, loc.id, loc.description)
        }
      }

      // Re-insert inventory items
      if (npc.inventory) {
        for (const item of npc.inventory) {
          this.prepare("INSERT INTO npc_inventory (npc_id, item) VALUES (?, ?)").run(npc.id, item)
        }
      }

      transaction.commit()
    } catch (error) {
      transaction.rollback()
      throw error
    }
  }

  deleteNPC(id: string): void {
    const transaction = this.transaction()
    try {
      this.exec(`DELETE FROM npc_descriptions WHERE npc_id = '${id}'`)
      this.exec(`DELETE FROM npc_personality_traits WHERE npc_id = '${id}'`)
      this.exec(`DELETE FROM npc_quests WHERE npc_id = '${id}'`)
      this.exec(`DELETE FROM npc_relationships WHERE npc_id = '${id}'`)
      this.exec(`DELETE FROM npc_locations WHERE npc_id = '${id}'`)
      this.exec(`DELETE FROM npc_inventory WHERE npc_id = '${id}'`)
      this.exec(`DELETE FROM npcs WHERE id = '${id}'`)
      transaction.commit()
    } catch (error) {
      transaction.rollback()
      throw error
    }
  }

  addNPCQuest(npcId: string, questId: string, description: string): void {
    this.prepare("INSERT INTO npc_quests (npc_id, quest_id, description) VALUES (?, ?, ?)").run(npcId, questId, description)
  }

  removeNPCQuest(npcId: string, questId: string): void {
    this.prepare("DELETE FROM npc_quests WHERE npc_id = ? AND quest_id = ?").run(npcId, questId)
  }

  addNPCRelationship(npcId: string, targetId: string, description: string): void {
    this.prepare("INSERT INTO npc_relationships (npc_id, target_id, description) VALUES (?, ?, ?)").run(npcId, targetId, description)
  }

  removeNPCRelationship(npcId: string, targetId: string): void {
    this.prepare("DELETE FROM npc_relationships WHERE npc_id = ? AND target_id = ?").run(npcId, targetId)
  }

  addNPCLocation(npcId: string, locationId: string, description: string): void {
    this.prepare("INSERT INTO npc_locations (npc_id, location_id, description) VALUES (?, ?, ?)").run(npcId, locationId, description)
  }

  removeNPCLocation(npcId: string, locationId: string): void {
    this.prepare("DELETE FROM npc_locations WHERE npc_id = ? AND location_id = ?").run(npcId, locationId)
  }

  addInventoryItem(npcId: string, item: string): void {
    this.prepare("INSERT INTO npc_inventory (npc_id, item) VALUES (?, ?)").run(npcId, item)
  }

  removeInventoryItem(npcId: string, item: string): void {
    this.prepare("DELETE FROM npc_inventory WHERE npc_id = ? AND item = ?").run(npcId, item)
  }
} 