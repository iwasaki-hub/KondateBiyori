/** Day 3: 料理と献立のデータ契約。分量はレシピの基準人数に対する値。 */
export const INGREDIENT_UNITS = ['g', 'kg', 'mL', 'L', '個', '本', '枚', '束'] as const;
export type IngredientUnit = (typeof INGREDIENT_UNITS)[number];

export type Ingredient = {
  readonly name: string;
  readonly quantity: number;
  readonly unit: IngredientUnit;
};

export type Recipe = {
  readonly id: string;
  readonly name: string;
  readonly servings: number;
  readonly cookingMinutes: number;
  readonly ingredients: readonly Ingredient[];
  readonly steps: readonly string[];
  /** 人が作成・確認した原稿のみを登録する。AIの自由生成結果は登録しない。 */
  readonly source: 'original';
};

export type MealPlan = {
  readonly date: string; // ローカル日付 YYYY-MM-DD
  readonly recipe_id: Recipe['id'];
  readonly servings: number;
};
