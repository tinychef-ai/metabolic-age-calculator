# **Metabolic Age (MVP) — PRD**

## **1\) Objective**

Deliver a questionnaire-based “Metabolic Age” that (a) computes Gut Score (0–100), (b) converts lifestyle inputs into age deltas in years (dGut, dBMI, dSleep, dAct, dStress), and (c) reveals a single HERO metric (Metabolic Age) with clear factor-by-factor impact. The model is intentionally heuristic but science-aligned and tuned for Indian dietary patterns and gut health emphasis.

## **2\) User Stories**

* As a user, I answer \~12 quick questions and get my Metabolic Age vs my real age.

* As a user, I can see which factors helped/hurt (in years) and what “band” I’m in for each.

* As a user, I get actionable guidance focused on gut/diet/sleep/activity/stress.

## **3\) Inputs (Questions & Choices)**

Use these exact labels (left of “→”) in UI; IDs (right) are what your mappers should pass to functions.

### **A. Basic Info (already in `personalInfo`)**

1. Age (years)

2. Sex (optional for MVP; not used in calc yet)

3. Height (cm)

4. Weight (kg) → compute BMI

### **B. Gut Health (feeds Gut Score 0–100)**

1. Bowel movement frequency

* “Daily” → daily

* “Every other day” → altDay

* “\<3/week or \>3/day” → irregular

2. Bloating/gas frequency

* “Rarely/Never” → never

* “Sometimes (2–3×/week)” → sometimes

* “Often (daily)” → often

3. Energy after meals

* “Energized/Light” → energized

* “Normal” → normal

* “Sluggish/Heavy” → sluggish

4. Food sensitivities

* “None” → none

* “1–2 foods” → few

* “Multiple foods” → many

5. Fermented/probiotic intake (any source: curd, idli/dosa, dhokla, kanji, etc.)

* “Daily” → daily

* “3–5×/week” → 3to5

* “1–2×/week” → 1to2

* “Rarely/Never” → rare

6. Fiber intake (servings/day of veg+fruit+whole grains)

* “5+” → high

* “2–4” → mid

* “0–1” → low

7. Hydration (glasses/day \~250ml)

* “8+” → eightPlus

* “5–7” → fiveToSeven

* “\<5” → underFive

8. Meal timing consistency

* “Regular routine” → regular

* “Somewhat irregular” → somewhat

* “Chaotic/Varies a lot” → chaotic

(Weights & scoring below draw directly from our gut framework with Indian-diet emphasis. )

### **C. Sleep (maps to dSleep)**

* “😴 Great (7–9 hours)” → great

* “😐 Okay (5–7 hours)” → okay

* “😩 Poor (\<5 or \>10)” → poor

### **D. Activity (maps to dAct)**

* “🏃 Very active” → veryActive

* “🚶 Somewhat active” → somewhat

* “🪑 Not much” → notMuch

### **E. Stress (maps to dStress)**

* “😌 Calm & peaceful” → calm

* “😐 Managing okay” → managing

* “😰 Pretty stressed” → stressed

* “😫 Overwhelmed” → overwhelmed

## **4\) Computations**

### **4.1 BMI**

`bmi = weightKg / (heightCm/100)^2`

### **4.2 Gut Score (0–100)**

Weighted composite (sum to 100):

* Bowel regularity — 15

  * daily: 15, altDay: 10, irregular: 5

* Bloating/gas — 15

  * never: 15, sometimes: 10, often: 5

* Energy after meals — 10

  * energized: 10, normal: 7, sluggish: 3

* Food sensitivities — 10

  * none: 10, few: 7, many: 3

* Fermented/probiotic — 15

  * daily: 15, 3to5: 12, 1to2: 8, rare: 3

* Fiber intake — 20

  * high: 20, mid: 12, low: 5

* Hydration — 5

  * eightPlus: 5, fiveToSeven: 3, underFive: 1

* Meal timing — 10

  * regular: 10, somewhat: 5, chaotic: 0

Rationale & India-specific fermented foods are documented in our research basis.

### **4.3 Factor Deltas (years)**

#### **dBMI (years)**

* Underweight (BMI \< 18.5): \+1.0

* Healthy (18.5–24.9): 0.0

* Overweight (25.0–29.9): \+1.0

* Obesity I (30.0–34.9): \+3.0

* Obesity II+ (≥35.0): \+5.0

(Values simplified from literature-aligned heuristics used in biological age models; tune later with data. )

#### **dGut (years) — three-band UI, simple piecewise MVP**

* GutScore ≥ 80 → **–2.0** (High / positive impact)

* 50 ≤ GutScore ≤ 79 → **0.0** (Adequate / neutral)

* GutScore \< 50 → **\+2.0** (Low / negative impact)

(Note: If you prefer the finer 5-band table used in our longform spec—85–100: –3, 70–84: –1.5, 55–69: 0, 40–54: \+2, \<40: \+4—you can swap it in; we’re shipping the 3-band version to match the latest UX. )

#### **dSleep (years)**

* great → –0.5

* okay → \+0.5

* poor → \+1.5

#### **dAct (years)**

* veryActive → –0.5

* somewhat → \+0.5

* notMuch → \+2.0

#### **dStress (years)**

* calm → 0.0

* managing → \+0.5

* stressed → \+1.0

* overwhelmed → \+2.0

### **4.4 Metabolic Age**

`metabolicAge = age + dGut + dBMI + dSleep + dAct + dStress`

**Clamp for messaging:** cap to `[age – 5, age + 10]` so results stay motivating and credible. (This mirrors how leading products bound outputs and communicate ranges.)

## **5\) Display / UX (for the later web app)**

* **HERO**: Metabolic Age vs Age (slider or Whoop-style hero), with delta chip (“+2.0 yrs” / “–1.5 yrs”).

* **Sections** (each row):

  * Title (e.g., “Gut Health”), **banded pills (Low / Adequate / High)** with the active band highlighted, and a **delta chip** (e.g., “+2.0 yrs”).

  * If needed, show a compact description (“Your current gut habits are nudging your metabolic age up”).

* **Waterfall transparency**: `Age → dGut → dBMI → dSleep → dAct → dStress → Metabolic Age` (each with signed years).

* **No raw GutScore value** on this screen (per latest direction); we use it to compute the band & dGut.

## **6\) Data Model (for this PRD’s web app)**

* Inputs: as listed in §3.

* Derived: `bmi`, `gutScore`, `dGut`, `dBMI`, `dSleep`, `dAct`, `dStress`, `metabolicAge`.

* Persist a single result payload with a timestamp so we can A/B test thresholds later.

## **7\) Mappers (label → id)**

Follow the label→id maps exactly as specified in §3 (these are the same maps you’ve already implemented in FF custom functions for sleep/activity/stress; create per-question mapper for gut items as we did for bowel score etc.).

## **8\) Test Cases (golden)**

Use these to sanity-check the engine:

* **T1: 25y, great gut, great sleep, very active, calm, BMI 22**

  * gutScore: 85 → dGut –2.0

  * dBMI 0.0, dSleep –0.5, dAct –0.5, dStress 0.0

  * MA \= 25 –2.0 –0.5 –0.5 \= **22.0** (–3.0 yrs)

* **T2: 25y, poor gut, okay sleep, somewhat active, managing stress, BMI 27**

  * gutScore: 45 → dGut \+2.0

  * dBMI \+1.0, dSleep \+0.5, dAct \+0.5, dStress \+0.5

  * MA \= 25 \+2.0 \+1.0 \+0.5 \+0.5 \+0.5 \= **29.5** (+4.5 yrs)

* **T3: 40y, average gut, great sleep, light activity, moderate stress, BMI 24**

  * gutScore: 60 → dGut 0.0

  * dBMI 0.0, dSleep –0.5, dAct \+0.5, dStress \+0.5

  * MA \= 40 \+0.0 –0.5 \+0.5 \+0.5 \= **40.5** (+0.5 yrs)

(Our longer references show comparable example outcomes and rationale. )

## **9\) Non-Goals (MVP)**

* No lab biomarkers, VO₂ max, or epigenetic clocks.

* No regional personalization yet beyond fermented-food recognition baked into GutScore.

* No historical trends (single-shot calc) in this first web version.

## **10\) Future Tuning**

* Swap 3-band dGut for 5-band table when we want more sensitivity.

* Add diet quality sub-index outside gut (processed foods, alcohol).

* Personalize thresholds by age/sex once we have distribution data.

---

