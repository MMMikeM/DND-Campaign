<!-- markdownlint-disable MD041 -->
### 6.4 Blast

#### Basic Effect (0 SP)

| Property      | Value                                                                                        |
|:--------------|:---------------------------------------------------------------------------------------------|
| **Cast Time** | 1 Action                                                                                     |
| **Range**     | Self (10-ft cone)                                                                            |
| **Duration**  | Instantaneous                                                                                |
| **Effect**    | Creatures in cone make Dex save vs Spell DC. Fail: 1d8 Essence damage. Success: Half damage. |

#### What you can buy

```mermaid
graph LR
  B["Basic Effect<br/>0 SP"]
  B --> C["Cone Blast<br/>2 SP"]
  B --> O["Orb Blast<br/>2 SP"]
  B --> L["Lancing Blast<br/>2 SP"]
  C --> MC["Mega Cone<br/>+2 SP"]
  C --> SB["Selective Blast<br/>+3 SP"]
  O --> LO["Large Orb<br/>+1 SP"]
  LO --> MO["Mega Orb<br/>+1 SP"]
  L --> PL["Piercing Lance<br/>+1 SP"]
  L --> TL["Twin Lance<br/>+2 SP"]

  G(["any Mode"]) --> AM["Amplify Blast<br/>+1 SP"]
  AM --> PB["Penetrating Blast<br/>+2 SP"]
  G --> FB["Forceful Blast<br/>+1 SP"]
  FB --> EI["Environmental Impact<br/>+1 SP"]
  G --> DB["Debilitating Blast<br/>+2 SP"]
  G --> CSP["Change Save: Physical<br/>+1 SP"]
  G --> CSM["Change Save: Mental<br/>+1 SP"]
```

#### Mode: Cone Blast ✦ 2 SP

| Property     | Value                                                                            |
|:-------------|:---------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                         |
| **Range**    | Self (15-foot cone)                                                              |
| **Duration** | Instantaneous                                                                    |
| **Effect**   | Creatures in cone make Dex save. Fail: 2d8 Essence damage. Success: Half damage. |

##### Cone Blast Enhancements

| Enhancement     | SP Cost | Effect                                                                        |
|:----------------|:--------|:------------------------------------------------------------------------------|
| Mega Cone       | +2 SP   | Increase cone length to 30 feet.                                              |
| Selective Blast | +3 SP   | Choose creatures in the cone; they are unaffected by the blast.               |

#### Mode: Orb Blast ✦ 2 SP

| Property     | Value                                                                              |
|:-------------|:-----------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                           |
| **Range**    | 60 ft (5-foot radius sphere centered on point)                                     |
| **Duration** | Instantaneous                                                                      |
| **Effect**   | Creatures in sphere make Dex save. Fail: 2d8 Essence damage. Success: Half damage. |

##### Orb Blast Enhancements

| Enhancement | SP Cost | Effect                                             |
|:------------|:--------|:---------------------------------------------------|
| Large Orb   | +1 SP   | Increase radius to 10 feet.                        |
| ↳ Mega Orb  | +1 SP   | (Requires: Large Orb) Increase radius to 15 feet.  |

#### Mode: Lancing Blast ✦ 2 SP

| Property     | Value                                                                                                                                                                               |
|:-------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Cast**     | 1 Action                                                                                                                                                                            |
| **Range**    | Self (Line 15 ft L x 5 ft W) OR 60 ft (Line centered on point)                                                                                                                      |
| **Duration** | Instantaneous (Lingers until start of your next turn)                                                                                                                               |
| **Effect**   | Creatures in line make Dex save. Fail: 2d8 Essence damage. Success: Half damage. Line persists; creatures entering/ending turn repeat save vs 1d8 Essence damage (half on success). |

##### Lancing Blast Enhancements

| Enhancement    | SP Cost | Effect                                                |
|:---------------|:--------|:------------------------------------------------------|
| Piercing Lance | +1 SP   | Increase line length to 30 feet.                      |
| Twin Lance     | +2 SP   | Create two separate Lancing Blasts with this casting. |

#### General Enhancements (Blast)

Available with any Mode. The indented rows require the enhancement above them.

| Enhancement              | SP Cost | Effect                                                                                                               |
|:-------------------------|:--------|:----------------------------------------------------------------------------------------------------------------------|
| Amplify Blast            | +1 SP   | Increase initial damage dice by +1d8. (*Stackable*).                                                                 |
| ↳ Penetrating Blast      | +2 SP   | (Requires: Amplify Blast) The blast's damage ignores resistance to its damage type.                                  |
| Forceful Blast           | +1 SP   | Creatures failing the initial save are pushed 10 ft away from the origin/center.                                     |
| ↳ Environmental Impact   | +1 SP   | (Requires: Forceful Blast) The area affected by the initial blast becomes difficult terrain until the start of your next turn. |
| Debilitating Blast       | +2 SP   | Creatures failing initial save suffer the status effect until end of **your** next turn.                             |
| Change Save (Physical)   | +1 SP   | Changes the required saving throw from Dexterity to Strength or Constitution (choose when learning).                 |
| Change Save (Mental)     | +1 SP   | Changes the required saving throw from Dexterity to Wisdom or Intelligence (choose when learning).                   |
