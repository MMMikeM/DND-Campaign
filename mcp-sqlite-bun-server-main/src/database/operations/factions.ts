import type { FactionOperations, RequiredFaction } from "./types"
import { SQLiteBaseOperations } from "./base"
import type { Database } from "bun:sqlite"

export class SQLiteFactionOperations extends SQLiteBaseOperations implements FactionOperations {
  constructor(db: Database) {
    super(db)
  }

  createFaction(id: string, faction: RequiredFaction): void {
    const transaction = this.transaction()
    try {
      // Insert main faction data
      this.prepare(
        "INSERT INTO factions (id, name, type, alignment, description, public_goal, true_goal, headquarters, territory, history) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      ).run(
        id,
        faction.name,
        faction.type,
        faction.alignment,
        faction.description,
        faction.public_goal,
        faction.true_goal,
        faction.headquarters,
        faction.territory,
        faction.history
      )

      // Insert resources
      if (faction.resources && faction.resources.length > 0) {
        for (const resource of faction.resources) {
          this.prepare("INSERT INTO faction_resources (faction_id, resource) VALUES (?, ?)").run(
            id,
            resource
          )
        }
      }

      // Insert leadership
      if (faction.leadership && faction.leadership.length > 0) {
        for (const leader of faction.leadership) {
          this.prepare(
            "INSERT INTO faction_leadership (faction_id, name, role, description, secret, stats, bio) VALUES (?, ?, ?, ?, ?, ?, ?)",
          ).run(
            id,
            leader.name,
            leader.role,
            leader.description,
            leader.secret,
            leader.stats,
            leader.bio
          )
        }
      }

      // Insert members
      if (faction.members && faction.members.length > 0) {
        for (const member of faction.members) {
          this.prepare(
            "INSERT INTO faction_members (faction_id, name, description, stats) VALUES (?, ?, ?, ?)",
          ).run(
            id,
            member.name,
            member.description,
            member.stats
          )
        }
      }

      // Insert allies
      if (faction.allies && faction.allies.length > 0) {
        for (const ally of faction.allies) {
          this.prepare("INSERT INTO faction_allies (faction_id, ally_id) VALUES (?, ?)").run(
            id,
            ally
          )
        }
      }

      // Insert enemies
      if (faction.enemies && faction.enemies.length > 0) {
        for (const enemy of faction.enemies) {
          this.prepare("INSERT INTO faction_enemies (faction_id, enemy_id) VALUES (?, ?)").run(
            id,
            enemy
          )
        }
      }

      // Insert quests
      if (faction.quests && faction.quests.length > 0) {
        for (const quest of faction.quests) {
          this.prepare("INSERT INTO faction_quests (faction_id, quest_id) VALUES (?, ?)").run(
            id,
            quest
          )
        }
      }

      transaction.commit()
    } catch (error) {
      transaction.rollback()
      throw error
    }
  }

  getFaction(id: string): RequiredFaction | null {
    // Get main faction data
    const faction = this.get<any>(`
      SELECT * FROM factions WHERE id = '${id}'
    `)

    if (!faction) return null

    // Get resources
    const resources = this.query<any>(`
      SELECT resource FROM faction_resources WHERE faction_id = '${id}'
    `).map(r => r.resource)

    // Get quests
    const quests = this.query<any>(`
      SELECT quest_id FROM faction_quests WHERE faction_id = '${id}'
    `).map(q => q.quest_id)

    // Get allies
    const allies = this.query<any>(`
      SELECT ally_id FROM faction_allies WHERE faction_id = '${id}'
    `).map(a => a.ally_id)

    // Get enemies
    const enemies = this.query<any>(`
      SELECT enemy_id FROM faction_enemies WHERE faction_id = '${id}'
    `).map(e => e.enemy_id)

    // Get leadership
    const leadership = this.query<any>(`
      SELECT name, role, description, secret, stats, bio
      FROM faction_leadership
      WHERE faction_id = '${id}'
    `)

    // Get members
    const members = this.query<any>(`
      SELECT name, description, stats
      FROM faction_members
      WHERE faction_id = '${id}'
    `)

    // Build the faction object directly
    return {
      name: faction.name || "",
      type: faction.type || "",
      description: faction.description || "",
      alignment: faction.alignment || "",
      public_goal: faction.public_goal || "",
      true_goal: faction.true_goal || "",
      headquarters: faction.headquarters || "",
      territory: faction.territory || "",
      history: faction.history || "",
      notes: "",
      resources,
      quests,
      allies,
      enemies,
      leadership,
      members,
      leaders: [],
    }
  }

  updateFaction(id: string, faction: RequiredFaction): void {
    const transaction = this.transaction()
    try {
      // Update main faction data
      this.prepare(
        "UPDATE factions SET name = ?, type = ?, alignment = ?, description = ?, public_goal = ?, true_goal = ?, headquarters = ?, territory = ?, history = ? WHERE id = ?",
      ).run(
        faction.name,
        faction.type,
        faction.alignment,
        faction.description,
        faction.public_goal,
        faction.true_goal,
        faction.headquarters,
        faction.territory,
        faction.history,
        id
      )

      // Delete existing related data
      this.exec(`DELETE FROM faction_resources WHERE faction_id = '${id}'`)
      this.exec(`DELETE FROM faction_leadership WHERE faction_id = '${id}'`)
      this.exec(`DELETE FROM faction_members WHERE faction_id = '${id}'`)
      this.exec(`DELETE FROM faction_allies WHERE faction_id = '${id}'`)
      this.exec(`DELETE FROM faction_enemies WHERE faction_id = '${id}'`)
      this.exec(`DELETE FROM faction_quests WHERE faction_id = '${id}'`)

      // Re-insert resources
      if (faction.resources && faction.resources.length > 0) {
        for (const resource of faction.resources) {
          this.prepare("INSERT INTO faction_resources (faction_id, resource) VALUES (?, ?)").run(
            id,
            resource
          )
        }
      }

      // Re-insert leadership
      if (faction.leadership && faction.leadership.length > 0) {
        for (const leader of faction.leadership) {
          this.prepare(
            "INSERT INTO faction_leadership (faction_id, name, role, description, secret, stats, bio) VALUES (?, ?, ?, ?, ?, ?, ?)",
          ).run(
            id,
            leader.name,
            leader.role,
            leader.description,
            leader.secret,
            leader.stats,
            leader.bio
          )
        }
      }

      // Re-insert members
      if (faction.members && faction.members.length > 0) {
        for (const member of faction.members) {
          this.prepare(
            "INSERT INTO faction_members (faction_id, name, description, stats) VALUES (?, ?, ?, ?)",
          ).run(
            id,
            member.name,
            member.description,
            member.stats
          )
        }
      }

      // Re-insert allies
      if (faction.allies && faction.allies.length > 0) {
        for (const ally of faction.allies) {
          this.prepare("INSERT INTO faction_allies (faction_id, ally_id) VALUES (?, ?)").run(
            id,
            ally
          )
        }
      }

      // Re-insert enemies
      if (faction.enemies && faction.enemies.length > 0) {
        for (const enemy of faction.enemies) {
          this.prepare("INSERT INTO faction_enemies (faction_id, enemy_id) VALUES (?, ?)").run(
            id,
            enemy
          )
        }
      }

      // Re-insert quests
      if (faction.quests && faction.quests.length > 0) {
        for (const quest of faction.quests) {
          this.prepare("INSERT INTO faction_quests (faction_id, quest_id) VALUES (?, ?)").run(
            id,
            quest
          )
        }
      }

      transaction.commit()
    } catch (error) {
      transaction.rollback()
      throw error
    }
  }

  deleteFaction(id: string): void {
    const transaction = this.transaction()
    try {
      this.exec(`DELETE FROM faction_resources WHERE faction_id = '${id}'`)
      this.exec(`DELETE FROM faction_leadership WHERE faction_id = '${id}'`)
      this.exec(`DELETE FROM faction_members WHERE faction_id = '${id}'`)
      this.exec(`DELETE FROM faction_allies WHERE faction_id = '${id}'`)
      this.exec(`DELETE FROM faction_enemies WHERE faction_id = '${id}'`)
      this.exec(`DELETE FROM faction_quests WHERE faction_id = '${id}'`)
      this.exec(`DELETE FROM factions WHERE id = '${id}'`)
      transaction.commit()
    } catch (error) {
      transaction.rollback()
      throw error
    }
  }

  addResource(factionId: string, resource: string): void {
    this.prepare("INSERT INTO faction_resources (faction_id, resource) VALUES (?, ?)").run({
      1: factionId,
      2: resource,
    })
  }

  removeResource(factionId: string, resource: string): void {
    this.prepare("DELETE FROM faction_resources WHERE faction_id = ? AND resource = ?").run({
      1: factionId,
      2: resource,
    })
  }

  addLeader(factionId: string, leader: RequiredFaction["leadership"][number]): void {
    this.prepare(
      "INSERT INTO faction_leadership (faction_id, name, role, description, secret, stats, bio) VALUES (?, ?, ?, ?, ?, ?, ?)",
    ).run({
      1: factionId,
      2: leader.name,
      3: leader.role,
      4: leader.description,
      5: leader.secret,
      6: leader.stats,
      7: leader.bio,
    })
  }

  removeLeader(factionId: string, leaderName: string): void {
    this.prepare("DELETE FROM faction_leadership WHERE faction_id = ? AND name = ?").run({
      1: factionId,
      2: leaderName,
    })
  }

  addMember(factionId: string, member: RequiredFaction["members"][number]): void {
    this.prepare(
      "INSERT INTO faction_members (faction_id, name, description, stats) VALUES (?, ?, ?, ?)",
    ).run({
      1: factionId,
      2: member.name,
      3: member.description,
      4: member.stats,
    })
  }

  removeMember(factionId: string, memberName: string): void {
    this.prepare("DELETE FROM faction_members WHERE faction_id = ? AND name = ?").run({
      1: factionId,
      2: memberName,
    })
  }

  addAlly(factionId: string, allyId: string): void {
    this.prepare("INSERT INTO faction_allies (faction_id, ally_id) VALUES (?, ?)").run({
      1: factionId,
      2: allyId,
    })
  }

  removeAlly(factionId: string, allyId: string): void {
    this.prepare("DELETE FROM faction_allies WHERE faction_id = ? AND ally_id = ?").run({
      1: factionId,
      2: allyId,
    })
  }

  addEnemy(factionId: string, enemyId: string): void {
    this.prepare("INSERT INTO faction_enemies (faction_id, enemy_id) VALUES (?, ?)").run({
      1: factionId,
      2: enemyId,
    })
  }

  removeEnemy(factionId: string, enemyId: string): void {
    this.prepare("DELETE FROM faction_enemies WHERE faction_id = ? AND enemy_id = ?").run({
      1: factionId,
      2: enemyId,
    })
  }

  addQuest(factionId: string, questId: string): void {
    this.prepare("INSERT INTO faction_quests (faction_id, quest_id) VALUES (?, ?)").run({
      1: factionId,
      2: questId,
    })
  }

  removeQuest(factionId: string, questId: string): void {
    this.prepare("DELETE FROM faction_quests WHERE faction_id = ? AND quest_id = ?").run({
      1: factionId,
      2: questId,
    })
  }
} 