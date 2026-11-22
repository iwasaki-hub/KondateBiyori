import test from 'node:test';
import assert from 'node:assert/strict';
import { recipes } from '../src/data/recipes.ts';
import { addDays, makeSampleWeek, parseLocalDate, shiftWeek, startOfWeek, toLocalDate, validateWeek, weekDates } from '../src/week/week-plan.ts';

test('月曜日始まり7日を一度ずつ表示する', () => {
  const dates = weekDates('2026-11-16');
  assert.deepEqual(dates, ['2026-11-16','2026-11-17','2026-11-18','2026-11-19','2026-11-20','2026-11-21','2026-11-22']);
  assert.equal(new Set(dates).size, 7);
  assert.equal(startOfWeek(parseLocalDate('2026-11-22')), '2026-11-16');
});
test('年末、月境界、うるう年、逆方向の週移動', () => {
  assert.equal(shiftWeek('2026-12-28', 1), '2027-01-04');
  assert.equal(shiftWeek('2027-01-04', -1), '2026-12-28');
  assert.equal(shiftWeek('2024-02-26', 1), '2024-03-04');
  assert.equal(toLocalDate(addDays(parseLocalDate('2024-02-28'), 1)), '2024-02-29');
  assert.throws(() => parseLocalDate('2026-02-30'));
  assert.throws(() => weekDates('2026-11-17'), /月曜日/);
});
test('サンプル献立は7日・有効recipe_id・正しい人数', () => {
  const plan = makeSampleWeek('2026-11-16', recipes, 3);
  assert.equal(plan.length, 7);
  assert.deepEqual(validateWeek(plan, '2026-11-16', recipes), plan);
  assert.ok(plan.every(x => x.servings === 3));
  assert.deepEqual(makeSampleWeek('2026-11-16', recipes, 3), plan);
  assert.throws(() => makeSampleWeek('2026-11-16', [], 3), /レシピ/);
});
test('不正な献立は保存前に拒否する', () => {
  const week = '2026-11-16';
  const valid = makeSampleWeek(week, recipes, 2);
  assert.throws(() => validateWeek(valid.slice(1), week, recipes));
  assert.throws(() => validateWeek([{...valid[0], recipe_id:'not-found'}, ...valid.slice(1)], week, recipes), /Unknown/);
  assert.throws(() => validateWeek([valid[1], valid[0], ...valid.slice(2)], week, recipes), /日付/);
});
