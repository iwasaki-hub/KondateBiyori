import test from 'node:test';
import assert from 'node:assert/strict';
import { recipes } from '../src/data/recipes.ts';
import { makeSampleWeek } from '../src/week/week-plan.ts';
import { replaceMeal } from '../src/week/replace-meal.ts';

const start = '2026-11-16';
const original = makeSampleWeek(start, recipes, 3);

test('選んだ1日だけ変更し、残り6日・人数・日付・元配列を保つ', () => {
  const chosen = original[2];
  const newId = recipes.find(recipe => recipe.id !== chosen.recipe_id).id;
  const output = replaceMeal(original, start, chosen.date, newId, recipes);
  assert.equal(output.length, 7);
  assert.equal(output[2].recipe_id, newId);
  assert.equal(output[2].servings, chosen.servings);
  for (const index of [0, 1, 3, 4, 5, 6]) assert.deepEqual(output[index], original[index]);
  assert.equal(original[2].recipe_id, chosen.recipe_id);
  assert.notStrictEqual(output, original);
  assert.notStrictEqual(output[0], original[0]);
});

test('存在しないレシピと対象週外の日付を拒否', () => {
  assert.throws(() => replaceMeal(original, start, original[2].date, 'unknown-id', recipes), /レシピ/);
  assert.throws(() => replaceMeal(original, start, '2026-11-23', recipes[0].id, recipes), /曜日/);
  assert.throws(() => replaceMeal(original.slice(0, 6), start, original[0].date, recipes[0].id, recipes), /7日/);
});

test('別の週も含めて元の保存用データを変更しない', () => {
  const otherWeek = makeSampleWeek('2026-11-23', recipes, 2);
  const snapshot = structuredClone({ original, otherWeek });
  replaceMeal(original, start, original[0].date, recipes[9].id, recipes);
  assert.deepEqual({ original, otherWeek }, snapshot);
});

test('キャンセルは保存関数を呼ばず、変更前データを保持する', async () => {
  let saveCount = 0;
  const cancel = () => undefined;
  cancel();
  assert.equal(saveCount, 0);
  assert.deepEqual(original, makeSampleWeek(start, recipes, 3));
  // Save errors are handled in UI before setPlan: failed save cannot commit display data.
  const save = async () => { saveCount++; throw new Error('storage unavailable'); };
  let displayed = original;
  await assert.rejects(async () => {
    const next = replaceMeal(original, start, original[0].date, recipes[9].id, recipes);
    await save(next);
    displayed = next;
  }, /storage unavailable/);
  assert.equal(saveCount, 1);
  assert.strictEqual(displayed, original);
});
