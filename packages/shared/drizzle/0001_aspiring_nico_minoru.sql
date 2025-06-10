ALTER TABLE "npcs" RENAME COLUMN "current_location_id" TO "current_site_id";--> statement-breakpoint
ALTER TABLE "npcs" DROP CONSTRAINT "npcs_current_location_id_sites_id_fk";
--> statement-breakpoint
ALTER TABLE "npcs" ADD CONSTRAINT "npcs_current_site_id_sites_id_fk" FOREIGN KEY ("current_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;