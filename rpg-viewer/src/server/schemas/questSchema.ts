import { z } from "zod";

// Completion path schema
export const CompletionPathSchema = z.object({
  description: z.string(),
  challenges: z.string(),
  outcomes: z.string(),
});

// Key decision choice schema
export const DecisionChoiceSchema = z.object({
  choice: z.string(),
  consequences: z.string(),
});

// Key decision point schema
export const KeyDecisionPointSchema = z.object({
  stage: z.number(),
  decision: z.string(),
  choices: z.array(DecisionChoiceSchema),
});

// Quest stage schema
export const QuestStageSchema = z.object({
  stage: z.number(),
  title: z.string(),
  objectives: z.array(z.string()),
  completion_paths: z.record(z.string(), CompletionPathSchema),
});

// Rewards schema - can be different for each path or a simple array
export const QuestRewardsSchema = z.union([
  z.record(z.string(), z.array(z.string())),
  z.array(z.string()),
]);

// Use a more flexible approach for the quest schema to accommodate different structures
export const QuestSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    associated_npc: z.array(z.string()).optional(),
    type: z.string(),
    difficulty: z.string(),
    description: z.string(),
    quest_stages: z.array(QuestStageSchema).optional(),
    key_decision_points: z.array(KeyDecisionPointSchema).optional(),
    potential_twists: z.array(z.string()).optional(),
    rewards: QuestRewardsSchema.optional(),
    follow_up_quests: z
      .union([z.array(z.string()), z.record(z.string(), z.array(z.string()))])
      .optional(),
    related_quests: z.array(z.string()).optional(),
    adaptable: z.boolean().optional(),
  })
  .passthrough(); // Allow additional properties that aren't defined in the schema

// Quest file schema
export const QuestsFileSchema = z.object({
  title: z.string(),
  version: z.string(),
  description: z.string(),
  main_quests: z.array(QuestSchema).optional(),
  side_quests: z.array(QuestSchema).optional(),
  faction_quests: z.array(QuestSchema).optional(),
  personal_quests: z.array(QuestSchema).optional(),
});

// Export TypeScript types
export type CompletionPath = z.infer<typeof CompletionPathSchema>;
export type DecisionChoice = z.infer<typeof DecisionChoiceSchema>;
export type KeyDecisionPoint = z.infer<typeof KeyDecisionPointSchema>;
export type QuestStage = z.infer<typeof QuestStageSchema>;
export type QuestRewards = z.infer<typeof QuestRewardsSchema>;
export type Quest = z.infer<typeof QuestSchema>;
export type QuestsFile = z.infer<typeof QuestsFileSchema>;
