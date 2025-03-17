import type { QuestOperations, RequiredQuest } from "./types"
import { SQLiteBaseOperations } from "./base"
import type { Database } from "bun:sqlite"
import type { NonNullableArrayElement } from "./types"


export class SQLiteQuestOperations extends SQLiteBaseOperations implements QuestOperations {
  constructor(db: Database) {
    super(db)
  }

  createQuest(quest: RequiredQuest): void {
    const transaction = this.transaction()
    try {
      // Insert main quest data
      this.prepare(
        "INSERT INTO quests (id, title, type, difficulty, description) VALUES (?, ?, ?, ?, ?)",
      ).run(quest.id, quest.title, quest.type, quest.difficulty, quest.description)

      // Insert quest stages
      if (quest.quest_stages) {
        for (const stage of quest.quest_stages) {
          this.prepare(
            "INSERT INTO quest_stages (quest_id, stage, title) VALUES (?, ?, ?)",
          ).run(quest.id, stage.stage, stage.title)

          // Insert stage objectives
          if (stage.objectives) {
            for (const objective of stage.objectives) {
              this.prepare(
                "INSERT INTO quest_objectives (quest_id, stage, objective) VALUES (?, ?, ?)",
              ).run(quest.id, stage.stage, objective)
            }
          }

          // Insert completion paths
          if (stage.completion_paths) {
            for (const [pathName, path] of Object.entries(stage.completion_paths)) {
              this.prepare(
                "INSERT INTO quest_completion_paths (quest_id, stage, path_name, description, challenges, outcomes) VALUES (?, ?, ?, ?, ?, ?)",
              ).run(quest.id, stage.stage, pathName, path.description, path.challenges, path.outcomes)
            }
          }
        }
      }

      // Insert decision points
      if (quest.key_decision_points) {
        for (const decision of quest.key_decision_points) {
          this.prepare(
            "INSERT INTO quest_decision_points (quest_id, stage, decision) VALUES (?, ?, ?)",
          ).run(quest.id, decision.stage, decision.decision)

          // Insert choices
          for (const choice of decision.choices) {
            this.prepare(
              "INSERT INTO quest_decision_choices (quest_id, stage, decision, choice, outcome) VALUES (?, ?, ?, ?, ?)",
            ).run(quest.id, decision.stage, decision.decision, choice.choice, choice.consequences)
          }
        }
      }

      // Insert twists
      if (quest.potential_twists) {
        for (const twist of quest.potential_twists) {
          this.prepare("INSERT INTO quest_twists (quest_id, twist) VALUES (?, ?)").run(quest.id, twist)
        }
      }

      // Insert rewards
      if (quest.rewards) {
        for (const [path, rewards] of Object.entries(quest.rewards)) {
          for (const reward of rewards) {
            this.prepare("INSERT INTO quest_rewards (quest_id, path, reward) VALUES (?, ?, ?)").run(quest.id, path, reward)
          }
        }
      }

      // Insert follow-up quests
      if (quest.follow_up_quests) {
        for (const [path, followUps] of Object.entries(quest.follow_up_quests)) {
          for (const followUp of followUps) {
            this.prepare("INSERT INTO quest_follow_ups (quest_id, path, follow_up_id) VALUES (?, ?, ?)").run(quest.id, path, followUp)
          }
        }
      }

      // Insert related quests
      if (quest.related_quests) {
        for (const relatedId of quest.related_quests) {
          this.prepare("INSERT INTO quest_related (quest_id, related_id) VALUES (?, ?)").run(quest.id, relatedId)
        }
      }

      // Insert associated NPCs
      if (quest.associated_npc) {
        for (const npcId of quest.associated_npc) {
          this.prepare("INSERT INTO quest_associated_npcs (quest_id, npc_id) VALUES (?, ?)").run(quest.id, npcId)
        }
      }

      transaction.commit()
    } catch (error) {
      transaction.rollback()
      throw error
    }
  }

  getQuest(id: string): RequiredQuest | null {
    const quest = this.get<any>(`
      SELECT q.*, 
        GROUP_CONCAT(DISTINCT qt.twist) as twists,
        GROUP_CONCAT(DISTINCT qr.related_id) as related_quests
      FROM quests q
      LEFT JOIN quest_twists qt ON q.id = qt.quest_id
      LEFT JOIN quest_related qr ON q.id = qr.quest_id
      WHERE q.id = '${id}'
      GROUP BY q.id
    `)

    if (!quest) return null

    // Get quest stages
    const stages = this.query<any>(`
      SELECT qs.*,
        GROUP_CONCAT(DISTINCT qso.objective) as objectives
      FROM quest_stages qs
      LEFT JOIN quest_objectives qso ON qs.quest_id = qso.quest_id AND qs.stage = qso.stage
      WHERE qs.quest_id = '${id}'
      GROUP BY qs.quest_id, qs.stage
    `)

    // Get completion paths for each stage
    for (const stage of stages) {
      const paths = this.query<any>(`
        SELECT path_name, description, challenges, outcomes
        FROM quest_completion_paths
        WHERE quest_id = '${id}' AND stage = ${stage.stage}
      `)
      stage.completion_paths = paths.reduce((acc: any, path: any) => {
        acc[path.path_name] = {
          description: path.description,
          challenges: path.challenges,
          outcomes: path.outcomes,
        }
        return acc
      }, {})
      stage.objectives = stage.objectives ? stage.objectives.split(",") : []
    }

    // Get decision points
    const decisions = this.query<any>(`
      SELECT *
      FROM quest_decision_points
      WHERE quest_id = '${id}'
    `)

    // Get rewards
    const rewards = this.query<any>(`
      SELECT path, GROUP_CONCAT(reward) as rewards
      FROM quest_rewards
      WHERE quest_id = '${id}'
      GROUP BY path
    `).reduce((acc: any, row: any) => {
      acc[row.path] = row.rewards.split(",")
      return acc
    }, {})

    // Get follow-up quests
    const followUps = this.query<any>(`
      SELECT path, GROUP_CONCAT(follow_up_id) as follow_ups
      FROM quest_follow_ups
      WHERE quest_id = '${id}'
      GROUP BY path
    `).reduce((acc: any, row: any) => {
      acc[row.path] = row.follow_ups.split(",")
      return acc
    }, {})

    return {
      ...quest,
      quest_stages: stages,
      key_decision_points: decisions.map((d: any) => ({ ...d, choices: d.choices.split(", ") })),
      potential_twists: quest.twists ? quest.twists.split(",") : [],
      related_quests: quest.related_quests ? quest.related_quests.split(",") : [],
      rewards,
      follow_up_quests: followUps,
    }
  }

  updateQuest(quest: RequiredQuest): void {
    const transaction = this.transaction()
    try {
      // Update main quest data
      this.prepare(
        "UPDATE quests SET title = ?, type = ?, difficulty = ?, description = ? WHERE id = ?",
      ).run(quest.title, quest.type, quest.difficulty, quest.description, quest.id)

      // Delete existing related data
      this.exec(`DELETE FROM quest_stages WHERE quest_id = '${quest.id}'`)
      this.exec(`DELETE FROM quest_objectives WHERE quest_id = '${quest.id}'`)
      this.exec(`DELETE FROM quest_completion_paths WHERE quest_id = '${quest.id}'`)
      this.exec(`DELETE FROM quest_decision_points WHERE quest_id = '${quest.id}'`)
      this.exec(`DELETE FROM quest_twists WHERE quest_id = '${quest.id}'`)
      this.exec(`DELETE FROM quest_rewards WHERE quest_id = '${quest.id}'`)
      this.exec(`DELETE FROM quest_follow_ups WHERE quest_id = '${quest.id}'`)
      this.exec(`DELETE FROM quest_related WHERE quest_id = '${quest.id}'`)

      // Re-insert all related data
      if (quest.quest_stages) {
        for (const stage of quest.quest_stages) {
          this.prepare(
            "INSERT INTO quest_stages (quest_id, stage, title) VALUES (?, ?, ?)",
          ).run(quest.id, stage.stage, stage.title)

          if (stage.objectives) {
            for (const objective of stage.objectives) {
              this.prepare(
                "INSERT INTO quest_objectives (quest_id, stage, objective) VALUES (?, ?, ?)",
              ).run(quest.id, stage.stage, objective)
            }
          }

          if (stage.completion_paths) {
            for (const [pathName, path] of Object.entries(stage.completion_paths)) {
              this.prepare(
                "INSERT INTO quest_completion_paths (quest_id, stage, path_name, description, challenges, outcomes) VALUES (?, ?, ?, ?, ?, ?)",
              ).run(quest.id, stage.stage, pathName, path.description, path.challenges, path.outcomes)
            }
          }
        }
      }

      if (quest.key_decision_points) {
        for (const decision of quest.key_decision_points) {
          this.prepare(
            "INSERT INTO quest_decision_points (quest_id, stage, decision) VALUES (?, ?, ?)",
          ).run(quest.id, decision.stage, decision.decision)

          for (const choice of decision.choices) {
            this.prepare(
              "INSERT INTO quest_decision_choices (quest_id, stage, decision, choice, outcome) VALUES (?, ?, ?, ?, ?)",
            ).run(quest.id, decision.stage, decision.decision, choice.choice, choice.consequences)
          }
        }
      }

      if (quest.potential_twists) {
        for (const twist of quest.potential_twists) {
          this.prepare("INSERT INTO quest_twists (quest_id, twist) VALUES (?, ?)").run(quest.id, twist)
        }
      }

      if (quest.rewards) {
        for (const [path, rewards] of Object.entries(quest.rewards)) {
          for (const reward of rewards) {
            this.prepare("INSERT INTO quest_rewards (quest_id, path, reward) VALUES (?, ?, ?)").run(quest.id, path, reward)
          }
        }
      }

      if (quest.follow_up_quests) {
        for (const [path, followUps] of Object.entries(quest.follow_up_quests)) {
          for (const followUp of followUps) {
            this.prepare("INSERT INTO quest_follow_ups (quest_id, path, follow_up_id) VALUES (?, ?, ?)").run(quest.id, path, followUp)
          }
        }
      }

      if (quest.related_quests) {
        for (const relatedId of quest.related_quests) {
          this.prepare("INSERT INTO quest_related (quest_id, related_id) VALUES (?, ?)").run(quest.id, relatedId)
        }
      }

      transaction.commit()
    } catch (error) {
      transaction.rollback()
      throw error
    }
  }

  deleteQuest(id: string): void {
    const transaction = this.transaction()
    try {
      this.exec(`DELETE FROM quest_stages WHERE quest_id = '${id}'`)
      this.exec(`DELETE FROM quest_objectives WHERE quest_id = '${id}'`)
      this.exec(`DELETE FROM quest_completion_paths WHERE quest_id = '${id}'`)
      this.exec(`DELETE FROM quest_decision_points WHERE quest_id = '${id}'`)
      this.exec(`DELETE FROM quest_twists WHERE quest_id = '${id}'`)
      this.exec(`DELETE FROM quest_rewards WHERE quest_id = '${id}'`)
      this.exec(`DELETE FROM quest_follow_ups WHERE quest_id = '${id}'`)
      this.exec(`DELETE FROM quest_related WHERE quest_id = '${id}'`)
      this.exec(`DELETE FROM quests WHERE id = '${id}'`)
      transaction.commit()
    } catch (error) {
      transaction.rollback()
      throw error
    }
  }

  addQuestStage(
    questId: string,
    stage: NonNullableArrayElement<NonNullable<RequiredQuest["quest_stages"]>>,
  ): void {
    const transaction = this.transaction()
    try {
      this.prepare("INSERT INTO quest_stages (quest_id, stage, title) VALUES (?, ?, ?)").run(questId, stage.stage, stage.title)

      if (stage.objectives) {
        for (const objective of stage.objectives) {
          this.prepare("INSERT INTO quest_objectives (quest_id, stage, objective) VALUES (?, ?, ?)").run(questId, stage.stage, objective)
        }
      }

      if (stage.completion_paths) {
        for (const [pathName, path] of Object.entries(stage.completion_paths)) {
          this.prepare(
            "INSERT INTO quest_completion_paths (quest_id, stage, path_name, description, challenges, outcomes) VALUES (?, ?, ?, ?, ?, ?)",
          ).run(questId, stage.stage, pathName, path.description, path.challenges, path.outcomes)
        }
      }

      transaction.commit()
    } catch (error) {
      transaction.rollback()
      throw error
    }
  }

  updateQuestStage(
    questId: string,
    stage: NonNullableArrayElement<NonNullable<RequiredQuest["quest_stages"]>>,
  ): void {
    const transaction = this.transaction()
    try {
      this.prepare("UPDATE quest_stages SET title = ? WHERE quest_id = ? AND stage = ?").run(stage.title, questId, stage.stage)

      // Delete existing objectives and completion paths
      this.exec(`DELETE FROM quest_objectives WHERE quest_id = '${questId}' AND stage = ${stage.stage}`)
      this.exec(
        `DELETE FROM quest_completion_paths WHERE quest_id = '${questId}' AND stage = ${stage.stage}`,
      )

      // Re-insert objectives and completion paths
      if (stage.objectives) {
        for (const objective of stage.objectives) {
          this.prepare("INSERT INTO quest_objectives (quest_id, stage, objective) VALUES (?, ?, ?)").run(questId, stage.stage, objective)
        }
      }

      if (stage.completion_paths) {
        for (const [pathName, path] of Object.entries(stage.completion_paths)) {
          this.prepare(
            "INSERT INTO quest_completion_paths (quest_id, stage, path_name, description, challenges, outcomes) VALUES (?, ?, ?, ?, ?, ?)",
          ).run(questId, stage.stage, pathName, path.description, path.challenges, path.outcomes)
        }
      }

      transaction.commit()
    } catch (error) {
      transaction.rollback()
      throw error
    }
  }

  deleteQuestStage(questId: string, stageNumber: number): void {
    const transaction = this.transaction()
    try {
      this.exec(`DELETE FROM quest_objectives WHERE quest_id = '${questId}' AND stage = ${stageNumber}`)
      this.exec(`DELETE FROM quest_completion_paths WHERE quest_id = '${questId}' AND stage = ${stageNumber}`)
      this.exec(`DELETE FROM quest_stages WHERE quest_id = '${questId}' AND stage = ${stageNumber}`)
      transaction.commit()
    } catch (error) {
      transaction.rollback()
      throw error
    }
  }

  addQuestObjective(questId: string, stageNumber: number, objective: string): void {
    this.prepare("INSERT INTO quest_objectives (quest_id, stage, objective) VALUES (?, ?, ?)").run(questId, stageNumber, objective)
  }

  deleteQuestObjective(questId: string, stageNumber: number, objective: string): void {
    this.prepare("DELETE FROM quest_objectives WHERE quest_id = ? AND stage = ? AND objective = ?").run(questId, stageNumber, objective)
  }

  addCompletionPath(
    questId: string,
    stageNumber: number,
    pathName: string,
    path: NonNullableArrayElement<
      NonNullable<RequiredQuest["quest_stages"]>
    >["completion_paths"][string],
  ): void {
    this.prepare(
      "INSERT INTO quest_completion_paths (quest_id, stage, path_name, description, challenges, outcomes) VALUES (?, ?, ?, ?, ?, ?)",
    ).run(questId, stageNumber, pathName, path.description, path.challenges, path.outcomes)
  }

  deleteCompletionPath(questId: string, stageNumber: number, pathName: string): void {
    this.prepare("DELETE FROM quest_completion_paths WHERE quest_id = ? AND stage = ? AND path_name = ?").run(questId, stageNumber, pathName)
  }

  addDecisionPoint(
    questId: string,
    decisionPoint: NonNullableArrayElement<
      NonNullable<RequiredQuest["key_decision_points"]>
    >,
  ): void {
    this.prepare(
      "INSERT INTO quest_decision_points (quest_id, stage, decision) VALUES (?, ?, ?)",
    ).run(questId, decisionPoint.stage, decisionPoint.decision)
  }

  deleteDecisionPoint(questId: string, stageNumber: number, decision: string): void {
    this.prepare("DELETE FROM quest_decision_points WHERE quest_id = ? AND stage = ? AND decision = ?").run(questId, stageNumber, decision)
  }

  addTwist(questId: string, twist: string): void {
    this.prepare("INSERT INTO quest_twists (quest_id, twist) VALUES (?, ?)").run(questId, twist)
  }

  deleteTwist(questId: string, twist: string): void {
    this.prepare("DELETE FROM quest_twists WHERE quest_id = ? AND twist = ?").run(questId, twist)
  }

  addReward(questId: string, rewardPath: string, reward: string): void {
    this.prepare("INSERT INTO quest_rewards (quest_id, path, reward) VALUES (?, ?, ?)").run(questId, rewardPath, reward)
  }

  deleteReward(questId: string, rewardPath: string, reward: string): void {
    this.prepare("DELETE FROM quest_rewards WHERE quest_id = ? AND path = ? AND reward = ?").run(questId, rewardPath, reward)
  }

  addFollowUpQuest(questId: string, path: string, followUpId: string): void {
    this.prepare("INSERT INTO quest_follow_ups (quest_id, path, follow_up_id) VALUES (?, ?, ?)").run(questId, path, followUpId)
  }

  deleteFollowUpQuest(questId: string, path: string, followUpId: string): void {
    this.prepare("DELETE FROM quest_follow_ups WHERE quest_id = ? AND path = ? AND follow_up_id = ?").run(questId, path, followUpId)
  }

  addRelatedQuest(questId: string, relatedId: string): void {
    this.prepare("INSERT INTO quest_related (quest_id, related_id) VALUES (?, ?)").run(questId, relatedId)
  }

  deleteRelatedQuest(questId: string, relatedId: string): void {
    this.prepare("DELETE FROM quest_related WHERE quest_id = ? AND related_id = ?").run(questId, relatedId)
  }
} 