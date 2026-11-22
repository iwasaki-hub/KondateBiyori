// Web静的配信とSSRで安全に読み込み、ブラウザ内にのみ保存する。
import { validateProfile, type FamilyProfile } from './profile.ts';
const KEY = 'kondate-biyori:family-profile:v1';

export async function loadProfile(): Promise<FamilyProfile | null> {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(KEY);
  return raw === null ? null : validateProfile(JSON.parse(raw) as unknown);
}
export async function saveProfile(profile: FamilyProfile): Promise<void> {
  if (typeof window === 'undefined') throw new Error('この環境では保存できません。');
  window.localStorage.setItem(KEY, JSON.stringify(validateProfile(profile)));
}
