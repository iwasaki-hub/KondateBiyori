import type { MealPlan, Recipe } from '../data/recipe-schema.ts';
import { validateWeek } from './week-plan.ts';

/**
 * Replace exactly one meal by date without modifying the original plan or
 * the servings. The caller must persist this result before updating UI state.
 */
export function replaceMeal(
  plan: readonly MealPlan[],
  weekStart: string,
  date: string,
  recipeId: string,
  catalog: readonly Recipe[],
): MealPlan[] {
  const validPlan = validateWeek(plan, weekStart, catalog);
  if (!validPlan.some(item => item.date === date)) {
    throw new Error('対象の曜日がこの週間献立にありません');
  }
  if (!catalog.some(recipe => recipe.id === recipeId)) {
    throw new Error('存在しないレシピは選択できません');
  }
  return validPlan.map(item =>
    item.date === date ? { ...item, recipe_id: recipeId } : { ...item });
}
