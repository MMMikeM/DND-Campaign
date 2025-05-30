classDiagram
direction BT
class areas {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   integer region_id
   text name
   text type
   text danger_level
   text atmosphere_type
   text[] revelation_layers_summary
   text leadership
   text population
   text primary_activity
   text[] cultural_notes
   text[] hazards
   text[] points_of_interest
   text[] rumors
   text[] defenses
   integer embedding_id
   integer id
}
class concept_relationships {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   integer source_concept_id
   integer target_concept_id
   text relationship_type
   text relationship_details
   text strength
   boolean is_bidirectional
   integer id
}
class conflict_participants {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   integer conflict_id
   integer npc_id
   integer faction_id
   text role
   text motivation
   text public_stance
   text secret_stance
   integer id
}
class consequences {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   text name
   text consequence_type
   text severity
   text visibility
   text timeframe
   text source_type
   text player_impact_feel
   integer trigger_decision_id
   integer trigger_quest_id
   integer trigger_conflict_id
   integer affected_faction_id
   integer affected_region_id
   integer affected_area_id
   integer affected_site_id
   integer affected_npc_id
   integer affected_destination_id
   integer affected_conflict_id
   text conflict_impact_description
   integer future_quest_id
   integer embedding_id
   integer id
}
class destination_participant_involvement {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   integer destination_id
   integer npc_id
   integer faction_id
   text role_in_arc
   text arc_importance
   text[] involvement_details
   integer id
}
class destination_quest_roles {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   integer destination_id
   integer quest_id
   text role
   integer sequence_in_arc
   text[] contribution_details
   integer id
}
class destination_relationships {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   integer source_destination_id
   integer related_destination_id
   text relationship_type
   text[] relationship_details
   integer id
}
class embeddings {
   vector(3072) embedding
   timestamp updatedAt
   integer id
}
class faction_agendas {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   integer faction_id
   text name
   text agenda_type
   text current_stage
   text importance
   text ultimate_aim
   text moral_ambiguity
   text[] approach
   text[] story_hooks
   integer embedding_id
   integer id
}
class faction_diplomacy {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   integer faction_id
   integer other_faction_id
   text strength
   text diplomatic_status
   integer id
}
class faction_influence {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   integer faction_id
   integer region_id
   integer area_id
   integer site_id
   text influence_level
   text[] presence_types
   text[] presence_details
   text[] priorities
   integer id
}
class factions {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   text name
   text public_alignment
   text secret_alignment
   text size
   text wealth
   text reach
   text[] type
   text public_goal
   text secret_goal
   text public_perception
   text transparency_level
   text[] values
   text[] history
   text[] symbols
   text[] rituals
   text[] taboos
   text[] aesthetics
   text[] jargon
   text[] recognition_signs
   integer primary_hq_site_id
   integer embedding_id
   integer id
}
class foreshadowing_seeds {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   text target_entity_type
   integer target_quest_id
   integer target_npc_id
   integer target_narrative_event_id
   integer target_major_conflict_id
   integer target_item_id
   integer target_narrative_destination_id
   integer target_world_concept_id
   integer target_faction_id
   integer target_site_id
   text target_abstract_detail
   text[] suggested_delivery_methods
   text subtlety
   text narrative_weight
   integer source_quest_id
   integer source_quest_stage_id
   integer source_site_id
   integer source_npc_id
   integer embedding_id
   integer id
}
class item_notable_history {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   integer item_id
   text event_description
   text timeframe
   integer key_npc_id
   text npc_role_in_event
   integer event_location_site_id
   integer id
}
class item_relationships {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   integer source_item_id
   text related_entity_type
   integer related_item_id
   integer related_npc_id
   integer related_faction_id
   integer related_site_id
   integer related_quest_id
   integer related_conflict_id
   integer related_narrative_destination_id
   integer related_world_concept_id
   text relationship_type
   text relationship_details
   integer id
}
class items {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   text name
   text item_type
   text rarity
   text narrative_role
   text perceived_simplicity
   text significance
   text lore_significance
   text[] mechanical_effects
   text creation_period
   text place_of_origin
   integer related_quest_id
   integer embedding_id
   integer id
}
class major_conflicts {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   integer primary_region_id
   text name
   text scope
   text[] natures
   text status
   text cause
   text[] stakes
   text moral_dilemma
   text[] possible_outcomes
   text[] hidden_truths
   text clarity_of_right_wrong
   text tension_level
   integer embedding_id
   integer id
}
class narrative_destinations {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   text name
   text type
   text status
   text promise
   text payoff
   text[] themes
   text[] foreshadowing_elements
   text intended_emotional_arc
   integer primary_region_id
   integer related_conflict_id
   integer embedding_id
   integer id
}
class narrative_events {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   text name
   text event_type
   text intended_rhythm_effect
   integer quest_stage_id
   integer triggering_decision_id
   integer related_quest_id
   text narrative_placement
   text impact_severity
   text complication_details
   text escalation_details
   text twist_reveal_details
   integer embedding_id
   integer id
}
class npc_factions {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   integer npc_id
   integer faction_id
   text loyalty
   text justification
   text role
   text rank
   text[] secrets
   integer id
}
class npc_relationships {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   integer npc_id
   integer related_npc_id
   text relationship_type
   text strength
   text[] history
   text[] narrative_tensions
   text[] shared_goals
   text[] relationship_dynamics
   boolean is_bidirectional
   integer id
}
class npc_sites {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   integer npc_id
   integer site_id
   text association_type
   integer id
}
class npcs {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   text name
   text alignment
   text disposition
   text gender
   text race
   text trust_level
   text wealth
   text adaptability
   text complexity_profile
   text player_perception_goal
   text age
   text attitude
   text occupation
   text quirk
   text social_status
   text availability
   integer current_location_id
   text[] current_goals
   text[] appearance
   text[] avoid_topics
   text[] background
   text[] biases
   text[] dialogue
   text[] drives
   text[] fears
   text[] knowledge
   text[] mannerisms
   text[] personality_traits
   text[] preferred_topics
   text[] rumours
   text[] secrets
   text[] voice_notes
   text capability
   text proactivity
   text relatability
   integer embedding_id
   integer id
}
class quest_hooks {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   integer quest_id
   integer site_id
   integer faction_id
   text source
   text hook_type
   text presentation_style
   text[] hook_content
   text[] discovery_conditions
   integer delivery_npc_id
   text npc_relationship_to_party
   text trust_required
   text dialogue_hint
   integer id
}
class quest_participant_involvement {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   integer quest_id
   integer npc_id
   integer faction_id
   text role_in_quest
   text importance_in_quest
   text[] involvement_details
   integer id
}
class quest_relationships {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   integer quest_id
   integer related_quest_id
   text relationship_type
   integer id
}
class quest_stages {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   integer quest_id
   integer site_id
   integer stage_order
   text name
   text dramatic_question
   text stage_type
   text intended_complexity_level
   text[] objectives
   text[] completion_paths
   text[] encounters
   text[] dramatic_moments
   text[] sensory_elements
   text stage_importance
   integer embedding_id
   integer id
}
class quests {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   text name
   integer region_id
   text type
   text urgency
   text visibility
   text mood
   text moral_spectrum_focus
   text intended_pacing_role
   text primary_player_experience_goal
   text[] failure_outcomes
   text[] success_outcomes
   text[] objectives
   text[] rewards
   text[] themes
   text[] inspirations
   integer parent_id
   text other_unlock_conditions_notes
   integer embedding_id
   integer id
}
class region_connections {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   integer region_id
   integer other_region_id
   text connection_type
   text route_type
   text travel_difficulty
   text travel_time
   integer controlling_faction_id
   text[] travel_hazards
   text[] points_of_interest
   integer id
}
class regions {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   text name
   text danger_level
   text type
   text atmosphere_type
   text[] revelation_layers_summary
   text economy
   text history
   text population
   text[] cultural_notes
   text[] hazards
   text[] points_of_interest
   text[] rumors
   text[] secrets
   text[] defenses
   integer embedding_id
   integer id
}
class site_encounters {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   text name
   integer site_id
   text encounter_type
   text danger_level
   text difficulty
   text[] creatures
   text[] treasure
   integer embedding_id
   integer id
}
class site_links {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   integer site_id
   integer other_site_id
   text link_type
   integer id
}
class site_secrets {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   integer site_id
   text secret_type
   text difficulty
   text[] discovery_method
   text[] consequences
   integer embedding_id
   integer id
}
class sites {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   integer area_id
   text site_type
   text intended_site_function
   text name
   text terrain
   text climate
   text mood
   text environment
   text[] creatures
   text[] features
   text[] treasures
   text[] lighting_description
   text[] soundscape
   text[] smells
   text[] weather
   text[] descriptors
   text[] cover_options
   text[] elevation_features
   text[] movement_routes
   text[] difficult_terrain
   text[] choke_points
   text[] sight_lines
   text[] tactical_positions
   text[] interactive_elements
   text[] environmental_hazards
   bytea battlemap_image
   text image_format
   integer image_size
   integer image_width
   integer image_height
   integer embedding_id
   integer id
}
class stage_decisions {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   integer quest_id
   integer from_stage_id
   integer to_stage_id
   text condition_type
   text decision_type
   text name
   text ambiguity_level
   text condition_value
   text[] success_description
   text[] failure_description
   text[] narrative_transition
   text[] potential_player_reactions
   text[] options
   boolean failure_leads_to_retry
   text failure_lesson_learned
   integer id
}
class world_concept_links {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   integer concept_id
   integer region_id
   integer faction_id
   integer npc_id
   integer conflict_id
   integer quest_id
   text link_role_or_type_text
   text link_strength
   text link_details_text
   integer id
}
class world_concepts {
   text[] creative_prompts
   text[] description
   text[] gm_notes
   text[] tags
   text name
   text concept_type
   text complexity_profile
   text moral_clarity
   text summary
   text surface_impression
   text lived_reality_details
   text hidden_truths_or_depths
   text[] additional_details
   text social_structure
   text[] core_values
   text[] traditions
   text[] languages
   text[] adaptation_strategies
   text[] defining_characteristics
   text[] major_events
   text[] lasting_institutions
   text[] conflicting_narratives
   text[] historical_grievances
   text[] ending_causes
   text[] historical_lessons
   text purpose
   text structure
   text[] membership
   text[] rules
   text[] modern_adaptations
   text current_effectiveness
   text[] institutional_challenges
   text[] cultural_evolution
   text scope
   text status
   text timeframe
   integer start_year
   integer end_year
   text modern_relevance
   text[] current_challenges
   text[] modern_consequences
   text[] quest_hooks
   integer embedding_id
   integer id
}

areas  -->  embeddings : embedding_id:id
areas  -->  regions : region_id:id
concept_relationships  -->  world_concepts : target_concept_id:id
concept_relationships  -->  world_concepts : source_concept_id:id
conflict_participants  -->  factions : faction_id:id
conflict_participants  -->  major_conflicts : conflict_id:id
conflict_participants  -->  npcs : npc_id:id
consequences  -->  areas : affected_area_id:id
consequences  -->  embeddings : embedding_id:id
consequences  -->  factions : affected_faction_id:id
consequences  -->  major_conflicts : trigger_conflict_id:id
consequences  -->  major_conflicts : affected_conflict_id:id
consequences  -->  narrative_destinations : affected_destination_id:id
consequences  -->  npcs : affected_npc_id:id
consequences  -->  quests : future_quest_id:id
consequences  -->  quests : trigger_quest_id:id
consequences  -->  regions : affected_region_id:id
consequences  -->  sites : affected_site_id:id
consequences  -->  stage_decisions : trigger_decision_id:id
destination_participant_involvement  -->  factions : faction_id:id
destination_participant_involvement  -->  narrative_destinations : destination_id:id
destination_participant_involvement  -->  npcs : npc_id:id
destination_quest_roles  -->  narrative_destinations : destination_id:id
destination_quest_roles  -->  quests : quest_id:id
destination_relationships  -->  narrative_destinations : source_destination_id:id
destination_relationships  -->  narrative_destinations : related_destination_id:id
faction_agendas  -->  embeddings : embedding_id:id
faction_agendas  -->  factions : faction_id:id
faction_diplomacy  -->  factions : faction_id:id
faction_diplomacy  -->  factions : other_faction_id:id
faction_influence  -->  areas : area_id:id
faction_influence  -->  factions : faction_id:id
faction_influence  -->  regions : region_id:id
faction_influence  -->  sites : site_id:id
factions  -->  embeddings : embedding_id:id
factions  -->  sites : primary_hq_site_id:id
foreshadowing_seeds  -->  embeddings : embedding_id:id
foreshadowing_seeds  -->  factions : target_faction_id:id
foreshadowing_seeds  -->  items : target_item_id:id
foreshadowing_seeds  -->  major_conflicts : target_major_conflict_id:id
foreshadowing_seeds  -->  narrative_destinations : target_narrative_destination_id:id
foreshadowing_seeds  -->  narrative_events : target_narrative_event_id:id
foreshadowing_seeds  -->  npcs : target_npc_id:id
foreshadowing_seeds  -->  npcs : source_npc_id:id
foreshadowing_seeds  -->  quest_stages : source_quest_stage_id:id
foreshadowing_seeds  -->  quests : source_quest_id:id
foreshadowing_seeds  -->  quests : target_quest_id:id
foreshadowing_seeds  -->  sites : source_site_id:id
foreshadowing_seeds  -->  sites : target_site_id:id
foreshadowing_seeds  -->  world_concepts : target_world_concept_id:id
item_notable_history  -->  items : item_id:id
item_notable_history  -->  npcs : key_npc_id:id
item_notable_history  -->  sites : event_location_site_id:id
item_relationships  -->  factions : related_faction_id:id
item_relationships  -->  items : related_item_id:id
item_relationships  -->  items : source_item_id:id
item_relationships  -->  major_conflicts : related_conflict_id:id
item_relationships  -->  narrative_destinations : related_narrative_destination_id:id
item_relationships  -->  npcs : related_npc_id:id
item_relationships  -->  quests : related_quest_id:id
item_relationships  -->  sites : related_site_id:id
item_relationships  -->  world_concepts : related_world_concept_id:id
items  -->  embeddings : embedding_id:id
items  -->  quests : related_quest_id:id
major_conflicts  -->  embeddings : embedding_id:id
major_conflicts  -->  regions : primary_region_id:id
narrative_destinations  -->  embeddings : embedding_id:id
narrative_destinations  -->  major_conflicts : related_conflict_id:id
narrative_destinations  -->  regions : primary_region_id:id
narrative_events  -->  embeddings : embedding_id:id
narrative_events  -->  quest_stages : quest_stage_id:id
narrative_events  -->  quests : related_quest_id:id
narrative_events  -->  stage_decisions : triggering_decision_id:id
npc_factions  -->  factions : faction_id:id
npc_factions  -->  npcs : npc_id:id
npc_relationships  -->  npcs : related_npc_id:id
npc_relationships  -->  npcs : npc_id:id
npc_sites  -->  npcs : npc_id:id
npc_sites  -->  sites : site_id:id
npcs  -->  embeddings : embedding_id:id
npcs  -->  sites : current_location_id:id
quest_hooks  -->  factions : faction_id:id
quest_hooks  -->  npcs : delivery_npc_id:id
quest_hooks  -->  quests : quest_id:id
quest_hooks  -->  sites : site_id:id
quest_participant_involvement  -->  factions : faction_id:id
quest_participant_involvement  -->  npcs : npc_id:id
quest_participant_involvement  -->  quests : quest_id:id
quest_relationships  -->  quests : related_quest_id:id
quest_relationships  -->  quests : quest_id:id
quest_stages  -->  embeddings : embedding_id:id
quest_stages  -->  quests : quest_id:id
quest_stages  -->  sites : site_id:id
quests  -->  embeddings : embedding_id:id
quests  -->  quests : parent_id:id
quests  -->  regions : region_id:id
region_connections  -->  factions : controlling_faction_id:id
region_connections  -->  regions : region_id:id
region_connections  -->  regions : other_region_id:id
regions  -->  embeddings : embedding_id:id
site_encounters  -->  embeddings : embedding_id:id
site_encounters  -->  sites : site_id:id
site_links  -->  sites : site_id:id
site_links  -->  sites : other_site_id:id
site_secrets  -->  embeddings : embedding_id:id
site_secrets  -->  sites : site_id:id
sites  -->  areas : area_id:id
sites  -->  embeddings : embedding_id:id
stage_decisions  -->  quest_stages : from_stage_id:id
stage_decisions  -->  quest_stages : to_stage_id:id
stage_decisions  -->  quests : quest_id:id
world_concept_links  -->  factions : faction_id:id
world_concept_links  -->  major_conflicts : conflict_id:id
world_concept_links  -->  npcs : npc_id:id
world_concept_links  -->  quests : quest_id:id
world_concept_links  -->  regions : region_id:id
world_concept_links  -->  world_concepts : concept_id:id
world_concepts  -->  embeddings : embedding_id:id
