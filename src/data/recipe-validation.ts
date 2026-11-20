import type { Ingredient, MealPlan, Recipe } from './recipe-schema.ts';
import { INGREDIENT_UNITS } from './recipe-schema.ts';

const validUnits: ReadonlySet<string> = new Set(INGREDIENT_UNITS);
const hasText = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;
const positive = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;

export function isIngredient(value: unknown): value is Ingredient {
  if (value === null || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return hasText(item.name) && positive(item.quantity) &&
    typeof item.unit === 'string' && validUnits.has(item.unit);
}

export function isRecipe(value: unknown): value is Recipe {
  if (value === null || typeof value !== 'object') return false;
  const recipe = value as Record<string, unknown>;
  return hasText(recipe.id) && hasText(recipe.name) &&
    Number.isInteger(recipe.servings) && positive(recipe.servings) &&
    Number.isInteger(recipe.cookingMinutes) && positive(recipe.cookingMinutes) &&
    recipe.source === 'original' &&
    Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 &&
    recipe.ingredients.every(isIngredient) &&
    Array.isArray(recipe.steps) && recipe.steps.length > 0 &&
    recipe.steps.every(hasText);
}

export function validateRecipeCatalog(values: readonly unknown[]): asserts values is readonly Recipe[] {
  const ids = new Set<string>();
  for (const [index, item] of values.entries()) {
    if (!isRecipe(item)) throw new Error(`Invalid recipe at index ${index}`);
    if (ids.has(item.id)) throw new Error(`Duplicate recipe ID: ${item.id}`);
    ids.add(item.id);
  }
}

function isValidLocalDate(date: unknown): date is string {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const [year, month, day] = date.split('-').map(Number);
  if (year < 1 || month < 1 || month > 12) return false;
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return day >= 1 && day <= days;
}

export function validateMealPlan(value: unknown, recipes: readonly Recipe[]): MealPlan {
  if (value === null || typeof value !== 'object') throw new Error('Invalid meal plan');
  const plan = value as Record<string, unknown>;
  if (!isValidLocalDate(plan.date) || !Number.isInteger(plan.servings) || !positive(plan.servings)) {
    throw new Error('Invalid meal plan date or servings');
  }
  if (!hasText(plan.recipe_id) || !recipes.some(recipe => recipe.id === plan.recipe_id)) {
    throw new Error('Unknown recipe_id');
  }
  return value as MealPlan;
}
