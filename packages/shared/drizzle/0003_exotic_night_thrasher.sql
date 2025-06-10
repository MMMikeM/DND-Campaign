DROP INDEX "unique_current_per_npc";--> statement-breakpoint
CREATE UNIQUE INDEX CONCURRENTLY "unique_current_per_npc" ON "npc_sites" USING btree ("npc_id") WHERE "npc_sites"."is_current" = true;