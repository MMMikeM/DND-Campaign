# Mike's TTRPGRules

## **2. Spell Points (SP)**

Magic is fueled by **Spell Points (SP)**, representing a caster's pool of magical energy. Activating Spell **Modes** and adding **Enhancements** costs SP.

### **2.1 Gaining and Spending SP**

- **SP Pool:** You have a maximum number of SP based on your character level, (your level + 1) * 5. You regain all expended SP after completing a **Long Rest**.
- **Spending SP:** When you activate a Spell using one of its **Modes** (other than the 0 SP Basic Effect) or add **Enhancements**, you spend SP equal to the total cost. You cannot spend more SP than you currently have.

### **2.2 Basic Effects (0 SP)**

Each core Spell has a **Basic Effect** listed in Section 3.4 that costs 0 SP to use. These represent minor manifestations of the Spell's concept and can be used at will.

### **2.3 Maximum SP per Activation**

There is a limit to the total SP you can spend on a single activation of a Spell (Base Mode Cost + Enhancement Costs). This limit prevents characters from expending their entire energy pool on one overwhelmingly powerful effect early on. This limit is based on your character level your 2 + (level / 2) rounded up, as shown on Table 2-1.

### **2.4 Spell Point Progression**

#### Table 2-1: Spell Points and Maximum SP per Activation by Level**

| Level | Spell Points | Max SP Per Activation |
|:------|:-------------|:----------------------|
| 1     | 10           | 3                     |
| 2     | 15           | 3                     |
| 3     | 20           | 4                     |
| 4     | 25           | 4                     |
| 5     | 30           | 5                     |
| 6     | 35           | 5                     |
| 7     | 40           | 6                     |
| 8     | 45           | 6                     |
| 9     | 50           | 7                     |
| 10    | 55           | 7                     |
| 11    | 60           | 8                     |
| 12    | 65           | 8                     |
| 13    | 70           | 9                     |
| 14    | 75           | 9                     |
| 15    | 80           | 10                    |
| 16    | 85           | 10                    |
| 17    | 90           | 11                    |
| 18    | 95           | 11                    |
| 19    | 100          | 12                    |
| 20    | 110          | 12                    |

## 3. Spells

### **3.1 Nature of Spells**

In this system, specific spell lists are replaced by **Spells**. Spells are the fundamental building blocks of magical effects – generic templates representing a core concept like projecting energy, healing wounds, or bolstering defenses. This system uses a smaller, curated list of core Spells to simplify turns and emphasise narrative choices.

The specific manifestation, damage type, and finer details of a Spell activated by a caster are determined by the **Essences** they apply (detailed in Section 4), while the overall potency and additional effects are modified by **Enhancements** (detailed in Section 5).

This approach shifts the focus from memorizing numerous specific rules to understanding a core set of effects and creatively applying Essences and Enhancements using your Spell Points (SP).

### **3.2 Learning Spells**

Characters **know** a set number of Spells, representing the magical effects they have mastered. They do not prepare spells daily.

- **Spells Known:** Your selected class determines the Spells available to you, forming your **Class Spell List**. At 1st level, you know **four** Spells determined as follows:
  - Your class grants you knowledge of a **Core Attack Spell** (`Strike` or `Bolt`, or a choice between them).
  - Your class grants you knowledge of a **Unique Thematic Spell**.
  - You **choose two** additional Spells from your class's specific list of six **Available Spells**.
  - (Refer to Section 7: Classes for the specific spells granted and available to each class).
- **Changing Known Spells:** Every 4th level (starting at level 4), when you would normally gain a Feat or Ability Score Improvement, you can choose one of the Spells you know and replace it with a different Spell from your **Class Spell List**.
- **Learning Outside Lists:** Certain Feats may grant the ability to learn Spells from lists other than your primary Class Spell List.

### **3.3 Spell Descriptions**

Each Spell is presented in a standard format, detailing its core function before any Enhancements are applied.

- **Name:** A generic name representing the Spell's core concept.
- **Casting Time:** The action required (e.g., 1 Action, Reaction, Special). *Note: Bonus Actions are not used for spellcasting in this system.*
- **Range:** The maximum distance (e.g., Self, Touch, 30 feet).
- **Components:** Specifies necessary components. **By default, all Spells require V (Verbal) and M (Focus)**, where the Focus replaces non-costly material components.
  - Costly material components are listed explicitly after the M (Focus) entry (e.g., "M (Focus, and a diamond worth 500 gp, which the Spell consumes)").
  - **S (Somatic)** is listed *only if* intricate gestures are required *in addition* to manipulating the focus. If S is not listed, only verbalization and handling the focus are needed.
- **Duration:** How long the effect lasts (e.g., Instantaneous, Concentration up to 1 minute).
- **Core Effect:** Description of the fundamental result of activating the Spell at its **Base SP Cost**. Details targets, saving throws, damage/healing, conditions, etc. Damage type is determined by Essences.
- **Tags:** Optional keywords:
  - **Concentration:** Requires concentration following standard rules (typically similar to 5e).
  - **Ritual:** Can optionally be cast taking 10 minutes longer than its normal casting time without spending SP. Only applicable to Spells with this tag, usually found on specific Modes in Section 5.

---

### **3.4 Core Spells - Basic Effects**

This section details the baseline **Basic Effect** for each core Spell. This effect costs **0 SP** to use and can be used at will, intended as a combat action or minor utility. Spending **Spell Points (SP)** allows activating one of the spell's specific **Modes** (detailed in Section 5). Activating a Mode *replaces* the Basic Effect with a more powerful one and unlocks further customization through **Enhancements**.

Default V (Verbal) and M (Focus) components are assumed unless S (Somatic) or costly M components are also required. Damage types are determined by Essence. Durations listed for Basic Effects do not require Concentration unless specified.

### Adapt Self - Basic Effect (0 SP)

| Property      | Value                                                                                                  |
|:--------------|:-------------------------------------------------------------------------------------------------------|
| **Cast Time** | 1 Action                                                                                               |
| **Range**     | Self                                                                                                   |
| **Duration**  | 1 minute                                                                                               |
| **Effect**    | Gain one: +5 ft speed; OR Adv on Athletics (climb/swim); OR unarmed strikes deal 1d4 + Str mod damage. |

---

### Arcane Sight - Basic Effect (0 SP)

| Property      | Value                                                                                                                                       |
|:--------------|:--------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast Time** | 1 Action                                                                                                                                    |
| **Range**     | Self (30 ft radius)                                                                                                                         |
| **Duration**  | Instantaneous                                                                                                                               |
| **Effect**    | Briefly sense the presence and general direction of active magical effects or items within 30 feet. (Specifics require Modes/Enhancements). |

---

### Barrier - Basic Effect (0 SP)

| Property      | Value                                                                                                                                |
|:--------------|:-------------------------------------------------------------------------------------------------------------------------------------|
| **Cast Time** | 1 Action                                                                                                                             |
| **Range**     | 30 ft                                                                                                                                |
| **Duration**  | 1 round                                                                                                                              |
| **Effect**    | Create a 5x5 ft energy plane: Provides half cover (+2 AC/Dex saves), has 5 HP, collapses if destroyed or at start of your next turn. |

---

### Blast - Basic Effect (0 SP)

| Property      | Value                                                                                        |
|:--------------|:---------------------------------------------------------------------------------------------|
| **Cast Time** | 1 Action                                                                                     |
| **Range**     | Self (10-ft cone)                                                                            |
| **Duration**  | Instantaneous                                                                                |
| **Effect**    | Creatures in cone make Dex save vs Spell DC. Fail: 1d8 Essence damage. Success: Half damage. |

---

### Bolt - Basic Effect (0 SP)

| Property      | Value                                                              |
|:--------------|:-------------------------------------------------------------------|
| **Cast Time** | 1 Action                                                           |
| **Range**     | 90 ft                                                              |
| **Duration**  | Instantaneous                                                      |
| **Effect**    | Make a ranged spell attack. Hit: Target takes 1d10 Essence damage. |

---

### Communicate - Basic Effect (0 SP)

| Property      | Value                                                                                                                      |
|:--------------|:---------------------------------------------------------------------------------------------------------------------------|
| **Cast Time** | 1 Action                                                                                                                   |
| **Range**     | 120 ft                                                                                                                     |
| **Duration**  | Instantaneous                                                                                                              |
| **Effect**    | Send one-way telepathic message (max 10 words) to one creature seen. Understood regardless of language. No reply possible. |

---

### Conduit - Basic Effect (0 SP)

| Property      | Value                                           |
|:--------------|:------------------------------------------------|
| **Cast Time** | Reaction (when ally seen attacks creature seen) |
| **Range**     | 30 ft                                           |
| **Duration**  | Instantaneous                                   |
| **Effect**    | The triggering attack roll has advantage.       |

---

### Debilitate - Basic Effect (0 SP)

| Property      | Value                                                                                |
|:--------------|:-------------------------------------------------------------------------------------|
| **Cast Time** | 1 Action                                                                             |
| **Range**     | 30 ft                                                                                |
| **Duration**  | 1 round                                                                              |
| **Effect**    | Target makes Con save vs Spell DC. Fail: Speed halved until start of your next turn. |

---

### Defend - Basic Effect (0 SP)

| Property      | Value                                                                                       |
|:--------------|:--------------------------------------------------------------------------------------------|
| **Cast Time** | 1 Action                                                                                    |
| **Range**     | Self                                                                                        |
| **Duration**  | 1 round                                                                                     |
| **Effect**    | Gain resistance to Bludgeoning, Piercing, OR Slashing damage until start of your next turn. |

---

### Empower/Enfeeble - Basic Effect (0 SP)

| Property      | Value                                                                                                                                                                                                                                         |
|:--------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast Time** | 1 Action                                                                                                                                                                                                                                      |
| **Range**     | 30 ft                                                                                                                                                                                                                                         |
| **Duration**  | 1 round                                                                                                                                                                                                                                       |
| **Effect**    | Choose one target & effect: **Empower:** Target gets +1d4 to next Attack Roll OR Save before start of your next turn. **Enfeeble:** Target makes Wis save vs Spell DC. Fail: -1d4 to next Attack Roll OR Save before start of your next turn. |

---

### Heal - Basic Effect (0 SP)

| Property      | Value                                                                     |
|:--------------|:--------------------------------------------------------------------------|
| **Cast Time** | 1 Action                                                                  |
| **Range**     | Touch                                                                     |
| **Duration**  | Instantaneous                                                             |
| **Effect**    | Target regains 1d4 + Spell Mod HP, OR becomes stable with 1 HP if downed. |

---

### Illusion - Basic Effect (0 SP)

| Property      | Value                                                                                                                          |
|:--------------|:-------------------------------------------------------------------------------------------------------------------------------|
| **Cast Time** | 1 Action                                                                                                                       |
| **Range**     | 30 ft                                                                                                                          |
| **Duration**  | 1 minute                                                                                                                       |
| **Effect**    | Create minor visual illusion (object/creature ≤ 5-ft cube) OR simple sound effect. Interaction/Investigation reveals illusion. |

---

### Influence - Basic Effect (0 SP)

| Property      | Value                                                                                                                              |
|:--------------|:-----------------------------------------------------------------------------------------------------------------------------------|
| **Cast Time** | 1 Action                                                                                                                           |
| **Range**     | 30 ft                                                                                                                              |
| **Duration**  | 1 round                                                                                                                            |
| **Effect**    | Target humanoid seen makes Wis save vs Spell DC. Fail: Disadvantage on next attack roll vs **you** before start of your next turn. |

---

### Manipulate - Basic Effect (0 SP)

| Property      | Value                                                                                                                                                                                                                                               |
|:--------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast Time** | 1 Action                                                                                                                                                                                                                                            |
| **Range**     | 30 ft                                                                                                                                                                                                                                               |
| **Duration**  | 1 minute                                                                                                                                                                                                                                            |
| **Effect**    | Use Action (on cast or later turns) to target point in range. Cause one: Interact with object ≤ 10 kg (push, pull, lift, etc.); Open/close unlocked door/container; Pour contents from container. Lacks finesse/strength for complex tasks/attacks. |

---

### Move - Basic Effect (0 SP)

| Property      | Value                                                                                                                                                                                   |
|:--------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast Time** | Special (Part of Move Action)                                                                                                                                                           |
| **Range**     | Self                                                                                                                                                                                    |
| **Duration**  | Instantaneous                                                                                                                                                                           |
| **Effect**    | When moving, choose one for remainder of turn's movement: Ignore difficult terrain; OR movement doesn't provoke opportunity attacks; OR move through hostile spaces (cannot end there). |

---

### Strike - Basic Effect (0 SP)

| Property      | Value                                                                                     |
|:--------------|:------------------------------------------------------------------------------------------|
| **Cast Time** | 1 Action                                                                                  |
| **Range**     | Self                                                                                      |
| **Duration**  | Instantaneous                                                                             |
| **Effect**    | Make one weapon attack. Hit: deals extra damage = Spell Mod (min 1) of your Essence type. |

---

### Summon - Basic Effect (0 SP)

| Property      | Value                                                                                                                                                           |
|:--------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast Time** | 1 Action                                                                                                                                                        |
| **Range**     | 30 ft                                                                                                                                                           |
| **Duration**  | 1 minute                                                                                                                                                        |
| **Effect**    | Summon Tiny Essence servant (AC 10, 1 HP, Speed 15ft fly/walk). Can use Action to Help ally attacking creature within 5 ft. Disappears at 0 HP or duration end. |

---

### Zone - Basic Effect (0 SP)

| Property      | Value                                                                                                                            |
|:--------------|:---------------------------------------------------------------------------------------------------------------------------------|
| **Cast Time** | 1 Action                                                                                                                         |
| **Range**     | 60 ft                                                                                                                            |
| **Duration**  | 1 round                                                                                                                          |
| **Effect**    | Choose point on surface seen. Creates 10-ft square area centered there. Area is Difficult Terrain until start of your next turn. |

---

## 4: Essences

### **4.1 Defining Essences**

**Essences** are the fundamental magical energies that shape your spells, manifesting as crackling electricity, devouring shadows, or verdant growth. They are the essential flavor and specific manifestation applied to a generic **Spell** when it is activated – the difference between a generic *Bolt* Spell and a scorching *Fire Bolt*, a crackling *Lightning Bolt*, or a debilitating *Necrotic Ray*. Essences bridge the gap between the abstract mechanical framework of a Spell and the evocative, descriptive magic seen in play. They provide:

- **Sensory Description:** How the Spell looks, sounds, smells, feels.
- **Thematic Grounding:** Connects the Spell to the caster's style (arcane formulas, divine prayers, primal calls, psionic focus).
- **Mechanical Hooks:** Determines damage type and provides links for potential status effects via **Enhancements**.

### **4.2 Choosing Essences**

Characters learn Essences based primarily on their chosen magical path and training.

- **Learning Essence Descriptors:** When a character first gains access to **Spells** (typically at 1st level or through multiclassing), they choose **two Essence Descriptors** (from the list in 4.5) that fit their character concept. Additional Descriptors might be learned through feats, or specific cases when granted by a GM.
- **Descriptor Knowledge:** Knowing an Essence Descriptor (e.g., "Fire") means you can apply its theme, associated damage type, and minor effects to any Spell you activate where it makes narrative sense.

### **4.3 Applying Essences**

When activating a **Spell**, the caster chooses **one** known **Essence Descriptor** to apply. This choice primarily dictates the Spell's sensory details and damage type.

- **Flavor First:** The primary role of applying an Essence is descriptive. It determines *how* the Spell manifests. For example, applying a "Fire" Essence to the *Heal* Spell wouldn't cause burning damage; instead, it might manifest as warm, soothing flames that knit wounds closed, or a comforting heat that revitalizes the target. The Spell's core mechanical function (restoring Hit Points) remains unchanged.
  - **Describing Your Magic:** The mechanics tell what your essence does, but **you** decide how it looks, sounds, and feels. A Fire spell might manifest as dancing embers, a concentrated beam of heat, or an explosion of ash and cinders – the choice is yours! Let your creativity define your magic's unique signature.
- **Narrative Consistency:** While flexible, the chosen Essence should generally align with the Spell's intended effect. Applying an Essence whose fundamental nature contradicts the Spell's core function usually doesn't make sense. For example, describing a *Heal* Spell using the "Necrotic" Essence (associated with decay and undeath) would likely be inappropriate for restoring life energy to a living creature. The GM helps ensure descriptions remain coherent within the established fiction.
- **No Base Cost:** Applying a basic Essence Descriptor does not increase the **SP** cost of activating the Spell.

---

### **4.4 Mechanical Impact of Essences**

While primarily descriptive, Essences have key mechanical implications:

- **Damage Type:** For Spells that deal damage, the chosen Essence Descriptor *becomes* the damage type (e.g., Fire damage, Cold damage, Life damage, Necrotic damage). Resistance and vulnerability function based on these Essence types. *(Optional Rule: For tables preferring standard 5e damage types, a mapping can be used where each Essence corresponds to a similar 5e type).*
- **Status Effect Association:** Base Essences do not automatically impose conditions. However, each Essence Descriptor is linked to a specific **composite status effect** (detailed in the table in Section 4.5). These associations serve as hooks for **Enhancements** (Section 5), which may allow a caster to spend additional **SP** (typically +2 SP, though class features might modify this) to add the Essence's associated status effect to a Spell.
- **Minor Inherent Effects:** Essences provide minor, flavorful, non-combat effects related to their nature (summarized alongside each Essence in Section 4.5, like Fire igniting objects or Cold chilling surfaces). These should be used for descriptive color and minor narrative advantages, not significant mechanical benefits without specific **Enhancements**.
- **Skill Interactions:** The description of an Essence might occasionally grant circumstantial benefits relevant to skills (e.g., an *Illusion* Spell with a convincing "Shadow" Essence might aid Stealth). This is situational and adjudicated by the GM.
- **Component Interaction:** The default Verbal (V) and Focus (M) components required for Spells are generally unchanged by Essences.

---

### **4.5 Essence Descriptors**

Each Essence represents a fundamental type of magical energy or substance, bringing unique flavor and mechanical effects to your spells. Remember that beyond the listed mechanics, you are encouraged to describe the specific visual, auditory, and sensory details of how *your* character manifests these Essences.

> Choose one known Essence whenever you cast a spell to determine its damage type (if any) and potentially apply its linked status effect using Enhancements.

| #  | Essence       | Status name    | **Primary** (biggest bite)            | **Secondary** (extra sting)                               | **Minor** (always‑on flavour)                             | Quick feel                      |
|:---|:--------------|:---------------|:--------------------------------------|:----------------------------------------------------------|:----------------------------------------------------------|:--------------------------------|
| 1  | **Fire**      | **Ignited**    | Attack rolls are **at disadvantage**  | **Vulnerable to Cold** damage                             | Sheds dim light                                           | Burning, easy to counter‑freeze |
| 2  | **Cold**      | **Frozen**     | **Speed becomes 5 ft**                | **Vulnerable to Fire** damage                             | **Disadvantage** on **Athletics** checks                  | Numbing lockdown                |
| 3  | **Life**      | **Overgrown**  | **Speed becomes 5 ft**                | **Attacks gain advantage** vs target                      | **Disadvantage** on grapple/disarm checks (Weakened Grip) | Vines entangle & expose         |
| 4  | **Necrotic**  | **Withered**   | Attack rolls are **at disadvantage**  | **Constitution** saves **at disadvantage**                | **Disadvantage** on **Strength** checks                   | Decay saps vitality             |
| 5  | **Light**     | **Dazzled**    | Attack rolls are **at disadvantage**  | **Wisdom** saves **at disadvantage**                      | Target gains **no cover bonus** vs caster                 | Blinding brilliance             |
| 6  | **Shadow**    | **Shrouded**   | **‑2 AC** penalty                     | Takes **Spell Mod extra damage** first time hit each turn | **Disadvantage** on sight‑based **Perception** checks     | Cloaked in harming gloom        |
| 7  | **Lightning** | **Conductive** | Attack rolls are **at disadvantage**  | Takes **Spell Mod extra damage** first time hit each turn | **Disadvantage** on **Dexterity** checks                  | Jolting, twitch‑inducing        |
| 8  | **Earth**     | **Weighted**   | **‑2 AC** penalty                     | Takes **Spell Mod extra damage** first time hit each turn | **Disadvantage** on grapple/disarm checks (Weakened Grip) | Crushing heaviness              |
| 9  | **Psychic**   | **Scrambled**  | **All saves** are **at disadvantage** | **Hindered Movement** (-10 ft & prone/move disadvantage)  | **Disadvantage** on **Insight** checks                    | Mind fog & sluggishness         |
| 10 | **Force**     | **Unstable**   | **‑2 AC** penalty                     | **Attacks gain advantage** vs target                      | Moved **+5 ft** when pushed/pulled (Opportune Push)       | Kinetic back‑kick               |
| 11 | **Sound**     | **Deafened**   | **All saves** are **at disadvantage** | **Attacks gain advantage** vs target                      | **Casting Interference:** DC 10 Con check for V spells    | Ear‑ringing disorientation      |
| 12 | **Toxic**     | **Enfeebled**  | Attack rolls are **at disadvantage**  | **Constitution** saves **at disadvantage**                | **Disadvantage** on **Constitution** checks               | Sickening poison                |

#### Using the status in play

- Add the Essence’s *damage type* for free when casting a spell that deals damage.
- To **inflict the associated status effect**, you typically spend **+2 SP** when casting the spell (using an Enhancement that allows this) OR use a specific class feature or Mode that applies the status.
- Unless specified otherwise by the spell Mode or Enhancement, status effects applied this way last until the **start of your next turn**.

*Example:*
> [GM] *"The ogre towers ahead of you, its tough skin gives it an AC of 16"*
>
> My storm mage channels crackling energy between her fingertips. 'You'll regret that!' I cast **Lightning Bolt** with the Debilitating enhancement for 4 SP total.
>
> *[Rolls attack dice]* That's a 17!
>
> The bolt strikes true, arcing across the battlefield with a thunderous crack!
>
> The ogre takes 3d8 lightning damage *[rolls]* for 13 damage. As electricity courses through its body, it becomes **Conductive** - its muscles spasm, making attacks difficult and its skin crackles with residual energy that will amplify the next hit it takes.
>
> [GM] "*The ogre roars in pain as lightning dances across its body. It's now Conductive until the start of your next turn."*

---

## Section 5: Enhancements

### **5.1 Purpose of Enhancements**

**Enhancements** allow casters to spend **Spell Points (SP)** to augment the **Basic Effect (0 SP)** of their known Spells. The most fundamental Enhancement is the **Standard Activation Enhancement**, which unlocks the Spell's original core function at a specific SP cost. Further Enhancements allow casters to scale a Spell's effects (increasing potency, scope, or duration), add new functions, or even alter how the Spell is cast or resolved, typically building upon the Standard Activation.

### **5.2 Learning and Using Enhancements**

- **Learning Enhancements:** Characters typically learn Enhancements as they gain levels in their spellcasting class, often choosing **one specific Spell** they know and **one Enhancement Category** relevant to that Spell.
- **Define the Benefit:** Working with the GM, the player defines the specific mechanical benefit and **SP** cost for the learned Enhancement. They can either:
  - Choose a suggested Example benefit from the list in 5.4 for the chosen Spell and Category.
  - Propose a custom benefit that fits the chosen Category, using the Examples as guidelines for balance and scope (GM approval required).
  - The player should clearly record the defined benefit and its associated SP cost. This becomes *their* unique, learned Enhancement for that Spell.
- **Applying Enhancements:** When activating a Spell, the caster declares they are using one or more learned Enhancements for that Spell. They describe the enhanced effect and add the SP cost of all applied Enhancements to the Spell's Base SP Cost. The total SP spent cannot exceed the Maximum SP per Activation limit (see 5.3).
- **Combining Enhancements:** Multiple *different* learned Enhancements can be applied to a single Spell activation, provided their effects are not contradictory (e.g., you cannot apply two Enhancements that change the saving throw type to different stats). The SP costs are cumulative.

### **5.3 Maximum SP per Activation**

To maintain balance across levels, there is a limit to the total number of **Spell Points (SP)** (Base SP Cost + Enhancement SP Costs) that can be spent on a single activation of any Spell. This limit typically increases as a character gains levels. The specific progression will be detailed on [Table X-Y: Maximum SP per Activation] (to be created later, likely tied to class progression or caster level).

### **5.4 Enhancement Categories by Spell**

Okay, here are the first 10 enhancement sections updated to use tables, following the style of the Manipulate example.

---

Okay, here are the first 10 spell enhancement sections reformatted using the agreed-upon "Best of Both" conventions, including the `(Requires: ...)` and `(Applies To: ...)` prefixes for clarity.

---

## 5.4.1 Adapt Self

> **Basic Effect** (0 SP, 1 Action, Self, 1 min): Minor physical adaptation: +5ft speed OR Adv Athletics climb/swim OR 1d4+Str unarmed strikes.

---

### Mode: Focused Adaptation ✦ 2 SP

| Property     | Value                                                                                                                                             |
|:-------------|:--------------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                                                                          |
| **Range**    | Self                                                                                                                                              |
| **Duration** | Concentration, up to 10 min                                                                                                                       |
| **Effect**   | Choose **two** enhancements from General Enhancements (marked with \*). Apply their effects for the duration. (Base cost includes their SP cost). |

---

### Mode: Beast Shape ✦ 5 SP

| Property     | Value                                                                                                                                                                                                                                               |
|:-------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                                                                                                                                                                            |
| **Range**    | Self                                                                                                                                                                                                                                                |
| **Duration** | Concentration, up to 10 min                                                                                                                                                                                                                         |
| **Effect**   | Transform into a partial bestial form. Gain: Natural weapons (1d8 + Spell Mod Essence damage, magical), +2 AC, Climb/Swim speed = walk speed (breathe underwater if apt), Adv vs Grapple/Restrain, Darkvision 60ft, Adv Perception (hearing/smell). |
| **Limits**   | Cannot cast spells with Verbal components or perform tasks requiring fine motor control unless form allows (GM discretion).                                                                                                                         |

---

### Mode: Elemental Body ✦ 5 SP

| Property     | Value                                                                                                                                                                                                                                                                                        |
|:-------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                                                                                                                                                                                                                     |
| **Range**    | Self                                                                                                                                                                                                                                                                                         |
| **Duration** | Concentration, up to 10 min                                                                                                                                                                                                                                                                  |
| **Effect**   | Body partially transforms into Essence type. Gain: Resistance to Essence damage type, Unarmed strikes deal 1d10 magical Essence damage, Move through 1-inch spaces without squeezing, Ignore non-magical difficult terrain, Retaliation damage (Spell Mod Essence) on melee hit within 5 ft. |
| **Limits**   | Minor environmental interactions (ignite, freeze, dim light) based on Essence (GM discretion). May appear obviously magical.                                                                                                                                                                 |

---

### General Enhancements (Adapt Self)

*(Add SP cost to Mode cost, unless used via Focused Adaptation\*)*

| Enhancement         | SP Cost      | Effect                                                                                                                      |
|:--------------------|:-------------|:----------------------------------------------------------------------------------------------------------------------------|
| Battle Mutation\*   | +1 SP        | Natural weapons (or unarmed strikes if none granted) deal 1d8 magical Essence damage.                                       |
| Hard Skin\*         | +1 SP        | Gain +1 bonus to AC. (*Stackable, max +2 total bonus*).                                                                     |
| Share Adaptation    | +2 SP        | Range becomes Touch. One willing creature gains the chosen Mode’s effects instead. (*Cannot target self*).                  |
| Enhanced Mobility\* | +1 SP        | Gain both climb and swim speed = walking speed; can breathe air and water.                                                  |
| Heightened Senses\* | +1 SP        | Gain darkvision 60 ft; gain advantage on Wisdom (Perception) checks.                                                        |
| Sustained Form      | +1 SP / step | Increase Concentration duration step (10 min → 1 hour → 8 hours).                                                           |
| Illusory Guise      | +2 SP        | Change appearance (visual only). Adv on Deception checks for disguise. Duration 1 hour, no Conc. (*Can add or cast alone*). |
| Growth              | +2 SP        | Size becomes Large (if M/S). Gain Adv Str checks/saves, +5 ft reach, weapon/unarmed +1d4 damage.                            |
| Shrink              | +2 SP        | Size becomes Small (if M/L). Gain Adv Dex checks/saves & Stealth, +1 AC & attack rolls.                                     |
| Inherent Form       | +2 SP        | Removes the need for Concentration.                                                                                         |

---

## 5.4.2 Arcane Sight

> **Basic Effect** (0 SP, 1 Action, Self (30ft), Instantaneous): Briefly sense presence/direction of active magic OR make check DC 10 to suppress lowest-level magic effect on target until start of your next turn.

---

### Mode: Detect Magic ✦ 2 SP

| Property     | Value                                                                                                                                             |
|:-------------|:--------------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action (Ritual Tag)                                                                                                                             |
| **Range**    | Self (30-ft radius)                                                                                                                               |
| **Duration** | Concentration, up to 10 min                                                                                                                       |
| **Effect**   | Sense presence/location of magic effects, items, residue within range. Action: Focus on visible target for aura/school. Penetrates thin barriers. |

#### Unique Enhancements (Detect Magic)

| Enhancement          | SP Cost      | Effect                                                                                                                           |
|:---------------------|:-------------|:---------------------------------------------------------------------------------------------------------------------------------|
| Identify Properties  | +1 SP        | Change Cast Time to 1 min (touching item), Duration Instant. Learn item properties, function, activation, charges. (Total 3 SP). |
| Power Analysis       | +1 SP        | When focusing aura, sense power level (Low: 1-3 SP, Med: 4-6 SP, High: 7+ SP). (Total 3 SP+).                                    |
| See Ethereal         | +2 SP        | While concentrating, see Ethereal Plane creatures/objects in range. (Total 4 SP+).                                               |
| Penetrating Vision   | +1 SP        | Detection ignores additional 1 ft stone / 1 inch metal / 3 ft wood/dirt. (*Stackable*).                                          |
| Sustain Detection    | +1 SP / step | Increase Concentration duration (10 min → 1 hour → 8 hours).                                                                     |
| Persistent Detection | +3 SP        | (Requires: Sustain Detection ≥ 1 hour) Duration becomes 8 hours, no Concentration.                                               |

---

### Mode: Dispel Magic ✦ 4 SP

| Property     | Value                                                                                                                                           |
|:-------------|:------------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                                                                        |
| **Range**    | 120 ft                                                                                                                                          |
| **Duration** | Instantaneous                                                                                                                                   |
| **Effect**   | Choose target creature/object/effect. Ends spell effects of ≤ 3 SP cost. For ≥ 4 SP effects, spellcasting check (DC 10 + [SP cost / 2]) to end. |

#### Unique Enhancements (Dispel Magic)

| Enhancement           | SP Cost | Effect                                                                                                                             |
|:----------------------|:--------|:-----------------------------------------------------------------------------------------------------------------------------------|
| Targeted Dispel       | +1 SP   | Choose specific spell effect to target first if multiple exist. (Total 5 SP+).                                                     |
| Area Dispel           | +3 SP   | Affects 10-ft radius sphere. Attempt dispel on *one* effect (lowest SP or targeted) on each target. Rolls separate. (Total 7 SP+). |
| Lingering Suppression | +1 SP   | If check fails, target effect suppressed (inactive) until end of **your** next turn. (Total 5 SP+).                                |

---

### Mode: Counterspell ✦ 4 SP

| Property     | Value                                                                                                                              |
|:-------------|:-----------------------------------------------------------------------------------------------------------------------------------|
| **Cast**     | Reaction (when you see creature within 60 ft casting)                                                                              |
| **Range**    | 60 ft                                                                                                                              |
| **Duration** | Instantaneous                                                                                                                      |
| **Effect**   | Interrupt spell if its total SP cost is ≤ 3 SP. If ≥ 4 SP, make spellcasting check (DC 10 + [SP cost / 2]) to cause spell to fail. |

#### Unique Enhancements (Counterspell)

| Enhancement            | SP Cost | Effect                                     |
|:-----------------------|:--------|:-------------------------------------------|
| Extended Counter Range | +1 SP   | Increase range to 120 feet. (Total 5 SP+). |

---

### General Enhancements (Arcane Sight)

| Enhancement           | SP Cost | Effect                                                                                                                                  |
|:----------------------|:--------|:----------------------------------------------------------------------------------------------------------------------------------------|
| Suppress              | +1 SP   | Target within 60 ft. Spellcasting check vs DC 10. Success: suppress lowest-SP magic effect until start of your next turn.               |
| Increase Range/Radius | +1 SP   | Doubles range or radius (Detect radius, Dispel/Counter initial range). (*Stackable*).                                                   |
| Greater Negation      | +2 SP   | (Applies To: Dispel/Counter Modes) Increases automatic dispel/counter threshold by +2 SP (e.g., base 3 -> 5). (*Stackable*).            |
| Adept Negation        | +2 SP   | (Applies To: Dispel/Counter Modes) Gain advantage on spellcasting check to dispel/counter spells above threshold.                       |
| Dispel Feedback       | +2 SP   | (Applies To: Dispel/Counter Modes) On successful dispel/counter, caster takes 1d6 psychic damage per 2 full SP of negated spell's cost. |

---

## 5.4.3 Barrier

> **Basic Effect** (0 SP, 1 Action, 30 ft range, 1 round): 5x5 plane, half cover (+2 AC/+2 Dex), 5 HP.

---

### Mode: Standard Barrier ✦ 3 SP

| Property     | Value                                                                                                                                                            |
|:-------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                                                                                         |
| **Range**    | 60 ft                                                                                                                                                            |
| **Duration** | Concentration, up to 10 min                                                                                                                                      |
| **Effect**   | Creates flat, vertical, opaque barrier (up to 10x10 ft plane OR 5-ft radius sphere/hemisphere). Provides total cover. AC 10, HP 15. Collapses at 0 HP. Anchored. |

---

### Mode: Shaped Barrier ✦ 4 SP (Simple) / 5 SP (Complex)

| Property     | Value                                                                                                                                     |
|:-------------|:------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                                                                  |
| **Range**    | 60 ft                                                                                                                                     |
| **Duration** | Concentration, up to 10 min                                                                                                               |
| **Effect**   | As Standard Barrier, but allows creating specific forms (e.g., 10x10x10 ft cube, 30 ft long bridge) within overall size limits. Anchored. |

---

### Mode: Mobile Barrier ✦ 5 SP

| Property     | Value                                                                                             |
|:-------------|:--------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                          |
| **Range**    | 60 ft                                                                                             |
| **Duration** | Concentration, up to 10 min                                                                       |
| **Effect**   | As Standard Barrier, but use Action while concentrating to move barrier up to 20 ft within range. |

---

### General Enhancements (Barrier)

| Enhancement        | SP Cost      | Effect                                                                                                            |
|:-------------------|:-------------|:------------------------------------------------------------------------------------------------------------------|
| Fortify Barrier    | +1 SP        | Increase barrier AC by +1 and HP by +10. (*Stackable*).                                                           |
| Resilient Barrier  | +1 SP        | Barrier gains resistance to one damage type (chosen when learned, often Essence type).                            |
| Expand Barrier     | +1 SP        | Increase size (Plane +5ft H&W; Sphere/Hemi +5ft radius; Shaped equivalent volume). (*Stackable*).                 |
| Sustain Barrier    | +1 SP / step | Increase Concentration duration (10 min → 1 hour → 8 hours).                                                      |
| Damaging Barrier   | +2 SP        | Creatures ending turn adjacent or moving through its space (if possible) take 1d8 Essence damage.                 |
| Obscuring Barrier  | +1 SP        | Barrier heavily obscures vision through it (if not already opaque).                                               |
| One-Way Visibility | +2 SP        | Choose one side when casting; creatures on that side can see and target through as if transparent, others cannot. |
| Persistent Barrier | +2 SP        | (Requires: Sustain Barrier ≥ 1 hour - *Implied based on pattern*) Removes the need for Concentration.             |

---

## 5.4.4 Blast

> **Basic Effect** (0 SP, 1 Action, Self (10-ft cone)): Dex save vs 1d8 Essence damage, half on success.

---

### Mode: Cone Blast ✦ 2 SP

| Property     | Value                                                                            |
|:-------------|:---------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                         |
| **Range**    | Self (15-foot cone)                                                              |
| **Duration** | Instantaneous                                                                    |
| **Effect**   | Creatures in cone make Dex save. Fail: 2d8 Essence damage. Success: Half damage. |

#### Unique Enhancements (Cone Blast)

| Enhancement | SP Cost | Effect                           |
|:------------|:--------|:---------------------------------|
| Mega Cone   | +2 SP   | Increase cone length to 30 feet. |

---

### Mode: Orb Blast ✦ 2 SP

| Property     | Value                                                                              |
|:-------------|:-----------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                           |
| **Range**    | 60 ft (5-foot radius sphere centered on point)                                     |
| **Duration** | Instantaneous                                                                      |
| **Effect**   | Creatures in sphere make Dex save. Fail: 2d8 Essence damage. Success: Half damage. |

#### Unique Enhancements (Orb Blast)

| Enhancement | SP Cost | Effect                      |
|:------------|:--------|:----------------------------|
| Large Orb   | +1 SP   | Increase radius to 10 feet. |
| Mega Orb    | +3 SP   | Increase radius to 15 feet. |

---

### Mode: Lancing Blast ✦ 2 SP

| Property     | Value                                                                                                                                                                               |
|:-------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                                                                                                            |
| **Range**    | Self (Line 15 ft L x 5 ft W) OR 60 ft (Line centered on point)                                                                                                                      |
| **Duration** | Instantaneous (Lingers until start of your next turn)                                                                                                                               |
| **Effect**   | Creatures in line make Dex save. Fail: 2d8 Essence damage. Success: Half damage. Line persists; creatures entering/ending turn repeat save vs 1d8 Essence damage (half on success). |

#### Unique Enhancements (Lancing Blast)

| Enhancement    | SP Cost | Effect                                                |
|:---------------|:--------|:------------------------------------------------------|
| Piercing Lance | +1 SP   | Increase line length to 30 feet.                      |
| Twin Lance     | +2 SP   | Create two separate Lancing Blasts with this casting. |

---

### General Enhancements (Blast)

| Enhancement            | SP Cost   | Effect                                                                                                                         |
|:-----------------------|:----------|:-------------------------------------------------------------------------------------------------------------------------------|
| Amplify Blast          | +1 SP     | Increase initial damage dice by +1d8. (*Stackable*).                                                                           |
| Forceful Blast         | +1 SP     | Creatures failing the initial save are pushed 10 ft away from the origin/center.                                               |
| Penetrating Blast      | +2 SP     | The blast's damage ignores resistance to its damage type.                                                                      |
| Debilitating Blast     | +1/2/3 SP | (Cost based on Essence B-Tier status) Creatures failing initial save suffer the status effect until end of **your** next turn. |
| Environmental Impact   | +1 SP     | The area affected by the initial blast becomes difficult terrain until the start of your next turn.                            |
| Change Save (Physical) | +1 SP     | Changes the required saving throw from Dexterity to Strength or Constitution (choose when learning).                           |
| Change Save (Mental)   | +2 SP     | Changes the required saving throw from Dexterity to Wisdom or Intelligence (choose when learning).                             |
| Selective Blast        | +3 SP     | Choose creatures in initial area; they are unaffected by the initial blast. (*Does not affect Lancing Blast linger*).          |

---

## 5.4.5 Bolt

> **Basic Effect** (0 SP, 1 Action, 60 ft range): Ranged spell attack, 1d10 damage.

---

### Mode: Standard Bolt ✦ 2 SP

| Property     | Value                                                              |
|:-------------|:-------------------------------------------------------------------|
| **Cast**     | 1 Action                                                           |
| **Range**    | 60 ft                                                              |
| **Duration** | Instantaneous                                                      |
| **Effect**   | Make a ranged spell attack vs one target. Hit: 3d8 Essence damage. |

#### Unique Enhancements (Standard Bolt)

| Enhancement              | SP Cost | Effect                                                                                                                                                                                                 |
|:-------------------------|:--------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Accurate Bolt            | +1 SP   | Gain Advantage on the ranged spell attack roll. (*Cannot combine with Seeking Bolt*).                                                                                                                  |
| Chain Bolt               | +2 SP   | On hit, bolt leaps to a second target within 15 ft (new attack roll). Hit: half original damage (round down). (*Stackable*: +2 SP/target, half previous damage). (*Cannot combine with Seeking Bolt*). |
| Seeking Bolt Enhancement | +1 SP   | Change spell to a Dexterity saving throw vs damage (half on success). No attack roll. (Total 3 SP). (*Cannot combine with Accurate/Chain Bolt*).                                                       |
| ↳ Change Save (Physical) | +1 SP   | (Requires: Seeking Bolt Enhancement) Changes the required save to Strength or Constitution.                                                                                                            |
| ↳ Change Save (Mental)   | +1 SP   | (Requires: Seeking Bolt Enhancement) Changes the required save to Wisdom, Intelligence, or Charisma.                                                                                                   |

---

### Mode: Area Bolt ✦ 3 SP

| Property     | Value                                                                                                      |
|:-------------|:-----------------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                                   |
| **Range**    | 60 ft (5-foot radius sphere centered on point)                                                             |
| **Duration** | Instantaneous                                                                                              |
| **Effect**   | Creatures within the sphere make a Dexterity saving throw. Fail: 3d8 Essence damage. Success: Half damage. |

#### Unique Enhancements (Area Bolt)

| Enhancement      | SP Cost | Effect                                                       |
|:-----------------|:--------|:-------------------------------------------------------------|
| Expand Area Bolt | +1 SP   | Increase the radius of the sphere by +5 feet. (*Stackable*). |

---

### Mode: Channeled Bolt ✦ 3 SP

| Property     | Value                                                                                                                                                                                                                                                           |
|:-------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                                                                                                                                                                                        |
| **Range**    | 60 ft                                                                                                                                                                                                                                                           |
| **Duration** | Concentration, up to 1 min                                                                                                                                                                                                                                      |
| **Effect**   | Choose delivery: **Attack Channel** (Spell attack, hit: 2d8 dmg, start channel) OR **Save Channel** (Dex save, fail: 2d8 dmg, start channel; success: half dmg, no channel). Subsequent turns: Action for 2d8 dmg to channeled target (needs visibility/range). |

#### Unique Enhancements (Channeled Bolt)

| Enhancement             | SP Cost | Effect                                                                                                     |
|:------------------------|:--------|:-----------------------------------------------------------------------------------------------------------|
| Increase Initial Damage | +1 SP   | Increase initial damage by +1d8. (*Stackable*).                                                            |
| Increase Channel Damage | +2 SP   | Increase subsequent Action damage by +1d8. (*Stackable*).                                                  |
| Tenacious Channel       | +2 SP   | Concentration is not broken if you use your Action to cast a non-attack spell or take a non-Attack action. |

---

### General Enhancements (Bolt)

| Enhancement       | SP Cost | Effect                                                                                                                                                                    |
|:------------------|:--------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| More Damage       | +1 SP   | Increase the initial damage dice by +1d8. (*Stackable*) (Applies to Standard, Area, Channeled initial hit).                                                               |
| Forceful Bolt     | +1 SP   | On hit (Standard) or failed initial save (Area/Seeking/Channeled), primary target pushed 10 ft away from caster or center of area.                                        |
| Penetrating Bolt  | +2 SP   | The spell's damage ignores resistance to its damage type.                                                                                                                 |
| Debilitating Bolt | +2 SP   | On hit (Standard) or failed initial save (Area/Seeking/Channeled), primary target makes Con save vs Spell DC or suffers Essence status until start of **your** next turn. |
| Increase Range    | +1 SP   | Doubles the spell's range. (*Stackable*).                                                                                                                                 |

---

## 5.4.6 Communicate

> **Basic Effect** (0 SP, 1 Action, 60ft range): Send one-way, 10-word telepathic message, bypasses language, no reply.

---

### Mode: Direct Link ✦ 2 SP

| Property     | Value                                                                                                                                              |
|:-------------|:---------------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                                                                           |
| **Range**    | 60 ft                                                                                                                                              |
| **Duration** | Concentration, up to 1 min                                                                                                                         |
| **Effect**   | Initiate a **two-way telepathic conversation** with one creature (willing, or Int save if unwilling). Bypasses language. Exchange thoughts freely. |

#### Unique Enhancements (Direct Link)

| Enhancement       | SP Cost        | Effect                                                                                                                                          |
|:------------------|:---------------|:------------------------------------------------------------------------------------------------------------------------------------------------|
| Mental Projection | +1 SP          | Transmit clear mental image/sound/basic sense once per round as part of link. (Int save still applies if unwilling target).                     |
| Mind Fracture     | +2 SP          | (Target must be concentrating) On link initiation or as Action, force target Concentration save (DC 10 + Spell Mod). Fail breaks concentration. |
| Share Link        | +1 SP / target | Add another creature within 30 ft of primary target to the two-way conversation.                                                                |
| Encrypt Link      | +1 SP          | Link resists interception (Int check vs Spell Save DC).                                                                                         |
| Emotional Hue     | +1 SP          | Imbue communication with simple, strong emotion (calm, fear, joy, etc.).                                                                        |

---

### Mode: Sensory Scry ✦ 3 SP

| Property     | Value                                                                                                                                                                                                                                                                                                                          |
|:-------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                                                                                                                                                                                                                                                       |
| **Range**    | Touch                                                                                                                                                                                                                                                                                                                          |
| **Duration** | Concentration, up to 10 min                                                                                                                                                                                                                                                                                                    |
| **Effect**   | Choose one: **Link Senses:** Target willing creature. Action to perceive via their visual/auditory senses (gain special senses); blind/deaf to own senses while doing so. OR **Read Object Imprint:** Target non-magical object. Gain vague psychic impressions of last user/events (needs Int [Invest] check vs GM DC 10-20). |

#### Unique Enhancements (Sensory Scry)

| Enhancement            | SP Cost | Effect                                                                                                  |
|:-----------------------|:--------|:--------------------------------------------------------------------------------------------------------|
| Ranged Scry            | +1 SP   | Increase initial Range to 30 ft.                                                                        |
| Share Senses           | +2 SP   | (Applies To: Link Senses) Target one additional willing creature. Use Action to switch between targets. |
| Two-Way Senses         | +2 SP   | (Applies To: Link Senses) Target(s) can use their Action to perceive through your senses.               |
| Deepen Imprint Reading | +1 SP   | (Applies To: Read Imprint) Gain clearer images/sounds. Advantage on Investigation check.                |

---

### Mode: Universal Channel ✦ 1 SP

| Property     | Value                                                    |
|:-------------|:---------------------------------------------------------|
| **Cast**     | 1 Action                                                 |
| **Range**    | Self                                                     |
| **Duration** | 1 hour (no Concentration)                                |
| **Effect**   | Understand literal meaning of any spoken language heard. |

#### Unique Enhancements (Universal Channel)

| Enhancement            | SP Cost      | Effect                                                                                                                                                                                |
|:-----------------------|:-------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Written Word           | +0 SP        | Also understand written language touched (~1 min/page).                                                                                                                               |
| Speak to Beasts        | +1 SP        | Also comprehend and verbally communicate simple ideas with Beasts.                                                                                                                    |
| Gift of Tongues        | +2 SP        | Range becomes Touch. Target (can be self) can also be understood by any creature with a language.                                                                                     |
| Swap Effect: Broadcast | +2 SP        | Change effect: Range Self (30ft radius) OR Point within 60ft (30ft radius). Send one-way, 25-word telepathic message to chosen creatures in radius, bypasses language. Instantaneous. |
| Swap Effect: Relay Net | +2 SP        | Change effect: Range 120 ft. Link up to 3 willing creatures (inc. self) for 10 mins (no Conc.). Linked members send 10-word telepathic messages to each other 1/round (no action).    |
| Extended Understanding | +1 SP / step | (Requires: Base Effect, Written Word, or Speak to Beasts) Increase non-Concentration duration step (1 hour → 8 hours).                                                                |

---

### General Enhancements (Communicate)

| Enhancement          | SP Cost      | Effect                                                                                                                        |
|:---------------------|:-------------|:------------------------------------------------------------------------------------------------------------------------------|
| Increase Range       | +1 SP        | Doubles the initial range (where applicable). (*Stackable*).                                                                  |
| Subtle Casting       | +1 SP        | Cast without Verbal or Somatic components.                                                                                    |
| Non-Visual Targeting | +1 SP        | Target known creature within range even if unseen.                                                                            |
| Planar Communication | +5 SP        | (Applies To: Direct Link, Broadcast, Relay Net) Range becomes Planar.                                                         |
| Sustain Link/Scry    | +1 SP / step | (Applies To: Direct Link, Sensory Scry) Increase Concentration duration step (1 min/10 min → 10 min/1 hour → 1 hour/8 hours). |
| Persistent Link/Scry | +2 SP        | (Applies To: Direct Link, Sensory Scry) (Requires: Sustain Link/Scry ≥ 1 hour) Requires no Concentration.                     |

---

## 5.4.7 Conduit

> **Basic Effect** (0 SP, reaction, 30ft, 1 round): When an ally declares an attack against a creature you can see, the triggering attack roll has advantage.

---

### Mode: Target Vulnerability ✦ 2 SP

| Property     | Value                                                                                                                                                |
|:-------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                                                                             |
| **Range**    | 60 ft                                                                                                                                                |
| **Duration** | Concentration, up to 1 min                                                                                                                           |
| **Effect**   | Target one creature. Choose one of your Essences. Target becomes vulnerable to that Essence's damage type. Con save at end of its turns ends effect. |

#### Unique Enhancements (Target Vulnerability)

| Enhancement             | SP Cost | Effect                                                                            |
|:------------------------|:--------|:----------------------------------------------------------------------------------|
| Lingering Vulnerability | +1 SP   | If target succeeds save, vulnerability persists until the *end* of its next turn. |
| Deepen Vulnerability    | +2 SP   | Target has disadvantage on its saving throws to end this effect.                  |

---

### Mode: Collaborative Strike ✦ 3 SP

| Property     | Value                                                                                                                        |
|:-------------|:-----------------------------------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                                                     |
| **Range**    | 60 ft                                                                                                                        |
| **Duration** | Concentration, up to 1 min                                                                                                   |
| **Effect**   | Target one creature. First time each turn an **ally** hits the target with an attack, that attack deals +1d8 Essence damage. |

#### Unique Enhancements (Collaborative Strike)

| Enhancement           | SP Cost | Effect                                                                    |
|:----------------------|:--------|:--------------------------------------------------------------------------|
| Amplify Collaboration | +1 SP   | Increase the bonus damage dealt by allies by +1d8. (*Stackable*).         |
| Personal Strike       | +1 SP   | Your own attacks can also trigger the bonus damage (once per turn total). |

---

### Mode: Resonance Field ✦ 4 SP

| Property     | Value                                                                                                                                                                                                               |
|:-------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                                                                                                                                            |
| **Range**    | 60 ft                                                                                                                                                                                                               |
| **Duration** | Concentration, up to 1 min                                                                                                                                                                                          |
| **Effect**   | Choose up to three creatures within range. When any marked target takes damage from an attack or spell, all other marked targets within 30 feet of it take damage = your Spell Mod (min 1) of the same damage type. |

#### Unique Enhancements (Resonance Field)

| Enhancement        | SP Cost        | Effect                                               |
|:-------------------|:---------------|:-----------------------------------------------------|
| Harmonic Resonance | +2 SP          | Increase the resonance damage from Spell Mod to 1d8. |
| Expanded Field     | +1 SP / target | Increase the number of initial targets.              |

---

### General Enhancements (Conduit)

| Enhancement        | SP Cost      | Effect                                                                                                                                                   |
|:-------------------|:-------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------|
| Weakening Conduit  | +2 SP        | Marked target(s) have disadvantage on saving throws against spells that deal damage of the same type as your applied Essence.                            |
| Conductive Burst   | +2 SP        | If a target marked by any Mode is reduced to 0 HP, it explodes (10 ft radius). Dex save vs Spell DC, taking 2d8 Essence damage on fail, half on success. |
| Shared Sight       | +1 SP        | While a creature is marked by any Mode, you and allies within 60 ft see its location as faint outline (even if invisible/obscured, not total cover).     |
| Increase Range     | +1 SP        | Doubles the initial range of the spell. (*Stackable*).                                                                                                   |
| Sustain Conduit    | +1 SP / step | Increase Concentration duration (1 min → 10 min → 1 hour).                                                                                               |
| Persistent Conduit | +3 SP        | (Requires: Sustain Conduit ≥ 1 hour) Duration becomes 8 hours, no Concentration.                                                                         |

---

## 5.4.8 Debilitate

> **Basic Effect** (0 SP, 1 Action, 30 ft range, 1 round): Target makes Con save vs speed halved.

---

### Mode: Single Target Affliction ✦ 2 SP

| Property     | Value                                                                                                                                                                |
|:-------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                                                                                             |
| **Range**    | 60 ft                                                                                                                                                                |
| **Duration** | Concentration, up to 1 min                                                                                                                                           |
| **Effect**   | Target one creature makes a saving throw (Wisdom by default). On fail, target suffers an effect based on applied Essence (Ignited, etc.). Repeats save end of turns. |

#### Unique Enhancements (Single Target Affliction)

| Enhancement             | SP Cost | Effect                                                                                  |
|:------------------------|:--------|:----------------------------------------------------------------------------------------|
| Overwhelming Affliction | +1 SP   | Target has disadvantage on the initial save.                                            |
| Lingering Effect        | +1 SP   | If the target succeeds save to end, it remains affected until the end of its next turn. |
| Shared Affliction       | +2 SP   | Target an additional creature within 30 ft of primary; also makes save vs same effect.  |
| Extreme Affliction      | +3 SP   | Target becomes Stunned instead of having the status effect applied.                     |

---

### Mode: Area Affliction ✦ 3 SP

| Property     | Value                                                                                                                                  |
|:-------------|:---------------------------------------------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                                                               |
| **Range**    | 60 ft (15-foot cube)                                                                                                                   |
| **Duration** | 1 round                                                                                                                                |
| **Effect**   | Creatures within cube make save (Wisdom default). On fail, targets suffer Essence-based status effect until end of **your** next turn. |

#### Unique Enhancements (Area Affliction)

| Enhancement        | SP Cost      | Effect                                                                                                                     |
|:-------------------|:-------------|:---------------------------------------------------------------------------------------------------------------------------|
| Expand Area        | +1 SP / +5ft | Increase the cube's side length by +5 feet. (*Stackable*).                                                                 |
| Increased Duration | +2 SP        | Effect lasts Concentration, up to 1 min. Affected creatures repeat save at end of turns, ending effect on self on success. |

---

### General Enhancements (Debilitate)

| Enhancement        | SP Cost | Effect                                                                                              |
|:-------------------|:--------|:----------------------------------------------------------------------------------------------------|
| Change Save        | +1 SP   | Change the saving throw to Strength, Constitution, Intelligence, or Charisma (choose when learned). |
| Greater Affliction | +2 SP   | The target becomes Incapacitated, instead of having the status effect applied.                      |

---

## 5.4.9 Defend

> **Basic Effect** (0 SP, 1 Action, Self, 1 round): Resistance to Bludgeoning, Piercing, OR Slashing.

---

### Mode: Essence Ward ✦ 2 SP

| Property     | Value                                                                 |
|:-------------|:----------------------------------------------------------------------|
| **Cast**     | 1 Action                                                              |
| **Range**    | Self                                                                  |
| **Duration** | Concentration, up to 1 min                                            |
| **Effect**   | Gain resistance to the damage type determined by the applied Essence. |

#### Unique Enhancements (Essence Ward)

| Enhancement        | SP Cost      | Effect                                                                                                       |
|:-------------------|:-------------|:-------------------------------------------------------------------------------------------------------------|
| Bolstering Defense | +1 SP        | Gain Temporary HP = 5 + Spell Mod when cast.                                                                 |
| Share Defense      | +2 SP        | Range becomes Touch, affects one willing creature instead.                                                   |
| Aura of Defense    | +3 SP        | Range Self (10-ft aura). You and allies starting turn in aura gain the resistance.                           |
| Invulnerability    | +3 SP        | Resistance becomes Immunity. (Total cost 5 SP+).                                                             |
| Reactive Retort    | +2 SP        | When target takes resisted damage from attacker within 30ft, attacker takes Spell Mod damage [Essence type]. |
| Sustain Ward       | +1 SP / step | Increase Concentration duration (1 min → 10 min → 1 hour).                                                   |
| Persistent Ward    | +3 SP        | (Requires: Sustain Ward ≥ 1 hour) Duration becomes 8 hours, no Concentration.                                |

---

### Mode: Reactive Shield ✦ 3 SP

| Property     | Value                                                                                    |
|:-------------|:-----------------------------------------------------------------------------------------|
| **Cast**     | Reaction (when hit by attack)                                                            |
| **Range**    | Self                                                                                     |
| **Duration** | 1 round                                                                                  |
| **Effect**   | Gain +5 bonus to AC against the triggering attack and until the start of your next turn. |

#### Unique Enhancements (Reactive Shield)

| Enhancement       | SP Cost | Effect                                                                                                       |
|:------------------|:--------|:-------------------------------------------------------------------------------------------------------------|
| Shield Other      | +2 SP   | Range becomes Touch. Use reaction when ally within 5 ft is hit; grant them the AC bonus. (Total 5 SP).       |
| Deflecting Shield | +1 SP   | If the triggering attack misses due to the AC bonus, attacker takes 1d8 Force/Essence damage. (Total 4 SP+). |

---

### Mode: Enduring Armor ✦ 0 SP

| Property     | Value                                                     |
|:-------------|:----------------------------------------------------------|
| **Cast**     | 10 Minutes (Ritual)                                       |
| **Range**    | Self                                                      |
| **Duration** | 8 hours                                                   |
| **Effect**   | Your base AC becomes 13 + Dex modifier. No Concentration. |

#### Unique Enhancements (Enduring Armor)

| Enhancement   | SP Cost | Effect                                                                               |
|:--------------|:--------|:-------------------------------------------------------------------------------------|
| Armour Other  | +2 SP   | Target becomes one willing creature touched instead of Self.                         |
| Greater Armor | +2 SP   | The AC formula becomes 14 + Dex Mod. (Total cost 2 SP+). Requires separate learning. |

---

## 5.4.10 Empower/Enfeeble

> **Basic Effect** (0 SP, 1 Action, 30 ft range, 1 round): Target gets +1d4 OR makes Wis save vs -1d4 to ONE attack roll OR saving throw.

---

### Mode: Greater Empowerment ✦ 2 SP

| Property     | Value                                                                                         |
|:-------------|:----------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                      |
| **Range**    | 30 ft                                                                                         |
| **Duration** | Concentration, up to 1 min                                                                    |
| **Effect**   | Target one creature. Gains +1d4 bonus to all attack rolls, saving throws, and ability checks. |

#### Unique Enhancements (Greater Empowerment)

| Enhancement        | SP Cost        | Effect                                               |
|:-------------------|:---------------|:-----------------------------------------------------|
| Shared Empowerment | +1 SP / target | Target additional creatures within 30 ft of primary. |

---

### Mode: Greater Enfeeblement ✦ 2 SP

| Property     | Value                                                                                                                                       |
|:-------------|:--------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                                                                    |
| **Range**    | 30 ft                                                                                                                                       |
| **Duration** | Concentration, up to 1 min                                                                                                                  |
| **Effect**   | Target one creature. Target makes Wisdom save. Fail: -1d4 penalty to all attack rolls, saves, ability checks. Repeats save at end of turns. |

#### Unique Enhancements (Greater Enfeeblement)

| Enhancement               | SP Cost        | Effect                                              |
|:--------------------------|:---------------|:----------------------------------------------------|
| Shared Enfeeblement       | +2 SP / target | Target additional creatures within 30 ft.           |
| Overwhelming Enfeeblement | +1 SP          | Target has disadvantage on the initial Wisdom save. |
| Change Save (Physical)    | +1 SP          | Change save to Strength or Constitution.            |
| Change Save (Mental)      | +1 SP          | Change save to Intelligence or Charisma.            |

---

### Mode: Reactive Interference ✦ 3 SP

| Property     | Value                                                             |
|:-------------|:------------------------------------------------------------------|
| **Cast**     | Reaction (when target within 60 ft succeeds on attack/save/check) |
| **Range**    | 60 ft                                                             |
| **Duration** | Instantaneous                                                     |
| **Effect**   | Target rerolls the triggering d20, must use the lower result.     |

---

### Mode: Reactive Fortune ✦ 3 SP

| Property     | Value                                                                                                           |
|:-------------|:----------------------------------------------------------------------------------------------------------------|
| **Cast**     | Reaction (when you/ally within 60 ft fails attack/save/check OR is hit by attack)                               |
| **Range**    | 60 ft                                                                                                           |
| **Duration** | Instantaneous                                                                                                   |
| **Effect**   | Target rerolls the triggering d20, potentially changing the outcome (use higher for fail, lower for hit vs AC). |

---

### General Enhancements (Empower/Enfeeble)

| Enhancement       | SP Cost      | Effect                                                                                                                |
|:------------------|:-------------|:----------------------------------------------------------------------------------------------------------------------|
| Greater Die       | +2 SP        | (Applies To: Greater Empowerment, Greater Enfeeblement) Increase the d4 bonus/penalty to a d6.                        |
| Sustain Effect    | +1 SP / step | (Applies To: Greater Empowerment, Greater Enfeeblement) Increase Concentration duration (1 min → 10 min → 1 hour).    |
| Persistent Effect | +3 SP        | (Applies To: Greater Empowerment, Greater Enfeeblement) (Requires: Sustain Effect ≥ 1 hour) Duration 1 hour, no Conc. |

---
Okay, applying the "Best of Both" format to spells 11 through 18, leaving Manipulate untouched as requested.

---

## 5.4.11 Heal

> **Basic Effect** (0 SP, 1 Action, Touch): Target regains **1d4** + spellcasting ability modifier hit points OR becomes stabilized if dying.

---

### Mode: Standard Heal ✦ 2 SP

| Property     | Value                                                                       |
|:-------------|:----------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                    |
| **Range**    | Touch                                                                       |
| **Duration** | Instantaneous                                                               |
| **Effect**   | Target creature regains **2d8 + Spellcasting Ability Modifier** hit points. |

#### Unique Enhancements (Standard Heal)

| Enhancement  | SP Cost        | Effect                                                                                                     |
|:-------------|:---------------|:-----------------------------------------------------------------------------------------------------------|
| Distant Heal | +1 SP          | Range becomes 60 feet.                                                                                     |
| Shared Heal  | +2 SP / target | Target additional willing creatures within 30 ft of original. Healing amount rolled once, applies to each. |

---

### Mode: Area Heal ✦ 5 SP

| Property     | Value                                                                                                                       |
|:-------------|:----------------------------------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                                                    |
| **Range**    | 60 ft (10-foot radius sphere centered on point)                                                                             |
| **Duration** | Instantaneous                                                                                                               |
| **Effect**   | Choose up to 6 willing creatures within the sphere. Each target regains **2d8 + Spellcasting Ability Modifier** hit points. |

#### Unique Enhancements (Area Heal)

| Enhancement      | SP Cost            | Effect                                                  |
|:-----------------|:-------------------|:--------------------------------------------------------|
| Expand Area      | +1 SP / +5ft       | Increase the sphere's radius by +5 feet. (*Stackable*). |
| Increase Targets | +1 SP / +2 targets | Increase the number of creatures you can choose.        |

---

### Mode: Restorative Heal ✦ 3 SP

| Property     | Value                                                                                                                                                                              |
|:-------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                                                                                                           |
| **Range**    | Touch                                                                                                                                                                              |
| **Duration** | Instantaneous                                                                                                                                                                      |
| **Effect**   | Target creature regains **1d8 + Spellcasting Ability Modifier** hit points AND you end **one** disease OR **one** condition affecting it (Blinded, Deafened, Paralyzed, Poisoned). |

#### Unique Enhancements (Restorative Heal)

| Enhancement         | SP Cost | Effect                                                                                                                                                                        |
|:--------------------|:--------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Greater Restoration | +2 SP   | Instead end **one** effect: Curse, Petrification, Charmed, Frightened, OR reduce exhaustion by one level, OR remove one reduction to ability score/HP max. (Total cost 5 SP). |

---

### General Enhancements (Heal)

*(Add SP cost to applicable Mode's cost)*

| Enhancement  | SP Cost | Effect                                                                                                                                                                         |
|:-------------|:--------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| More Healing | +1 SP   | Increase healing dice by **+1d8**. (Applies to Standard, Area, or Restorative healing amount). (*Stackable*).                                                                  |
| Revivify     | +5 SP   | (Applies To: Standard Heal, Restorative Heal) Target creature died within last minute. Returns to life with 1 HP. Doesn't restore missing parts or prevent death from old age. |

---

## 5.4.12 Illusion

> **Basic Effect** (0 SP, 1 Action, 30ft range, 1 min): Basic visual OR sound illusion, like Minor Illusion.

---

### Mode: Sensory Illusion ✦ 2 SP

| Property     | Value                                                                                                                                                                                                                    |
|:-------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                                                                                                                                                 |
| **Range**    | 60 ft                                                                                                                                                                                                                    |
| **Duration** | Concentration, up to 1 min                                                                                                                                                                                               |
| **Effect**   | Create EITHER image (object/creature/phenomenon ≤ 15-ft cube) OR sound effect (whisper to scream). Physical interaction reveals visual illusions; Action + Int (Investigation) check vs Spell Save DC discerns illusion. |

#### Unique Enhancements (Sensory Illusion)

| Enhancement           | SP Cost      | Effect                                                                                                                             |
|:----------------------|:-------------|:-----------------------------------------------------------------------------------------------------------------------------------|
| Combine Senses        | +1 SP        | Create both image and sound simultaneously.                                                                                        |
| Add Minor Senses      | +1 SP        | (Requires: Combine Senses or base illusion with image+sound) Add minor thermal, tactile, or olfactory elements (superficial only). |
| Animate Illusion      | +1 SP        | (Requires: image) Free action to move image within range; can interact crudely (open unlocked door).                               |
| Expand Illusion       | +1 SP / +5ft | Increase maximum cube size by +5 feet per dimension. (*Stackable*).                                                                |
| Improve Believability | +2 SP        | Creatures have disadvantage on the Investigation check to discern the illusion.                                                    |
| Sustain Sensory       | +1 SP / step | Increase Concentration duration (1 min → 10 min → 1 hour).                                                                         |
| Persistent Sensory    | +3 SP        | (Requires: Sustain Sensory ≥ 1 hour) Duration becomes 8 hours, no Concentration.                                                   |

---

### Mode: Personal Illusion ✦ 3 SP

| Property     | Value                                                                                                                                                                                                                                                                                                                                                                       |
|:-------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                                                                                                                                                                                                                                                                                                    |
| **Range**    | Self                                                                                                                                                                                                                                                                                                                                                                        |
| **Duration** | See Effect                                                                                                                                                                                                                                                                                                                                                                  |
| **Effect**   | Choose **one**: **Disguise Self:** Change appearance (visual only). Duration 1 hour, no Conc. Int (Investigation) check vs Spell DC on interaction/inspection reveals. **Blurring Form:** Attackers have disadvantage unless they don't use sight. Duration Conc, up to 1 min. **Illusory Duplicates:** Create 3 duplicates (like *Mirror Image*). Duration 1 min, no Conc. |

#### Unique Enhancements (Personal Illusion)

| Enhancement         | SP Cost      | Effect                                                                                                    |
|:--------------------|:-------------|:----------------------------------------------------------------------------------------------------------|
| Share Disguise/Blur | +2 SP        | (Applies To: Disguise Self or Blurring Form) Range becomes Touch, affect one willing creature instead.    |
| Sustain Blur        | +1 SP / step | (Applies To: Blurring Form) Increase Concentration duration (1 min → 10 min → 1 hour).                    |
| Persistent Blur     | +3 SP        | (Applies To: Blurring Form) (Requires: Sustain Blur ≥ 1 hour) Duration becomes 8 hours, no Concentration. |

---

### Mode: Invisibility ✦ 4 SP

| Property     | Value                                                                            |
|:-------------|:---------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                         |
| **Range**    | Touch                                                                            |
| **Duration** | Concentration, up to 1 hour                                                      |
| **Effect**   | A creature you touch becomes Invisible. Ends if target attacks or casts a spell. |

#### Unique Enhancements (Invisibility)

| Enhancement           | SP Cost        | Effect                                                                                    |
|:----------------------|:---------------|:------------------------------------------------------------------------------------------|
| Improved Invisibility | +3 SP          | Effect does not end if the target attacks or casts a spell. (Total cost 7 SP+).           |
| Share Invisibility    | +2 SP / target | Target additional creatures touched. (Total cost 6 SP+ for 2 targets, 8 SP+ for 3, etc.). |

---

### General Enhancements (Illusion)

*(Add SP cost to applicable Mode's cost)*

| Enhancement    | SP Cost | Effect                                                                                                       |
|:---------------|:--------|:-------------------------------------------------------------------------------------------------------------|
| Increase Range | +1 SP   | Doubles the range of the chosen Mode (if applicable and not Self/Touch). (*Stackable*).                      |
| Subtle Casting | +1 SP   | Cast without Verbal or Somatic components. (Most useful for Sensory Illusion or bestowed Personal Illusions) |

---

## 5.4.13 Influence

> **Basic Effect** (0 SP, 1 Action, 30ft range, 1 round): Target makes Wis save or has disadvantage on its next attack roll made against **you**.

---

### Mode: Charm Person ✦ 2 SP

| Property     | Value                                                                                                                                                                                                              |
|:-------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                                                                                                                                           |
| **Range**    | 30 ft                                                                                                                                                                                                              |
| **Duration** | 1 hour (no Concentration)                                                                                                                                                                                          |
| **Effect**   | Target one humanoid you can see. Wis save vs **Charmed**. Regards you as friendly acquaintance. Knows it was charmed after effect ends (unless *Lasting Impression* used). Ends early if harmed by you/companions. |

#### Unique Enhancements (Charm Person)

| Enhancement   | SP Cost        | Effect                                                                  |
|:--------------|:---------------|:------------------------------------------------------------------------|
| Share Charm   | +2 SP / target | Target additional humanoids within range.                               |
| Sustain Charm | +2 SP / step   | Increase non-Concentration duration step (1 hour → 8 hours → 24 hours). |

---

### Mode: Suggest Course ✦ 3 SP

| Property     | Value                                                                                                                                                                                               |
|:-------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                                                                                                                            |
| **Range**    | 30 ft                                                                                                                                                                                               |
| **Duration** | Concentration, up to 8 hours                                                                                                                                                                        |
| **Effect**   | Target one creature that can hear/understand you. Wis save vs following a suggested reasonable course of activity (1-2 sentences). Ends if suggestion completed or target harmed by you/companions. |

#### Unique Enhancements (Suggest Course)

| Enhancement           | SP Cost      | Effect                                                                                |
|:----------------------|:-------------|:--------------------------------------------------------------------------------------|
| Sustain Suggestion    | +2 SP / step | Increase Concentration duration step (8 hours → 24 hours). (*Can be made Persistent*) |
| Persistent Suggestion | +3 SP        | (Requires: Sustain Suggestion at 24 hours) Duration becomes 24 hours, no Conc.        |

---

### Mode: Read Thoughts ✦ 3 SP

| Property     | Value                                                                                                                                                                                            |
|:-------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                                                                                                                         |
| **Range**    | Self (30 ft radius)                                                                                                                                                                              |
| **Duration** | Concentration, up to 1 min                                                                                                                                                                       |
| **Effect**   | Use Action to target creature within 30 ft. Wis save vs reading its surface thoughts while within 30 ft. Can switch targets with Action. Target unaware on success (unless *Probe Deeper* used). |

#### Unique Enhancements (Read Thoughts)

| Enhancement  | SP Cost | Effect                                                                                                                                                              |
|:-------------|:--------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Probe Deeper | +1 SP   | As Action, force linked target Int save. Fail: access deeper thoughts for 1 round. Target knows mind is probed on failed save. Success: spell ends for that target. |

---

### Mode: Dominate Creature ✦ 6 SP

| Property     | Value                                                                                                                                                                                                                                                                                |
|:-------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                                                                                                                                                                                                             |
| **Range**    | 60 ft                                                                                                                                                                                                                                                                                |
| **Duration** | Concentration, up to 1 min                                                                                                                                                                                                                                                           |
| **Effect**   | Target one creature. Wis save vs **Charmed**. Establish telepathic link (same plane). Issue commands (no action). Use Action for precise control until end of next turn (use target's reaction with yours). Target repeats save each time it takes damage, ending effect on success. |

#### Unique Enhancements (Dominate Creature)

| Enhancement         | SP Cost      | Effect                                                          |
|:--------------------|:-------------|:----------------------------------------------------------------|
| Extended Domination | +2 SP / step | Increase Concentration duration step (1 min → 10 min → 1 hour). |
| Overwhelming Will   | +2 SP        | Target has disadvantage on the initial saving throw.            |

---

### General Enhancements (Influence)

*(Add SP cost to applicable Mode's cost)*

| Enhancement        | SP Cost | Effect                                                                                                                                       |
|:-------------------|:--------|:---------------------------------------------------------------------------------------------------------------------------------------------|
| Increase Range     | +1 SP   | Doubles the range (where applicable). (*Stackable*).                                                                                         |
| Subtle Casting     | +1 SP   | Cast without Verbal or Somatic components.                                                                                                   |
| Forceful Influence | +1 SP   | (Applies To: Charm Person, Suggest Course) Target has disadvantage on the initial saving throw (unless *Overwhelming Will* already applied). |
| Stronger Hold      | +1 SP   | (Applies To: Charm Person, Suggest Course, Dominate Creature) Advantage on Charisma checks made against the target while affected.           |
| Lasting Impression | +1 SP   | (Applies To: Charm Person, Suggest Course) Target doesn't realize it was magically influenced after the effect ends.                         |
| Broaden Target     | +2 SP   | (Applies To: Charm Person, Suggest Course, Dominate Creature) Can target any creature type (GM discretion on understanding for Suggestion).  |

---

## 5.4.14 Manipulate

*(Format retained as per user request)*

> **Basic Effect (0 SP)** – 1 Action, 30 ft, 1 min.
> Simple telekinetic nudge of an unattended object ≤ 5 lb (≈ 2 kg).

---

### Mode — **Focused Control** ✦ 2 SP

*This replaces the Basic Effect when cast.*

| Property          | Value                                                                                                                                                                                                          |
|:------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast**          | 1 Action                                                                                                                                                                                                       |
| **Range / Speed** | 60 ft (move the focus up to 60 ft per action)                                                                                                                                                                  |
| **Duration**      | Conc. up to 10 min                                                                                                                                                                                             |
| **Power**         | Lift / manipulate up to **25 lb** (≈ 12 kg)                                                                                                                                                                    |
| **Finesse**       | May perform delicate tasks: pick locks (use relevant tool prof.), tie knots, write, pour, swap items from open containers, etc. Sleight of Hand vs Perception if unaware; Acrobatics vs Spell DC if resisting. |

---

### Enhancements

(Add the listed SP to the 2 SP Mode cost)

| Category             | Enhancement          | SP         | Effect / notes                                                                                                                                                                 |
|:---------------------|:---------------------|:-----------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Core Utility**     | Increase Range/Speed | +1 SP      | Doubles both range & movement of the focus. *Stackable.*                                                                                                                       |
|                      | Sustain Control      | +1 SP/step | Extend concentration → 1 h → 8 h.                                                                                                                                              |
|                      | Invisible Hand       | +1 SP      | The telekinetic effect leaves no visible trace.                                                                                                                                |
| **Strength & Force** | Boost Force          | +1 SP/step | Each step: ×2 carry cap (25→50→100 lb …) **and** raises eligible size for shove / grapple by 1 (S→M→L…).                                                                       |
|                      | Forceful Push        | +1 SP      | (Requires: ≥ 1 step Boost Force) Action: contested check (Spell ability vs Athletics/Acrobatics). On success, push creature ≤ size limit 10 ft.                                |
|                      | Crushing Grip        | +2 SP      | (Requires: ≥ 1 step Boost Force) Action: contested check to **Grapple** (escape DC = Spell DC). On later turns: action to deal **1d8 Essence** or drag the target.             |
|                      | Essence Lash         | +2 SP      | Action: melee spell attack from focus (reach 5 ft). Hit = **2d8 Essence**.                                                                                                     |
| **Multiplicity**     | Dual Hands           | +3 SP      | Create a second identical focus. Both obey the same action command. Only one may attack per action (unless …).                                                                 |
|                      | Coordinated Action   | +1 SP      | (Requires: Dual Hands) Both hands may attempt complex checks / attacks simultaneously; if aimed at the same target, gain Advantage.                                            |
| **Elemental Work**   | Elemental Touch      | +1 SP      | (Requires: an Essence) Hand is immune to that element and can carry / slosh / ignite it for minor narrative effects.                                                           |
|                      | Shape Element        | +2 SP      | (Requires: Elemental Touch and apt Essence) Action: sculpt / move a **5‑ft cube** of loose, non‑living matching material (sand, water, shadow, etc.). Lasts while spell lasts. |
| **Longevity**        | Persistent Control   | +3 SP      | (Requires: Sustain Control ≥ 1 h) Duration 8 h, no concentration.                                                                                                              |

---

## 5.4.15 Move

> **Basic Effect** (0 SP, Special (Part of Move), Self, Instantaneous): Enhance movement: Ignore Difficult Terrain OR Avoid Opportunity Attacks OR Move Through Hostiles.

---

### Mode: Blink Step ✦ 2 SP

| Property     | Value                                                                                                                                                                                                |
|:-------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast**     | Special (Part of Move Action)                                                                                                                                                                        |
| **Range**    | Self                                                                                                                                                                                                 |
| **Duration** | Instantaneous                                                                                                                                                                                        |
| **Effect**   | When moving, instead **teleport up to 30 feet** to an unoccupied space you can see. This uses an equivalent amount of movement speed. Can pass through obstacles you couldn't normally move through. |

#### Unique Enhancements (Blink Step)

| Enhancement             | SP Cost        | Effect                                                                                                                               |
|:------------------------|:---------------|:-------------------------------------------------------------------------------------------------------------------------------------|
| Increase Teleport Dist. | +1 SP / +15 ft | Increase the distance teleported. (*Stackable*).                                                                                     |
| Twin Step               | +2 SP          | Bring one willing creature (Size M/S, within 5 ft of start) with you to an adjacent space at destination. Their movement unaffected. |
| Switch Step             | +2 SP          | Instead of empty space, swap places with one willing creature you can see within teleport distance.                                  |
| Phase Step              | +2 SP          | Teleport allows passing through solid objects/barriers up to 5 feet thick. Must end in unoccupied space.                             |
| Elemental Arrival       | +1 SP          | Creatures within 5 feet of arrival space take damage = Spell Mod (min 1) of your Essence type.                                       |

---

### Mode: Velocity Surge ✦ 2 SP

| Property     | Value                                                                                         |
|:-------------|:----------------------------------------------------------------------------------------------|
| **Cast**     | Special (Part of Move Action)                                                                 |
| **Range**    | Self                                                                                          |
| **Duration** | Instantaneous                                                                                 |
| **Effect**   | Gain the benefits of both the **Dash** and **Disengage** actions for your movement this turn. |

*(No Unique Enhancements for this Mode)*

---

### Mode: Reactive Phase ✦ 3 SP

| Property     | Value                                                                                                   |
|:-------------|:--------------------------------------------------------------------------------------------------------|
| **Cast**     | Reaction (When hit by attack or fail Dex save)                                                          |
| **Range**    | Self                                                                                                    |
| **Duration** | Instantaneous                                                                                           |
| **Effect**   | Immediately **teleport up to 15 feet** to an unoccupied space you can see *after* the trigger resolves. |

#### Unique Enhancements (Reactive Phase)

| Enhancement             | SP Cost        | Effect                                                                                         |
|:------------------------|:---------------|:-----------------------------------------------------------------------------------------------|
| Increase Teleport Dist. | +1 SP / +15 ft | Increase the distance teleported. (*Stackable*).                                               |
| Elemental Arrival       | +1 SP          | Creatures within 5 feet of arrival space take damage = Spell Mod (min 1) of your Essence type. |

---

### General Enhancements (Move)

*(Add SP cost to applicable Mode's cost OR cast alone where noted)*

| Enhancement     | SP Cost | Effect                                                                                                                                                                               |
|:----------------|:--------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Bestow Movement | +2 SP   | (Applies To: Blink Step, Velocity Surge) Cast Time becomes 1 Action, Range Touch. Target willing creature can use the chosen Mode's effect on *their* next turn without spending SP. |
| Feather Fall    | +1 SP   | (Cast Independently) Reaction (when you or creature within 60 ft falls). Target's fall rate slows to 60 ft/round, no fall damage. Duration 1 min or until landing.                   |
| Subtle Movement | +1 SP   | Cast without Verbal or Somatic components (mainly for Bestow/Feather Fall).                                                                                                          |

---

## 5.4.16 Strike

> **Basic Effect** (0 SP, 1 Action, Self, Instantaneous): Make weapon attack, if hit deals +Spell Mod Essence damage.

---

### Mode: Empowered Strike ✦ 2 SP

| Property     | Value                                                                                   |
|:-------------|:----------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                |
| **Range**    | Self                                                                                    |
| **Duration** | Instantaneous                                                                           |
| **Effect**   | Make one weapon attack. Hit: deals normal weapon damage + **2d8** bonus Essence damage. |

*(No Unique Enhancements for this Mode)*

---

### Mode: Cleaving Strike ✦ 4 SP

| Property     | Value                                                                                                                                                                                                            |
|:-------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                                                                                                                                         |
| **Range**    | Self (Affects primary target + others within 5 ft)                                                                                                                                                               |
| **Duration** | Instantaneous                                                                                                                                                                                                    |
| **Effect**   | (Melee Only) Make melee weapon attack. Hit: target takes weapon dmg + **2d8** bonus Essence damage. Choose others within 5 ft (up to Spell Mod); they make Dex save vs **2d8** Essence damage (half on success). |

*(No Unique Enhancements for this Mode)*

---

### Mode: Piercing Strike ✦ 4 SP

| Property     | Value                                                                                                                                                                                                        |
|:-------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                                                                                                                                     |
| **Range**    | Self (Affects primary target + 15ft line behind)                                                                                                                                                             |
| **Duration** | Instantaneous                                                                                                                                                                                                |
| **Effect**   | (Ranged/Thrown Only) Make ranged weapon attack. Hit: target takes weapon dmg + **2d8** bonus Essence damage. Creatures in 15ft line behind target make Dex save vs **2d8** Essence damage (half on success). |

*(No Unique Enhancements for this Mode)*

---

### Mode: Bursting Strike ✦ 5 SP

| Property     | Value                                                                                                                                                                                             |
|:-------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                                                                                                                          |
| **Range**    | Self (Affects primary target + 10ft radius burst)                                                                                                                                                 |
| **Duration** | Instantaneous                                                                                                                                                                                     |
| **Effect**   | Make weapon attack. Hit: target takes weapon dmg + **2d8** bonus Essence damage. Creatures in 10ft radius explosion centered on target make Dex save vs **2d8** Essence damage (half on success). |

*(No Unique Enhancements for this Mode)*

---

### General Enhancements (Strike)

*(Add SP cost to applicable Mode's cost)*

| Enhancement        | SP Cost   | Effect                                                                                                                                                                 |
|:-------------------|:----------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Increase Bonus Dmg | +1 SP     | Increases **bonus** damage dice by **+1d8**. (Applies to initial hit and secondary AoE where applicable). (*Stackable*).                                               |
| Inflicted Strike   | +1/2/3 SP | (Cost based on Essence B-Tier status) (Applies to *initial* target) Hit: target makes Con save vs Spell DC or suffers B-Tier status until start of **your** next turn. |
| Flashing Step      | +1 SP     | After the attack (hit or miss), teleport up to 10 feet.                                                                                                                |
| Resounding Impact  | +1 SP     | (Applies to *initial* target) Hit: target makes Str save vs pushed 10 ft away.                                                                                         |
| Tripping Strike    | +2 SP     | (Applies to *initial* target) Hit: target makes Str save vs knocked prone.                                                                                             |
| Disarming Strike   | +2 SP     | (Applies to *initial* target) Hit: target makes Str/Dex save vs dropping one held item of your choice.                                                                 |
| Feinting Strike    | +2 SP     | (Applies to *initial* target) Hit: Gain advantage on your next attack roll vs target before end of your next turn.                                                     |
| Critical Surge     | +2 SP     | (Use as Reaction) On critical hit with the spell's attack, spend 2 SP to maximize the spell's **bonus** damage dice.                                                   |

---

## 5.4.17 Summon

> **Basic Effect** (0 SP, 1 Action, 30ft range, 1 min): Summons Tiny servant (AC 10, 1 HP, Speed 15ft) that can use BA to Help ally.

---

### Mode: Utility Familiar ✦ 2 SP

| Property     | Value                                                                                                                                                   |
|:-------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                                                                                |
| **Range**    | 30 ft                                                                                                                                                   |
| **Duration** | Concentration, up to 10 min                                                                                                                             |
| **Effect**   | Summon Tiny/Small spirit (AC 12, HP 5+SpellMod, Speed 30ft). Can Help, Search, Use Object, Dash actions. Obeys commands. Can deliver your touch spells. |

#### Unique Enhancements (Utility Familiar)

| Enhancement         | SP Cost      | Effect                                                                         |
|:--------------------|:-------------|:-------------------------------------------------------------------------------|
| Skilled Assistant   | +1 SP        | Gains proficiency in one skill/tool you choose (uses your stats).              |
| Telepathic Bond     | +1 SP        | Can communicate telepathically with you within 100 ft.                         |
| Shifting Form       | +1 SP        | Can use its action to change size (Tiny/Small/Medium). Stats remain unchanged. |
| Enhanced Senses     | +1 SP        | Gains darkvision 60 ft & advantage on Wisdom (Perception) checks.              |
| Invisibility        | +1 SP        | Familiar is invisible.                                                         |
| Sustain Familiar    | +1 SP / step | Increase Concentration duration (10 min → 1 hour → 8 hours).                   |
| Persistent Familiar | +3 SP        | (Requires: Sustain Familiar ≥ 1 hour) Duration 8 hours, no Concentration.      |

---

### Mode: Combat Spirit ✦ 4 SP

| Property     | Value                                                                                                                                                                                                                                    |
|:-------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Minute                                                                                                                                                                                                                                 |
| **Range**    | 30 ft                                                                                                                                                                                                                                    |
| **Duration** | Concentration, up to 1 hour                                                                                                                                                                                                              |
| **Effect**   | Summon Medium spirit (AC 14, HP 15 + [5 * SP spent above 4 SP], Speed 30ft). Acts on its own turn after yours. Can take most actions (no spells). Attack: Uses your Spell Attack vs AC, deals **1d8 + Spell Mod** Essence damage on hit. |

#### Unique Enhancements (Combat Spirit)

| Enhancement       | SP Cost        | Effect                                                                                                                                                                                                                                                                                                                                                    |
|:------------------|:---------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Swift Summon      | +2 SP          | Casting Time becomes 1 Action. (Total cost 6 SP+).                                                                                                                                                                                                                                                                                                        |
| Greater Attack    | +1 SP          | Increase attack damage by **+1d8**. (*Stackable*).                                                                                                                                                                                                                                                                                                        |
| Multiattack       | +4 SP          | Can make two attacks with its Attack action. (Requires base spirit cost + 4 SP = 8 SP total min).                                                                                                                                                                                                                                                         |
| Guardian Stance   | +1 SP          | Can use its Reaction to impose disadvantage on an attack roll against a creature within 5 feet of it.                                                                                                                                                                                                                                                     |
| Reinforced Spirit | +1 SP / +10 HP | Increase the spirit's maximum Hit Points by +10. (*Stackable*).                                                                                                                                                                                                                                                                                           |
| Armored Spirit    | +1 SP / +1 AC  | Increase the spirit's AC by +1. (*Stackable, max +3 total bonus*).                                                                                                                                                                                                                                                                                        |
| Resilient Spirit  | +2 SP          | Gains resistance to non-magical bludgeoning, piercing, and slashing damage.                                                                                                                                                                                                                                                                               |
| Movement Mode     | +1 SP          | Gains a fly, burrow, or swim speed equal to its walking speed (choose one).                                                                                                                                                                                                                                                                               |
| Special Maneuver  | +2 SP          | Choose one option: **Charge:** (Replaces attack) Move ≥10ft straight, attack deals +1d8 dmg, target makes Str save vs Spell DC or knocked prone. **Grapple:** (Replaces attack) Make grapple check using Spell Atk bonus. **Area Burst:** (1/summon, replaces attack) 5-ft radius burst centered on self, 2d6 Essence dmg, Dex save vs Spell DC for half. |

---

### General Enhancements (Summon)

*(Add SP cost to applicable Mode's cost)*

| Enhancement           | SP Cost | Effect                                                                                                                   |
|:----------------------|:--------|:-------------------------------------------------------------------------------------------------------------------------|
| Increase Summon Range | +1 SP   | Doubles initial summon range. (*Stackable*).                                                                             |
| Essence Burst         | +2 SP   | When spirit drops to 0 HP, it explodes (10ft radius). Dex save vs Spell DC, 2d6 Essence damage on fail, half on success. |
| Twin Summon           | +4 SP   | Summon two identical spirits instead of one. Concentration applies to both. Base cost + 4 SP applies.                    |

---

## 5.4.18 Zone

> **Basic Effect** (0 SP, 1 Action, 60ft range, 1 round): 10-ft square area becomes Difficult Terrain.

---

### Mode: Hindering Zone ✦ 3 SP

| Property     | Value                                                                                                                                                                                                                                                                                                                                                     |
|:-------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                                                                                                                                                                                                                                                                                  |
| **Range**    | 60 ft (20-foot radius sphere)                                                                                                                                                                                                                                                                                                                             |
| **Duration** | Concentration, up to 1 min                                                                                                                                                                                                                                                                                                                                |
| **Effect**   | Create zone. Choose **one** effect upon casting: **Difficult Terrain:** Area is difficult terrain. **Obscuring Mist:** Area heavily obscured. **Restraining Field:** Creatures entering/starting turn make Str save vs **Restrained** until start of their next turn. **Silence:** No sound within/passes through. Deafens inside. Prevents V components. |

#### Unique Enhancements (Hindering Zone)

| Enhancement         | SP Cost | Effect                                                                                                    |
|:--------------------|:--------|:----------------------------------------------------------------------------------------------------------|
| Hazardous Terrain   | +2 SP   | (Applies To: Difficult Terrain) Creatures take 1d4 Essence damage for every 5 feet moved within the zone. |
| Selective Obscurity | +2 SP   | (Applies To: Obscuring Mist) Chosen creatures treat the area as only lightly obscured.                    |
| Mobile Silence      | +2 SP   | (Applies To: Silence) Zone centered on a willing creature/object you choose within range, moves with it.  |
| Tenacious Restraint | +1 SP   | (Applies To: Restraining Field) Creatures have disadvantage on the Strength saving throw.                 |

---

### Mode: Harmful Zone ✦ 4 SP

| Property     | Value                                                                                                                                                                                                                                                                                                      |
|:-------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                                                                                                                                                                                                                                   |
| **Range**    | 60 ft (20-foot radius, 20-foot high cylinder)                                                                                                                                                                                                                                                              |
| **Duration** | Concentration, up to 1 min                                                                                                                                                                                                                                                                                 |
| **Effect**   | Create zone. Choose **one** effect upon casting: **Damaging:** Creatures entering/starting turn make Dex save. Take **2d6** Essence damage on fail, half on success. **Debilitating:** Creatures entering/starting turn make Con save vs B-Tier status (linked to Essence) until start of *its* next turn. |

#### Unique Enhancements (Harmful Zone)

| Enhancement            | SP Cost | Effect                                                                                                                         |
|:-----------------------|:--------|:-------------------------------------------------------------------------------------------------------------------------------|
| Increase Dmg/Debuff DC | +1 SP   | Increase damage by **+1d6** OR increase the save DC for the B-Tier status by +1. (Choose effect when learning). (*Stackable*). |
| Lingering Hazard       | +1 SP   | The zone's area also becomes difficult terrain.                                                                                |
| Weakening Field        | +1 SP   | (Applies To: Debilitating) Creatures have disadvantage on the initial save vs the status effect.                               |

---

### Mode: Sanctuary Zone ✦ 4 SP

| Property     | Value                                                                                                 |
|:-------------|:------------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                              |
| **Range**    | 60 ft (20-foot radius sphere)                                                                         |
| **Duration** | Concentration, up to 1 min                                                                            |
| **Effect**   | Choose creatures when casting. Chosen creatures inside gain **+1 bonus to AC and all saving throws**. |

#### Unique Enhancements (Sanctuary Zone)

| Enhancement       | SP Cost | Effect                                                                                                |
|:------------------|:--------|:------------------------------------------------------------------------------------------------------|
| Greater Sanctuary | +2 SP   | Bonus increases to +2.                                                                                |
| Purifying Aura    | +2 SP   | Chosen creatures also have advantage on saving throws against being charmed, frightened, or poisoned. |

---

### General Enhancements (Zone)

| Enhancement     | SP Cost      | Effect                                                                                                                                         |
|:----------------|:-------------|:-----------------------------------------------------------------------------------------------------------------------------------------------|
| Expand Zone     | +1 SP / +5ft | Increase the zone's radius or side length by +5 feet. (*Stackable*).                                                                           |
| Increase Range  | +1 SP        | Doubles initial casting range. (*Stackable*).                                                                                                  |
| Sustain Zone    | +1 SP / step | Increase Concentration duration (1 min → 10 min → 1 hour).                                                                                     |
| Persistent Zone | +3 SP        | (Requires: Sustain Zone ≥ 1 hour) Duration becomes 8 hours, no Concentration.                                                                  |
| Selective Zone  | +2 SP        | Choose creatures when casting; they are unaffected by the zone's detrimental effects (does not grant benefits of Sanctuary Zone).              |
| Shape Zone      | +1 SP        | Can form the zone into a Cube, Cylinder, Line, or Wall of equivalent area/volume (GM discretion for specific dimensions based on radius/side). |

6.1 Character Concept: Thinking about who your character is.

6.2 Ability Scores: How to assign the standard array (+0, +1, +1, +2, +2, +3) to the six abilities (Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma).

6.3 Choose Background: Selecting a background that grants skill/ proficiencies, and a narrative feature.

6.4 Choose Class: Selecting one of the six classes detailed in Section 7. This determines Hit Dice, proficiencies, and starting spells.

6.5 Calculate Hit Points: Determine starting HP based on class Hit Die and Constitution modifier.

6.6 Choose Essences: Remind the player to choose their two starting Essence Descriptors (referencing Section 4.2).

6.7 Final Details: Alignment, personality traits, appearance, name, etc.

## **7. Classes**

This section details the core classes available in Mike's TTRPG Rules. Each class is tied to one of the six core ability scores and provides a unique thematic and mechanical framework. Your class determines your starting hit points, proficiencies, class features gained at higher levels, and your access to **Spells**.

### **7.1 Gaining Class Features**

As you gain levels in a class, you will unlock new features, including potentially more **Spells Known**. Your **Spell Point (SP)** pool and **Maximum SP per Activation** limit increase automatically with your character level as shown on **Table 2-1** (unless a specific class feature states otherwise, though this is uncommon).

### **7.2 Starting Spells**

At 1st level (or when you first gain access to Spells through your class), you **know** a total of **four Spells**. The specific spells are determined as follows:

1. **Core Attack Spell:** Your class grants you knowledge of either `Strike` or `Bolt`, or allows you to choose one of them.
2. **Unique Thematic Spell:** Your class grants you knowledge of a specific mandatory Spell that embodies its core concept.
3. **Choice Spells (Choose 2):** You choose two additional Spells from your class's specific **Available Spells** list.

### **7.3 Class Descriptions**

The following classes represent broad archetypes defined by their primary ability score. Each description offers a theme and typical expressions of power, but these are merely suggestions – a foundation upon which to build *your* unique character. Use your choice of **Spells**, **Essences**, and **Enhancements** to bring your specific concept to life. How your character embodies their class is entirely up to you.

You are absolutely right! My apologies, I trimmed those flavorful examples too aggressively when converting to the table format. Let me add those back in.

Here are the updated class entries with the "What could your X be?" bullet points restored:

---

#### **7.3.1 Champion (Strength)**

Champions harness raw physical power, translating overwhelming Strength into tangible magical effects. They dominate the battlefield through might, protect allies with unwavering resolve, and their force of will can manifest as physical **Barriers** (`Barrier`) just as readily as devastating enhanced **Strikes** (`Strike`). This framework is a starting point; your Champion's power comes from within – define what drives yours.

- **What could your Champion be?**
  - A determined protector whose conviction creates shields of shimmering force.
  - A tribal warrior who commands earth to rise as protective walls through stomps or gestures.
  - A disciplined combatant whose powerful stance establishes zones of defense.
  - A resolute individual whose sheer stubbornness materializes as physical obstacles.
- **How does your strength manifest?** Battle cries? Precise martial technique? Sheer unstoppable will?

| Stat         | Value    |
|:-------------|:---------|
| Core Ability | Strength |
| Hit Dice     | 1d10     |

| Proficiency   | Details                                                     |
|:--------------|:------------------------------------------------------------|
| Armor         | Light armor, medium armor, heavy armor, shields             |
| Weapons       | Simple weapons, martial weapons                             |
| Saving Throws | Strength, Constitution                                      |
| Skills        | Choose 2 from Athletics, Intimidation, Perception, Survival |

| Spell Category           | Details                                                 |
|:-------------------------|:--------------------------------------------------------|
| **Total Known**          | 4                                                       |
| Core Attack              | `Strike`                                                |
| Unique Thematic          | `Barrier`                                               |
| Choice Spells (Choose 2) | Blast, Debilitate, Defend, Empower/Enfeeble, Heal, Zone |

---

#### **7.3.2 Trickster (Dexterity)**

Tricksters excel through speed, precision, and cunning, their enhanced agility allowing them to **Move** (`Move`) with supernatural grace. They might use magically guided attacks (`Strike`/`Bolt`), misdirection (`Illusion`), or sheer nimbleness to confound foes and navigate danger. This is just a template; your Trickster's style is yours to define.

- **What could your Trickster be?**
  - A shadow dancer who blinks short distances between attacks.
  - A seemingly luck-touched gambler whose throws always hit their mark.
  - A battlefield acrobat whose dazzling movements confound opponents.
  - A silent hunter who seems to glide through any environment unseen.
- **How does your dexterity express itself?** Subtle and secretive? Flamboyant and showy? Methodical and precise?

| Stat         | Value     |
|:-------------|:----------|
| Core Ability | Dexterity |
| Hit Dice     | 1d8       |

| Proficiency   | Details                                                                                           |
|:--------------|:--------------------------------------------------------------------------------------------------|
| Armor         | Light armor                                                                                       |
| Weapons       | Simple weapons, hand crossbows, longswords, rapiers, shortswords, shortbows                       |
| Saving Throws | Dexterity, Intelligence                                                                           |
| Skills        | Choose 3 from Acrobatics, Deception, Insight, Investigation, Perception, Sleight of Hand, Stealth |

| Spell Category           | Details                                                   |
|:-------------------------|:----------------------------------------------------------|
| **Total Known**          | 4                                                         |
| Core Attack              | Choose `Strike` OR `Bolt`                                 |
| Unique Thematic          | `Move`                                                    |
| Choice Spells (Choose 2) | Blast, Communicate, Conduit, Debilitate, Defend, Illusion |

---

#### **7.3.3 Adapter (Constitution)**

Adapters draw power from their remarkable resilience and life force, their bodies capable of extraordinary transformation (**Adapt Self**). They endure, evolve, and overcome challenges by altering their very form, making their body both weapon (`Strike`/`Bolt`) and shield (`Defend`). But the specifics are yours to create; the Adapter's power is personal.

- **What could your Adapter be?**
  - A shapeshifter whose limbs become claws, wings, or fins as needed.
  - A stoic warrior whose skin temporarily hardens like stone or bark against attacks.
  - A survivor whose wounds close with unnatural speed (`Heal`).
  - A symbiotic host sharing consciousness and physical traits with another entity.
- **How does your body change?** Controlled evolution? Primal response? Ancient magic? Strange experimentation?

| Stat         | Value        |
|:-------------|:-------------|
| Core Ability | Constitution |
| Hit Dice     | 1d10         |

| Proficiency   | Details                                                             |
|:--------------|:--------------------------------------------------------------------|
| Armor         | Light armor, medium armor, shields                                  |
| Weapons       | Simple weapons                                                      |
| Saving Throws | Constitution, Strength                                              |
| Skills        | Choose 2 from Athletics, Intimidation, Nature, Perception, Survival |

| Spell Category           | Details                                       |
|:-------------------------|:----------------------------------------------|
| **Total Known**          | 4                                             |
| Core Attack              | Choose `Strike` OR `Bolt`                     |
| Unique Thematic          | `Adapt Self`                                  |
| Choice Spells (Choose 2) | Blast, Debilitate, Defend, Heal, Summon, Zone |

---

#### **7.3.4 Scholar (Intelligence)**

Scholars reshape reality through careful study, pattern recognition, and the precise application of knowledge. Their intellect allows them to affect the world, often from afar, whether through direct force (`Bolt`), intricate control over objects and energy (**Manipulate**), or understanding the underlying principles of magic and nature. This archetype is broad; the Scholar's power comes from understanding – what do *you* seek to comprehend?

- **What could your Scholar be?**
  - A traditional arcanist translating ancient formulae into tangible effects.
  - An inventor whose calculated understanding allows for precise telekinetic control.
  - A battlefield tactician who redirects energy and subtly alters terrain (`Zone`).
  - A researcher who perceives and interacts with the hidden connections between all things.
- **What knowledge drives you?** Forbidden texts? Science? Math? Laws of magic or nature?

| Stat         | Value        |
|:-------------|:-------------|
| Core Ability | Intelligence |
| Hit Dice     | 1d6          |

| Proficiency   | Details                                                                 |
|:--------------|:------------------------------------------------------------------------|
| Armor         | None                                                                    |
| Weapons       | Daggers, darts, slings, quarterstaffs, light crossbows                  |
| Saving Throws | Intelligence, Wisdom                                                    |
| Skills        | Choose 2 from Arcana, History, Insight, Investigation, Medicine, Nature |

| Spell Category           | Details                                                |
|:-------------------------|:-------------------------------------------------------|
| **Total Known**          | 4                                                      |
| Core Attack              | `Bolt`                                                 |
| Unique Thematic          | `Manipulate`                                           |
| Choice Spells (Choose 2) | Blast, Communicate, Debilitate, Defend, Illusion, Zone |

---

#### **7.3.5 Sage (Wisdom)**

Sages perceive what others cannot, drawing on intuition, experience, and a connection to the world around them to see hidden truths (**Arcane Sight**). Their wisdom often allows them to heal (`Heal`), guide (`Communicate`), protect (`Defend`), and understand deeper patterns, sometimes drawing on forces larger than themselves (`Summon`/`Zone`). The Sage's insight is unique – what informs yours?

- **What could your Sage be?**
  - A nature-connected guide who communes with animal spirits or channels natural energies.
  - A temple guardian sensing disturbances in spiritual harmony or reading auras.
  - A battlefield medic whose intuitive understanding of life force saves lives.
  - A keen investigator who notices the smallest details and understands underlying motives.
- **What guides your perception?** A connection to spirits or divinity? Deep practical experience and observation? Strong emotional intuition and empathy?

| Stat         | Value  |
|:-------------|:-------|
| Core Ability | Wisdom |
| Hit Dice     | 1d8    |

| Proficiency   | Details                                                                          |
|:--------------|:---------------------------------------------------------------------------------|
| Armor         | Light armor, medium armor, shields                                               |
| Weapons       | Simple weapons                                                                   |
| Saving Throws | Wisdom, Charisma                                                                 |
| Skills        | Choose 2 from Animal Handling, Insight, Medicine, Perception, Religion, Survival |

| Spell Category           | Details                                          |
|:-------------------------|:-------------------------------------------------|
| **Total Known**          | 4                                                |
| Core Attack              | Choose `Strike` OR `Bolt`                        |
| Unique Thematic          | `Arcane Sight`                                   |
| Choice Spells (Choose 2) | Communicate, Conduit, Defend, Heal, Summon, Zone |

---

#### **7.3.6 Orator (Charisma)**

Orators command attention and shape reality through sheer force of personality, their presence allowing them to **Influence** (`Influence`) minds, emotions, and even the flow of magic itself. Their power might erupt as spectacular displays (`Blast`/`Bolt`), subtle manipulations (`Illusion`), compelling commands (`Communicate`), or pact-bound abilities (`Summon`). The Orator's power reflects their unique character – how does yours shine?

- **What could your Orator be?**
  - An innately powerful individual whose strong emotions manifest as magical effects.
  - A pact-bound intermediary channeling otherworldly power through carefully worded agreements.
  - A stirring leader whose inspiring words literally empower allies (`Empower`).
  - A silver-tongued negotiator whose bargains and pronouncements hold magical weight.
- **How does your personality affect the world?** Captivating performance? Resolute command? Subtle manipulation and charm? Unfiltered emotional expression?

| Stat         | Value    |
|:-------------|:---------|
| Core Ability | Charisma |
| Hit Dice     | 1d8      |

| Proficiency   | Details                                                                 |
|:--------------|:------------------------------------------------------------------------|
| Armor         | Light armor                                                             |
| Weapons       | Simple weapons, hand crossbows, rapiers, shortswords                    |
| Saving Throws | Charisma, Constitution                                                  |
| Skills        | Choose 2 from Deception, Insight, Intimidation, Performance, Persuasion |

| Spell Category           | Details                                                            |
|:-------------------------|:-------------------------------------------------------------------|
| **Total Known**          | 4                                                                  |
| Core Attack              | `Bolt`                                                             |
| Unique Thematic          | `Influence`                                                        |
| Choice Spells (Choose 2) | Blast, Communicate, Debilitate, Empower/Enfeeble, Illusion, Summon |

---
