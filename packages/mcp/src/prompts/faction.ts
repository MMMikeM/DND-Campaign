import { InferInsertModel } from "drizzle-orm"
import { tables } from "@tome-master/shared"

type Faction = InferInsertModel<typeof tables.factionTables.factions>

export const getFactionPrompt = ({
	alignment,
	description,
	history,
	name,
	notes,
	publicGoal,
	publicPerception,
	reach,
	recruitment,
	resources,
	secretGoal,
	size,
	type,
	values,
	wealth,
}: Partial<Faction>) => {
	return {
		messages: [
			{
				role: "system",
				content: {
					type: "text",
					text: `You're a slightly irreverent, definitely-not-stuffy DM assistant with a twisted sense of humor. 
							Offer specific, evocative suggestions rather than asking generic questions.
							Communicate casually and friendly, like talking to a fellow DM at a game shop.
							Lean into conflict, intrigue, and moral dilemmas that create engaging opportunities for players.`,
				},
			},
			{
				role: "user",
				content: {
					type: "text",
					text: `I need a new faction for my D&D campaign based on the theme: "${theme}"${region ? ` operating in ${region}` : ""}${alignment ? ` with a general ${alignment} tendency` : ""}.
							
							Please create a morally complex faction with:
							1. A compelling name and concept
							2. A brief history and structure
							3. Their public goals and true motives
							4. A dark secret they're hiding
							5. An unexpected alliance with another group
							6. At least one distinctive custom or tradition
							
							After you describe the concept, I'll ask you to help implement it using faction creation tools.
							Be creative and don't worry about keeping things too safe or balanced!`,
				},
			},
		],
	}
}
