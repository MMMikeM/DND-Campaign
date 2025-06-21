# Campaign Prompt System Refactor Plan

This plan outlines the steps to refactor the prompt system into a two-tiered approach: a high-level campaign context-loading prompt and a specific, flexible entity creation prompt.

## Phase 1: Campaign Context Loading Prompt

- [x] **Define Campaign Context Schema:** Create a Zod schema that defines the optional inputs for loading campaign context, allowing for a focus on a specific quest or faction.
- [x] **Develop Context Loading Handler:** Implement the logic that takes the optional arguments, gathers the relevant campaign data using existing `baseContext` functions, and returns it as a single, comprehensive JSON object.
- [x] **Register the New Prompt:** Add the `load-campaign-context` prompt to the central prompt registry.
- [ ] **(Removed)** ~~Create Database Seeding Tool~~: This is no longer necessary as we are loading existing data, not seeding new data.

## Phase 2: Bespoke Entity Creation Prompts

- [x] **Refactor `create-npc`:**
    - [x] Update context gathering (`gatherNPCCreationContext`) to be more focused, assuming general context is already loaded.
    - [x] Align the prompt's output to match the `manage_npc` tool's input schema for the `create` action.
    - [x] Simplify the prompt to focus solely on generating the data for the new NPC.
- [ ] **Implement `create-faction`:**
    - [ ] Create a `gatherFactionCreationContext` function.
    - [ ] Define the prompt to generate data matching the `manage_faction` tool's schema.
- [ ] **Implement `create-quest`:**
    - [ ] Create a `gatherQuestCreationContext` function.
    - [ ] Define the prompt to generate data matching the `manage_quest` tool's schema.
- [ ] **Implement `create-location`:**
    - [ ] Create a `gatherLocationCreationContext` function for sites, areas, and regions.
    - [ ] Define the prompt to generate data matching the `manage_location` tool's schema.

## Phase 3: Integration and Refinement

- [ ] **End-to-End Testing:** Test the full workflow: use `load-campaign-context` to set the stage, and then use the new creation prompts to add several new entities, ensuring they are properly integrated.
- [ ] **Tool-Call Integration:** Ensure the output from the creation prompts can be directly used to call the corresponding `manage-<entity>` tools to save the new entities to the database.
- [ ] **Documentation:** Update the documentation to reflect the new workflow.
- [ ] **Cleanup:** Remove any redundant or legacy code.
