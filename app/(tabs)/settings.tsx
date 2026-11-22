import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { AppButton } from '../../src/components/AppButton';
import { AppCard } from '../../src/components/AppCard';
import { AppIcon } from '../../src/components/AppIcon';
import { AppScreen } from '../../src/components/AppScreen';
import { getSiteMetadata } from '../../src/config/siteMetadata';
import { asDraft, COOKING_MINUTES, DEFAULT_PROFILE, parseProfileDraft, type ProfileDraft } from '../../src/profile/profile';
import { loadProfile, saveProfile } from '../../src/profile/profile-storage';
import { screenStyles as s } from '../../src/theme/screenStyles';
import { colors, layout, radius, spacing, typography } from '../../src/theme/tokens';

export function generateMetadata() { return getSiteMetadata(); }

type LoadState = 'loading' | 'ready' | 'error';
export default function SettingsScreen() {
  const [draft, setDraft] = useState<ProfileDraft>(() => asDraft(DEFAULT_PROFILE));
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    loadProfile().then(profile => {
      if (!active) return;
      setDraft(asDraft(profile ?? DEFAULT_PROFILE));
      setError('');
      setLoadState('ready');
    }).catch(() => {
      if (!active) return;
      setError('保存済みの家族設定を読み込めませんでした。再試行してください。');
      setLoadState('error');
    });
    return () => { active = false; };
  }, [retry]);

  function update<K extends keyof ProfileDraft>(key: K, value: ProfileDraft[K]) {
    setDraft(previous => ({ ...previous, [key]: value }));
    setNotice(''); setError('');
  }

  async function handleSave() {
    setNotice(''); setError('');
    try {
      const profile = parseProfileDraft(draft);
      setSaving(true);
      await saveProfile(profile);
      setDraft(asDraft(profile));
      setNotice('家族設定をこの端末に保存しました。');
    } catch (e) {
      setError(e instanceof Error && !/保存|環境/.test(e.message) ? e.message : '保存できませんでした。内容を確認して再試行してください。');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppScreen>
      <View style={s.header}>
        <View style={s.iconBadge}><AppIcon name="settings" size={32} tone="brown" /></View>
        <Text accessibilityRole="header" style={s.title}>設定</Text>
        <Text style={s.body}>あなたの家族に合わせた献立づくりへ。</Text>
      </View>

      <AppCard>
        <Text accessibilityRole="header" style={s.heading}>家族プロフィール</Text>
        {loadState === 'loading' ? (
          <View accessibilityLabel="家族設定を読み込み中"><ActivityIndicator color={colors.primary}/><Text style={s.body}>保存した設定を読み込んでいます…</Text></View>
        ) : loadState === 'error' ? (
          <View style={styles.section}>
            <Text accessibilityRole="alert" style={styles.error}>{error}</Text>
            <AppButton label="読み込みを再試行" onPress={() => setRetry(n => n + 1)} />
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.label}>大人の人数（必須・1〜5人）</Text>
            <TextInput accessibilityLabel="大人の人数" keyboardType="number-pad" inputMode="numeric"
              value={draft.adults} onChangeText={value => update('adults', value)} style={styles.input} />
            <Text style={styles.label}>子どもの人数（必須・0〜5人）</Text>
            <TextInput accessibilityLabel="子どもの人数" keyboardType="number-pad" inputMode="numeric"
              value={draft.children} onChangeText={value => update('children', value)} style={styles.input} />
            <Text style={styles.label}>平日の調理時間（必須）</Text>
            <View style={styles.choices}>
              {COOKING_MINUTES.map(minutes => (
                <Pressable key={minutes} accessibilityRole="radio"
                  accessibilityState={{ selected: draft.cookingMinutes === minutes }}
                  accessibilityLabel={`${minutes}分`} onPress={() => update('cookingMinutes', minutes)}
                  style={[styles.choice, draft.cookingMinutes === minutes && styles.choiceSelected]}>
                  <Text style={[styles.choiceText, draft.cookingMinutes === minutes && styles.choiceTextSelected]}>
                    {draft.cookingMinutes === minutes ? '✓ ' : ''}{minutes}分
                  </Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.label}>苦手な食材（任意）</Text>
            <TextInput accessibilityLabel="苦手な食材" value={draft.dislikedIngredients}
              onChangeText={value => update('dislikedIngredients', value)}
              placeholder="例：ピーマン、なす" placeholderTextColor={colors.muted}
              style={styles.input} />
            <Text style={styles.label}>除外したい食材（任意）</Text>
            <TextInput accessibilityLabel="除外したい食材" value={draft.excludedIngredients}
              onChangeText={value => update('excludedIngredients', value)}
              placeholder="例：えび、くるみ" placeholderTextColor={colors.muted}
              style={styles.input} />
            <Text style={styles.hint}>食材は「、」やカンマで区切って入力できます。任意項目は空欄で保存できます。</Text>
            <Text style={styles.hint}>除外設定はアレルギーの安全を保証しません。調理前に商品表示などを必ず確認してください。</Text>
            {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
            {notice ? <Text accessibilityRole="alert" style={styles.success}>{notice}</Text> : null}
            <AppButton label={saving ? '保存中…' : 'この端末に保存'} disabled={saving} onPress={handleSave} />
          </View>
        )}
      </AppCard>
      <AppCard>
        <Text accessibilityRole="header" style={s.heading}>利用プラン</Text>
        <Text style={s.body}>プランの提供は準備中です。現在、購入や課金の機能はありません。</Text>
        <Text style={s.eyebrow}>準備中</Text>
      </AppCard>
      <AppCard>
        <View style={s.row}><AppIcon name="info" tone="brown" /><Text accessibilityRole="header" style={s.heading}>アプリ情報</Text></View>
        <Text style={s.label}>こんだて日和 · 0.1.0</Text>
        <Text style={s.small}>家族の食卓を支える、週間献立アプリです。</Text>
      </AppCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.md },
  label: { ...typography.label, color: colors.text },
  input: { minHeight: layout.touchTarget, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, ...typography.body, color: colors.text },
  choices: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  choice: { minHeight: layout.touchTarget, minWidth: 70, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: spacing.md, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.surface },
  choiceSelected: { borderColor: colors.primary, backgroundColor: colors.selected },
  choiceText: { ...typography.label, color: colors.text },
  choiceTextSelected: { color: colors.primary, fontWeight: '700' },
  hint: { ...typography.small, color: colors.muted },
  error: { ...typography.body, color: colors.primary },
  success: { ...typography.body, color: colors.text, fontWeight: '700' },
});
