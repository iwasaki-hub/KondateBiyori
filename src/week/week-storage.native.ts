import Storage from 'expo-sqlite/kv-store';
import type { MealPlan } from '../data/recipe-schema.ts';
import { recipes } from '../data/recipes.ts';
import { validateWeek } from './week-plan.ts';
const KEY = 'kondate-biyori:weekly-plans:v1';
type Store = Record<string, MealPlan[]>;
function decode(raw: string | null): Store {
  if (raw === null) return {};
  const data: unknown = JSON.parse(raw);
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('献立の保存形式が正しくありません');
  const store: Store = {};
  for (const [key, value] of Object.entries(data)) store[key] = validateWeek(value, key, recipes);
  return store;
}
export async function loadWeek(weekStart: string): Promise<MealPlan[] | null> {
  const store = decode(await Storage.getItemAsync(KEY));
  return store[weekStart] ?? null;
}
export async function saveWeek(weekStart: string, items: readonly MealPlan[]): Promise<void> {
  const store = decode(await Storage.getItemAsync(KEY));
  store[weekStart] = validateWeek(items, weekStart, recipes);
  await Storage.setItemAsync(KEY, JSON.stringify(store));
}
