export const COOKING_MINUTES = [10, 20, 30, 45] as const;
export type CookingMinutes = (typeof COOKING_MINUTES)[number];
export type FamilyProfile = {
  adults: number;
  children: number;
  cookingMinutes: CookingMinutes;
  dislikedIngredients: string[];
  excludedIngredients: string[];
};

export const DEFAULT_PROFILE: FamilyProfile = {
  adults: 1, children: 0, cookingMinutes: 20,
  dislikedIngredients: [], excludedIngredients: [],
};

export type ProfileDraft = {
  adults: string;
  children: string;
  cookingMinutes: CookingMinutes;
  dislikedIngredients: string;
  excludedIngredients: string;
};

export function asDraft(profile: FamilyProfile): ProfileDraft {
  return {
    adults: String(profile.adults), children: String(profile.children),
    cookingMinutes: profile.cookingMinutes,
    dislikedIngredients: profile.dislikedIngredients.join('、'),
    excludedIngredients: profile.excludedIngredients.join('、'),
  };
}

function parseIngredients(raw: string): string[] {
  return [...new Set(raw.split(/[、,，\n]/).map(item => item.trim()).filter(Boolean))];
}

export function validateProfile(value: unknown): FamilyProfile {
  if (!value || typeof value !== 'object') throw new Error('家族設定の形式が正しくありません。');
  const v = value as Record<string, unknown>;
  if (!Number.isInteger(v.adults) || typeof v.adults !== 'number' || v.adults < 1 || v.adults > 5)
    throw new Error('大人の人数は1〜5人で入力してください。');
  if (!Number.isInteger(v.children) || typeof v.children !== 'number' || v.children < 0 || v.children > 5)
    throw new Error('子どもの人数は0〜5人で入力してください。');
  if (typeof v.cookingMinutes !== 'number' || !COOKING_MINUTES.some(n => n === v.cookingMinutes))
    throw new Error('調理時間を選択してください。');
  for (const key of ['dislikedIngredients', 'excludedIngredients'] as const) {
    const list = v[key];
    if (!Array.isArray(list) || list.length > 30 ||
      !list.every(item => typeof item === 'string' && item.trim().length > 0 && item.length <= 50))
      throw new Error('食材は1件50文字以内・30件まで入力してください。');
  }
  return {
    adults: v.adults, children: v.children,
    cookingMinutes: v.cookingMinutes as CookingMinutes,
    dislikedIngredients: [...new Set(v.dislikedIngredients as string[])],
    excludedIngredients: [...new Set(v.excludedIngredients as string[])],
  };
}

export function parseProfileDraft(draft: ProfileDraft): FamilyProfile {
  const adults = /^\d+$/.test(draft.adults.trim()) ? Number(draft.adults.trim()) : NaN;
  const children = /^\d+$/.test(draft.children.trim()) ? Number(draft.children.trim()) : NaN;
  return validateProfile({
    adults, children, cookingMinutes: draft.cookingMinutes,
    dislikedIngredients: parseIngredients(draft.dislikedIngredients),
    excludedIngredients: parseIngredients(draft.excludedIngredients),
  });
}
