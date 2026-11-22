import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Recipe } from '../data/recipe-schema';
import { AppButton } from './AppButton';
import { AppCard } from './AppCard';
import { colors, radius, spacing, typography } from '../theme/tokens';

type Props = {
  dateLabel: string;
  currentRecipeId: string;
  catalog: readonly Recipe[];
  saving: boolean;
  error: string;
  onCancel: () => void;
  onConfirm: (recipeId: string) => void;
};

export function MealReplacement({
  dateLabel, currentRecipeId, catalog, saving, error, onCancel, onConfirm,
}: Props) {
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const current = catalog.find(recipe => recipe.id === currentRecipeId);
  const selected = catalog.find(recipe => recipe.id === candidateId);
  const options = catalog.filter(recipe => recipe.id !== currentRecipeId);

  return (
    <AppCard>
      <Text accessibilityRole="header" style={styles.heading}>{dateLabel}の献立を変更</Text>
      <Text style={styles.body}>現在：{current?.name ?? '不明な料理'}</Text>
      <Text style={styles.small}>変更候補を選んでから確定してください。他の6日分は変更されません。</Text>
      <View style={styles.section}>
        <Text accessibilityRole="header" style={styles.subheading}>料理の候補</Text>
        {options.map(recipe => (
          <View key={recipe.id} style={[styles.option, candidateId === recipe.id && styles.selected]}>
            <View style={styles.optionText}>
              <Text style={styles.optionName}>{recipe.name}</Text>
              <Text style={styles.small}>{recipe.cookingMinutes}分 · 基準{recipe.servings}人分</Text>
            </View>
            <View style={styles.pick}>
              <AppButton variant="secondary" label={candidateId === recipe.id ? '選択中 ✓' : '選択'}
                disabled={saving} onPress={() => setCandidateId(recipe.id)} />
            </View>
          </View>
        ))}
      </View>
      <View style={styles.section}>
        <Text accessibilityRole="header" style={styles.subheading}>変更内容の確認</Text>
        {selected ? (
          <Text style={styles.body}>{current?.name} → {selected.name}</Text>
        ) : <Text style={styles.small}>候補を選択してください。</Text>}
        <Text style={styles.small}>除外食材やアレルギーへの安全性は保証されません。レシピの材料を必ず確認してください。</Text>
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        <AppButton label={saving ? '保存中…' : 'この料理に変更して保存'} disabled={!selected || saving}
          onPress={() => { if (selected) onConfirm(selected.id); }} />
        <AppButton label="キャンセルして週間献立に戻る" variant="secondary"
          disabled={saving} onPress={onCancel} />
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  heading: { ...typography.heading, color: colors.text },
  subheading: { ...typography.label, color: colors.text },
  body: { ...typography.body, color: colors.text },
  small: { ...typography.small, color: colors.muted },
  section: { gap: spacing.md },
  option: { borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, flexDirection: 'row', gap: spacing.sm, alignItems: 'center', minHeight: 64 },
  selected: { borderColor: colors.primary, backgroundColor: colors.selected },
  optionText: { flex: 1, minWidth: 0, gap: spacing.xs },
  optionName: { ...typography.body, color: colors.text, fontWeight: '600' },
  pick: { minWidth: 92 },
  error: { ...typography.body, color: colors.primary },
});
