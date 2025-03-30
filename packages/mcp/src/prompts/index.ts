import type { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { GetPromptRequestSchema, ListPromptsRequestSchema } from "@modelcontextprotocol/sdk/types.js"

export const addPrompts = (server: Server) => {
	server.setRequestHandler(GetPromptRequestSchema, async (request) => {
		const promptName = request.params.name

		//=======================================
		// FACTION PROMPTS
		//=======================================
		if (promptName === "create_faction_concept") {
			const theme = request.params.arguments?.theme || "mysterious organization"
			const region = request.params.arguments?.region
			const alignment = request.params.arguments?.alignment

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

		//=======================================
		// LOCATION PROMPTS
		//=======================================
		else if (promptName === "create_location_concept") {
			const locationType = request.params.arguments?.locationType || "mysterious place"
			const region = request.params.arguments?.region
			const dangerLevel = request.params.arguments?.dangerLevel

			return {
				messages: [
					{
						role: "system",
						content: {
							type: "text",
							text: `You're a creative worldbuilder with an eye for memorable locations.
                    Create places that feel lived-in, with history and secrets.
                    Focus on what makes locations interesting to explore and interact with.
                    Add elements that create storytelling opportunities and player choices.`,
						},
					},
					{
						role: "user",
						content: {
							type: "text",
							text: `I need a ${dangerLevel ? `${dangerLevel} ` : ""}${locationType} for my D&D campaign${region ? ` in the ${region} region` : ""}.
                    
                    Please create an evocative location with:
                    1. A striking name and basic description
                    2. The location's history and how it came to be
                    3. Who controls or inhabits it currently
                    4. 3-5 notable features or areas within it
                    5. At least one hidden secret or mystery
                    6. A looming threat or complication
                    7. 1-2 rumors players might hear about this place
                    
                    Make this place feel alive and worth exploring! Include elements that could lead to 
                    interesting roleplay, combat, or exploration scenarios.
                    
                    After you describe the concept, I'll ask you to help implement it using location creation tools.`,
						},
					},
				],
			}
		} else if (promptName === "create_location_details") {
			const locationId = request.params.arguments?.locationId
			const locationName = request.params.arguments?.locationName
			const locationType = request.params.arguments?.locationType || "location"

			return {
				messages: [
					{
						role: "system",
						content: {
							type: "text",
							text: `You're a detail-oriented worldbuilder who excels at fleshing out locations.
                    Create vivid sensory details and dynamic elements that bring places to life.
                    Focus on actionable details that DMs can easily incorporate into gameplay.`,
						},
					},
					{
						role: "user",
						content: {
							type: "text",
							text: `I've created a ${locationType} called "${locationName}" (ID: ${locationId}) and now I need to flesh out more details.
                    
                    Please help me add:
                    1. Sensory details - sights, sounds, smells, etc.
                    2. Key NPCs who might be found here (without full stats)
                    3. Interesting objects or interactive elements
                    4. Potential encounters appropriate to this location
                    5. A small "random events" table (d6) with location-specific happenings
                    
                    After you suggest these details, I'll help you implement them using update tools and NPC creation.`,
						},
					},
				],
			}
		}

		//=======================================
		// NPC PROMPTS
		//=======================================
		else if (promptName === "create_npc_concept") {
			const role = request.params.arguments?.role || "mysterious character"
			const race = request.params.arguments?.race
			const characterClass = request.params.arguments?.class

			return {
				messages: [
					{
						role: "system",
						content: {
							type: "text",
							text: `You're a character creator who specializes in memorable, flawed NPCs.
                    Create characters with strong personalities, clear motivations, and interesting quirks.
                    Focus on what makes them fun to roleplay and interact with.
                    Include both strengths and weaknesses to make them feel real.`,
						},
					},
					{
						role: "user",
						content: {
							type: "text",
							text: `I need a ${race ? `${race} ` : ""}${characterClass ? `${characterClass} ` : ""}NPC who serves as a ${role} in my D&D campaign.
                    
                    Please create a compelling character with:
                    1. A memorable name and basic appearance
                    2. A concise but colorful personality description
                    3. Their primary motivation and current goal
                    4. A notable quirk or behavioral trait
                    5. A secret they're hiding
                    6. How they might help or hinder the players
                    7. A vocal pattern or speech habit that makes them distinctive
                    
                    Make this character someone my players will remember! Avoid clichés unless you're 
                    deliberately subverting them in an interesting way.
                    
                    After you describe the concept, I'll ask you to help implement it using NPC creation tools.`,
						},
					},
				],
			}
		} else if (promptName === "create_faction_npcs") {
			const factionId = request.params.arguments?.factionId
			const factionName = request.params.arguments?.factionName
			const factionType = request.params.arguments?.factionType || "organization"

			return {
				messages: [
					{
						role: "system",
						content: {
							type: "text",
							text: `You're a creative DM assistant who specializes in developing memorable NPCs.
                    Create characters with distinct personalities, motivations, and quirks.
                    Include at least one potential ally, one potential enemy, and one wildcard.
                    Focus on how these characters interact with each other within the faction.`,
						},
					},
					{
						role: "user",
						content: {
							type: "text",
							text: `I need 3-5 key NPCs who are members of the "${factionName}" ${factionType} (ID: ${factionId}).
                    
                    For each NPC, provide:
                    1. Name, race, gender
                    2. Role within the faction
                    3. Distinct personality traits and appearance
                    4. A personal motivation that might align or conflict with faction goals
                    5. A secret or quirk
                    6. Basic stats approach (e.g., "skilled rogue with high dexterity")
                    
                    Make these NPCs feel like they belong together but have their own agendas and conflicts.
                    Include a mix of ranks and attitudes - not everyone should be a true believer!
                    
                    After you suggest them, I'll help you implement them using the NPC creation tools.`,
						},
					},
				],
			}
		} else if (promptName === "create_location_npcs") {
			const locationId = request.params.arguments?.locationId
			const locationName = request.params.arguments?.locationName
			const locationType = request.params.arguments?.locationType || "place"

			return {
				messages: [
					{
						role: "system",
						content: {
							type: "text",
							text: `You're a creative DM assistant who specializes in populating locations with interesting characters.
                    Create NPCs that feel like they belong in this specific location.
                    Include a mix of permanent residents and visitors with different purposes.
                    Focus on how these characters interact with the environment and each other.`,
						},
					},
					{
						role: "user",
						content: {
							type: "text",
							text: `I need 3-5 NPCs who can be found at "${locationName}" ${locationType} (ID: ${locationId}).
                    
                    For each NPC, provide:
                    1. Name, race, gender
                    2. Their role or purpose at this location
                    3. Distinct personality traits and appearance
                    4. Why they're here and how long they've been/will be here
                    5. A secret or quirk
                    6. How they might interact with players who visit
                    
                    Make these NPCs feel like they naturally fit in this location. Include both fixtures
                    (people who are always there) and transients (people who might be passing through).
                    
                    After you suggest them, I'll help you implement them using the NPC creation tools.`,
						},
					},
				],
			}
		}

		//=======================================
		// QUEST PROMPTS
		//=======================================
		else if (promptName === "create_quest_concept") {
			const questType = request.params.arguments?.questType || "adventure"
			const difficulty = request.params.arguments?.difficulty
			const partyLevel = request.params.arguments?.partyLevel

			return {
				messages: [
					{
						role: "system",
						content: {
							type: "text",
							text: `You're a quest designer who creates engaging adventures with multiple paths.
                    Design quests with moral complexity, interesting choices, and unexpected twists.
                    Focus on player agency and opportunities for different approaches.
                    Create challenges that appeal to different player types (combat, roleplay, exploration).`,
						},
					},
					{
						role: "user",
						content: {
							type: "text",
							text: `I need a ${difficulty ? `${difficulty} ` : ""}${questType} quest${partyLevel ? ` for a level ${partyLevel} party` : ""}.
                    
                    Please create an engaging quest with:
                    1. A compelling hook and initial situation
                    2. The core conflict or challenge
                    3. Key NPCs involved (antagonists, allies, neutrals)
                    4. 2-3 key locations or scenes
                    5. Multiple possible approaches or solutions
                    6. An unexpected twist or complication
                    7. Potential rewards beyond just treasure
                    8. Possible consequences or follow-up hooks
                    
                    Make this quest adaptable to different play styles! Include opportunities for combat,
                    social interaction, and exploration. Don't make it too linear - allow for player creativity.
                    
                    After you describe the concept, I'll ask you to help implement it using quest creation tools.`,
						},
					},
				],
			}
		} else if (promptName === "create_faction_quests") {
			const factionId = request.params.arguments?.factionId
			const factionName = request.params.arguments?.factionName

			return {
				messages: [
					{
						role: "system",
						content: {
							type: "text",
							text: `You're a quest design expert who excels at creating faction-centered adventures.
                    Focus on quests that reveal faction dynamics and internal conflicts.
                    Create adventures that let players impact the faction's future.
                    Include options for both supporting and opposing the faction.`,
						},
					},
					{
						role: "user",
						content: {
							type: "text",
							text: `I need 2-3 quest ideas involving the "${factionName}" faction (ID: ${factionId}).
                    
                    For each quest, provide:
                    1. An engaging title and hook (how players get involved)
                    2. The core conflict or objective
                    3. Key NPCs from the faction who are involved
                    4. How this quest reveals something about the faction's goals or methods
                    5. Multiple approaches (helping the faction, hindering them, or something unexpected)
                    6. A potential twist or complication
                    7. Consequences for the faction depending on the outcome
                    
                    Make these quests reveal different aspects of the faction! Include scenarios
                    where players might be tempted to both help and hinder the faction's goals.
                    
                    After you suggest them, I'll help implement them using the quest creation tools.`,
						},
					},
				],
			}
		} else if (promptName === "create_location_quests") {
			const locationId = request.params.arguments?.locationId
			const locationName = request.params.arguments?.locationName

			return {
				messages: [
					{
						role: "system",
						content: {
							type: "text",
							text: `You're a quest design expert who excels at creating location-based adventures.
                    Focus on quests that showcase unique features of the location.
                    Create adventures that have players interact with the environment in interesting ways.
                    Include exploration, environmental challenges, and local conflicts.`,
						},
					},
					{
						role: "user",
						content: {
							type: "text",
							text: `I need 2-3 quest ideas set at "${locationName}" (ID: ${locationId}).
                    
                    For each quest, provide:
                    1. An engaging title and hook (why players come to this location)
                    2. The core conflict or objective
                    3. How this quest makes use of unique features of the location
                    4. Key NPCs or creatures involved
                    5. Multiple approaches to resolution
                    6. A potential twist or environmental complication
                    7. How the location might change based on the outcome
                    
                    Make these quests feel like they could only happen in this specific location!
                    Leverage the environment for more than just backdrop - make it integral to the adventure.
                    
                    After you suggest them, I'll help implement them using the quest creation tools.`,
						},
					},
				],
			}
		}

		//=======================================
		// ASSOCIATION PROMPTS
		//=======================================
		else if (promptName === "create_faction_connections") {
			const factionId = request.params.arguments?.factionId
			const factionName = request.params.arguments?.factionName

			return {
				messages: [
					{
						role: "system",
						content: {
							type: "text",
							text: `You're a worldbuilding assistant who excels at creating interconnected story elements.
                    Create interesting relationships between entities that will drive conflict and story.
                    Focus on connections that create dramatic tension and gameplay opportunities.`,
						},
					},
					{
						role: "user",
						content: {
							type: "text",
							text: `I need to establish connections for faction "${factionName}" (ID: ${factionId}).
                    
                    Please suggest:
                    1. What locations this faction might be associated with (headquarters, territories, etc.)
                    2. What other factions they might have relationships with (allies, rivals, etc.)
                    3. What quests might involve this faction (either as quest-givers or antagonists)
                    4. How these connections might create interesting dynamics in the campaign
                    
                    For each suggested connection, provide:
                    - The type of entity (location, faction, NPC, quest)
                    - A name and brief description
                    - The nature of the relationship (control, rivalry, alliance, etc.)
                    - A potential conflict or complication involving this relationship
                    
                    I'll use these suggestions to help implement the connections using the association tools.
                    Be specific and imaginative - create connections that will generate gameplay opportunities!`,
						},
					},
				],
			}
		} else if (promptName === "create_location_connections") {
			const locationId = request.params.arguments?.locationId
			const locationName = request.params.arguments?.locationName

			return {
				messages: [
					{
						role: "system",
						content: {
							type: "text",
							text: `You're a worldbuilding assistant who excels at creating interconnected locations.
                    Create interesting relationships between places and the entities that inhabit them.
                    Focus on connections that create story hooks and adventure opportunities.`,
						},
					},
					{
						role: "user",
						content: {
							type: "text",
							text: `I need to establish connections for location "${locationName}" (ID: ${locationId}).
                    
                    Please suggest:
                    1. What factions might control or have interest in this location
                    2. What NPCs might be permanently or frequently found here
                    3. What quests might take place at this location
                    4. What other locations might be connected to this one (physically or thematically)
                    
                    For each suggested connection, provide:
                    - The type of entity (faction, NPC, quest, location)
                    - A name and brief description
                    - The nature of the connection
                    - Why this connection matters to the story or gameplay
                    
                    I'll use these suggestions to help implement the connections using the association tools.
                    Be specific and concrete - focus on connections that create interesting situations!`,
						},
					},
				],
			}
		} else if (promptName === "create_npc_connections") {
			const npcId = request.params.arguments?.npcId
			const npcName = request.params.arguments?.npcName

			return {
				messages: [
					{
						role: "system",
						content: {
							type: "text",
							text: `You're a character development expert who excels at creating interconnected NPCs.
                    Create interesting relationships between characters and the world around them.
                    Focus on connections that create drama, loyalty conflicts, and interesting backstories.`,
						},
					},
					{
						role: "user",
						content: {
							type: "text",
							text: `I need to establish connections for NPC "${npcName}" (ID: ${npcId}).
                    
                    Please suggest:
                    1. What factions this NPC might belong to or have relationships with
                    2. What locations this NPC might be associated with
                    3. What other NPCs they might have significant relationships with
                    4. What quests they might be involved in
                    
                    For each suggested connection, provide:
                    - The type of entity (faction, location, NPC, quest)
                    - A name and brief description
                    - The nature of the relationship (member, rival, friend, etc.)
                    - A potential story hook involving this relationship
                    
                    I'll use these suggestions to help implement the connections using the association tools.
                    Be specific and dramatic - focus on connections that create interesting roleplay opportunities!`,
						},
					},
				],
			}
		} else if (promptName === "create_quest_connections") {
			const questId = request.params.arguments?.questId
			const questName = request.params.arguments?.questName

			return {
				messages: [
					{
						role: "system",
						content: {
							type: "text",
							text: `You're a quest design expert who excels at creating interconnected adventures.
                    Create interesting relationships between quests and campaign elements.
                    Focus on connections that create a sense of a living world with consequences.`,
						},
					},
					{
						role: "user",
						content: {
							type: "text",
							text: `I need to establish connections for quest "${questName}" (ID: ${questId}).
                    
                    Please suggest:
                    1. What factions might be involved in or affected by this quest
                    2. What locations this quest might take place in
                    3. What NPCs might be key figures in this quest
                    4. What other quests might be connected to this one (prerequisites, follow-ups)
                    
                    For each suggested connection, provide:
                    - The type of entity (faction, location, NPC, quest)
                    - A name and brief description
                    - The nature of the involvement
                    - How this connection enhances the quest's depth or complexity
                    
                    I'll use these suggestions to help implement the connections using the association tools.
                    Be specific and consequential - focus on connections that make the quest more engaging!`,
						},
					},
				],
			}
		}

		//=======================================
		// CAMPAIGN INTEGRATION PROMPTS
		//=======================================
		else if (promptName === "integrate_entities") {
			const theme = request.params.arguments?.theme || "interconnected world"
			const entityIds = request.params.arguments?.entityIds

			return {
				messages: [
					{
						role: "system",
						content: {
							type: "text",
							text: `You're a master storyteller who excels at weaving disparate elements into cohesive narratives.
                    Create interesting connections that feel natural but surprising.
                    Focus on creating a complex web rather than linear relationships.`,
						},
					},
					{
						role: "user",
						content: {
							type: "text",
							text: `I need to integrate multiple campaign elements around the theme: "${theme}"${entityIds ? ` involving entities with IDs: ${entityIds}` : ""}.
                    
                    Please help me create a web of connections that:
                    1. Links factions, locations, NPCs, and quests in interesting ways
                    2. Creates multiple layers of alliances and conflicts
                    3. Establishes secrets known to some entities but not others
                    4. Suggests how players might discover these connections over time
                    5. Includes surprising twists that challenge initial appearances
                    
                    For each suggested connection, provide:
                    - The entities involved
                    - The nature of their relationship
                    - Who knows about this relationship and who doesn't
                    - How it connects to the central theme
                    
                    Focus on creating a rich, interconnected world that feels dynamic and responsive!
                    After you suggest these connections, I'll help implement them using the association tools.`,
						},
					},
				],
			}
		} else if (promptName === "generate_session_hooks") {
			const campaignStage = request.params.arguments?.campaignStage || "ongoing"
			const previousEvents = request.params.arguments?.previousEvents

			return {
				messages: [
					{
						role: "system",
						content: {
							type: "text",
							text: `You're an experienced DM who excels at creating engaging game sessions.
                    Create hooks that build on existing campaign elements but introduce new twists.
                    Focus on creating player agency while advancing the overall story.`,
						},
					},
					{
						role: "user",
						content: {
							type: "text",
							text: `I need ideas for my next D&D session in a ${campaignStage} campaign${previousEvents ? ` where recently: ${previousEvents}` : ""}.
                    
                    Please suggest:
                    1. 2-3 potential adventure hooks that could kick off the session
                    2. A surprising event that could occur during gameplay
                    3. An NPC who might make a significant appearance
                    4. A moral dilemma or tough choice the players might face
                    5. A potential cliffhanger or revelation to end the session
                    
                    Make these suggestions specific and actionable! I want ideas I can implement right away,
                    not generic concepts. Include suggestions that could connect to existing campaign elements
                    while introducing fresh developments.
                    
                    The best ideas will give players meaningful choices while advancing the story in
                    interesting ways, regardless of what they choose.`,
						},
					},
				],
			}
		}

		// Handle other prompt types...
		else {
			throw new Error(`Unknown prompt: ${promptName}`)
		}
	})

	// Define a set of related prompt templates
	server.setRequestHandler(ListPromptsRequestSchema, async () => {
		return {
			prompts: [
				// Main faction creation prompt
				{
					name: "create_faction_concept",
					description: "Generate an engaging faction concept for your D&D campaign",
					arguments: [
						{
							name: "theme",
							description: "The theme or concept for this faction (e.g., 'thieves guild', 'dragon cult')",
							required: true,
						},
						{
							name: "region",
							description: "The region where this faction operates",
							required: false,
						},
						{
							name: "alignment",
							description: "General alignment tendency (e.g., 'lawful evil', 'chaotic neutral')",
							required: false,
						},
					],
				},

				// NPC creation prompt
				{
					name: "create_faction_npcs",
					description: "Generate memorable NPCs for your faction",
					arguments: [
						{
							name: "factionId",
							description: "ID of the faction these NPCs belong to",
							required: true,
						},
						{
							name: "factionName",
							description: "Name of the faction these NPCs belong to",
							required: true,
						},
						{
							name: "factionType",
							description: "Type of faction (e.g., 'cult', 'guild', 'military')",
							required: false,
						},
					],
				},

				// Association prompt
				{
					name: "create_faction_connections",
					description: "Establish relationships between your faction and other entities",
					arguments: [
						{
							name: "factionId",
							description: "ID of the faction to connect",
							required: true,
						},
						{
							name: "factionName",
							description: "Name of the faction to connect",
							required: true,
						},
					],
				},

				// Quest hooks prompt
				{
					name: "create_faction_quests",
					description: "Generate quest ideas involving your faction",
					arguments: [
						{
							name: "factionId",
							description: "ID of the faction involved in these quests",
							required: true,
						},
						{
							name: "factionName",
							description: "Name of the faction involved in these quests",
							required: true,
						},
					],
				},
			],
		}
	})
}
