# Mike's TTRPGRules

## **2. Spell Points (SP)**

Magic is fueled by **Spell Points (SP)**, representing a caster's pool of magical energy. Activating Spell **Modes** and adding **Enhancements** costs SP.

### **2.1 Gaining and Spending SP**

- **SP Pool:** You have a maximum number of SP based on your character level, as shown on Table 2-1. You regain all expended SP after completing a **Long Rest**.
- **Spending SP:** When you activate a Spell using one of its **Modes** (other than the 0 SP Basic Effect) or add **Enhancements**, you spend SP equal to the total cost. You cannot spend more SP than you currently have.

### **2.2 Basic Effects (0 SP)**

Each core Spell has a **Basic Effect** listed in Section 3.4 that costs 0 SP to use. These represent minor manifestations of the Spell's concept and can be used at will, serving as a viable alternative combat action or cantrip-level utility.

### **2.3 Maximum SP per Activation**

There is a limit to the total SP you can spend on a single activation of a Spell (Base Mode Cost + Enhancement Costs). This limit prevents characters from expending their entire energy pool on one overwhelmingly powerful effect early on. This limit is based on your character level, as shown on Table 2-1.

### **2.4 Spell Point Progression**

#### Table 2-1: Spell Points and Maximum SP per Activation by Level**

| Level | Spell Points | Max SP Per Activation |
| :---- | :----------- | :-------------------- |
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

### ### **3.1 Nature of Spells**

In this system, specific spell lists are replaced by **Spells**. Spells are the fundamental building blocks of magical effects – generic templates representing a core concept like projecting energy, healing wounds, or bolstering defenses. Unlike the vast and highly specific spell lists of standard 5th Edition, this system uses a smaller, curated list of core Spells.

The specific manifestation, damage type, and finer details of a Spell activated by a caster are determined by the **Essences** they apply (detailed in Section 4), while the overall potency and additional effects are modified by **Enhancements** (detailed in Section 5).

This approach shifts the focus from memorizing hundreds of specific incantations to understanding a core set of effects and creatively applying Essences and Enhancements using your Spell Points (SP).

### **3.2 Learning Spells**

Characters do not prepare spells daily. Instead, they **know** a set number of Spells, representing the magical effects they have mastered.

- **Spells Known:** Your class determines the number of Spells you know. You start knowing a certain number of Spells at 1st level (or when you gain access to Spells) and learn additional Spells as you gain levels. The specific progression is detailed in the class description (Section 7) or accompanying tables.
- **Choosing Spells:** When a feature states you learn a Spell, you choose a new Spell from your **Class Spell List**. Spells themselves generally do not have inherent level requirements beyond being available on your class list; access is determined by the number of Spells your class level grants you. Potency is governed by SP cost and the Maximum SP per Activation limit (Section 2.3).
- **Changing Known Spells:** When you gain a level in a class that grants access to Spells, you can typically choose one of the Spells you know and replace it with another Spell from your Class Spell List.
- **Learning Outside Lists:** Some class features might grant the ability to learn Spells from lists other than your primary Class Spell List.

### **3.3 Spell Descriptions**

Each Spell is presented in a standard format, detailing its core function before any Enhancements are applied.

- **Name:** A generic name representing the Spell's core concept.
- **Base SP Cost:** The minimum Spell Points required to activate the core effect.
- **Casting Time:** The action required (e.g., 1 Action, Reaction).
- **Range:** The maximum distance (e.g., Self, Touch, 30 feet).
- **Components:** Specifies necessary components. **By default, all Spells require V (Verbal) and M (Focus)**, where the Focus replaces non-costly material components.
  - Costly material components are listed explicitly after the M (Focus) entry (e.g., "M (Focus, and a diamond worth 500 gp, which the Spell consumes)").
  - **S (Somatic)** is listed *only if* intricate gestures are required *in addition* to manipulating the focus. If S is not listed, only verbalization and handling the focus are needed.
- **Duration:** How long the effect lasts (e.g., Instantaneous, Concentration up to 1 minute).
- **Core Effect:** Description of the fundamental result of activating the Spell at its Base SP Cost. Details targets, saving throws, damage/healing, conditions, etc. Damage type is determined by Essences.
- **Tags:** Optional keywords:
  - **Concentration:** Requires concentration following standard 5e rules.
  - **Ritual:** Can optionally be cast over 10 minutes longer without spending SP.

---

### **3.4 Core Spells**

This section details the baseline **Basic Effect (0 SP)** for each core Spell. This effect can be used at will without spending Spell Points and is intended as a **viable alternative combat action** compared to a standard weapon attack or cantrip. Spending **Spell Points (SP)** allows activating one of the spell's specific **Modes** (detailed in Section 5), which replaces the Basic Effect and unlocks further customization through **Enhancements**.

Default V (Verbal) and M (Focus) components are assumed unless S (Somatic) or costly M components are also required. If only simple verbalization and focus manipulation are needed, no component is listed beyond the default V/M. Damage types are determined by Essence. Durations listed for Basic Effects do not require Concentration unless specified.

1. **Adapt Self**
    - **Basic Effect:**
        - Casting Time: 1 Action | Range: Self | Components: S | Duration: 1 minute
        - Effect: Gain **one** minor physical adaptation: +5 feet to movement speed; OR gain advantage on Strength (Athletics) checks made to climb or swim; OR your unarmed strikes deal 1d4 + Strength modifier damage.

2. **Arcane Sight**
    - **Basic Effect:**
        - Casting Time: 1 Action | Range: Self (30ft) / 60 ft (Target) | Components: S | Duration: Instantaneous
        - Effect: Choose one:
            - **Detect:** Briefly sense the presence and general direction of active magic within 30 feet.

3. **Barrier**
    - **Basic Effect:**
        - Casting Time: 1 Action | Range: 30 ft | Components: S | Duration: 1 round
        - Effect: Create a visible 5-foot-by-5-foot plane of energy. It provides half cover (+2 AC, +2 Dex Saves). It has 5 hit points and collapses if destroyed or at the start of your next turn.

4. **Blast**
    - **Basic Effect:**
        - Casting Time: 1 Action | Range: Self (10-ft cone) | Duration: Instantaneous
        - Effect: Creatures in the cone make a Dexterity saving throw vs your Spell Save DC. Takes **1d8 damage** (Essence type) on a failed save, or half as much on a successful one.

5. **Bolt**
    - **Basic Effect:**
        - Casting Time: 1 Action | Range: 90 ft | Duration: Instantaneous
        - Effect: Make a ranged spell attack. On a hit, target takes **1d10 damage** (Essence type).

6. **Communicate**
    - **Basic Effect:**
        - Casting Time: 1 Action | Range: 120 ft | Components: S | Duration: Instantaneous
        - Effect: Send a one-way telepathic message (up to 10 words) to one creature you can see. It understands regardless of language. Target cannot reply via this effect.

7. **Conduit**
   - **Basic Effect:**
        - Casting Time: 1 Reaction (when an ally you can see within 60 ft makes an attack roll against a creature you can see)
        - Range: 60 ft | Components: V | Duration: Instantaneous
        - Effect: The triggering attack roll has advantage.

8. **Debilitate**
    - **Basic Effect:**
        - Casting Time: 1 Action | Range: 30 ft | Components: S | Duration: 1 round
        - Effect: Target one creature. It must make a Constitution saving throw vs your Spell Save DC. On a failed save, its speed is halved until the start of your next turn.

9. **Defend**
    - **Basic Effect:**
        - Casting Time: 1 Action | Range: Self | Components: S | Duration: 1 round
        - Effect: Gain resistance to **one** damage type: Bludgeoning, Piercing, OR Slashing, until the start of your next turn.

10. **Empower/Enfeeble**
    - **Basic Effect:**
        - Casting Time: 1 Action | Range: 30 ft | Components: S | Duration: 1 round
        - Effect: Target one creature. Choose Empower or Enfeeble:
            - **Empower:** Target gains a **+1d4 bonus** to EITHER its next Attack Roll OR Saving Throw made before the start of your next turn.
            - **Enfeeble:** Target makes a Wisdom saving throw vs your Spell Save DC. On fail, suffers a **-1d4 penalty** to EITHER its next Attack Roll OR Saving Throw made before the start of your next turn.

11. **Heal**
    - **Basic Effect:**
        - Casting Time: 1 Action | Range: Touch | Duration: Instantaneous
        - Effect: A creature you touch regains hit points equal to **1d4** + spellcasting ability modifier OR gains 1 HP if downed.

12. **Illusion**
    - **Basic Effect:**
        - Casting Time: 1 Action | Range: 30 ft | Components: S | Duration: 1 minute
        - Effect: Create a visual illusion of an object or creature (no larger than 5-foot cube) OR a simple sound effect. Physical interaction reveals visual illusions.

13. **Influence**
    - **Basic Effect:**
        - Casting Time: 1 Action | Range: 30 ft | Components: S | Duration: 1 round
        - Effect: Target one humanoid you can see. It must succeed on a Wisdom saving throw vs your Spell Save DC or have disadvantage on its next attack roll made against **you** before the start of your next turn.

14. **Manipulate**
    - **Basic Effect:**
        - Casting Time: 1 Action | Range: 30 ft | Components: S | Duration: 1 minute
        - Effect: Create a spectral hand. As part of the Action to cast this, OR as an Action on subsequent turns, move the hand up to 30 ft and cause it to perform one simple interaction (push/pull/manipulate object < 5 lbs, open unlocked container/door). Cannot attack or carry significant weight.

15. **Move**
    - **Basic Effect:**
        - Casting Time: Special (Part of your Move Action) | Range: Self | Components: S | Duration: Instantaneous
        - Effect: When you take the Move action or use any part of your movement speed on your turn, you can activate this effect. Choose one:
            - **Swift Stride:** Ignore difficult terrain for the remainder of your movement this turn.
            - **Safe Passage:** Your movement for the remainder of your turn does not provoke opportunity attacks.
            - **Acrobatic Step:** You can move through the space of hostile creatures (but cannot end your move there) for the remainder of your movement this turn.

16. **Strike**
    - **Basic Effect:**
        - Casting Time: 1 Action | Range: Self | Duration: Instantaneous
        - Effect: Make one weapon attack as part of this action. If the attack hits, it deals extra damage equal to your **Spellcasting Ability Modifier** (minimum 1) of your Essence type.

17. **Summon**
    - **Basic Effect:**
        - Casting Time: 1 Action | Range: 30 ft | Components: S | Duration: 1 minute
        - Effect: Summon a Tiny servant reflecting your Essence (AC 10, 1 HP, Speed 15ft fly/walk). It can use its **Action** to take the **Help** action, aiding an ally attacking a creature within 5 feet of it. It disappears if it drops to 0 HP or when the duration ends.

18. **Zone**
    - **Basic Effect:**
        - Casting Time: 1 Action | Range: 60 ft | Components: S | Duration: 1 round
        - Effect: Choose a point on a surface. Creates a 10-foot square area centered on that point. The area is **Difficult Terrain** until the start of your next turn.

---

## 4: Essences

### **4.1 Defining Essences**

**Essences** are the essential flavor and specific manifestation applied to a generic **Spell** when it is activated. They are the difference between a generic *Bolt* Spell and a scorching *Fire Bolt*, a crackling *Lightning Bolt*, or a debilitating *Necrotic Ray*. Essences bridge the gap between the abstract mechanical framework of a Spell and the evocative, descriptive magic seen in play. They provide:

- **Sensory Description:** How the Spell looks, sounds, smells, feels.
- **Thematic Grounding:** Connects the Spell to the caster's style (arcane formulas, divine prayers, primal calls, psionic focus).
- **Mechanical Hooks:** Determines damage type and provides links for potential status effects via **Enhancements**.

### **4.2 Choosing Essences**

Characters learn Essences based primarily on their chosen magical path and training.

- **Learning Essence Descriptors:** When a character first gains access to **Spells** (typically at 1st level or through multiclassing), they choose **two Essence Descriptors** (from the list in 4.5) that fit their character concept, subject to GM approval. Additional Descriptors might be learned through class features, feats, or specific training during downtime (GM permitting).
- **Descriptor Knowledge:** Knowing an Essence Descriptor (e.g., "Fire") means you can apply its theme, associated damage type, and minor effects to any Spell you activate where it makes narrative sense.

### **4.3 Applying Essences**

When activating a **Spell**, the caster chooses **one** known **Essence Descriptor** to apply. This choice primarily dictates the Spell's sensory details and damage type.

- **Flavor First:** The primary role of applying an Essence is descriptive. It determines *how* the Spell manifests. For example, applying a "Fire" Essence to the *Heal* Spell wouldn't cause burning damage; instead, it might manifest as warm, soothing flames that knit wounds closed, or a comforting heat that revitalizes the target. The Spell's core mechanical function (restoring Hit Points) remains unchanged.
- **Narrative Consistency:** While flexible, the chosen Essence should generally align with the Spell's intended effect. Applying an Essence whose fundamental nature contradicts the Spell's core function usually doesn't make sense. For example, describing a *Heal* Spell using the "Necrotic" Essence (associated with decay and undeath) would likely be inappropriate for restoring life energy to a living creature. The GM helps ensure descriptions remain coherent within the established fiction.
- **No Base Cost:** Applying a basic Essence Descriptor does not increase the **SP** cost of activating the Spell.

---

## Updated Rules Text (Sections 4.4 - 4.6)

### **4.4 Mechanical Impact of Essences**

While primarily descriptive, Essences have key mechanical implications:

- **Damage Type:** For Spells that deal damage, the chosen Essence Descriptor *becomes* the damage type (e.g., Fire damage, Cold damage, Life damage, Necrotic damage). Resistance and vulnerability function based on these Essence types. *(Optional Rule: For tables preferring standard 5e damage types, a mapping can be used where each Essence corresponds to a similar 5e type, like Life -> Radiant, Earth -> Bludgeoning, etc. This should be decided at the campaign start.*
- **Status Effect Association:** Base Essences do not automatically impose conditions. However, each Essence Descriptor is linked to a specific **composite status effect** (detailed in 4.5). These associations serve as hooks for **Enhancements** (Section 5), which may allow a caster to spend additional **SP** (typically +2 SP) to add the Essence's associated status effect to a Spell.
- **Minor Inherent Effects:** Essences provide minor, flavorful, non-combat effects related to their nature (e.g., Fire can ignite flammable objects, Cold can chill surfaces, Thunder is loud, Light illuminates). These should be used for descriptive color and minor narrative advantages, not significant mechanical benefits without specific **Enhancements**.
- **Skill Interactions:** The description of an Essence might occasionally grant circumstantial benefits relevant to skills (e.g., an *Illusion* Spell with a convincing "Shadow" Essence might aid Stealth). This is situational and adjudicated by the GM.
- **Component Interaction:** The default Verbal (V) and Focus (M) components required for Spells are generally unchanged by Essences.

---

### **4.5 Essence Descriptors**

These represent fundamental energy or substance types used to shape magical effects. Damage dealt by Spells uses the name of the applied Essence as its type (unless using the optional 5e mapping). Each is linked to a specific **composite status effect**, detailed below. Enhancements may allow applying these effects (typically requiring a saving throw from the target). Unless otherwise noted, an effect imposed by an Enhancement lasts until the start of the caster's next turn or requires Concentration as specified by the Enhancement. *Apply ONE Essence each time you cast a spell.  The Essence decides the spell’s damage type **and** inflicts the status shown below when you use a Status‑granting Enhancement.*

| # | Essence  | Status Name | What happens to the target? *(all last until start of your next turn unless noted)* |
|---|----------|-------------|--------------------------------------------------------------------------------------------------------------------|
| 1 | **Fire** | **Ignited** | • Disadvantage on all attack rolls  ⟡ Takes **double damage from Cold**  ⟡ Glows faintly (sheds dim light) |
| 2 | **Cold** | **Frozen** | • Speed drops to **5 ft**  ⟡ Takes **double damage from Fire**  ⟡ Disadvantage on **Athletics** checks |
| 3 | **Life** | **Overgrown** | • Speed drops to **5 ft**  ⟡ Attacks **against** the target have **advantage**  ⟡ Disadvantage on grapple/disarm attempts |
| 4 | **Necrotic** | **Withered** | • Disadvantage on all attack rolls  ⟡ Disadvantage on **Constitution saves**  ⟡ Disadvantage on **Strength** checks |
| 5 | **Light** | **Dazzled** | • Disadvantage on all attack rolls  ⟡ Disadvantage on **Wisdom saves**  ⟡ Cannot benefit from half or three‑quarters cover vs you |
| 6 | **Shadow** | **Shrouded** | • Armor Class −2  ⟡ Takes **extra damage = your Spell Mod** the **first time** it is hit each turn  ⟡ Disadvantage on sight‑based **Perception** |
| 7 | **Lightning** | **Conductive** | • Disadvantage on all attack rolls  ⟡ Takes **extra damage = your Spell Mod** the **first time** it is hit each turn  ⟡ Disadvantage on **Dexterity** checks |
| 8 | **Earth** | **Weighted** | • Armor Class −2  ⟡ Takes **extra damage = your Spell Mod** the **first time** it is hit each turn  ⟡ Disadvantage on grapple/disarm attempts |
| 9 | **Psychic** | **Scrambled** | • Disadvantage on **all saving throws**  ⟡ Speed −10 ft & disadvantage vs being pushed or knocked prone  ⟡ Disadvantage on **Insight** checks |
|10 | **Force** | **Unstable** | • Armor Class −2  ⟡ Attacks **against** the target have **advantage**  ⟡ When pushed or pulled, it moves **+5 ft** farther |
|11 | **Sound** | **Deafened** | • Disadvantage on **all saving throws**  ⟡ Attacks **against** the target have **advantage**  ⟡ Must pass **DC 10 Con** check to cast spells with a verbal component |
|12 | **Toxic** | **Enfeebled** | • Disadvantage on all attack rolls  ⟡ Disadvantage on **Constitution saves**  ⟡ Disadvantage on **Constitution** checks |

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

### **5.4.1 Adapt Self Enhancements**

> *Basic Effect Refresher: 0 SP, 1 Action, Self, 1 min. Minor physical adaptation: +5ft speed OR Adv Athletics climb/swim OR 1d4+Str unarmed strikes.*

- **Modes (Choose one when casting):**

  - **Mode: Focused Adaptation**
    - *Total Cost:* **2 SP**
    - *Effect:* Replaces the Basic Effect. Duration Concentration, up to 10 minutes. Choose **two** enhancements from the "General Enhancements" list below (marked with \*). The total SP cost of chosen enhancements is included in this Mode's base cost; apply their effects for the duration. *(Example: Choose Hard Skin (+1 AC) and Battle Mutation (+1d8 unarmed) for 2 SP total)*.

  - **Mode: Beast Shape**
    - *Total Cost:* **5 SP**
    - *Effect:* Replaces Basic Effect. Duration Conc. 10 minutes. You transform into a partial bestial form themed to your Essence. Gain:
      - Natural weapons dealing **1d8 + Spellcasting Ability Modifier** magical Essence damage.
      - +2 bonus to AC.
      - Gain a climb speed and a swim speed equal to your walking speed; can breathe underwater if relevant to form (GM discretion).
      - Advantage on checks and saves against being grappled or restrained.
      - Darkvision out to 60 ft and advantage on Wisdom (Perception) checks relying on hearing or smell.
    - *Limitations:* Cannot cast spells with verbal components or perform tasks requiring fine motor control unless the form allows (GM discretion).

  - **Mode: Elemental Body**
    - *Total Cost:* **5 SP**
    - *Effect:* Replaces Basic Effect. Duration Conc. 10 minutes. Your body partially transforms into your Essence type (e.g., fiery, icy, shadowy). Gain:
      - Resistance to the damage type matching your Essence.
      - Unarmed strikes deal **1d10** magical Essence damage.
      - Can move through spaces as narrow as 1 inch without squeezing.
      - Ignore non-magical difficult terrain.
      - When hit by a melee attack from within 5 feet, the attacker takes damage equal to your Spellcasting Ability Modifier (min 1) of your Essence type.
    - *Limitations:* May have minor environmental interactions (ignite flammable, freeze water, dim light) based on Essence (GM discretion). May appear obviously magical.

- **General Enhancements (Add SP cost to your chosen Mode's cost, unless used via Focused Adaptation\*):**
  - *Battle Mutation\*:* **+1 SP** Your natural weapons (or unarmed strikes if form doesn't grant them) deal **1d8** magical Essence damage
  - *Hard Skin\*:* **+1 SP** You gain a +1 bonus to AC. (Can apply multiple times, max +2 total bonus from this enhancement).
  - *Share Adaptation:* **+2 SP** Range becomes Touch. One willing creature gains the chosen Mode’s effects instead of you. (Cannot target self).
  - *Enhanced Mobility\*:* **+1 SP** You gain both a climb speed and a swim speed equal to your walking speed; you can breathe air and water.
  - *Heightened Senses\*:* **+1 SP** You gain darkvision out to 60 ft; you gain advantage on Wisdom (Perception) checks.
  - *Sustained Form:* **+1 SP per step.** Increases the Concentration duration step (10 min -> 1 hour -> 8 hours).
  - *Illusory Guise:* **+2 SP** You change your appearance (visual only, no mechanical changes beyond appearance). Gain advantage on Charisma (Deception) checks made to maintain the disguise. Duration 1 hour, no Concentration. *(Can be added to Modes or cast alone for 2 SP.*
  - *Growth:* **+2 SP** Your size becomes Large (if Medium or smaller). Gain Adv on Strength checks/saves, +5 ft reach, weapon/unarmed attacks deal +1d4 damage.
  - *Shrink:* **+2 SP** Your size becomes Small (if Medium or larger). Gain Adv on Dexterity checks/saves & Stealth checks, +1 bonus to AC & attack rolls.
  - *Inherent Form:* **+2 SP** Removes the need for Concentration.

---

### **5.4.2 Arcane Sight Enhancements (NEW - Replaces Sense & Negate)**

> *Basic Effect Refresher: 0 SP, 1 Action, Self (30ft), Instantaneous. Briefly sense presence/direction of active magic OR make check DC 10 to suppress lowest-level magic effect on target until start of your next turn*

- **Modes (Choose one when casting):**

  - **Mode: Detect Magic**
    - *Total Cost:* **2 SP**
    - *Effect:* Replaces Basic Effect. Casting Time 1 Action, Range Self (30-ft radius), Duration **Concentration up to 10 minutes**. You sense the presence and location of magical effects, active magic items, and areas of strong magical residue within range. As an Action, you can focus on one visible creature or object to see a faint aura revealing if it's magical and, if so, the school of magic involved (if any). This sense penetrates thin barriers (1 ft wood/dirt, 1 inch metal). **Ritual Tag.**
    - **Unique Enhancements for this Mode:**
      - *Identify Properties:* **+1 SP** Change Casting Time to 1 minute (touching one item), Duration Instantaneous. Learn the properties, functions, activation method, and charges (if any) of that magic item. (Total cost 3 SP).
      - *Power Analysis:* **+1 SP** When focusing on an aura, gain a general sense of power (Low: 1-3 SP cost, Medium: 4-6 SP, High: 7+ SP). (Total cost 3 SP+).
      - *See Ethereal:* **+2 SP** While concentrating, see creatures/objects on the Ethereal Plane within range. (Total cost 4 SP+).
      - *Penetrating Vision:* **+1 SP** The detection ignores an additional 1 foot of stone, 1 inch of metal, or 3 feet of wood/dirt. (Can apply multiple times).

  - **Mode: Dispel Magic**
    - *Total Cost:* **4 SP**
    - *Effect:* Replaces Basic Effect. Casting Time 1 Action, Range 120 ft, Duration Instantaneous. Choose one creature, object, or magical effect. Any spell effect on the target created with a total SP cost of **3 SP or less** ends. For effects of **4 SP or more**, make a spellcasting ability check (DC 10 + [Total SP cost / 2, rounded down]). On success, the spell effect ends.
    - **Unique Enhancements for this Mode:**
      - *Targeted Dispel:* **+1 SP** Choose which specific spell effect to target first if multiple are present. (Total cost 5 SP+).
      - *Area Dispel:* **+3 SP** Affects a 10-foot-radius sphere. Attempt to dispel *one* effect (lowest SP or targeted) on each creature/object within. Roll checks separately. (Total cost 7 SP+).
      - *Lingering Suppression:* **+1 SP** If your check fails, the target spell effect is suppressed (inactive) until the end of **your** next turn. (Total cost 5 SP+).

  - **Mode: Counterspell**
    - *Total Cost:* **4 SP**
    - *Effect:* Replaces Basic Effect. Casting Time **Reaction** (when you see a creature within 60 feet casting a spell), Range 60 ft, Duration Instantaneous. Interrupt the spell if its total SP cost is **3 SP or less**. If **4 SP or more**, make a spellcasting ability check (DC 10 + [Total SP cost / 2, rounded down]). On success, the spell fails.
    - **Unique Enhancements for this Mode:**
      - *Extended Counter Range:* **+1 SP** Increases range to 120 feet. (Total cost 5 SP+).

- **General Enhancements (Add SP cost to applicable Mode's cost):**
  - *Suppress:*  **+1 SP**  Target one creature, object, or magical effect within 60 ft. Make a spellcasting ability check vs DC 10. On success, suppress the lowest-SP cost magical effect on the target until the start of your next turn.
  - *Increase Range/Radius:* **+1 SP** Doubles the range or radius of the chosen Mode's effect. (Can apply multiple times). *(Applies to Detect radius, Dispel/Counter initial range.*
  - *Greater Negation:* **+2 SP** Increases the automatic dispel/counter threshold by **+2 SP** (e.g., base 3 SP becomes 5 SP). (Can apply multiple times). *(Applies to Dispel/Counter Modes)*.
  - *Adept Negation:* **+2 SP** Gain advantage on the spellcasting ability check to dispel or counter spells above the threshold. *(Applies to Dispel/Counter Modes)*.
  - *Dispel Feedback:* **+2 SP** If you successfully end or counter a spell, the original caster takes psychic damage = **1d6 per 2 full SP** of the negated spell's cost. *(Applies to Dispel/Counter Modes)*.
  - *Sustain Detection:* **+1 SP per step.** (Detect Magic Mode only). Increases Concentration duration (10 min -> 1 hour -> 8 hours).
  - *Persistent Detection:* **+3 SP** (Detect Magic Mode only, requires *Sustain Detection* reaching 1 hour). Duration becomes 8 hours, no Concentration.

---

### **5.4.3 Barrier Enhancements**

> *Basic Effect Refresher: 0 SP, 1 Action, 30 ft range, 1 round. 5x5 plane, half cover (+2 AC/+2 Dex), 5 HP.*

- **Modes (Choose one when casting):**

  - **Mode: Standard Barrier**
    - *Total Cost:* **3 SP**
    - *Effect:* Replaces the Basic Effect. Range 60 ft, Duration Conc. 10 min. Creates a flat, vertical, opaque barrier (up to 10x10 ft plane OR 5-ft radius sphere/hemisphere) providing total cover. AC 10, HP 15. Collapses at 0 HP. Anchored where created.

  - **Mode: Shaped Barrier**
    - *Total Cost:* **4 SP** (simple shapes) or **5 SP** (complex shapes like bridges, boxes)
    - *Effect:* As Standard Barrier, but allows creating specific forms within overall size limits (e.g., a 10x10x10 ft cube or a 30 ft long, 5 ft wide bridge). Anchored.

  - **Mode: Mobile Barrier**
    - *Total Cost:* **5 SP**
    - *Effect:* As Standard Barrier, but while concentrating, you can use your Action to move the barrier up to 20 ft to a new location within range.

- **General Enhancements (Add SP cost to your chosen Mode's cost):**
  - *Fortify Barrier:* **+1 SP** Increases the barrier's AC by +1 and its Hit Points by +10. (Can apply multiple times).
  - *Resilient Barrier:* **+1 SP** Barrier gains resistance to one damage type chosen when learned (often matching Essence).
  - *Expand Barrier:* **+1 SP** Increases size (Plane: +5 ft height & width; Sphere/Hemisphere: +5 ft radius; Shaped: equivalent volume increase). (Can apply multiple times).
  - *Sustain Barrier:* **+1 SP per step.** Increases the Concentration duration step (10 min -> 1 hour -> 8 hours).
  - *Damaging Barrier:* **+2 SP** Creatures ending their turn adjacent to the barrier or moving through its space (if possible) take **1d8 damage** of your Essence type.
  - *Obscuring Barrier:* **+1 SP** Barrier heavily obscures vision through it (if not already opaque).
  - *One-Way Visibility:* **+2 SP** Choose one side when casting; creatures on that side can see and target through the barrier as if it were transparent, while those on the other side cannot.
  - *Persistent Barrier:* **+2 SP** Requires no Concentration.

---

### **5.4.4 Blast Enhancements**

> *Basic Effect Refresher: 0 SP, 1 Action, Self (10-ft cone). Dex save vs 1d8 Essence damage, half on success.*

- **Modes (Choose one when casting):**

  - **Mode: Cone Blast**
    - *Total Cost:* **2 SP**
    - *Effect:* Replaces Basic Effect. 15-foot cone from self. Dex save vs **2d8 damage** (Essence type), half on success.
    - **Unique Enhancements for this Mode:**
      - *Mega Cone:* **+2 SP** (Increases cone length to **30 feet**).

  - **Mode: Orb Blast**
    - *Total Cost:* **2 SP**
    - *Effect:* Replaces Basic Effect. 5-foot radius sphere centered on point within 60 ft. Dex save vs **2d8 damage** (Essence type), half on success.
    - **Unique Enhancements for this Mode:**
      - *Large Orb:* **+1 SP** Increases radius to **10 feet**.
      - *Mega Orb:* **+3 SP**  Increases radius to **15 feet**.

  - **Mode: Lancing Blast**
    - *Total Cost:* **2 SP**
    - *Effect:* Replaces Basic Effect. Line 15 ft long, 5 ft wide from self OR centered on point within 60 ft. Dex save vs **2d8 damage** (Essence type), half on success. Line persists until start of your next turn; creatures entering or ending turn in line repeat save vs **1d8 damage**.
    - **Unique Enhancements for this Mode:**
      - *Piercing Lance:* **+1 SP** Increases line length to **30 feet**.
      - *Twin Lance:* **+2 SP** Create two separate Lancing Blasts with this casting.

- **General Enhancements (Add SP cost to your chosen Mode's cost):**
  - *Amplify Blast:* **+1 SP** Increases the initial damage dice by **+1d8**. (Can apply multiple times).
  - *Forceful Blast:* **+1 SP** Creatures failing the initial save are pushed 10 ft away from the origin/center.
  - *Penetrating Blast:* **+2 SP** The blast's damage ignores resistance to its damage type.
  - *Debilitating Blast:* **+1/2/3 SP** (Cost depends on Essence's linked B-Tier status). Creatures failing the initial save suffer the status effect until the end of **your** next turn.
  - *Environmental Impact:* **+1 SP** The area affected by the initial blast becomes difficult terrain until the start of your next turn.
  - *Change Save (Physical):* **+1 SP** Changes the required saving throw from Dexterity to Strength or Constitution (choose when learning).
  - *Change Save (Mental):* **+2 SP** Changes the required saving throw from Dexterity to Wisdom or Intelligence (choose when learning).
  - *Selective Blast:* **+3 SP** Choose creatures in the initial area; they are unaffected by the initial blast. (Does not affect Lancing Blast's lingering effect).

---

### **5.4.5 Bolt Enhancements**

> *Basic Effect Refresher: 0 SP, 1 Action, 60 ft range. Ranged spell attack, 1d10 damage.*

- **Modes (Choose one when casting):**

  - **Mode: Standard Bolt**
    - *Total Cost:* **2 SP**
    - *Effect:* Replaces Basic Effect. Range **60 ft**. Make a ranged spell attack against one target. On a hit, the target takes **3d8 damage** of your Essence type.
    - **Unique Enhancements for this Mode:**
      - *Accurate Bolt:* **+1 SP** Gain Advantage on the ranged spell attack roll. *(Cannot be combined with Seeking Bolt Enhancement)*.
      - *Chain Bolt:* **+2 SP** On hit, the bolt leaps to a second target within 15 ft, making a new attack roll against the second target. If that hits, it deals half the original damage (rounded down). (Can apply multiple times, +2 SP per additional chain target, each dealing half the damage of the previous link). *(Cannot be combined with Seeking Bolt Enhancement)*.
      - *Seeking Bolt Enhancement:* **+1 SP** Change the spell from an attack roll to a saving throw. Target one creature within range. The target must make a Dexterity saving throw. On a failed save, it takes the spell's damage (3d8 base), or half as much damage on a successful one. *(If chosen, Accurate Bolt and Chain Bolt cannot be applied)*. (Total cost 3 SP).
        - *Change Save (Physical):* **+1 SP** (Requires Seeking Bolt Enhancement). Changes the required save to Strength or Constitution.
        - *Change Save (Mental):* **+1 SP** (Requires Seeking Bolt Enhancement). Changes the required save to Wisdom, Intelligence, or Charisma.

  - **Mode: Area Bolt**
    - *Total Cost:* **3 SP**
    - *Effect:* Replaces Basic Effect. Range **60 ft**. Choose a point within range. A **5-foot radius sphere** erupts. Creatures within the sphere must make a Dexterity saving throw. On a failed save, they take **3d8 damage** of your Essence type, or half as much damage on a successful one.
    - **Unique Enhancements for this Mode:**
      - *Expand Area Bolt:* **+1 SP** Increases the radius of the sphere by **+5 feet**. (Can apply multiple times).

  - **Mode: Channeled Bolt**
    - *Total Cost:* **3 SP**
    - *Effect:* Replaces Basic Effect. Range **60 ft**, Duration **Concentration up to 1 minute**. Choose one delivery method:
      - **Attack Channel:** Make a ranged spell attack vs one target. Hit: **2d8 damage** (Essence type) and the channel begins.
      - **Save Channel:** Target one creature makes Dex save. Fail: **2d8 damage** (Essence type) and channel begins. Success: Half damage, no channel.
    - **Channel Effect:** On each subsequent turn, you can use your **Action** to re-cast the spell to deal **2d8** Essence damage to the channeled target (requires target to be visible and within range).
    - **Unique Enhancements for this Mode:**
      - *Increase Initial Damage:* **+1 SP** Increases initial damage by **+1d8**. (Can apply multiple times).
      - *Increase Channel Damage:* **+2 SP** Increases subsequent damage by **+1d8**. (Can apply multiple times).
      - *Tenacious Channel:* **+2 SP** Concentration is not broken if you use your Action to cast a non-attack spell or take an action other than Attack.

- **General Enhancements (Add SP cost to your chosen Mode's cost):**
  - *More Damage:* **+1 SP** Increases the initial damage dice of the chosen Mode by **+1d8**. (Can apply multiple times).
  - *Forceful Bolt:* **+1 SP** On hit (Standard) or failed save (Area/Seeking Enhancement/Channeled Bolt initial save), the primary target is pushed 10 feet directly away from you or the center of the area.
  - *Penetrating Bolt:* **+2 SP** The spell's damage ignores resistance to its damage type.
  - *Debilitating Bolt:* **+2 SP** On hit (Standard) or failed initial save (Area/Seeking Enhancement/Channeled Bolt initial save), the primary target must make a Constitution saving throw vs your Spell Save DC or suffer the Essence's status until the start of **your** next turn. *(Note: Separate from Debilitating Channel enhancement)*.
  - *Increase Range:* **+1 SP** Doubles the range of the spell. (Can apply multiple times).

---

### **5.4.6 Communicate Enhancements**

> *Basic Effect Refresher: 0 SP, 1 Action, 60ft range. Send one-way, 10-word telepathic message, bypasses language, no reply.*

- **Modes (Choose one when casting):**

  - **Mode: Direct Link**
    - *Total Cost:* **2 SP**
    - *Effect:* Replaces the Basic Effect. Casting Time 1 Action, Range 60 ft, Duration **Concentration up to 1 minute**. Initiate a **two-way telepathic conversation** with one creature (willing or unwilling; Int save if unwilling to receive initial contact). Bypasses language barriers. Exchange thoughts freely.
    - **Unique Enhancements for this Mode:**
      - *Mental Projection:* **+1 SP** Instead of words, transmit a clear mental image, sound, or basic sensory impression once per round as part of the link. (Int save still applies if unwilling target).
      - *Mind Fracture:* **+2 SP** (Target must be concentrating). When initiating the link (or as an Action while linked), force the target to make a Concentration save (DC 10 + Your Spell Mod). Failure breaks concentration.
      - *Share Link:* **+1 SP per additional target.** Add another creature within 30 ft of primary target to the two-way conversation.
      - *Encrypt Link:* **+1 SP** Link resists interception (Int check vs Spell Save DC).
      - *Emotional Hue:* **+1 SP** Imbue the communication with a simple, strong emotion (calm, fear, joy, etc.).

  - **Mode: Sensory Scry**
    - *Total Cost:* **3 SP**
    - *Effect:* Replaces the Basic Effect. Casting Time 1 Action, Range Touch, Duration **Concentration up to 10 minutes**. Choose one:
      - **Link Senses:** Target one willing creature. Use Action to perceive through their visual/auditory senses (gain special senses). Blind/deaf to own senses while doing so.
      - **Read Object Imprint:** Target one non-magical object. Gain vague psychic impressions of last significant user (emotion, appearance) and recent strong emotional events tied to it. Requires Int (Investigation) check vs GM DC (10-20).
    - **Unique Enhancements for this Mode:**
      - *Ranged Scry:* **+1 SP** Increase initial Range to 30 ft.
      - *Share Senses:* **+2 SP** (Link Senses only). Target one additional willing creature. Use Action to switch between targets.
      - *Two-Way Senses:* **+2 SP** (Link Senses only). Target(s) can use their Action to perceive through your senses.
      - *Deepen Imprint Reading:* **+1 SP** (Read Imprint only). Gain clearer images/sounds. Advantage on Investigation check.

  - **Mode: Universal Channel**
    - *Total Cost:* **1 SP**
    - *Effect:* Replaces the Basic Effect. Casting Time 1 Action, Range Self, Duration **1 hour (no Concentration)**. Understand literal meaning of any spoken language heard.
    - **Unique Enhancements for this Mode:**
      - *Written Word:* **+0 SP** Also understand written language touched (~1 min/page).
      - *Speak to Beasts:* **+1 SP** Also comprehend and verbally communicate simple ideas with Beasts.
      - *Gift of Tongues:* **+2 SP** Range becomes Touch. Target (can be self) can also be understood by any creature with a language.
      - *Swap Effect: Broadcast:* **+2 SP** Change effect: Range Self (30ft radius) OR Point within 60ft (30ft radius). Send one-way, 25-word telepathic message to chosen creatures in radius, bypassing language. Instantaneous.
      - *Swap Effect: Relay Network:* **+2 SP** Change effect: Range 120 ft. Link up to 3 willing creatures (can include self) for 10 mins (no Conc.). Linked members can send 10-word telepathic messages to each other once per round (no action).
      - *Extended Understanding:* **+1 SP per step.** (Requires Comprehend Languages, Written Word, or Speak to Beasts). Increase non-Concentration duration step (1 hour -> 8 hours).

- **General Enhancements (Add SP cost to applicable Mode's cost):**
  - *Increase Range:* **+1 SP** Doubles the initial range of the Mode (where applicable).
  - *Subtle Casting:* **+1 SP** Cast without Verbal or Somatic components.
  - *Non-Visual Targeting:* **+1 SP** Target known creature within range even if unseen.
  - *Planar Communication:* **+5 SP** (Direct Link, Broadcast, Relay only). Range becomes Planar.
  - *Sustain Link/Scry:* **+1 SP per step.** (Direct Link / Sensory Scry only). Increases Concentration duration step (1 min -> 10 min -> 1 hour).
  - *Persistent Link/Scry:* **+2 SP** No longer requires Concentration.

---

### **5.4.7 Conduit Enhancements**

> *Basic Effect Refresher: 0 SP, reaction, 60ft, 1 round. When an ally within 60 ft declares an attack against a creature you can see, the triggering attack roll has advantage.*

- **Modes (Choose one when casting):**

  - **Mode: Target Vulnerability**
    - *Total Cost:* **2 SP**
    - *Effect:* Replaces Basic Effect. Casting Time 1 Action, Range 60 ft, Duration **Concentration up to 1 minute**. Target one creature. Choose one of your known Essences. The target becomes vulnerable to the damage type associated with that Essence (takes 50% additional damage from that type). Target makes a Constitution saving throw at the end of each of its turns, ending the effect on a success.
    - **Unique Enhancements for this Mode:**
      - *Lingering Vulnerability:* **+1 SP** If the target succeeds on its saving throw, the vulnerability persists until the *end* of its next turn instead of ending immediately.
      - *Deepen Vulnerability:* **+2 SP** The target has disadvantage on its saving throws to end this effect.

  - **Mode: Collaborative Strike**
    - *Total Cost:* **3 SP**
    - *Effect:* Replaces Basic Effect. Casting Time 1 Action, Range 60 ft, Duration **Concentration up to 1 minute**. Target one creature. The first time each turn that an **ally** hits the target with an attack, that attack deals an additional **1d8** damage of your Essence type.
    - **Unique Enhancements for this Mode:**
      - *Amplify Collaboration:* **+1 SP** Increases the bonus damage dealt by allies by **+1d8**. (Can apply multiple times).
      - *Personal Strike:* **+1 SP** Your own attacks can also trigger the bonus damage (once per turn total, shared between you and allies).

  - **Mode: Resonance Field**
    - *Total Cost:* **4 SP**
    - *Effect:* Replaces Basic Effect. Casting Time 1 Action, Range 60 ft, Duration **Concentration up to 1 minute**. Choose up to three creatures within range. When any marked target takes damage from an attack or spell, all other marked targets within 30 feet of it take damage equal to your **Spellcasting Ability Modifier** (min 1) of the same damage type.
    - **Unique Enhancements for this Mode:**
      - *Harmonic Resonance:* **+2 SP** Increase the resonance damage from Spell Mod to **1d8**.
      - *Expanded Field:* **+1 SP per additional target.** Increase the number of initial targets.

- **General Enhancements (Add SP cost to applicable Mode's cost):**
  - *Weakening Conduit:* **+2 SP** Marked target(s) have disadvantage on saving throws against spells that deal damage of the same type as your applied Essence.
  - *Conductive Burst:* **+2 SP** If a target marked by any Mode is reduced to 0 HP, it explodes. Creatures within 10 feet make Dex save vs Spell Save DC, taking 2d8 Essence damage on fail, half on success.
  - *Shared Sight:* **+1 SP** While a creature is marked by any Mode, you and all allies within 60 feet of you can see the marked target's location as a faint outline, even if it is invisible or heavily obscured (but not through total cover).
  - *Increase Range:* **+1 SP** Doubles the initial range of the spell. (Can apply multiple times).
  - *Sustain Conduit:* **+1 SP per step.** Increases the Concentration duration step (1 min -> 10 min -> 1 hour).
  - *Persistent Conduit:* **+3 SP** (Requires *Sustain Conduit* learned reaching 1 hour). Duration becomes 8 hours, no Concentration.

---

### **5.4.8 Debilitate Enhancements**

> *Basic Effect Refresher: 0 SP, 1 Action, 30 ft range, 1 round. Target makes Con save vs speed halved.*

- **Modes (Choose one when casting):**

  - **Mode: Single Target Affliction**
    - *Total Cost:* **2 SP**
    - *Effect:* Replaces Basic Effect. Range 60 ft, Duration **Concentration, up to 1 minute**. Target one creature makes a saving throw (Wisdom by default). On a failed save, the target suffers an effect based on your applied Essence (Ignited, Chilled, Weakened, etc.) until the end of the duration. The target can repeat the saving throw at the end of each of its turns, ending the effect on a success.
  - **Unique Enhancements for this Mode:**
    - *Overwhelming Affliction:* **+1 SP** Target has disadvantage on the initial save.
    - *Lingering Effect:* **+1 SP** If the target succeeds on its save to end the effect, it remains affected until the end of its next turn.
    - *Shared Affliction:* **+2 SP** Target an additional creature within 30 ft of the primary target, who also makes a saving throw against the same effect.
    - *Extreme Affliction:* **+3 SP** Target becomes stunned instead of having the status effect applied.

- **Mode: Area Affliction**
  - *Total Cost:* **3 SP**
  - *Effect:* Replaces Basic Effect. Range 60 ft, Duration **1 round**. Create a 15-foot cube. Creatures within make a saving throw (Wisdom by default). On a failed save, targets suffer an effect based on your applied Essence (Ignited, Chilled, Weakened, etc.) until the end of your next turn.
  - **Unique Enhancements for this Mode:**
    - *Expand Area:* **+1 SP per +5ft side length.** Increases the cube's size.
    - *Increased Duration:* **+2 SP** The effect lasts for **Concentration, up to 1 minute**. Affected creatures repeat the save at the end of their turns, ending the effect on themselves on a success. *(Clarified duration)*

- **General Enhancements (Add SP cost to applicable Mode's cost):**
  - *Change Save:* **+1 SP** Change the saving throw to Strength, Constitution, Intelligence, or Charisma (choose when learned).
  - *Greater Affliction:* **+2 SP** The target becomes incapacitated, instead of having the status effect applied.

---

### **5.4.9 Defend Enhancements**

> *Basic Effect Refresher: 0 SP, 1 Action, Self, 1 round. Resistance to Bludgeoning, Piercing, OR Slashing.*

- **Modes (Choose one when casting):**

  - **Mode: Essence Ward**
    - *Total Cost:* **2 SP**
    - *Casting Time:* 1 Action | *Range:* Self | *Duration:* **Concentration up to 1 minute**
    - *Effect:* Replaces Basic Effect resistance type. Gain resistance to the damage type determined by the applied **Essence**.
    - **Unique Enhancements for this Mode:**
      - *Bolstering Defense:* **+1 SP** Gain Temporary HP = 5 + Spell Mod when cast.
      - *Share Defense:* **+2 SP** Range becomes Touch, affects one willing creature instead.
      - *Aura of Defense:* **+3 SP** Range Self (10-ft aura). You and allies starting turn in aura gain the resistance.
      - *Invulnerability:* **+3 SP** Resistance becomes Immunity. (Total cost 5 SP+).
      - *Reactive Retort:* **+2 SP** When target takes resisted damage from attacker within 30ft, attacker takes Spell Mod damage [Essence type].

  - **Mode: Reactive Shield**
    - *Total Cost:* **3 SP**
    - *Casting Time:* Reaction (when hit by attack) | *Range:* Self | *Duration:* 1 round
    - *Effect:* Replaces Basic Effect. Gain **+5 bonus to AC** against the triggering attack and until the start of your next turn.
    - **Unique Enhancements for this Mode:**
      - *Shield Other:* **+2 SP** Range becomes Touch. Use reaction when ally within 5 ft is hit; grant them the AC bonus instead. (Total cost 5 SP).
      - *Deflecting Shield:* **+1 SP** If the triggering attack misses due to the AC bonus, the attacker takes 1d8 Force/Essence damage. (Total cost 4 SP+).

  - **Mode: Enduring Armor**
    - *Total Cost:* **0 SP**
    - *Casting Time:* 10 Minutes (Ritual) | *Range:* Self | *Duration:* 8 hours
    - *Effect:* Replaces Basic Effect. Your base AC becomes **13 + your Dexterity modifier**. No Concentration.
    - **Unique Enhancements for this Mode:**
      - *Armour Other:* **+2 SP** Target becomes one willing creature touched instead of Self.
      - *Greater Armor:* **+2 SP** The AC formula becomes 14 + Dex Mod. (Total cost 2 SP+). Requires separate learning.

- **General Enhancements (Add SP cost to applicable Mode's cost):**
  - *Sustain Ward:* **+1 SP per step.** (Essence Ward only). Increases Concentration duration step (1 min -> 10 min -> 1 hour).
  - *Persistent Ward:* **+3 SP** (Essence Ward only, requires *Sustain Ward* learned reaching 1 hour). Duration becomes 8 hours, no Concentration.

---

### **5.4.10 Empower/Enfeeble Enhancements**

> *Basic Effect Refresher: 0 SP, 1 Action, 30 ft range, 1 round. Target gets +1d4 OR makes Wis save vs -1d4 to ONE attack roll OR saving throw.*

- **Modes (Choose one when casting):**

  - **Mode: Greater Empowerment**
    - *Total Cost:* **2 SP**
    - *Effect:* Replaces Basic Effect. Target one creature. Duration **Conc. 1 min**. Target gains **+1d4 bonus** to all attack rolls, saving throws, and ability checks.
    - **Unique Enhancements for this Mode:**
      - *Shared Empowerment:* **+1 SP per additional target.** Target additional creatures within 30 ft.

  - **Mode: Greater Enfeeblement**
    - *Total Cost:* **2 SP**
    - *Effect:* Replaces Basic Effect. Target one creature. Duration **Conc. 1 min**. Target makes **Wisdom save**. Fail: **-1d4 penalty** to all attack rolls, saving throws, and ability checks. Repeats save at end of turns.
    - **Unique Enhancements for this Mode:**
      - *Shared Enfeeblement:* **+2 SP per additional target.** Target additional creatures within 30 ft.
      - *Overwhelming Enfeeblement:* **+1 SP** Target has disadvantage on the initial Wisdom save.
      - *Change Save (Physical):* **+1 SP** (Change save to Strength or Constitution).
      - *Change Save (Mental):* **+1 SP** (Change save to Intelligence or Charisma).

  - **Mode: Reactive Interference**
    - *Total Cost:* **3 SP**
    - *Effect:* Replaces Basic Effect. Cast as Reaction (target within 60 ft succeeds on attack/save/check). Target rerolls d20, uses lower result. Instantaneous.

  - **Mode: Reactive Fortune**
    - *Total Cost:* **3 SP**
    - *Effect:* Replaces Basic Effect. Cast as Reaction (you/ally within 60 ft fails attack/save/check OR is hit by attack). Target rerolls d20, potentially changing outcome (uses higher for fail, lower for hit vs AC). Instantaneous. *(Revised for more direct impact)*.

- **General Enhancements (Add SP cost to applicable Mode's cost):**
  - *Greater Die:* **+2 SP** Increases the d4 bonus/penalty to a **d6**. (Applies to Empower/Enfeeble modes).
  - *Sustain Effect:* **+1 SP per step.** Increases Concentration duration step (1 min -> 10 min -> 1 hour). (Applies to Empower/Enfeeble modes).
  - *Persistent Effect:* **+3 SP** (Requires *Sustain Effect* learned reaching 1 hour). Increases duration to 1 hour and removes Concentration.

---

### **5.4.11 Heal Enhancements**

> *Basic Effect Refresher: 0 SP, 1 Action, Touch. Target regains **1d4** + spellcasting ability modifier hit points OR becomes stabilized if dying.*

- **Modes (Choose one when casting):**

  - **Mode: Standard Heal**
    - *Total Cost:* **2 SP**
    - *Casting Time:* 1 Action | *Range:* Touch | *Duration:* Instantaneous
    - *Effect:* Replaces Basic Effect healing. Target creature regains **2d8 + Spellcasting Ability Modifier** hit points.
    - **Unique Enhancements for this Mode:**
      - *Distant Heal:* **+1 SP** Range becomes 60 feet.
      - *Shared Heal:* **+2 SP per additional target.** Target additional willing creatures you can see within 30 ft of the original target. The healing amount is rolled once and applied to each target.

  - **Mode: Area Heal**
    - *Total Cost:* **5 SP**
    - *Casting Time:* 1 Action | *Range:* 60 ft | *Duration:* Instantaneous
    - *Effect:* Replaces Basic Effect healing. Create a 10-foot radius sphere centered on a point within range. Choose up to 6 willing creatures within the sphere. Each target regains **2d8 + Spellcasting Ability Modifier** hit points.
    - **Unique Enhancements for this Mode:**
      - *Expand Area:* **+1 SP per +5ft radius.** Increase the sphere's radius.
      - *Increase Targets:* **+1 SP per +2 targets.** Increase the number of creatures you can choose within the area.

  - **Mode: Restorative Heal**
    - *Total Cost:* **3 SP**
    - *Casting Time:* 1 Action | *Range:* Touch | *Duration:* Instantaneous
    - *Effect:* Replaces Basic Effect healing. Target creature regains **1d8 + Spellcasting Ability Modifier** hit points AND you end **one** disease OR **one** condition affecting it chosen from: Blinded, Deafened, Paralyzed, Poisoned.
    - **Unique Enhancements for this Mode:**
      - *Greater Restoration:* **+2 SP** You can instead end **one** effect chosen from: Curse, Petrification, Charmed, Frightened, OR reduce exhaustion by one level, OR remove one reduction to an ability score or hit point maximum. (Total cost 5 SP).

- **General Enhancements (Add SP cost to applicable Mode's cost):**
  - *More Healing:* **+1 SP**
    - *Effect:* Increases healing dice by **+1d8**. (Applies to Standard, Area, or Restorative healing amount). (Can apply multiple times).
  - *Revivify:* **+5 SP**
    - *Effect:* (Applies to Standard Heal or Restorative Heal modes). Changes target to a creature that has died within the last minute. That creature returns to life with 1 hit point. This spell can't return to life a creature that has died of old age, nor can it restore any missing body parts. (High cost reflects Level 3 spell equivalent).

---

### **5.4.12 Illusion Enhancements**

> *Basic Effect Refresher: 0 SP, 1 Action, 30ft range, 1 min. Basic visual OR sound illusion, like Minor Illusion.*

- **Modes (Choose one when casting):**

  - **Mode: Sensory Illusion**
    - *Total Cost:* **2 SP**
    - *Effect:* Replaces the Basic Effect. Casting Time 1 Action, Range 60 ft, Duration **Concentration up to 1 minute**. Create EITHER the image of an object/creature/phenomenon (no larger than 15-foot cube) OR a sound effect (whisper to scream). Physical interaction reveals visual illusions; creatures using an Action can make Int (Investigation) check vs Spell Save DC to discern illusion.
    - **Unique Enhancements for this Mode:**
      - *Combine Senses:* **+1 SP** Create both image and sound simultaneously.
      - *Add Minor Senses:* **+1 SP** (Requires *Combine Senses* or illusion with image+sound). Add minor thermal, tactile, or olfactory elements. Superficial only.
      - *Animate Illusion:* **+1 SP** (Requires image). Free action. Move an existing image within range; can interact crudely (open unlocked door).
      - *Expand Illusion:* **+1 SP per +5ft cube size.** Increase maximum size.
      - *Improve Believability:* **+2 SP** Creatures have disadvantage on the Investigation check.

  - **Mode: Personal Illusion**
    - *Total Cost:* **3 SP**
    - *Effect:* Replaces the Basic Effect. Casting Time 1 Action, Range Self, Duration **Concentration up to 1 minute**. Choose **one** effect:
      - **Disguise Self:** Change your appearance (as *Disguise Self* spell, visual only). Duration becomes 1 hour, no Concentration. Int (Investigation) check vs Spell Save DC reveals illusion on physical interaction/close inspection.
      - **Blurring Form:** Your body blurs. Creatures have disadvantage on attack rolls against you unless they don't rely on sight.
      - **Illusory Duplicates:** Create three illusory duplicates (as *Mirror Image* spell). Duration becomes 1 minute, no Concentration.
    - **Unique Enhancements for this Mode:**
      - *Share Disguise/Blur:* **+2 SP** (Disguise or Blur only). Range becomes Touch, affect one willing creature instead.
      - *Sustain Blur:* **+1 SP per step.** (Blur only). Increases Concentration duration (1 min -> 10 min -> 1 hour).

  - **Mode: Invisibility**
    - *Total Cost:* **4 SP**
    - *Effect:* Replaces the Basic Effect. Casting Time 1 Action, Range Touch, Duration **Concentration up to 1 hour**. A creature you touch becomes Invisible. Ends if target attacks or casts a spell.
    - **Unique Enhancements for this Mode:**
      - *Improved Invisibility:* **+3 SP** Effect does not end if the target attacks or casts a spell. (Total cost 7 SP).
      - *Share Invisibility:* **+2 SP per additional target.** Target additional creatures touched. (Total cost 6 SP for 2 targets, etc.).

- **General Enhancements (Add SP cost to applicable Mode's cost):**
  - *Increase Range:* **+1 SP** Doubles the range of the chosen Mode (if applicable and not Self/Touch). (Can apply multiple times).
  - *Sustain Sensory Illusion:* **+1 SP per step.** (Sensory Illusion only). Increases Concentration duration step (1 min -> 10 min -> 1 hour).
  - *Persistent Illusion:* **+3 SP** (Requires *Sustain Sensory Illusion* or *Sustain Blur* learned reaching 1 hour). Increases duration to 8 hours and removes the need for Concentration.
  - *Subtle Casting:* **+1 SP** Cast without Verbal or Somatic components.

---

### **5.4.13 Influence Enhancements**

> *Basic Effect Refresher: 0 SP, 1 Action, 30ft range, 1 round. Target makes Wis save or has disadvantage on its next attack roll made against **you**.*

- **Modes (Choose one when casting):**

  - **Mode: Charm Person**
    - *Total Cost:* **2 SP**
    - *Effect:* Replaces the Basic Effect. Casting Time 1 Action, Range 30 ft, Duration **1 hour (no Concentration)**. Target one humanoid you can see. Wis save vs **Charmed**. Regards you as friendly acquaintance. Knows it was charmed after effect ends unless *Lasting Impression* used. Ends early if harmed by you/companions.

  - **Mode: Suggest Course**
    - *Total Cost:* **3 SP**
    - *Effect:* Replaces the Basic Effect. Casting Time 1 Action, Range 30 ft, Duration **Concentration up to 8 hours**. Target one creature that can hear/understand you. Wis save vs following a suggested reasonable course of activity (1-2 sentences). Ends if suggestion completed or target harmed by you/companions.

  - **Mode: Read Thoughts**
    - *Total Cost:* **3 SP**
    - *Effect:* Replaces the Basic Effect. Casting Time 1 Action, Range Self (30 ft radius), Duration **Concentration up to 1 minute**. Use Action to target creature within 30 ft. Wis save vs reading its surface thoughts while within 30 ft. Can switch targets with Action. Target unaware on success unless *Probe Deeper* used.
    - **Unique Enhancements for this Mode:**
      - *Probe Deeper:* **+1 SP** As Action, force linked target to make Int save. Fail: access deeper thoughts for 1 round. Target knows its mind is probed on failed save. Success: spell ends for that target.

  - **Mode: Dominate Creature**
    - *Total Cost:* **6 SP**
    - *Effect:* Replaces the Basic Effect. Casting Time 1 Action, Range 60 ft, Duration **Concentration up to 1 minute**. Target one creature. Wis save vs **Charmed**. Telepathic link on same plane. Issue commands (no action). Use Action for precise control until end of next turn (can use target's reaction with yours). Target repeats save each time it takes damage, ending effect on success.
    - **Unique Enhancements for this Mode:**
      - *Extended Domination:* **+2 SP per step.** Increase Concentration duration step (1 min -> 10 min -> 1 hour).
      - *Overwhelming Will:* **+2 SP** Target has disadvantage on the initial saving throw.

- **General Enhancements (Add SP cost to applicable Mode's cost):**
  - *Increase Range:* **+1 SP** Doubles the range (where applicable).
  - *Subtle Casting:* **+1 SP** Cast without Verbal or Somatic components.
  - *Forceful Influence:* **+1 SP** Target has disadvantage on the initial saving throw (unless *Overwhelming Will* already applied). *(Applies to Charm, Suggestion)*.
  - *Stronger Hold:* **+1 SP** (Charm, Suggestion, Dominate). Advantage on Charisma checks vs target.
  - *Lasting Impression:* **+1 SP** (Charm, Suggestion). Target doesn't realize it was influenced.
  - *Broaden Target:* **+2 SP** (Charm, Suggestion, Dominate). Can target any creature type (GM discretion on understanding for Suggestion).
  - *Share Charm:* **+2 SP per additional target.** (Charm Person only). Target additional humanoids.
  - *Sustain Charm/Suggestion:* **+2 SP per step.** (Charm Person / Suggest Course). Increase non-Concentration duration step (1 hour -> 8 hours -> 24 hours for Charm; 8 hours -> 24 hours for Suggestion).

---

### **5.4.14 Manipulate Enhancements**

> *Basic Effect Refresher: 0 SP, 1 Action, 30ft range, 1 min. Action controls spectral hand for simple interaction < 5 lbs, cannot attack.*

- **Mode: Enhanced Hand**
  - *Total Cost:* **1 SP**
  - *Effect:* Replaces the Basic Effect. Casting Time 1 Action, Range **60 ft**, Duration **Concentration up to 10 minutes**. Creates a spectral hand. Use Action to move 60 ft, interact, open/close, stow/retrieve, pour. Can exert force = **10 lbs**.
  - **Unique Enhancements for this Mode:**
    - *Increase Range/Speed:* **+1 SP** Doubles initial range and movement speed. (Can apply multiple times).
    - *Sustain Hand:* **+1 SP per step.** Increases Conc. duration (10 min -> 1 hour -> 8 hours).
    - *Boost Strength:* **+1 SP per step.** Doubles carrying capacity/force (10 -> 20 -> 40 lbs...). Increases size limit for Shove/Grapple by one step (S -> M -> L -> H).
    - *Precise Dexterity:* **+1 SP** Hand gains fine motor control (use tools w/ Spell Mod, tie knots, write).
    - *Invisible Hand:* **+1 SP** Hand is invisible.
    - *Magic Item Interaction:* **+2 SP** (Requires *Precise Dexterity* learned). Hand can attempt to activate simple non-attunement magic items.
    - *Forceful Strike:* **+2 SP** Use Action for melee spell attack (reach 5ft). Hit: **2d8 Force/Essence damage**.
    - *Shoving Grasp:* **+1 SP** (Requires *Boost Strength* learned). Use Action for contested check (Spellcasting vs Str/Dex) to push target (up to size limit) 10 ft.
    - *Crushing Grip:* **+2 SP** (Requires *Boost Strength* learned). Use Action for contested check to grapple target (up to size limit, Escape DC = Spell Save DC). Requires Conc. Action on later turns for 1d8 damage or contested move.
    - *Dual Hands:* **+3 SP** Create second identical hand. Control both with same Action (choose one for complex tasks).
    - *Coordinated Action:* **+2 SP** (Requires *Dual Hands* learned). Both hands can perform complex task (attack/check) simultaneously (Adv if same target).
    - *Elemental Touch:* **+1 SP** (Requires Essence). Hand unharmed by element, applies minor non-damaging effect.
    - *Shape Element:* **+2 SP** (Requires *Elemental Touch* + applicable Essence). Action to crudely shape 5ft cube of loose element.

- **General Enhancements (Apply where appropriate):**
  - *Persistent Hand:* **+3 SP** (Requires *Sustain Hand* learned reaching 1 hour). Duration becomes 8 hours, no Concentration.

*(Note: Manipulate kept as one versatile mode due to its nature, enhancements define its function.*

---

### **5.4.15 Move Enhancements**

> *Basic Effect Refresher: 0 SP, Special (Part of Move), Self, Instantaneous. Enhance your turn's movement: Ignore Difficult Terrain OR Avoid Opportunity Attacks OR Move Through Hostiles.*

- **Modes (Choose one when casting, replacing the Basic Effect for this turn's movement):**

  - **Mode: Blink Step**
    - *Total Cost:* **2 SP**
    - *Casting Time:* Special (Part of your Move Action) | *Range:* Self | *Duration:* Instantaneous
    - *Effect:* When you take the Move action or use movement, expend this SP cost. Instead of moving normally, you **teleport up to 30 feet** to an unoccupied space you can see. This teleportation replaces an equivalent amount of your movement speed (e.g., teleporting 20 feet uses 20 feet of your speed). This can be used to pass through obstacles you could not normally move through.

  - **Mode: Velocity Surge**
    - *Total Cost:* **2 SP**
    - *Casting Time:* Special (Part of your Move Action) | *Range:* Self | *Duration:* Instantaneous
    - *Effect:* When you take the Move action or use movement, expend this SP cost. You gain the benefits of both the **Dash** and **Disengage** actions for your movement this turn. (Your movement speed is doubled, and it does not provoke opportunity attacks).

  - **Mode: Reactive Phase**
    - *Total Cost:* **3 SP**
    - *Casting Time:* **Reaction** (When you are hit by an attack or fail a Dexterity saving throw) | *Range:* Self | *Duration:* Instantaneous
    - *Effect:* You **teleport up to 15 feet** to an unoccupied space you can see. This occurs immediately *after* the triggering attack resolves or the saving throw is failed.

- **General Enhancements (Add SP cost to applicable Mode's cost OR sometimes cast alone):**

  - *Increase Teleport Distance (Blink Step/Reactive Phase):* **+1 SP per +15 feet.** Increases the distance you can teleport with the chosen Mode. (Can apply multiple times).
  - *Bestow Movement (Blink Step/Velocity Surge):* **+2 SP** Casting Time becomes 1 Action, Range Touch. Target one willing creature. On *their* next turn, they can use the chosen Mode's effect (Blink Step or Velocity Surge) as part of their movement without spending SP.
  - *Feather Fall:* **+1 SP** Casting Time Reaction (when you or a creature within 60 feet falls). Target's rate of descent slows to 60 ft/round, takes no falling damage. Duration 1 minute or until landing. *(Can be cast independently of Modes).*
  - *Twin Step (Blink Step Only):* **+2 SP** Bring one willing creature (Size M/S, within 5 ft of your starting position) with you to an adjacent space at your destination. Their movement is not affected.
  - *Switch Step (Blink Step Only):* **+2 SP** Instead of teleporting to an empty space, swap places with one willing creature you can see within the teleport distance.
  - *Phase Step (Blink Step Only):* **+2 SP** The teleport allows you to pass through solid objects or barriers up to 5 feet thick. You must end in an unoccupied space.
  - *Elemental Arrival (Blink Step/Reactive Phase):* **+1 SP** Creatures within 5 feet of your arrival space take damage equal to your Spellcasting Ability Modifier (min 1) of your Essence type.
  - *Subtle Movement:* **+1 SP** Cast without Verbal or Somatic components (where applicable, mainly for Bestow/Share/Feather Fall).

---

### **5.4.16 Strike Enhancements**

> *Basic Effect Refresher: 0 SP, Action, Self, Instantaneous. Make weapon attack, if hit deals +Spell Mod Essence damage.*

- **Modes (Choose one when casting):**

  - **Mode: Empowered Strike**
    - *Total Cost:* **2 SP**
    - *Effect:* Replaces Basic Effect. Casting Time 1 Action, Range Self. Make weapon attack. Hit: deals normal weapon damage + **2d8** bonus Essence damage.

  - **Mode: Cleaving Strike** (Melee Only)
    - *Total Cost:* **4 SP**
    - *Effect:* Replaces Basic Effect. Casting Time 1 Action, Range Self (5ft radius). Melee weapon attack. Hit: target takes weapon dmg + **2d8** bonus Essence damage. Choose others within 5 ft (up to Spell Mod); Dex save vs **2d8** Essence damage (half on success).

  - **Mode: Piercing Strike** (Ranged/Thrown Only)
    - *Total Cost:* **4 SP**
    - *Effect:* Replaces Basic Effect. Casting Time 1 Action, Range Self (15ft line). Ranged weapon attack. Hit: target takes weapon dmg + **2d8** bonus Essence damage. 15ft line extends behind target; Dex save vs **2d8** Essence damage (half on success).

  - **Mode: Bursting Strike**
    - *Total Cost:* **5 SP**
    - *Effect:* Replaces Basic Effect. Casting Time 1 Action, Range Self (10ft radius). Weapon attack. Hit: target takes weapon dmg + **2d8** bonus Essence damage. 10ft radius explosion centered on target; Dex save vs **2d8** Essence damage (half on success).

- **General Enhancements (Add SP cost to applicable Mode's cost):**
  - *Increase Bonus Damage:* **+1 SP** Increases **bonus** damage dice by **+1d8**. (Applies to initial hit and secondary AoE where applicable). (Can apply multiple times).
  - *Inflicted Strike:* **+1/2/3 SP** (Cost depends on Essence's B-Tier status). (Applies to *initial* target). Hit: target makes Con save vs Spell Save DC or suffers B-Tier status until start of **your** next turn.
  - *Flashing Step:* **+1 SP** After attack (hit or miss), teleport up to 10 feet.
  - *Resounding Impact:* **+1 SP** (Initial target). Hit: Str save vs pushed 10 ft away.
  - *Tripping Strike:* **+2 SP** (Initial target). Hit: Str save vs knocked prone.
  - *Disarming Strike:* **+2 SP** (Initial target). Hit: Str/Dex save vs drop held item.
  - *Feinting Strike:* **+2 SP** (Initial target). Hit: Gain advantage on next attack vs target before end of your next turn.
  - *Critical Surge:* **+2 SP** (Use as Reaction). On critical hit with the spell's attack, spend 2 SP to maximize spell's **bonus** damage dice.

---

### **5.4.17 Summon Enhancements**

> *Basic Effect Refresher: 0 SP, 1 Action, 30ft range, 1 min. Summons Tiny servant (AC 10, 1 HP, Speed 15ft) that can use BA to Help ally.*

- **Modes (Choose one when casting):**

  - **Mode: Utility Familiar**
    - *Total Cost:* **2 SP**
    - *Effect:* Replaces Basic Effect. Casting Time 1 Action, Range 30 ft, Duration **Conc. 10 minutes**. Summon Tiny/Small spirit (AC 12, HP 5+SpellMod, Speed 30ft). Can Help, Search, Use Object, Dash. Can deliver touch spells. Obeys commands.
    - **Unique Enhancements for this Mode:**
      - *Skilled Assistant:* **+1 SP** Gains proficiency in one skill/tool (uses your stats).
      - *Telepathic Bond:* **+1 SP** Telepathy within 100 ft.
      - *Shifting Form:* **+1 SP** Action to change size (T/S/M). Stats unchanged.
      - *Enhanced Senses:* **+1 SP** Darkvision 60 ft & adv. on Perception.
      - *Invisibility:* **+1 SP** Familiar is invisible.
      - *Sustain Familiar:* **+1 SP per step.** Increases Conc. duration (10 min -> 1 hour -> 8 hours).
      - *Persistent Familiar:* **+3 SP** (Requires *Sustain Familiar* reaching 1 hour). Duration 8 hours, no Conc.

  - **Mode: Combat Spirit**
    - *Total Cost:* **4 SP**
    - *Effect:* Replaces Basic Effect. Casting Time **1 Minute**, Range 30 ft, Duration **Conc. 1 hour**. Summon Medium spirit (AC 14, HP 15 + [5 * SP spent above 4 SP], Speed 30ft). Acts after you. Can take actions (no spells). Attack: Spell Atk vs AC, deals **1d8 + Spell Mod** Essence damage.
    - **Unique Enhancements for this Mode:**
      - *Swift Summon:* **+2 SP** Casting Time 1 Action.
      - *Greater Attack:* **+1 SP** Increases attack damage by **+1d8**. (Can apply multiple times).
      - *Multiattack:* **+4 SP** Can make two attacks with Attack action.
      - *Guardian Stance:* **+1 SP** Reaction to impose disadv. on attack vs creature within 5 ft.
      - *Reinforced Spirit:* **+1 SP per +10 HP.** Increases max HP.
      - *Armored Spirit:* **+1 SP per +1 AC.** Increases AC (max +3 total).
      - *Resilient Spirit:* **+2 SP** Resistance to non-magical B/P/S damage.
      - *Movement Mode:* **+1 SP** Gains fly, burrow, or swim speed = walk speed.
      - *Special Maneuver:* **+2 SP** Choose one: Charge (Str save vs prone), Grapple (replace attack), Area Burst (1/summon, replace attack, 2d6 Essence dmg AoE).

- **General Enhancements (Add SP cost to applicable Mode's cost):**
  - *Increase Summon Range:* **+1 SP** Doubles initial summon range.
  - *Essence Burst:* **+2 SP** Explodes on 0 HP (10ft radius, Dex save vs 2d6 Essence damage).
  - *Twin Summon:* **+4 SP** Summon two identical spirits. Concentration applies to both.

---

### **5.4.18 Zone Enhancements**

> *Basic Effect Refresher: 0 SP, 1 Action, 60ft range, 1 round. 10-ft square area becomes Difficult Terrain.*

- **Modes (Choose one when casting):**

  - **Mode: Hindering Zone** *(Consolidated Control/Obscure)*
    - *Total Cost:* **3 SP**
    - *Effect:* Replaces Basic Effect. Casting Time 1 Action, Range 60 ft, Duration **Conc. 1 minute**. Creates **20-foot radius sphere**. Choose **one** effect:
      - **Difficult Terrain:** Area is difficult terrain.
      - **Obscuring Mist:** Area is heavily obscured.
      - **Restraining Field:** Creatures entering/starting turn make Str save vs **Restrained** until start of their next turn. *(Cost increased)*.
      - **Silence:** No sound within/passes through. Deafens inside. Prevents V components.
    - **Unique Enhancements for this Mode:**
      - *Hazardous Terrain:* **+2 SP** (Difficult Terrain only). 1d4 Essence damage per 5 ft moved.
      - *Selective Obscurity:* **+2 SP** (Obscuring Mist only). Chosen creatures see through as lightly obscured.
      - *Mobile Silence:* **+2 SP** (Silence only). Zone centered on willing creature/object, moves with it.
      - *Tenacious Restraint:* **+1 SP** (Restraining Field only). Disadvantage on the Str save.

  - **Mode: Harmful Zone** *(Consolidated Damage/Debuff)*
    - *Total Cost:* **4 SP**
    - *Effect:* Replaces Basic Effect. Casting Time 1 Action, Range 60 ft, Duration **Conc. 1 minute**. Create **20-foot radius, 20-foot high cylinder**. Choose **one** effect:
      - **Damaging:** Creatures entering/starting turn make Dex save. Take **2d6** Essence damage on fail, half on success.
      - **Debilitating:** Creatures entering/starting turn make Con save vs B-Tier status (linked to Essence) until start of *its* next turn. *(SP cost matches direct Debilitate status + AoE premium)*.
    - **Unique Enhancements for this Mode:**
      - *Increase Damage/Debuff DC:* **+1 SP** Increases damage by **+1d6** OR increases the save DC for the B-Tier status by +1. (Choose when learning, can apply multiple times).
      - *Lingering Hazard:* **+1 SP** Area also becomes difficult terrain.
      - *Weakening Field:* **+1 SP** (Debilitating only). Disadvantage on initial save vs status effect.

  - **Mode: Sanctuary Zone**
    - *Total Cost:* **4 SP**
    - *Effect:* Replaces Basic Effect. Casting Time 1 Action, Range 60 ft, Duration **Conc. 1 minute**. **20-foot radius sphere**. Chosen creatures inside gain **+1 bonus to AC and all saving throws**.
    - **Unique Enhancements for this Mode:**
      - *Greater Sanctuary:* **+2 SP** Bonus increases to +2.
      - *Purifying Aura:* **+2 SP** Chosen creatures also have advantage on saves vs charmed, frightened, poisoned.

- **General Enhancements (Add SP cost to applicable Mode's cost):**
  - *Expand Zone:* **+1 SP per +5ft radius/side length.** Increases the zone's size.
  - *Increase Range:* **+1 SP** Doubles initial casting range.
  - *Sustain Zone:* **+1 SP per step.** Increases Conc. duration (1 min -> 10 min -> 1 hour).
  - *Persistent Zone:* **+3 SP** (Requires *Sustain Zone* learned reaching 1 hour). Duration 8 hours, no Conc.
  - *Selective Zone:* **+2 SP** Chosen creatures unaffected by detrimental effects (not Obscurity/Silence benefit).
  - *Shape Zone:* **+1 SP** Form zone into Cube, Cylinder, Line, or Wall of equivalent size.

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

#### **7.3.1 Champion (Strength)**

- **Core Ability:** Strength
- **Concept:** Champions harness raw physical power, translating overwhelming Strength into tangible magical effects. They dominate the battlefield through might, protect allies with unwavering resolve, and their force of will can manifest as physical **Barriers** (`Barrier`) just as readily as devastating enhanced **Strikes** (`Strike`). This framework is a starting point; your Champion's power comes from within – define what drives yours.
- **What could your Champion be?**
  - A determined protector whose conviction creates shields of shimmering force.
  - A tribal warrior who commands earth to rise as protective walls through stomps or gestures.
  - A disciplined combatant whose powerful stance establishes zones of defense.
  - A resolute individual whose sheer stubbornness materializes as physical obstacles.
- **How does your strength manifest?** Through roaring battle cries that bolster defenses? Precise martial technique that shatters enemy guards? Sheer unstoppable will that imposes itself on the physical world?
- **Hit Dice:** 1d10 per Champion level
- **Proficiencies:**
  - **Armor:** Light armor, medium armor, heavy armor, shields
  - **Weapons:** Simple weapons, martial weapons
  - **Saving Throws:** Strength, Constitution
  - **Skills:** Choose two from Athletics, Intimidation, Perception, Survival
- **Starting Spells Known (4 Total):**
  - **Core Attack Spell:** `Strike`
  - **Unique Thematic Spell:** `Barrier`
  - **Choice Spells (Choose 2 from list below):**
    - Blast
    - Debilitate
    - Defend
    - Empower/Enfeeble
    - Heal
    - Zone`

#### **7.3.2 Trickster (Dexterity)**

- **Core Ability:** Dexterity
- **Concept:** Tricksters excel through speed, precision, and cunning, their enhanced agility allowing them to **Move** (`Move`) with supernatural grace. They might use magically guided attacks (`Strike`/`Bolt`), misdirection (`Illusion`), or sheer nimbleness to confound foes and navigate danger. This is just a template; your Trickster's style is yours to define.
- **What could your Trickster be?**
  - A shadow dancer who blinks short distances between attacks.
  - A seemingly luck-touched gambler whose throws always hit their mark.
  - A battlefield acrobat whose dazzling movements confound opponents.
  - A silent hunter who seems to glide through any environment unseen.
- **How does your dexterity express itself?** Is it subtle and secretive, focused on remaining unseen? Flamboyant and showy, drawing attention while setting up a ruse? Methodical and precise, exploiting every small advantage?
- **Hit Dice:** 1d8 per Trickster level
- **Proficiencies:**
  - **Armor:** Light armor
  - **Weapons:** Simple weapons, hand crossbows, longswords, rapiers, shortswords, shortbows
  - **Saving Throws:** Dexterity, Intelligence
  - **Skills:** Choose three from Acrobatics, Deception, Insight, Investigation, Perception, Sleight of Hand, Stealth
- **Starting Spells Known (4 Total):**
  - **Core Attack Spell:** Choose `Strike` OR `Bolt`
  - **Unique Thematic Spell:** `Move`
  - **Choice Spells (Choose 2 from list below):**
    - Blast
    - Communicate
    - Conduit
    - Debilitate
    - Defend
    - Illusion`

#### **7.3.3 Adapter (Constitution)**

- **Core Ability:** Constitution
- **Concept:** Adapters draw power from their remarkable resilience and life force, their bodies capable of extraordinary transformation (**Adapt Self**). They endure, evolve, and overcome challenges by altering their very form, making their body both weapon (`Strike`/`Bolt`) and shield (`Defend`). But the specifics are yours to create; the Adapter's power is personal.
- **What could your Adapter be?**
  - A shapeshifter whose limbs become claws, wings, or fins as needed.
  - A stoic warrior whose skin temporarily hardens like stone or bark against attacks.
  - A survivor whose wounds close with unnatural speed (`Heal`).
  - A symbiotic host sharing consciousness and physical traits with another entity.
- **How does your body change?** Is it a controlled, deliberate evolution? An instinctive, primal response to threats? The result of ancient magic in your bloodline or strange experimentation?
- **Hit Dice:** 1d10 per Adapter level
- **Proficiencies:**
  - **Armor:** Light armor, medium armor, shields
  - **Weapons:** Simple weapons
  - **Saving Throws:** Constitution, Strength
  - **Skills:** Choose two from Athletics, Intimidation, Nature, Perception, Survival
- **Starting Spells Known (4 Total):**
  - **Core Attack Spell:** Choose `Strike` OR `Bolt`
  - **Unique Thematic Spell:** `Adapt Self`
  - **Choice Spells (Choose 2 from list below):**
    - Blast
    - Debilitate
    - Defend
    - Heal
    - Summon
    - Zone`

#### **7.3.4 Scholar (Intelligence)**

- **Core Ability:** Intelligence
- **Concept:** Scholars reshape reality through careful study, pattern recognition, and the precise application of knowledge. Their intellect allows them to affect the world, often from afar, whether through direct force (`Bolt`), intricate control over objects and energy (**Manipulate**), or understanding the underlying principles of magic and nature. This archetype is broad; the Scholar's power comes from understanding – what do *you* seek to comprehend?
- **What could your Scholar be?**
  - A traditional arcanist translating ancient formulae into tangible effects.
  - An inventor whose calculated understanding allows for precise telekinetic control.
  - A battlefield tactician who redirects energy and subtly alters terrain (`Zone`).
  - A researcher who perceives and interacts with the hidden connections between all things.
- **What knowledge drives you?** Forbidden texts? Scientific inquiry? Mathematical patterns? The intricate laws of magic or the natural world?
- **Hit Dice:** 1d6 per Scholar level
- **Proficiencies:**
  - **Armor:** None
  - **Weapons:** Daggers, darts, slings, quarterstaffs, light crossbows
  - **Saving Throws:** Intelligence, Wisdom
  - **Skills:** Choose two from Arcana, History, Insight, Investigation, Medicine, Nature
- **Starting Spells Known (4 Total):**
  - **Core Attack Spell:** `Bolt`
  - **Unique Thematic Spell:** `Manipulate`
  - **Choice Spells (Choose 2 from list below):**
    - Blast
    - Communicate
    - Debilitate
    - Defend
    - Illusion
    - Zone`

#### **7.3.5 Sage (Wisdom)**

- **Core Ability:** Wisdom
- **Concept:** Sages perceive what others cannot, drawing on intuition, experience, and a connection to the world around them to see hidden truths (**Arcane Sight**). Their wisdom often allows them to heal (`Heal`), guide (`Communicate`), protect (`Defend`), and understand deeper patterns, sometimes drawing on forces larger than themselves (`Summon`/`Zone`). The Sage's insight is unique – what informs yours?
- **What could your Sage be?**
  - A nature-connected guide who communes with animal spirits or channels natural energies.
  - A temple guardian sensing disturbances in spiritual harmony or reading auras.
  - A battlefield medic whose intuitive understanding of life force saves lives.
  - A keen investigator who notices the smallest details and understands underlying motives.
- **What guides your perception?** A connection to spirits or divinity? Deep practical experience and observation? Strong emotional intuition and empathy?
- **Hit Dice:** 1d8 per Sage level
- **Proficiencies:**
  - **Armor:** Light armor, medium armor, shields
  - **Weapons:** Simple weapons
  - **Saving Throws:** Wisdom, Charisma
  - **Skills:** Choose two from Animal Handling, Insight, Medicine, Perception, Religion, Survival
- **Starting Spells Known (4 Total):**
  - **Core Attack Spell:** Choose `Strike` OR `Bolt`
  - **Unique Thematic Spell:** `Arcane Sight`
  - **Choice Spells (Choose 2 from list below):**
    - Communicate
    - Conduit
    - Defend
    - Heal
    - Summon
    - Zone`

#### **7.3.6 Orator (Charisma)**

- **Core Ability:** Charisma
- **Concept:** Orators command attention and shape reality through sheer force of personality, their presence allowing them to **Influence** (`Influence`) minds, emotions, and even the flow of magic itself. Their power might erupt as spectacular displays (`Blast`/`Bolt`), subtle manipulations (`Illusion`), compelling commands (`Communicate`), or pact-bound abilities (`Summon`). The Orator's power reflects their unique character – how does yours shine?
- **What could your Orator be?**
  - An innately powerful individual whose strong emotions manifest as magical effects.
  - A pact-bound intermediary channeling otherworldly power through carefully worded agreements.
  - A stirring leader whose inspiring words literally empower allies (`Empower`).
  - A silver-tongued negotiator whose bargains and pronouncements hold magical weight.
- **How does your personality affect the world?** Through captivating performance? Resolute command? Subtle manipulation and charm? Unfiltered emotional expression?
- **Hit Dice:** 1d8 per Orator level
- **Proficiencies:**
  - **Armor:** Light armor
  - **Weapons:** Simple weapons, hand crossbows, rapiers, shortswords
  - **Saving Throws:** Charisma, Constitution
  - **Skills:** Choose two from Deception, Insight, Intimidation, Performance, Persuasion
- **Starting Spells Known (4 Total):**
  - **Core Attack Spell:** `Bolt`
  - **Unique Thematic Spell:** `Influence`
  - **Choice Spells (Choose 2 from list below):**
    - Blast
    - Communicate
    - Debilitate
    - Empower/Enfeeble
    - Illusion
    - Summon`
