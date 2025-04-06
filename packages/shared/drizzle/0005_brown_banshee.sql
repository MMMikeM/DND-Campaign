ALTER TABLE "npc_locations" RENAME TO "npc_sites";--> statement-breakpoint
ALTER TABLE "faction_operations" RENAME COLUMN "locations" TO "site";--> statement-breakpoint
ALTER TABLE "npc_sites" DROP CONSTRAINT "npc_locations_npc_id_site_id_unique";--> statement-breakpoint
ALTER TABLE "npc_sites" DROP CONSTRAINT "npc_locations_npc_id_npcs_id_fk";
--> statement-breakpoint
ALTER TABLE "npc_sites" DROP CONSTRAINT "npc_locations_site_id_sites_id_fk";
--> statement-breakpoint
ALTER TABLE "npc_sites" ADD CONSTRAINT "npc_sites_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_sites" ADD CONSTRAINT "npc_sites_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_sites" ADD CONSTRAINT "npc_sites_npc_id_site_id_unique" UNIQUE("npc_id","site_id");