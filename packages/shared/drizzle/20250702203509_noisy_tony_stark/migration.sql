ALTER TABLE "lore_links" DROP CONSTRAINT "unique_lore_link";--> statement-breakpoint
ALTER TABLE "map_variants" DROP CONSTRAINT "map_variants_name_unique";--> statement-breakpoint
ALTER TABLE "npc_faction_memberships" DROP CONSTRAINT "unique_npc_faction_membership";--> statement-breakpoint
ALTER TABLE "foreshadowing" DROP CONSTRAINT "single_source_fk_check";--> statement-breakpoint
ALTER TABLE "item_connections" DROP CONSTRAINT "chk_single_connected_fk";--> statement-breakpoint
ALTER TABLE "lore_links" DROP CONSTRAINT "single_fk_check";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'npc_details'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

ALTER TABLE "npc_details" DROP CONSTRAINT "npc_details_pkey";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'site_secrets'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

ALTER TABLE "site_secrets" DROP CONSTRAINT "site_secrets_pkey";--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD COLUMN "source_item_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "item_connections" ADD COLUMN "connected_quest_stage_id" integer;--> statement-breakpoint
ALTER TABLE "npc_details" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "site_secrets" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD CONSTRAINT "foreshadowing_source_item_id_items_id_fk" FOREIGN KEY ("source_item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_connections" ADD CONSTRAINT "item_connections_connected_quest_stage_id_quest_stages_id_fk" FOREIGN KEY ("connected_quest_stage_id") REFERENCES "public"."quest_stages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conflict_participants" ADD CONSTRAINT "conflict_participants_conflict_id_npc_id_unique" UNIQUE("conflict_id","npc_id");--> statement-breakpoint
ALTER TABLE "conflict_participants" ADD CONSTRAINT "conflict_participants_conflict_id_faction_id_unique" UNIQUE("conflict_id","faction_id");--> statement-breakpoint
ALTER TABLE "faction_influence" ADD CONSTRAINT "faction_influence_faction_id_region_id_area_id_site_id_unique" UNIQUE("faction_id","region_id","area_id","site_id");--> statement-breakpoint
ALTER TABLE "item_connections" ADD CONSTRAINT "item_connections_source_item_id_connected_npc_id_connected_faction_id_connected_site_id_connected_quest_id_connected_conflict_id_connected_lore_id_connected_item_id_connected_quest_stage_id_unique" UNIQUE("source_item_id","connected_npc_id","connected_faction_id","connected_site_id","connected_quest_id","connected_conflict_id","connected_lore_id","connected_item_id","connected_quest_stage_id");--> statement-breakpoint
ALTER TABLE "lore_links" ADD CONSTRAINT "unique_lore_link" UNIQUE("lore_id","region_id","faction_id","npc_id","conflict_id","quest_id","foreshadowing_id","related_lore_id","item_id");--> statement-breakpoint
ALTER TABLE "npc_faction_memberships" ADD CONSTRAINT "npc_faction_memberships_npc_id_unique" UNIQUE("npc_id");--> statement-breakpoint
ALTER TABLE "quest_participants" ADD CONSTRAINT "quest_participants_quest_id_npc_id_unique" UNIQUE("quest_id","npc_id");--> statement-breakpoint
ALTER TABLE "quest_participants" ADD CONSTRAINT "quest_participants_quest_id_faction_id_unique" UNIQUE("quest_id","faction_id");--> statement-breakpoint
ALTER TABLE "foreshadowing" ADD CONSTRAINT "single_source_fk_check" CHECK ((
        (case when "foreshadowing"."source_quest_id" is not null then 1 else 0 end) +
        (case when "foreshadowing"."source_quest_stage_id" is not null then 1 else 0 end) +
        (case when "foreshadowing"."source_site_id" is not null then 1 else 0 end) +
        (case when "foreshadowing"."source_npc_id" is not null then 1 else 0 end) +
        (case when "foreshadowing"."source_lore_id" is not null then 1 else 0 end) +
        (case when "foreshadowing"."source_item_id" is not null then 1 else 0 end)
      ) = 1);--> statement-breakpoint
ALTER TABLE "item_connections" ADD CONSTRAINT "chk_single_connected_fk" CHECK ((
					(CASE WHEN "item_connections"."connected_npc_id" IS NOT NULL THEN 1 ELSE 0 END) +
					(CASE WHEN "item_connections"."connected_faction_id" IS NOT NULL THEN 1 ELSE 0 END) +
					(CASE WHEN "item_connections"."connected_site_id" IS NOT NULL THEN 1 ELSE 0 END) +
					(CASE WHEN "item_connections"."connected_quest_id" IS NOT NULL THEN 1 ELSE 0 END) +
					(CASE WHEN "item_connections"."connected_conflict_id" IS NOT NULL THEN 1 ELSE 0 END) +
					(CASE WHEN "item_connections"."connected_lore_id" IS NOT NULL THEN 1 ELSE 0 END) +
					(CASE WHEN "item_connections"."connected_item_id" IS NOT NULL THEN 1 ELSE 0 END) +
					(CASE WHEN "item_connections"."connected_quest_stage_id" IS NOT NULL THEN 1 ELSE 0 END)
			) = 1);--> statement-breakpoint
ALTER TABLE "lore_links" ADD CONSTRAINT "single_fk_check" CHECK ((
        (case when "lore_links"."region_id" is not null then 1 else 0 end) +
        (case when "lore_links"."faction_id" is not null then 1 else 0 end) +
        (case when "lore_links"."npc_id" is not null then 1 else 0 end) +
        (case when "lore_links"."conflict_id" is not null then 1 else 0 end) +
        (case when "lore_links"."quest_id" is not null then 1 else 0 end) +
        (case when "lore_links"."foreshadowing_id" is not null then 1 else 0 end) +
        (case when "lore_links"."related_lore_id" is not null then 1 else 0 end) +
        (case when "lore_links"."item_id" is not null then 1 else 0 end)
      ) = 1);