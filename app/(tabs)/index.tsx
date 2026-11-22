import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../../src/components/AppButton';
import { AppCard } from '../../src/components/AppCard';
import { AppIcon } from '../../src/components/AppIcon';
import { AppScreen } from '../../src/components/AppScreen';
import { getSiteMetadata } from '../../src/config/siteMetadata';
import type { MealPlan } from '../../src/data/recipe-schema';
import { recipes } from '../../src/data/recipes';
import { DEFAULT_PROFILE } from '../../src/profile/profile';
import { loadProfile } from '../../src/profile/profile-storage';
import { screenStyles as s } from '../../src/theme/screenStyles';
import { colors, radius, spacing, typography } from '../../src/theme/tokens';
import { makeSampleWeek, parseLocalDate, shiftWeek, startOfWeek, weekDates } from '../../src/week/week-plan';
import { loadWeek, saveWeek } from '../../src/week/week-storage';

export function generateMetadata() { return getSiteMetadata(); }

const DAYS = ['月', '火', '水', '木', '金', '土', '日'];
const fmt = (date: string) => {
  const d = parseLocalDate(date);
  return `${d.getMonth() + 1}/${d.getDate()}`;
};
type Status = 'loading' | 'ready' | 'error';

export default function WeekScreen() {
  const router = useRouter();
  const [week, setWeek] = useState(() => startOfWeek(new Date()));
  const [plan, setPlan] = useState<MealPlan[] | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [retry, setRetry] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    setStatus('loading');
    setError('');
    setNotice('');
    setPlan(null);
    loadWeek(week).then(result => {
      if (!active) return;
      setPlan(result);
      setStatus('ready');
    }).catch(() => {
      if (!active) return;
      setError('保存した献立を読み込めませんでした。');
      setStatus('error');
    });
    return () => { active = false; };
  }, [week, retry]);

  async function generate() {
    setError('');
    setNotice('');
    setSaving(true);
    try {
      const profile = await loadProfile() ?? DEFAULT_PROFILE;
      // Exclusions are best-effort string matches; no allergy-safety guarantee.
      const excluded = [...profile.excludedIngredients, ...profile.dislikedIngredients];
      const candidates = recipes.filter(recipe =>
        recipe.cookingMinutes <= profile.cookingMinutes &&
        !recipe.ingredients.some(item => excluded.some(word => item.name.includes(word))));
      const next = makeSampleWeek(week, candidates, profile.adults + profile.children);
      await saveWeek(week, next);
      setPlan(next);
      setNotice('サンプル献立を端末に保存しました。');
    } catch (e) {
      setError(e instanceof Error && e.message.includes('レシピ') ?
        '条件に合うサンプルレシピがありません。設定タブで調理時間や食材を見直してください。' :
        '献立を保存できませんでした。再試行してください。');
    } finally {
      setSaving(false);
    }
  }

  const dates = weekDates(week);
  return (
    <AppScreen>
      <View style={s.header}>
        <Text style={s.eyebrow}>家族の食卓に、ほっとする時間を。</Text>
        <Text accessibilityRole="header" style={s.title}>こんだて日和</Text>
        <Text style={s.body}>一週間の夕食を、まとめて眺められます。</Text>
      </View>
      <AppCard>
        <View style={s.row}><AppIcon name="week" /><Text accessibilityRole="header" style={s.heading}>週間献立</Text></View>
        <Text style={styles.period}>{fmt(dates[0])} 〜 {fmt(dates[6])}</Text>
        <View style={styles.navigation}>
          <View style={styles.navigationButton}><AppButton label="前週" variant="secondary" icon="back" onPress={() => setWeek(w => shiftWeek(w, -1))} disabled={saving} /></View>
          <View style={styles.navigationButton}><AppButton label="次週" variant="secondary" icon="forward" onPress={() => setWeek(w => shiftWeek(w, 1))} disabled={saving} /></View>
        </View>

        {status === 'loading' ? (
          <View accessibilityLabel="週間献立を読み込み中" style={styles.center}>
            <ActivityIndicator color={colors.primary} /><Text style={s.body}>保存済みの献立を読み込んでいます…</Text>
          </View>
        ) : status === 'error' ? (
          <View style={styles.section}>
            <Text accessibilityRole="alert" style={styles.error}>{error}</Text>
            <AppButton label="読み込みを再試行" onPress={() => setRetry(n => n + 1)} />
          </View>
        ) : (
          <View style={styles.section}>
            {plan === null ? (
              <View style={styles.center}>
                <View style={s.iconBadge}><AppIcon name="cooking" size={48} tone="orange" /></View>
                <Text accessibilityRole="header" style={s.heading}>まだ献立がありません</Text>
                <Text style={s.body}>この週は未作成です。10件の自作レシピからサンプルを作れます。</Text>
              </View>
            ) : null}
            {dates.map((date, i) => {
              const item = plan?.[i];
              const recipe = item ? recipes.find(r => r.id === item.recipe_id) : undefined;
              return (
                <View key={date} style={styles.dayRow}>
                  <View style={styles.dayLabel}>
                    <Text style={styles.dayName}>{DAYS[i]}</Text>
                    <Text style={styles.date}>{fmt(date)}</Text>
                  </View>
                  <View style={styles.meal}>
                    <Text style={styles.mealTitle}>{recipe?.name ?? '未設定'}</Text>
                    {recipe ? <Text style={s.small}>{recipe.cookingMinutes}分・{item?.servings}人分</Text> : null}
                  </View>
                </View>
              );
            })}
            {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
            {notice ? <Text accessibilityRole="alert" style={s.label}>{notice}</Text> : null}
            <AppButton label={saving ? '保存中…' : plan ? 'サンプル献立を作り直す' : 'サンプル献立を作る'}
              icon="meal" disabled={saving} onPress={generate} />
            <Text style={s.small}>AIは使用していません。食品アレルギーの安全性は保証できないため、原材料表示などを確認してください。</Text>
          </View>
        )}
      </AppCard>
      <AppButton label="買い物リストを見る" icon="shopping" variant="secondary" onPress={() => router.push('/shopping')} />
      <View style={s.notice}><AppIcon name="info" /><Text style={s.small}>レシピの詳細や献立の差し替え、買い物リスト集計は今後対応します。</Text></View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  period: { ...typography.heading, color: colors.text },
  navigation: { flexDirection: 'row', gap: spacing.sm },
  navigationButton: { flex: 1, minWidth: 0 },
  section: { gap: spacing.md },
  center: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  dayRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm,
    paddingVertical: spacing.md, paddingHorizontal: spacing.md, minHeight: 64 },
  dayLabel: { width: 58, alignItems: 'center', gap: spacing.xs },
  dayName: { ...typography.label, color: colors.primary },
  date: { ...typography.small, color: colors.muted },
  meal: { flex: 1, minWidth: 0, gap: spacing.xs },
  mealTitle: { ...typography.body, fontWeight: '700', color: colors.text },
  error: { ...typography.body, color: colors.primary },
});
