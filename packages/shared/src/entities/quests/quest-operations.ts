import { eq, and, InferInsertModel } from "drizzle-orm"
import {
	quests,
	questStages,
	questObjectives,
	questCompletionPaths,
	questDecisionPoints,
	questDecisionChoices,
	questTwists,
	questRewards,
	questFollowUps,
	questRelated,
	questNpcs,
	questLocations,
	questFactions,
	type NewQuest,
	type UpdateQuest,
	type Stage,
} from "./quest.schema.js"
import type { DrizzleDb } from "../../db/index.js"

export const createQuestOperations = (db: DrizzleDb) => {
	const create = async (newQuest: NewQuest): Promise<number> => {
		try {
			return await db.transaction(async (tx) => {
				// Insert main quest data
				const result = await tx
					.insert(quests)
					.values({
						title: newQuest.title,
						type: newQuest.type,
						difficulty: newQuest.difficulty,
						description: newQuest.description,
						adaptable: newQuest.adaptable,
					})
					.returning({ id: quests.id })

				const questId = result[0].id

				// Insert stages
				if (newQuest.stages?.length) {
					for (const stage of newQuest.stages) {
						// Insert stage
						const stageResult = await tx
							.insert(questStages)
							.values({
								questId,
								stage: stage.stage,
								title: stage.title,
							})
							.returning({ stage: questStages.stage })

						const stageNumber = stageResult[0].stage

						// Insert objectives
						if (stage.objectives?.length) {
							await tx.insert(questObjectives).values(
								stage.objectives.map((objective) => ({
									questId,
									stage: stageNumber,
									...objective,
								})),
							)
						}

						// Insert completion paths
						if (stage.completionPaths?.length) {
							await tx.insert(questCompletionPaths).values(
								stage.completionPaths.map((path) => ({
									questId,
									stage: stageNumber,
									...path,
								})),
							)
						}

						// Insert decision points
						if (stage.decisionPoints?.length) {
							for (const decision of stage.decisionPoints) {
								// Insert decision point
								await tx.insert(questDecisionPoints).values({
									questId,
									stage: stageNumber,
									...decision,
								})

								// Insert decision choices
								if (decision.choices?.length) {
									await tx.insert(questDecisionChoices).values(
										decision.choices.map((choice) => ({
											questId,
											stage: stageNumber,
											decision: decision.decision,
											...choice,
										})),
									)
								}
							}
						}
					}
				}

				// Insert twists
				if (newQuest.twists?.length) {
					await tx.insert(questTwists).values(
						newQuest.twists.map((twist) => ({
							questId,
							...twist,
						})),
					)
				}

				// Insert rewards
				if (newQuest.rewards?.length) {
					await tx.insert(questRewards).values(
						newQuest.rewards.map((reward) => ({
							questId,
							...reward,
						})),
					)
				}

				// Insert follow-ups
				if (newQuest.follow_ups?.length) {
					await tx.insert(questFollowUps).values(
						newQuest.follow_ups.map((followUp) => ({
							questId,
							...followUp,
						})),
					)
				}

				// Insert related quests
				if (newQuest.related_quests?.length) {
					await tx.insert(questRelated).values(
						newQuest.related_quests.map((related) => ({
							questId,
							...related,
						})),
					)
				}

				// Insert NPCs
				if (newQuest.npcs?.length) {
					await tx.insert(questNpcs).values(
						newQuest.npcs.map((npc) => ({
							questId,
							...npc,
						})),
					)
				}

				// Insert locations
				if (newQuest.locations?.length) {
					await tx.insert(questLocations).values(
						newQuest.locations.map((location) => ({
							questId,
							...location,
						})),
					)
				}

				// Insert factions
				if (newQuest.factions?.length) {
					await tx.insert(questFactions).values(
						newQuest.factions.map((faction) => ({
							questId,
							...faction,
						})),
					)
				}

				return questId
			})
		} catch (error) {
			console.error("Error creating quest:", error)
			throw error
		}
	}

	const get = async (id: number) => {
		try {
			// Return raw join results using left joins
			const result = await db
				.select()
				.from(quests)
				.leftJoin(questStages, eq(questStages.questId, quests.id))
				.leftJoin(
					questObjectives,
					and(eq(questObjectives.questId, quests.id), eq(questObjectives.stage, questStages.stage)),
				)
				.leftJoin(
					questCompletionPaths,
					and(
						eq(questCompletionPaths.questId, quests.id),
						eq(questCompletionPaths.stage, questStages.stage),
					),
				)
				.leftJoin(
					questDecisionPoints,
					and(
						eq(questDecisionPoints.questId, quests.id),
						eq(questDecisionPoints.stage, questStages.stage),
					),
				)
				.leftJoin(
					questDecisionChoices,
					and(
						eq(questDecisionChoices.questId, quests.id),
						eq(questDecisionChoices.stage, questStages.stage),
						eq(questDecisionChoices.decision, questDecisionPoints.decision),
					),
				)
				.leftJoin(questTwists, eq(questTwists.questId, quests.id))
				.leftJoin(questRewards, eq(questRewards.questId, quests.id))
				.leftJoin(questFollowUps, eq(questFollowUps.questId, quests.id))
				.leftJoin(questRelated, eq(questRelated.questId, quests.id))
				.leftJoin(questNpcs, eq(questNpcs.questId, quests.id))
				.leftJoin(questLocations, eq(questLocations.questId, quests.id))
				.leftJoin(questFactions, eq(questFactions.questId, quests.id))
				.where(eq(quests.id, id))
				.all()

			return result
		} catch (error) {
			console.error("Error retrieving quest:", error)
			throw error
		}
	}

	const update = async (questId: number, partialQuest: UpdateQuest): Promise<void> => {
		try {
			await db.transaction(async (tx) => {
				// Extract the base quest fields from partialQuest
				const {
					stages,
					twists,
					rewards,
					follow_ups,
					related_quests,
					npcs,
					locations,
					factions,
					...questFields
				} = partialQuest

				// Update main quest record if there are fields to update
				if (Object.keys(questFields).length > 0) {
					await tx.update(quests).set(questFields).where(eq(quests.id, questId))
				}

				// Update stages and their related data if provided
				if (stages !== undefined) {
					// Delete all existing stage-related data
					await tx.delete(questObjectives).where(eq(questObjectives.questId, questId))
					await tx.delete(questCompletionPaths).where(eq(questCompletionPaths.questId, questId))
					await tx.delete(questDecisionChoices).where(eq(questDecisionChoices.questId, questId))
					await tx.delete(questDecisionPoints).where(eq(questDecisionPoints.questId, questId))
					await tx.delete(questStages).where(eq(questStages.questId, questId))

					// Insert new stages and their related data
					if (stages.length > 0) {
						for (const stage of stages) {
							// Insert stage
							const stageResult = await tx
								.insert(questStages)
								.values({ questId, stage: stage.stage, title: stage.title })
								.returning({ stage: questStages.stage })

							const stageNumber = stageResult[0].stage

							// Insert objectives
							if (stage.objectives?.length) {
								await tx.insert(questObjectives).values(
									stage.objectives.map((objective) => ({
										questId: questId,
										stage: stageNumber,
										...objective,
									})),
								)
							}

							// Insert completion paths
							if (stage.completionPaths?.length) {
								await tx.insert(questCompletionPaths).values(
									stage.completionPaths.map((path) => ({
										questId: questId,
										stage: stageNumber,
										pathName: path.pathName,
										description: path.description,
										challenges: path.challenges,
										outcomes: path.outcomes,
									})),
								)
							}

							// Insert decision points
							if (stage.decisionPoints?.length) {
								for (const decision of stage.decisionPoints) {
									// Insert decision point
									await tx.insert(questDecisionPoints).values({
										questId: questId,
										stage: stageNumber,
										decision: decision.decision,
									})

									// Insert decision choices
									if (decision.choices?.length) {
										await tx.insert(questDecisionChoices).values(
											decision.choices.map((choice) => ({
												questId: questId,
												stage: stageNumber,
												decision: decision.decision,
												choice: choice.choice,
												consequences: choice.consequences,
											})),
										)
									}
								}
							}
						}
					}
				}

				// Update twists if provided
				if (twists !== undefined) {
					await tx.delete(questTwists).where(eq(questTwists.questId, questId))
					if (twists.length > 0) {
						await tx.insert(questTwists).values(
							twists.map((twist) => ({
								questId: questId,
								twist: twist.twist,
							})),
						)
					}
				}

				// Update rewards if provided
				if (rewards !== undefined) {
					await tx.delete(questRewards).where(eq(questRewards.questId, questId))
					if (rewards.length > 0) {
						await tx.insert(questRewards).values(
							rewards.map((reward) => ({
								questId: questId,
								rewardPath: reward.rewardPath,
								reward: reward.reward,
							})),
						)
					}
				}

				// Update follow-ups if provided
				if (follow_ups !== undefined) {
					await tx.delete(questFollowUps).where(eq(questFollowUps.questId, questId))
					if (follow_ups.length > 0) {
						await tx.insert(questFollowUps).values(
							follow_ups.map((followUp) => ({
								questId: questId,
								path: followUp.path,
								followUpId: followUp.followUpId,
							})),
						)
					}
				}

				// Update related quests if provided
				if (related_quests !== undefined) {
					await tx.delete(questRelated).where(eq(questRelated.questId, questId))
					if (related_quests.length > 0) {
						await tx.insert(questRelated).values(
							related_quests.map((related) => ({
								questId: questId,
								relatedId: related.relatedId,
							})),
						)
					}
				}

				// Update NPCs if provided
				if (npcs !== undefined) {
					await tx.delete(questNpcs).where(eq(questNpcs.questId, questId))
					if (npcs.length > 0) {
						await tx.insert(questNpcs).values(
							npcs.map((npc) => ({
								questId: questId,
								npcId: npc.npcId,
								role: npc.role,
							})),
						)
					}
				}

				// Update locations if provided
				if (locations !== undefined) {
					await tx.delete(questLocations).where(eq(questLocations.questId, questId))
					if (locations.length > 0) {
						await tx.insert(questLocations).values(
							locations.map((location) => ({
								questId: questId,
								...location,
							})),
						)
					}
				}

				// Update factions if provided
				if (factions !== undefined) {
					await tx.delete(questFactions).where(eq(questFactions.questId, questId))
					if (factions.length > 0) {
						await tx.insert(questFactions).values(
							factions.map((faction) => ({
								questId: questId,
								...faction,
							})),
						)
					}
				}
			})
		} catch (error) {
			console.error("Error updating quest:", error)
			throw error
		}
	}

	const deleteFn = async (id: number): Promise<void> => {
		try {
			await db.transaction(async (tx) => {
				// With cascade delete on schema, we can just delete the main record
				await tx.delete(quests).where(eq(quests.id, id))
			})
		} catch (error) {
			console.error("Error deleting quest:", error)
			throw error
		}
	}

	// Helper functions for specific operations
	const addQuestStage = async (questId: number, stage: Stage): Promise<void> => {
		try {
			await db.transaction(async (tx) => {
				// Insert stage
				const stageResult = await tx
					.insert(questStages)
					.values({
						...stage,
					})
					.returning({ stage: questStages.stage })

				const stageNumber = stageResult[0].stage

				// Insert objectives
				if (stage.objectives?.length) {
					await tx.insert(questObjectives).values(
						stage.objectives.map((objective) => ({
							...stage,
							...objective,
						})),
					)
				}

				// Insert completion paths
				if (stage.completionPaths?.length) {
					await tx.insert(questCompletionPaths).values(
						stage.completionPaths.map((path) => ({
							questId,
							stage: stageNumber,
							...path,
						})),
					)
				}

				// Insert decision points and choices
				if (stage.decisionPoints?.length) {
					for (const decision of stage.decisionPoints) {
						await tx.insert(questDecisionPoints).values({
							questId,
							stage: stageNumber,
							decision: decision.decision,
						})

						if (decision.choices?.length) {
							await tx.insert(questDecisionChoices).values(
								decision.choices.map((choice) => ({
									questId,
									stage: stageNumber,
									decision: decision.decision,
									...choice,
								})),
							)
						}
					}
				}
			})
		} catch (error) {
			console.error("Error adding quest stage:", error)
			throw error
		}
	}

	const deleteQuestStage = async (questId: number, stageNumber: number): Promise<void> => {
		try {
			await db.transaction(async (tx) => {
				// Delete all related stage data
				await tx
					.delete(questObjectives)
					.where(and(eq(questObjectives.questId, questId), eq(questObjectives.stage, stageNumber)))
				await tx
					.delete(questCompletionPaths)
					.where(
						and(
							eq(questCompletionPaths.questId, questId),
							eq(questCompletionPaths.stage, stageNumber),
						),
					)
				await tx
					.delete(questDecisionChoices)
					.where(
						and(
							eq(questDecisionChoices.questId, questId),
							eq(questDecisionChoices.stage, stageNumber),
						),
					)
				await tx
					.delete(questDecisionPoints)
					.where(
						and(
							eq(questDecisionPoints.questId, questId),
							eq(questDecisionPoints.stage, stageNumber),
						),
					)
				await tx
					.delete(questStages)
					.where(and(eq(questStages.questId, questId), eq(questStages.stage, stageNumber)))
			})
		} catch (error) {
			console.error("Error deleting quest stage:", error)
			throw error
		}
	}

	const addTwist = async (questId: number, twist: string): Promise<void> => {
		try {
			await db.insert(questTwists).values({
				questId,
				twist,
			})
		} catch (error) {
			console.error("Error adding quest twist:", error)
			throw error
		}
	}

	const deleteTwist = async (questId: number, twist: string): Promise<void> => {
		try {
			await db
				.delete(questTwists)
				.where(and(eq(questTwists.questId, questId), eq(questTwists.twist, twist)))
		} catch (error) {
			console.error("Error deleting quest twist:", error)
			throw error
		}
	}

	return {
		create,
		get,
		update,
		delete: deleteFn,
		// Additional operations
		addQuestStage,
		deleteQuestStage,
		addTwist,
		deleteTwist,
	}
}
