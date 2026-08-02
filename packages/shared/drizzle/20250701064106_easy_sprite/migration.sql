ALTER TABLE "quests" DROP CONSTRAINT "quests_region_id_regions_id_fk";
--> statement-breakpoint
ALTER TABLE "quests" ADD COLUMN "promise" text;--> statement-breakpoint
ALTER TABLE "quests" ADD COLUMN "payoff" text;--> statement-breakpoint
ALTER TABLE "quests" ADD COLUMN "stakes" text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "quests" ADD COLUMN "emotional_shape" text;--> statement-breakpoint
ALTER TABLE "quests" ADD COLUMN "event_type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "quests" ADD COLUMN "intended_rhythm_effect" text NOT NULL;--> statement-breakpoint
ALTER TABLE "quests" ADD COLUMN "narrative_placement" text NOT NULL;--> statement-breakpoint
ALTER TABLE "quests" ADD COLUMN "impact_severity" text NOT NULL;--> statement-breakpoint
ALTER TABLE "quest_hooks" DROP COLUMN "gm_notes";--> statement-breakpoint
ALTER TABLE "quest_participants" DROP COLUMN "gm_notes";--> statement-breakpoint
ALTER TABLE "quest_relations" DROP COLUMN "gm_notes";--> statement-breakpoint
ALTER TABLE "quests" DROP COLUMN "gm_notes";--> statement-breakpoint
ALTER TABLE "quests" DROP COLUMN "region_id";--> statement-breakpoint
ALTER TABLE "quests" DROP COLUMN "visibility";--> statement-breakpoint
ALTER TABLE "quests" DROP COLUMN "moral_spectrum_focus";--> statement-breakpoint
ALTER TABLE "quests" DROP COLUMN "intended_pacing_role";--> statement-breakpoint
ALTER TABLE "quests" DROP COLUMN "failure_outcomes";--> statement-breakpoint
ALTER TABLE "quests" DROP COLUMN "success_outcomes";--> statement-breakpoint
ALTER TABLE "quests" DROP COLUMN "themes";--> statement-breakpoint
ALTER TABLE "quests" DROP COLUMN "inspirations";--> statement-breakpoint
ALTER TABLE "npc_quest_stage_involvement" DROP COLUMN "gm_notes";--> statement-breakpoint
ALTER TABLE "quest_stage_decisions" DROP COLUMN "gm_notes";--> statement-breakpoint
ALTER TABLE "quest_stages" DROP COLUMN "gm_notes";