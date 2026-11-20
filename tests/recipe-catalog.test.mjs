import test from 'node:test';
import assert from 'node:assert/strict';
import { recipes } from '../src/data/recipes.ts';
import { isIngredient, isRecipe, validateMealPlan, validateRecipeCatalog } from '../src/data/recipe-validation.ts';

test('自作レシピ10件のIDは重複せず材料・分量・手順がそろう', () => {
  assert.equal(recipes.length, 10);
  assert.doesNotThrow(() => validateRecipeCatalog(recipes));
  for (const recipe of recipes) assert.equal(isRecipe(recipe), true);
});

test('単位、数量、空の材料を拒否', () => {
  assert.equal(isIngredient({ name:'米', quantity:100, unit:'g' }), true);
  assert.equal(isIngredient({ name:'米', quantity:100, unit:'杯' }), false);
  assert.equal(isIngredient({ name:'米', quantity:0, unit:'g' }), false);
  assert.equal(isIngredient({ name:' ', quantity:100, unit:'g' }), false);
  assert.equal(isRecipe({ ...recipes[0], ingredients:[] }), false);
  assert.equal(isRecipe({ ...recipes[0], steps:[' '] }), false);
  assert.equal(isRecipe({ ...recipes[0], ingredients:[{name:'米',quantity:NaN,unit:'g'}] }), false);
});

test('重複レシピIDを拒否', () => {
  assert.throws(() => validateRecipeCatalog([recipes[0], recipes[0]]), /Duplicate/);
});

test('存在しないrecipe_idと不正な日付・人数を拒否', () => {
  const valid = { date:'2026-11-20', recipe_id:recipes[0].id, servings:2 };
  assert.deepEqual(validateMealPlan(valid, recipes), valid);
  assert.throws(() => validateMealPlan({...valid, recipe_id:'missing'}, recipes), /Unknown/);
  assert.throws(() => validateMealPlan({...valid, date:'2026-02-30'}, recipes), /Invalid/);
  assert.throws(() => validateMealPlan({...valid, servings:0}, recipes), /Invalid/);
});
