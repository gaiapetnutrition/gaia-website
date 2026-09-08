/*
 * Pure helper for proportionally scaling an existing AAFCO recipe's serving
 * size to a target daily calorie count. Does not compute or alter nutrient
 * comparison data — per-1000-kcal ratios are scale-invariant, so the AAFCO
 * result stays valid unchanged regardless of the scaling factor applied here.
 */

export function computeScaledRecipe({ recipe, totalKcal, targetDailyCalories, mealsPerDay, daysToPrepare }) {
  if (!Number.isFinite(totalKcal) || totalKcal <= 0) return null
  if (!Number.isFinite(targetDailyCalories) || targetDailyCalories <= 0) return null
  if (!Number.isFinite(mealsPerDay) || mealsPerDay <= 0) return null
  if (!Number.isFinite(daysToPrepare) || daysToPrepare <= 0) return null

  const scalingFactor = targetDailyCalories / totalKcal

  const items = recipe.map(r => {
    const originalGrams = Number(r.grams) || 0
    const scaledDailyGrams = originalGrams * scalingFactor
    return {
      id: r.id,
      name: r.name,
      kcalPer100g: r.kcal,
      originalGrams,
      scaledDailyGrams,
      gramsPerMeal: scaledDailyGrams / mealsPerDay,
      gramsToPrepare: scaledDailyGrams * daysToPrepare,
    }
  })

  return {
    targetDailyCalories,
    mealsPerDay,
    daysToPrepare,
    scalingFactor,
    originalTotalKcal: totalKcal,
    scaledTotalKcal: totalKcal * scalingFactor,
    items,
  }
}
