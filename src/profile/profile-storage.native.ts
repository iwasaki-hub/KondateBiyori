// iOS/Android: Expo SQLiteのKVストアはアプリ再起動後も端末に残る。
import Storage from 'expo-sqlite/kv-store';
import { validateProfile, type FamilyProfile } from './profile.ts';
const KEY = 'kondate-biyori:family-profile:v1';

export async function loadProfile(): Promise<FamilyProfile | null> {
  const raw = await Storage.getItemAsync(KEY);
  return raw === null ? null : validateProfile(JSON.parse(raw) as unknown);
}
export async function saveProfile(profile: FamilyProfile): Promise<void> {
  await Storage.setItemAsync(KEY, JSON.stringify(validateProfile(profile)));
}
