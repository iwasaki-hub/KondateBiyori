import assert from 'node:assert/strict';
import test from 'node:test';
import { recipes } from '../src/data/recipes.ts';
import { formatIngredientQuantity, scaledIngredients, scaleQuantity } from '../src/recipes/servings.ts';

test('基準2人分から1/3/5人分へ比例計算できる', () => {
  assert.equal(scaleQuantity(300, 2, 1), 150);
  assert.equal(scaleQuantity(300, 2, 3), 450);
  assert.equal(scaleQuantity(2, 2, 5), 5);
});
test('少数は小数2桁に丸め、単位を変更しない', () => {
  assert.equal(scaleQuantity(1, 2, 1), 0.5);
  assert.equal(scaleQuantity(1, 3, 1), 0.33);
  assert.equal(scaleQuantity(1.25, 2, 3), 1.88);
  assert.equal(formatIngredientQuantity(0.5, '個'), '0.5 個');
  assert.equal(formatIngredientQuantity(1500.25, 'mL'), '1,500.25 mL');
  assert.equal(formatIngredientQuantity(0.75, 'kg'), '0.75 kg');
});
test('すべてのレシピは材料名と単位が維持され、元データは不変', () => {
  for (const recipe of recipes) {
    const scaled = scaledIngredients(recipe, 3);
    assert.equal(scaled.length, recipe.ingredients.length);
    for (let i = 0; i < scaled.length; i++) {
      assert.equal(scaled[i].name, recipe.ingredients[i].name);
      assert.equal(scaled[i].unit, recipe.ingredients[i].unit);
      assert.equal(scaled[i].quantity, scaleQuantity(recipe.ingredients[i].quantity, recipe.servings, 3));
    }
  }
  assert.equal(recipes[0].ingredients[0].quantity, 300);
});
test('不正な人数と数量は拒否', () => {
  for (const value of [0, -1, 1.5, 11, NaN, Infinity]) {
    assert.throws(() => scaleQuantity(100, 2, value));
  }
  assert.throws(() => scaleQuantity(100, 0, 2));
  assert.throws(() => scaleQuantity(-1, 2, 3));
  assert.throws(() => scaleQuantity(Infinity, 2, 3));
});
