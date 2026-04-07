/**
 * GAiA Nutrition Calculator Logic
 * Based on AAFCO / NRC recommendations and standard veterinary nutrition formulas.
 */

/* ─── Resting Energy Requirement ─────────────────────────── */
export function calcRER(weightKg) {
  // Exponential formula: RER = 70 × W^0.75 kcal/day
  return 70 * Math.pow(weightKg, 0.75)
}

/* ─── Maintenance Energy Requirement ─────────────────────── */
export function calcMER(rer, profile) {
  const { lifeStage, activityLevel, isNeutered, bodyCondition } = profile

  let factor = 1.6 // default: neutered adult

  if (lifeStage === 'puppy_small') factor = 3.0    // < 4 months
  else if (lifeStage === 'puppy')  factor = 2.0    // 4–12 months
  else if (lifeStage === 'senior') factor = 1.4
  else if (lifeStage === 'adult') {
    if (!isNeutered) factor = 1.8
    else factor = 1.6

    if (activityLevel === 'low')    factor *= 0.9
    if (activityLevel === 'active') factor *= 1.2
    if (activityLevel === 'sport')  factor *= 1.6
    if (activityLevel === 'work')   factor *= 2.2
  }

  // Body condition adjustment
  if (bodyCondition === 'overweight') factor = 1.0 * (isNeutered ? 1.0 : 1.1)
  if (bodyCondition === 'underweight') factor *= 1.2

  return rer * factor
}

/* ─── Caloric density of food types (kcal/100g) ─────────── */
export const FOOD_TYPES = [
  { id: 'dry',       label: 'יבש (קיבל)',         kcalPer100g: 350,  icon: '🥩' },
  { id: 'wet',       label: 'רטוב / שימורים',      kcalPer100g: 80,   icon: '🫙' },
  { id: 'raw',       label: 'BARF / נא',           kcalPer100g: 140,  icon: '🥩' },
  { id: 'homecooked',label: 'בישול ביתי',           kcalPer100g: 130,  icon: '🍲' },
  { id: 'mixed',     label: 'שילוב יבש + רטוב',    kcalPer100g: 215,  icon: '🥣' },
]

/* ─── Daily food amount in grams ──────────────────────────── */
export function calcDailyGrams(dailyKcal, foodTypeId) {
  const ft = FOOD_TYPES.find(f => f.id === foodTypeId) || FOOD_TYPES[0]
  return Math.round((dailyKcal / ft.kcalPer100g) * 100)
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

/* ─── Ideal body weight (for overweight dogs) ────────────── */
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
  const { weightKg, foodType, lifeStage, activityLevel, isNeutered, bodyCondition } = inputs

  const profile = { lifeStage, activityLevel, isNeutered, bodyCondition }
  const rer        = calcRER(weightKg)
  const mer        = calcMER(rer, profile)
  const dailyGrams = calcDailyGrams(mer, foodType)
  const macros     = calcMacros(mer, lifeStage)
  const freq       = feedingFrequency(lifeStage)
  const perMeal    = Math.round(dailyGrams / freq.times)

  return {
    rer:        Math.round(rer),
    mer:        Math.round(mer),
    dailyGrams,
    perMeal,
    frequency:  freq,
    macros,
    foodType:   FOOD_TYPES.find(f => f.id === foodType),
  }
}
