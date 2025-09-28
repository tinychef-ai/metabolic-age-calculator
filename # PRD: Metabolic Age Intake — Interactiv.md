# PRD: Metabolic Age Intake — Interactive Chat

## 1. Objective

Deliver a lightweight **chat-based intake flow** that:

* Collects all inputs needed for **Metabolic Age calculation** (GutScore + BMI + lifestyle).
* Feels **conversational and adaptive**, not like a rigid survey.
* Preserves **deterministic scoring logic** (no free-text reasoning needed).
* Is fast to prototype (Lovable) and test with RF users before full FlutterFlow integration.

---

## 2. Core Experience

### Chat Metaphor

* **System bubbles**: friendly, varied phrasing.
* **User responses**: mostly **choice chips** (mapped deterministically to IDs).
* **Acknowledgement bubbles**: short affirmations or context (“That helps me estimate your gut health 👌”).

### Flow

1. **Warm intro** → “Hi 👋 I’ll ask a few quick things to calculate your Metabolic Age.”
2. **Questions** (scripted, deterministic order; ~14 total).
3. **Reveal** → “Your Metabolic Age is 35 (vs your age 32) — let’s see what’s driving it.”
4. **Summary cards** → Gut, BMI, Sleep, Activity, Stress (each with band + yrs impact).

---

## 3. Questions (canonical IDs)

### Basic Info

* `age` (number)
* `heightCm` (number)
* `weightKg` (number → BMI)

### Gut Health

* `bowel`: daily | sometimes | rare
* `bloating`: never | sometimes | often
* `energy`: energized | normal | sluggish
* `sensitivities`: none | few | many
* `fermented`: daily | 3to5 | 1to2 | rare
* `vegetables`: high | mid | low
* `hydration`: eightPlus | fiveToSeven | underFive
* `timing`: regular | somewhat | chaotic

### Lifestyle

* `sleep`: great | okay | poor
* `activity`: veryActive | somewhat | notMuch
* `stress`: calm | managing | stressed | overwhelmed

---

## 4. Scoring (unchanged, deterministic)

* **BMI → dBMI** (Indian cutoffs)
* **GutScore → dGut** (≥80: –2; 50–79: 0; <50: +2)
* **Sleep → dSleep** (great: –0.5; okay: +0.5; poor: +1.5)
* **Activity → dAct** (veryActive: –0.5; somewhat: +0.5; notMuch: +2.0)
* **Stress → dStress** (calm: 0; managing: +0.5; stressed: +1.0; overwhelmed: +2.0)
* **Metabolic Age = age + dGut + dBMI + dSleep + dAct + dStress**

  * Clamp: `[age–5, age+10]`

---

## 5. Conversational Layer

### System Bubble Variants

Each canonical Q has **3–4 phrasing options**:

* Example (sleep):

  1. “How’s your sleep these days?”
  2. “Do you usually wake up refreshed?”
  3. “How many hours do you get on average?”
     → All lead to the same 3 chips.

### Response Acknowledgements

* After choice, show a short supportive line.

  * If poor sleep → “😟 Poor sleep can add years to your metabolic age.”
  * If great sleep → “💤 Nice — restorative sleep helps you stay younger.”

---

## 6. Reveal & Feedback

### HERO

* Big number: **Metabolic Age**
* Subtext: “+3 yrs older than your age” or “2 yrs younger — great job!”

### Factor Cards (rows)

* **Gut Health** → band + `dGut yrs`
* **Weight Status** → BMI value + `dBMI yrs`
* **Sleep** → label + `dSleep yrs`
* **Activity** → label + `dAct yrs`
* **Stress** → label + `dStress yrs`

### Waterfall

Transparent list:
Age → dGut → dBMI → dSleep → dAct → dStress → Metabolic Age

---

## 7. Build Notes

### For Lovable (fast prototype)

* Use **chat bubble component** + choice chip input.
* State machine JSON: array of `{id, type, options[], variants[]}`.
* On submit: run deterministic calculation in JS function.
* Show reveal + factor cards in scrollable feed.

### For Cursor + React Native PWA

* Use a **messages[] array** to render chat bubbles.
* Each Q → {id, type, options, variants}.
* Answers dispatch into state; scoring function runs at end.
* Store results in localStorage or simple backend for repeat sessions.

---

## 8. Success Criteria

* Time-to-complete: **<90 sec** for average user.
* Drop-off rate lower than stepper-form baseline.
* Users describe it as “fun / feels like a coach” in feedback.
* Results match deterministic formulas exactly (no drift from AI phrasing).

---

## 9. Future Iterations

* Progressive learning: only ask “core” upfront, fill other answers via nudges later.
* Personalization: vary phrasing and responses by persona (e.g., “Busy professional” vs “Fitness-focused”).
* AI wrapper: generate bubble phrasing + acknowledgements from GPT, while **chips stay fixed**.

---