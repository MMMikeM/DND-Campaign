ALTER TABLE "npcs" DROP CONSTRAINT "npcs_current_site_id_sites_id_fk";
--> statement-breakpoint
ALTER TABLE "npc_sites" ADD COLUMN "is_current" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_current_per_npc" ON "npc_sites" USING btree ("npc_id") WHERE "npc_sites"."is_current" = true;--> statement-breakpoint
ALTER TABLE "npcs" DROP COLUMN "current_site_id";