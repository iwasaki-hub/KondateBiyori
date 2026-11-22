import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_PROFILE, asDraft, parseProfileDraft, validateProfile } from '../src/profile/profile.ts';

test('初期値と任意項目を省略して保存できる', () => {
  assert.deepEqual(parseProfileDraft(asDraft(DEFAULT_PROFILE)), DEFAULT_PROFILE);
  assert.deepEqual(parseProfileDraft({ ...asDraft(DEFAULT_PROFILE), dislikedIngredients: '', excludedIngredients: '' }).excludedIngredients, []);
});
test('食材区切りと重複の正規化', () => {
  const parsed = parseProfileDraft({ ...asDraft(DEFAULT_PROFILE), dislikedIngredients:'なす、 ピーマン,なす', excludedIngredients:'えび\nくるみ' });
  assert.deepEqual(parsed.dislikedIngredients, ['なす', 'ピーマン']);
  assert.deepEqual(parsed.excludedIngredients, ['えび', 'くるみ']);
});
test('人数と所要時間の不正な値を拒否', () => {
  const d = asDraft(DEFAULT_PROFILE);
  for (const adults of ['0', '6', '', '1.5', 'abc', '-1', '1a']) {
    assert.throws(() => parseProfileDraft({ ...d, adults }), /大人/);
  }
  for (const children of ['-1', '6', 'abc', '']) {
    assert.throws(() => parseProfileDraft({ ...d, children }), /子ども/);
  }
  assert.throws(() => validateProfile({ ...DEFAULT_PROFILE, cookingMinutes: 99 }), /調理時間/);
  assert.throws(() => validateProfile({ ...DEFAULT_PROFILE, dislikedIngredients:[''] }), /食材/);
});
test('永続データの形式違反を拒否', () => {
  assert.throws(() => validateProfile(null));
  assert.throws(() => validateProfile({ ...DEFAULT_PROFILE, adults: NaN }), /大人/);
  assert.throws(() => validateProfile({ ...DEFAULT_PROFILE, excludedIngredients: Array(31).fill('a') }), /食材/);
});
