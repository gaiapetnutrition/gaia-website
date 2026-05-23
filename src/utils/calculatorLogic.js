/**
 * GAiA Nutrition Calculator Logic
 * Based on AAFCO / NRC recommendations and the GAiA reference spreadsheet.
 */

/* ─── Resting Energy Requirement ─────────────────────────── */
export function calcRER(weightKg) {
  // Exponential formula: RER = 70 × W^0.75 kcal/day
  return 70 * Math.pow(weightKg, 0.75)
}

/* ─── MER factor lookup table ────────────────────────────────
 * Source: GAiA spreadsheet "Factors" sheet (Maintain column).
 * Keyed by lifeStage → neutered (true/false) → activityLevel.
 *
 * UI scale position → spreadsheet activity label:
 *   low          → Inactive    (minimal exercise)
 *   low_plus     → Inactive+   (between low and moderate)
 *   moderate     → Typical     (1–2 hrs/day)
 *   moderate_plus→ Typical+    (between moderate and active)
 *   active       → Active      (running, training)
 *   sport        → Active+     (agility, protection sport)
 *   work         → Working     (working dogs — not exposed in public UI)
 ─────────────────────────────────────────────────────────── */
const MER_FACTORS = {
  puppy_small: {  // < 4 months — activity level irrelevant at this age
    true:  { low: 3.0, low_plus: 3.0, moderate: 3.0, moderate_plus: 3.0, active: 3.0, active_plus: 3.0, sport: 3.0, work: 3.0 },
    false: { low: 3.0, low_plus: 3.0, moderate: 3.0, moderate_plus: 3.0, active: 3.0, active_plus: 3.0, sport: 3.0, work: 3.0 },
  },
  puppy: {        // 4–12 months
    true:  { low: 2.0, low_plus: 2.0, moderate: 2.0, moderate_plus: 2.0, active: 2.0, active_plus: 2.0, sport: 2.0, work: 2.0 },
    false: { low: 2.0, low_plus: 2.0, moderate: 2.0, moderate_plus: 2.0, active: 2.0, active_plus: 2.0, sport: 2.0, work: 2.0 },
  },
  adult: {        // Source: Factors sheet rows 3–17
    true:  { low: 1.2, low_plus: 1.3, moderate: 1.4, moderate_plus: 1.5, active: 1.6, active_plus: 1.7, sport: 1.7, work: 2.35 },
    false: { low: 1.4, low_plus: 1.5, moderate: 1.5, moderate_plus: 1.6, active: 1.7, active_plus: 1.8, sport: 1.8, work: 2.50 },
  },
  // Senior = Adult × 0.925 for Inactive–Active+; Working unchanged from Adult.
  // Source: Factors sheet rows 19–32.
  senior: {
    true:  { low: 1.1, low_plus: 1.2, moderate: 1.3, moderate_plus: 1.4, active: 1.5, active_plus: 1.6, sport: 1.6, work: 2.35 },
    false: { low: 1.3, low_plus: 1.4, moderate: 1.4, moderate_plus: 1.5, active: 1.6, active_plus: 1.7, sport: 1.7, work: 2.5  },
  },
}

/* ─── Maintenance Energy Requirement ─────────────────────── */
// Pure maintenance calculator: MER is derived from idealWeightKg (via RER)
// and the life-stage/activity factor only. BCS is not used here — it was
// already consumed to produce idealWeightKg upstream in calculate().
export function calcMER(rer, profile) {
  const { lifeStage, activityLevel, isNeutered } = profile

  const stageFactors = MER_FACTORS[lifeStage] ?? MER_FACTORS.adult
  const neuteredKey  = isNeutered ? 'true' : 'false'
  const factor       = stageFactors[neuteredKey][activityLevel] ?? stageFactors[neuteredKey].moderate

  return rer * factor
}

/* ─── Caloric density of food types (kcal/100g) ─────────── */
export const FOOD_TYPES = [
  { id: 'homecooked', label: 'מבושל',                kcalPer100g: 140, icon: '🍲' },
  { id: 'raw',        label: 'נא',                  kcalPer100g: 160, icon: '🥩' },
  { id: 'wet',        label: 'שימורים',              kcalPer100g: 120, icon: '🫙' },
  { id: 'dry',        label: 'יבש (גרגרים)',       kcalPer100g: 360, icon: '🥩' },
]

/* ─── Daily food amount in grams ──────────────────────────── */
// customKcalPer100g: optional user-entered value — overrides the preset
export function calcDailyGrams(dailyKcal, foodTypeId, customKcalPer100g) {
  const preset     = FOOD_TYPES.find(f => f.id === foodTypeId) ?? FOOD_TYPES[0]
  const kcalPer100g = (customKcalPer100g && customKcalPer100g > 0)
    ? customKcalPer100g
    : preset.kcalPer100g
  return Math.round((dailyKcal / kcalPer100g) * 100)
}

/* ─── Macronutrient targets (% of ME) based on NRC 2006 ──── */
export function calcMacros(dailyKcal, lifeStage) {
  const isPuppy = lifeStage?.startsWith('puppy')
  return {
    protein: { pct: isPuppy ? 29 : 25, kcal: Math.round(dailyKcal * (isPuppy ? 0.29 : 0.25)) },
    fat:     { pct: isPuppy ? 17 : 14, kcal: Math.round(dailyKcal * (isPuppy ? 0.17 : 0.14)) },
    carbs:   { pct: isPuppy ? 29 : 30, kcal: Math.round(dailyKcal * (isPuppy ? 0.29 : 0.30)) },
    fiber:   { pct: 5,                 kcal: Math.round(dailyKcal * 0.05) },
  }
}

/* ─── Ideal body weight from BCS 1–9 ─────────────────────── */
// WSAVA scale: BCS 4–5 are both ideal (no adjustment needed).
// Each point above 5 or below 4 represents ±10% from ideal weight.
// Returns full-precision kg — caller is responsible for display rounding.
export function calcIdealWeightFromBCS(currentWeightKg, bcsScore) {
  if (bcsScore >= 6) return currentWeightKg * (1 - 0.10 * (bcsScore - 5))
  if (bcsScore <= 3) return currentWeightKg * (1 + 0.10 * (4 - bcsScore))
  return currentWeightKg  // BCS 4–5: already ideal
}

// Map BCS 1–9 → bodyCondition key used by MER factor table
function bcsToBodyCondition(bcsScore) {
  if (bcsScore <= 3) return 'underweight'
  if (bcsScore >= 6) return 'overweight'
  return 'ideal'   // 4–5
}

/* ─── Ideal body weight (legacy — kept for compatibility) ─── */
export function idealWeight(currentKg, bodyCondition) {
  if (bodyCondition === 'overweight')  return Math.round(currentKg * 0.85 * 10) / 10
  if (bodyCondition === 'underweight') return Math.round(currentKg * 1.10 * 10) / 10
  return currentKg
}

/* ─── Feeding frequency recommendation ───────────────────── */
export function feedingFrequency(lifeStage) {
  if (lifeStage?.startsWith('puppy')) return { times: 3, label: '3 ארוחות ביום' }
  if (lifeStage === 'senior')         return { times: 2, label: '2 ארוחות ביום' }
  return { times: 2, label: '2 ארוחות ביום' }
}

/* ─── Full calculation ────────────────────────────────────── */
export function calculate(inputs) {
  const { weightKg, foodType, lifeStage, activityLevel, isNeutered, customKcalPer100g, bcsScore } = inputs

  // ── Pre-processing: derive ideal weight and body condition from BCS ──
  const bcs              = bcsScore ?? 5
  const idealWeightKg    = calcIdealWeightFromBCS(weightKg, bcs)   // full precision
  const idealWeightKgDisplay = Math.round(idealWeightKg * 10) / 10 // 1 dp — display only
  const bodyCondition    = bcsToBodyCondition(bcs)

  const profile    = { lifeStage, activityLevel, isNeutered, bodyCondition }
  const rer        = calcRER(idealWeightKg)          // use full-precision ideal weight
  const mer        = calcMER(rer, profile)
  const dailyGrams = calcDailyGrams(mer, foodType, Number(customKcalPer100g) || 0)
  const macros     = calcMacros(mer, lifeStage)
  const freq       = feedingFrequency(lifeStage)
  const perMeal    = Math.round(dailyGrams / freq.times)

  return {
    rer:          Math.round(rer),
    mer:          Math.round(mer),
    dailyGrams,
    perMeal,
    frequency:    freq,
    macros,
    foodType:     FOOD_TYPES.find(f => f.id === foodType),
    customKcalPer100g: Number(customKcalPer100g) || 0,
    idealWeightKg: idealWeightKgDisplay,   // rounded for display
    bcsScore:     bcs,
    bodyCondition,
  }
}
