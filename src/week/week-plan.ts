import type { MealPlan, Recipe } from '../data/recipe-schema.ts';
import { validateMealPlan } from '../data/recipe-validation.ts';

/** Calendar arithmetic at local noon avoids most daylight-saving midnight transitions. */
export function toLocalDate(date: Date): string {
  const y = date.getFullYear();
  return `${String(y).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function parseLocalDate(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('日付の形式が不正です');
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(0);
  date.setFullYear(y, m - 1, d);
  date.setHours(12, 0, 0, 0);
  if (toLocalDate(date) !== value) throw new Error('存在しない日付です');
  return date;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date.getTime());
  result.setHours(12, 0, 0, 0);
  result.setDate(result.getDate() + days);
  return result;
}

export function startOfWeek(date: Date): string {
  const local = addDays(date, 0);
  return toLocalDate(addDays(local, -((local.getDay() + 6) % 7)));
}

export function shiftWeek(weekStart: string, weeks: number): string {
  return toLocalDate(addDays(parseLocalDate(weekStart), weeks * 7));
}

export function weekDates(weekStart: string): string[] {
  const first = parseLocalDate(weekStart);
  if (first.getDay() !== 1) throw new Error('週の開始日は月曜日です');
  return Array.from({ length: 7 }, (_, index) => toLocalDate(addDays(first, index)));
}

export function makeSampleWeek(weekStart: string, recipes: readonly Recipe[], servings: number): MealPlan[] {
  const dates = weekDates(weekStart);
  if (recipes.length === 0 || !Number.isInteger(servings) || servings < 1) {
    throw new Error('献立を作れるレシピまたは人数がありません。');
  }
  // Repeatably rotate by the ISO week start; never use AI or random remote data.
  const rotation = Math.floor(parseLocalDate(weekStart).getTime() / 86400000) % recipes.length;
  return dates.map((date, i) => ({
    date, recipe_id: recipes[(rotation + i) % recipes.length].id, servings,
  }));
}

export function validateWeek(value: unknown, weekStart: string, recipes: readonly Recipe[]): MealPlan[] {
  const expected = weekDates(weekStart);
  if (!Array.isArray(value) || value.length !== 7) throw new Error('7日分の献立が必要です');
  const items = value.map(entry => validateMealPlan(entry, recipes));
  if (items.some((entry, index) => entry.date !== expected[index])) {
    throw new Error('献立の日付または曜日が不正です');
  }
  return items;
}
