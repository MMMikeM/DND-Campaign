ALTER TABLE "quest_stage_decisions" DROP CONSTRAINT "quest_stage_decisions_quest_id_quests_id_fk";--> statement-breakpoint
ALTER TABLE "quest_stage_decisions" DROP CONSTRAINT "quest_stage_decisions_quest_id_from_quest_stage_id_to_quest_stage_id_unique";--> statement-breakpoint
ALTER TABLE "quest_stage_decisions" DROP COLUMN "quest_id";--> statement-breakpoint
ALTER TABLE "quest_stage_decisions" ADD CONSTRAINT "quest_stage_decisions_from_quest_stage_id_to_quest_stage_id_unique" UNIQUE("from_quest_stage_id","to_quest_stage_id");