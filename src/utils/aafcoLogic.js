/**
 * aafcoLogic.js
 *
 * Pure-JS ports of the Python functions:
 *   computeRecipeNutrients(recipe_rows, ingredientsById)
 *   compareToAafco(recipe_rows, aafcoData, ingredientsById, life_stage)
 *
 * Both accept a pre-built ingredientsById Map (id → row from ingredient_nutrients_all.json)
 * and the raw aafco array from aafco_dog_per_1000kcal.json.
 */

/** All nutrient keys present in each ingredient's `.n` object (including derived Chloride) */
export const NUTRIENT_COLS = [
  'Protein', 'Total fat', 'Calcium', 'Iron', 'Magnesium', 'Phosphorus',
  'Potassium', 'Sodium', 'Zinc', 'Copper', 'Iodine', 'Manganese', 'Selenium',
  'Vitamin A', 'Vitamin E', 'Vitamin D', 'Thiamine', 'Riboflavin', 'Niacin',
  'Pantothenic acid', 'Pyridoxine', 'Vitamin B-12', 'Choline', 'Folic acid',
  'Chloride',   // derived: Sodium × (35.45 / 22.99) — assumes NaCl
]

/**
 * Unit conversion map: USDA native units → AAFCO comparison units.
 *
 * USDA stores nutrients in these units per 100 g:
 *   G   → Protein, Total fat
 *   MG  → most minerals, B-vitamins, Vitamin E
 *   UG  → Selenium, Iodine, Folic acid, Vitamin B-12, Vitamin A (RAE), Vitamin D
 *
 * AAFCO expresses requirements per 1000 kcal in:
 *   g   → macro-minerals (Calcium, Phosphorus, etc.)   ← MG ÷ 1000
 *   mg  → trace minerals, B-vitamins                   ← no change (MG→mg) or UG ÷ 1000
 *   IU  → Vitamins A, D, E                             ← µg/mg × factor
 *
 * Key conversions applied before the per-1000-kcal ratio:
 *   g_minerals : USDA mg/day  → g/day     (÷ 1000)
 *   ug_to_mg   : USDA µg/day  → mg/day    (÷ 1000)
 *   ug_to_IU_A : USDA µg RAE  → IU        (× 3.333  — 1 IU retinol = 0.3 µg RAE)
 *   ug_to_IU_D : USDA µg D2+D3 → IU      (× 40     — 1 IU Vit D   = 0.025 µg)
 *   mg_to_IU_E : USDA mg α-tocoph → IU   (× 1.492  — 1 IU Vit E   = 0.67 mg d-α-tocoph)
 */
const CONVERSION = {
  Calcium:          'g_minerals',
  Phosphorus:       'g_minerals',
  Potassium:        'g_minerals',
  Sodium:           'g_minerals',
  Chloride:         'g_minerals',
  Magnesium:        'g_minerals',
  Selenium:         'ug_to_mg',
  Iodine:           'ug_to_mg',
  'Folic acid':     'ug_to_mg',
  'Vitamin B-12':   'ug_to_mg',
  'Vitamin A':      'ug_to_IU_A',
  'Vitamin D':      'ug_to_IU_D',
  'Vitamin E':      'mg_to_IU_E',
}

function applyConversion(nutrient, amountPerDay) {
  const conv = CONVERSION[nutrient]
  if (conv === 'g_minerals') return amountPerDay / 1000        // mg/day → g/day
  if (conv === 'ug_to_mg')   return amountPerDay / 1000        // µg/day → mg/day
  if (conv === 'ug_to_IU_A') return amountPerDay * 3.333       // µg RAE → IU
  if (conv === 'ug_to_IU_D') return amountPerDay * 40          // µg     → IU
  if (conv === 'mg_to_IU_E') return amountPerDay * 1.492       // mg     → IU
  return amountPerDay                                           // no change (mg→mg, g→g)
}

/** Hebrew display labels */
export const NUTRIENT_LABELS = {
  'Protein':          'חלבון',
  'Total fat':        'שומן',
  'Calcium':          'סידן',
  'Iron':             'ברזל',
  'Magnesium':        'מגנזיום',
  'Phosphorus':       'זרחן',
  'Potassium':        'אשלגן',
  'Sodium':           'נתרן',
  'Zinc':             'אבץ',
  'Copper':           'נחושת',
  'Iodine':           'יוד',
  'Manganese':        'מנגן',
  'Selenium':         'סלניום',
  'Vitamin A':        'ויטמין A',
  'Vitamin E':        'ויטמין E',
  'Vitamin D':        'ויטמין D',
  'Thiamine':         'תיאמין (B1)',
  'Riboflavin':       'ריבופלבין (B2)',
  'Niacin':           'ניאצין (B3)',
  'Pantothenic acid': 'חומצה פנטותנית (B5)',
  'Pyridoxine':       'פירידוקסין (B6)',
  'Vitamin B-12':     'ויטמין B12',
  'Choline':          'כולין',
  'Folic acid':       'חומצה פולית',
  'Chloride':         'כלוריד',
}

/** Tooltip shown on the ⓘ next to Chloride in the results table */
export const CHLORIDE_NOTE =
  'ערך הכלוריד כאן הוא אומדן מחושב מנתרן, בהנחה שרוב הנתרן מגיע ממלח שולחן (NaCl). ' +
  'מאגר USDA אינו מדווח ישירות על כלוריד ברוב המזונות, ולכן נעשה שימוש בחישוב זה כמקובל בניתוחי תזונה.'

const STATUS_ORDER = { 'Below minimum': 0, 'Above maximum': 1, 'OK': 2 }

/**
 * Compute total kcal and per-nutrient totals (in native units per day) for a recipe.
 *
 * @param {Array<{id:number, grams:number}>} recipeRows
 * @param {Map<number, object>} ingredientsById  — id → ingredient row from ingredient_nutrients_all.json
 * @returns {{ totalKcal: number, nutrientsPerDay: Object }}
 */
export function computeRecipeNutrients(recipeRows, ingredientsById) {
  let totalKcal = 0
  const npd = Object.fromEntries(NUTRIENT_COLS.map(k => [k, 0]))

  for (const row of recipeRows) {
    const ing = ingredientsById.get(Number(row.id))
    if (!ing) continue
    const scale = (row.grams || 0) / 100
    totalKcal += (ing.kcal ?? 0) * scale
    for (const col of NUTRIENT_COLS) {
      const v = ing.n?.[col]
      if (v != null) npd[col] += v * scale
    }
  }

  return { totalKcal, nutrientsPerDay: npd }
}

/**
 * Compare a recipe to AAFCO standards.
 *
 * Chloride is stored in mg/100 g in the ingredient data.
 * AAFCO expresses it in g/1000 kcal, so we divide by 1000 before the
 * per-1000-kcal calculation (same treatment as Calcium, Sodium, etc.).
 *
 * @param {Array<{id:number, grams:number}>} recipeRows
 * @param {Array<object>} aafcoData       — from aafco_dog_per_1000kcal.json
 * @param {Map<number, object>} ingredientsById
 * @param {'adult'|'growth'} lifeStage
 * @returns {{ totalKcal: number, rows: Array<object> }}
 */
export function compareToAafco(recipeRows, aafcoData, ingredientsById, lifeStage = 'adult') {
  const { totalKcal, nutrientsPerDay } = computeRecipeNutrients(recipeRows, ingredientsById)

  const filtered = aafcoData.filter(r => r.life_stage === lifeStage)

  const rows = filtered.map(spec => {
    const nutrient = spec.nutrient
    const unit     = spec.unit               // 'g', 'mg', or 'IU' from AAFCO table
    const aafcoMin = spec.min_per_1000_kcal ?? 0
    const aafcoMax = spec.max_per_1000_kcal  // null when AAFCO sets no upper limit

    // Convert from USDA native units/day to AAFCO comparison units/day
    const amountConverted = applyConversion(nutrient, nutrientsPerDay[nutrient] ?? 0)

    const per1000     = totalKcal > 0 ? (amountConverted / totalKcal) * 1000 : 0
    const coveragePct = aafcoMin > 0  ? (per1000 / aafcoMin) * 100  : null

    let status
    if (aafcoMax != null && per1000 > aafcoMax) status = 'Above maximum'
    else if (per1000 + 1e-9 < aafcoMin)         status = 'Below minimum'
    else                                         status = 'OK'

    return {
      nutrient,
      unit,
      lifeStage,
      per1000:     Math.round(per1000 * 1000) / 1000,
      aafcoMin,
      aafcoMax,
      coveragePct: coveragePct != null ? Math.round(coveragePct * 10) / 10 : null,
      status,
    }
  })

  rows.sort((a, b) =>
    (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9) ||
    a.nutrient.localeCompare(b.nutrient)
  )

  return { totalKcal, rows }
}
