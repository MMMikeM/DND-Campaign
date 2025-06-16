// foreshadowing/tables.ts

import { sql } from "drizzle-orm"
import { check, integer, pgTable } from "drizzle-orm/pg-core"
import { list, manyOf, nullableOneOf, oneOf, pk, string } from "../../db/utils"
import { enums } from "./enums"

export { enums } from "./enums"

const { discoverySubtlety, narrativeWeight, seedDeliveryMethods, foreshadowedTargetType, foreshadowingSourceType } =
	enums

export const foreshadowing = pgTable(
	"foreshadowing",
	{
		id: pk(),
		name: string("name").unique(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		targetEntityType: oneOf("target_entity_type", foreshadowedTargetType),
		targetEntityId: integer("target_entity_id"),

		sourceEntityType: nullableOneOf("source_entity_type", foreshadowingSourceType),
		sourceEntityId: integer("source_entity_id"),

		subtlety: oneOf("subtlety", discoverySubtlety),
		narrativeWeight: oneOf("narrative_weight", narrativeWeight),
		suggestedDeliveryMethods: manyOf("suggested_delivery_methods", seedDeliveryMethods),
	},
	(t) => [
		check(
			"chk_abstract_target_has_text",
			sql`
                CASE 
                    WHEN ${t.targetEntityType} IN ('abstract_theme', 'specific_reveal') 
                    THEN (${t.targetEntityId} IS NOT NULL) -- For abstract, the text IS the ID.
                    ELSE TRUE
                END
            `,
		),
		check(
			"chk_source_duo_validity",
			sql`(${t.sourceEntityType} IS NULL AND ${t.sourceEntityId} IS NULL) OR (${t.sourceEntityType} IS NOT NULL AND ${t.sourceEntityId} IS NOT NULL)`,
		),
	],
)
