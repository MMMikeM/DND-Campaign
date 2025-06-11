CREATE TABLE "map_details" (
	"map_id" integer NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"cover_options" text[] NOT NULL,
	"elevation_features" text[] NOT NULL,
	"movement_routes" text[] NOT NULL,
	"difficult_terrain" text[] NOT NULL,
	"choke_points" text[] NOT NULL,
	"sight_lines" text[] NOT NULL,
	"tactical_positions" text[] NOT NULL,
	"interactive_elements" text[] NOT NULL,
	"environmental_hazards" text[] NOT NULL,
	"embedding_id" integer
);
--> statement-breakpoint
CREATE TABLE "maps" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"map_image" "bytea" NOT NULL,
	"image_format" text NOT NULL,
	"image_size" integer NOT NULL,
	"image_width" integer NOT NULL,
	"image_height" integer NOT NULL,
	CONSTRAINT "maps_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "sites" ADD COLUMN "map_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "map_details" ADD CONSTRAINT "map_details_map_id_maps_id_fk" FOREIGN KEY ("map_id") REFERENCES "public"."maps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "map_details" ADD CONSTRAINT "map_details_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_map_id_maps_id_fk" FOREIGN KEY ("map_id") REFERENCES "public"."maps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sites" DROP COLUMN "cover_options";--> statement-breakpoint
ALTER TABLE "sites" DROP COLUMN "elevation_features";--> statement-breakpoint
ALTER TABLE "sites" DROP COLUMN "movement_routes";--> statement-breakpoint
ALTER TABLE "sites" DROP COLUMN "difficult_terrain";--> statement-breakpoint
ALTER TABLE "sites" DROP COLUMN "choke_points";--> statement-breakpoint
ALTER TABLE "sites" DROP COLUMN "sight_lines";--> statement-breakpoint
ALTER TABLE "sites" DROP COLUMN "tactical_positions";--> statement-breakpoint
ALTER TABLE "sites" DROP COLUMN "interactive_elements";--> statement-breakpoint
ALTER TABLE "sites" DROP COLUMN "environmental_hazards";--> statement-breakpoint
ALTER TABLE "sites" DROP COLUMN "battlemap_image";--> statement-breakpoint
ALTER TABLE "sites" DROP COLUMN "image_format";--> statement-breakpoint
ALTER TABLE "sites" DROP COLUMN "image_size";--> statement-breakpoint
ALTER TABLE "sites" DROP COLUMN "image_width";--> statement-breakpoint
ALTER TABLE "sites" DROP COLUMN "image_height";--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_map_id_unique" UNIQUE("map_id");