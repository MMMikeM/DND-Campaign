ALTER TABLE "world_state_changes" RENAME COLUMN "title" TO "name";--> statement-breakpoint
ALTER TABLE "world_state_changes" DROP CONSTRAINT "world_state_changes_title_unique";--> statement-breakpoint
ALTER TABLE "world_state_changes" ADD CONSTRAINT "world_state_changes_name_unique" UNIQUE("name");