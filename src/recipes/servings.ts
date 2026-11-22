import type { Ingredient, Recipe } from '../data/recipe-schema.ts';

export const MIN_SERVINGS = 1;
export const MAX_SERVINGS = 10;

/** Display-only per-serving conversion. Keep source recipe quantities and saved plans unchanged. */
export function scaleQuantity(quantity: number, baseServings: number, targetServings: number): number {
  if (![quantity, baseServings, targetServings].every(Number.isFinite) ||
    quantity <= 0 || !Number.isInteger(baseServings) || baseServings < 1 ||
    !Number.isInteger(targetServings) || targetServings < MIN_SERVINGS || targetServings > MAX_SERVINGS) {
    throw new Error('材料の数量または人数が不正です');
  }
  return Math.round((quantity * targetServings / baseServings) * 100) / 100;
}

export function scaledIngredients(recipe: Recipe, servings: number): Ingredient[] {
  return recipe.ingredients.map(ingredient => ({
    name: ingredient.name,
    unit: ingredient.unit,
    quantity: scaleQuantity(ingredient.quantity, recipe.servings, servings),
  }));
}

/** Japanese locale presentation, with no implicit change to original units. */
export function formatIngredientQuantity(quantity: number, unit: Ingredient['unit']): string {
  if (!Number.isFinite(quantity) || quantity < 0) throw new Error('表示する分量が不正です');
  return `${new Intl.NumberFormat('ja-JP', { maximumFractionDigits: 2 }).format(quantity)} ${unit}`;
}
